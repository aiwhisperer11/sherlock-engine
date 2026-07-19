"use client";

import { useState } from "react";

import SherlockForm from "@/components/SherlockForm";
import FollowUpEvidenceForm from "@/components/FollowUpEvidenceForm";
import LearningDiff from "@/components/LearningDiff";
import SherlockInvestigationView from "@/components/SherlockInvestigationView";
import type { SherlockInvestigation } from "@/types/sherlock";

export default function Home() {
  const [snapshots, setSnapshots] = useState<SherlockInvestigation[]>([]);
  const latestSnapshot = snapshots.at(-1);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      <header><h1 className="text-3xl font-bold">Sherlock</h1><p className="mt-1 text-zinc-600 dark:text-zinc-400">A falsification-driven investigation engine.</p></header>
      <SherlockForm onSnapshot={(snapshot) => setSnapshots((current) => [...current, snapshot])} onSnapshotsLoaded={setSnapshots} />
      {snapshots.length >= 2 && <LearningDiff previous={snapshots.at(-2)!} latest={latestSnapshot!} />}
      {latestSnapshot && <FollowUpEvidenceForm previousSnapshot={latestSnapshot} onSnapshot={(snapshot) => setSnapshots((current) => [...current, snapshot])} />}
      {latestSnapshot && <SherlockInvestigationView investigation={latestSnapshot} />}
    </main>
  );
}
