"use client";

import type { MatchResult, MatchStatus } from "@/lib/types";

interface ScoreDisplayProps {
  status: MatchStatus;
  result?: MatchResult;
}

export default function ScoreDisplay({ status, result }: ScoreDisplayProps) {
  if (status === "scheduled" || !result) {
    return (
      <span className="text-sm font-medium uppercase text-text-muted">vs</span>
    );
  }

  return (
    <span className="flex flex-col items-center">
      {status === "live" && (
        <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          En vivo
        </span>
      )}
      <span className="text-2xl font-semibold tabular-nums">
        {result.homeGoals}
        <span className="mx-1.5 text-text-muted">-</span>
        {result.awayGoals}
      </span>
      {result.penalties && (
        <span className="text-[11px] tabular-nums text-text-secondary">
          ({result.penalties.home}-{result.penalties.away} pen.)
        </span>
      )}
    </span>
  );
}
