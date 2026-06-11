"use client";

import type { StandingsRowView } from "@/lib/types";
import TeamRow from "./TeamRow";

export default function StandingsTable({
  rows,
}: {
  rows: StandingsRowView[];
}) {
  return (
    <div>
      <div className="grid grid-cols-[1.25rem_1fr_2rem_2.25rem_2.25rem] gap-2 border-b border-border px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
        <span>#</span>
        <span>Equipo</span>
        <span className="text-right">PJ</span>
        <span className="text-right">DG</span>
        <span className="text-right">Pts</span>
      </div>
      <div className="mt-1 flex flex-col">
        {rows.map((row, index) => (
          <TeamRow key={row.teamId} row={row} position={index + 1} />
        ))}
      </div>
    </div>
  );
}
