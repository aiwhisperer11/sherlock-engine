"use client";

import { useState, type FormEvent } from "react";

import followUpExample from "@/examples/case-b-evidence-e5.json";
import { parseSherlockInvestigation } from "@/lib/investigation-validation";
import type { SherlockInvestigation } from "@/types/sherlock";

interface FollowUpEvidenceFormProps {
  previousSnapshot: SherlockInvestigation;
  onSnapshot: (snapshot: SherlockInvestigation) => void;
}

interface FormEvidence {
  label: string;
  content: string;
}

export default function FollowUpEvidenceForm({ previousSnapshot, onSnapshot }: FollowUpEvidenceFormProps) {
  const [evidence, setEvidence] = useState<FormEvidence[]>([{ label: "", content: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = evidence.length > 0 && evidence.every((item) => item.label.trim() && item.content.trim());

  function updateEvidence(index: number, field: keyof FormEvidence, value: string) {
    setEvidence((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  async function reinvestigate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previous_snapshot: previousSnapshot, new_evidence: evidence }),
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message = body !== null && typeof body === "object" && typeof (body as Record<string, unknown>).error === "string"
          ? (body as Record<string, unknown>).error as string
          : `Request failed with status ${response.status}`;
        setError(`Error ${response.status}: ${message}`);
        return;
      }
      const parsed = parseSherlockInvestigation(body);
      if (!parsed.ok) {
        setError(`The API returned an invalid investigation: ${parsed.errors.map((entry) => `${entry.instancePath}: ${entry.message}`).join("; ")}`);
        return;
      }
      onSnapshot(parsed.investigation);
      setEvidence([{ label: "", content: "" }]);
    } catch {
      setError("The re-investigation request could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  return <section aria-labelledby="new-evidence-heading" className="rounded-lg border border-sky-300 bg-sky-50 p-5 dark:bg-sky-950/20">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="new-evidence-heading" className="text-xl font-semibold">New evidence</h2><p className="text-sm text-zinc-600 dark:text-zinc-400">Re-investigate iteration {previousSnapshot.meta.iteration + 1} from the latest snapshot.</p></div><button type="button" onClick={() => setEvidence(followUpExample.map((item) => ({ ...item })))} className="rounded border border-sky-400 px-3 py-2 text-sm">Add example follow-up evidence</button></div>
    <form onSubmit={reinvestigate} className="mt-4 space-y-3">
      {evidence.map((item, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]"><input required value={item.label} onChange={(event) => updateEvidence(index, "label", event.target.value)} aria-label={`New evidence ${index + 1} label`} placeholder="Label" className="rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700" /><textarea required rows={2} value={item.content} onChange={(event) => updateEvidence(index, "content", event.target.value)} aria-label={`New evidence ${index + 1} content`} placeholder="Content" className="rounded border border-zinc-300 bg-transparent p-2 dark:border-zinc-700" /><button type="button" onClick={() => setEvidence((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="text-sm text-red-700">Remove</button></div>)}
      <div className="flex gap-2"><button type="button" onClick={() => setEvidence((items) => [...items, { label: "", content: "" }])} className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Add evidence</button><button type="submit" disabled={loading || !canSubmit} className="rounded bg-sky-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Re-investigating…" : "Re-investigate"}</button></div>
      {error && <p role="alert" className="text-sm text-red-800 dark:text-red-300">{error}</p>}
    </form>
  </section>;
}
