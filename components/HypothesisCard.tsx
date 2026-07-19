import type { SherlockHypothesis } from "@/types/sherlock";

interface HypothesisCardProps {
  hypothesis: SherlockHypothesis;
}

const statusStyle: Record<SherlockHypothesis["status"], string> = {
  active: "bg-emerald-100 text-emerald-800",
  weakened: "bg-amber-100 text-amber-900",
  rejected: "bg-zinc-200 text-zinc-800",
  revived: "bg-sky-100 text-sky-900",
};

export default function HypothesisCard({ hypothesis }: HypothesisCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">{hypothesis.id} · {hypothesis.origin}</p>
          <h3 className="mt-1 font-semibold">{hypothesis.statement}</h3>
        </div>
        <div className="text-right">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle[hypothesis.status]}`}>
            {hypothesis.status}
          </span>
          <p className="mt-2 text-3xl font-bold leading-none">{hypothesis.confidence}</p>
          <p className="text-xs text-zinc-500">confidence</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div>
          <h4 className="font-medium">Supported by</h4>
          <ul className="mt-1 space-y-1 text-zinc-600 dark:text-zinc-400">
            {hypothesis.supported_by.length ? hypothesis.supported_by.map((link) => <li key={`${link.evidence_id}-${link.reason}`}><strong>{link.evidence_id}</strong>: {link.reason}</li>) : <li>None recorded.</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Contradicted by</h4>
          <ul className="mt-1 space-y-1 text-zinc-600 dark:text-zinc-400">
            {hypothesis.contradicted_by.length ? hypothesis.contradicted_by.map((link) => <li key={`${link.evidence_id}-${link.reason}`}><strong>{link.evidence_id}</strong>: {link.reason}</li>) : <li>None recorded.</li>}
          </ul>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div><dt className="font-medium">Expected but absent</dt><dd>{hypothesis.expected_but_absent_ids.join(", ") || "None"}</dd></div>
        <div><dt className="font-medium">Would be refuted by</dt><dd>{hypothesis.would_be_refuted_by}</dd></div>
        {hypothesis.status === "rejected" && <>
          <div><dt className="font-medium">Killed by</dt><dd>{hypothesis.killed_by}</dd></div>
          <div><dt className="font-medium">Resurrection condition</dt><dd>{hypothesis.resurrection_condition}</dd></div>
        </>}
      </dl>
    </article>
  );
}
