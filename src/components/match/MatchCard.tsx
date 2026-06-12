"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { MatchTeamView, MatchView } from "@/lib/types";
import { CDMX_TZ, browserTimeZone, formatTime } from "@/lib/dates";
import TeamFlag from "@/components/team/TeamFlag";
import ScoreDisplay from "./ScoreDisplay";

export const phaseLabels: Record<MatchView["phase"], string> = {
  groups: "Grupos",
  round32: "Dieciseisavos",
  round16: "Octavos",
  qf: "Cuartos",
  sf: "Semifinal",
  third: "Tercer puesto",
  final: "Final",
};

function TeamSide({
  team,
  align,
}: {
  team: MatchTeamView | null;
  align: "left" | "right";
}) {
  return (
    <span
      className={clsx(
        "flex min-w-0 items-center gap-2.5",
        align === "right" && "flex-row-reverse"
      )}
    >
      {team ? (
        <>
          <TeamFlag code={team.code} name={team.name} size="md" />
          <span className="truncate text-sm font-medium sm:text-base">
            {team.name}
          </span>
        </>
      ) : (
        <>
          <span className="h-5 w-7 shrink-0 rounded-[3px] bg-surface-2 ring-1 ring-white/10" />
          <span className="truncate text-sm text-text-muted sm:text-base">
            Por definir
          </span>
        </>
      )}
    </span>
  );
}

function KickoffTimes({ date }: { date: string }) {
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    if (browserTimeZone() !== CDMX_TZ) {
      setLocalTime(formatTime(date));
    }
  }, [date]);

  return (
    <span className="tabular-nums">
      {formatTime(date, CDMX_TZ)} CDMX
      {localTime && (
        <span className="text-text-muted"> · {localTime} tu hora</span>
      )}
    </span>
  );
}

export default function MatchCard({ match }: { match: MatchView }) {
  return (
    <motion.article
      id={match.id}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-4 shadow-sm hover:shadow-md sm:p-5"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-wider text-text-muted">
        <span className="font-medium">
          {phaseLabels[match.phase]}
          {match.groupId && (
            <span className="text-text-secondary"> {match.groupId}</span>
          )}
        </span>
        <span className="truncate text-right">
          {match.stadium} · {match.city}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide team={match.home} align="left" />
        <ScoreDisplay status={match.status} result={match.result} />
        <span className="flex justify-end">
          <TeamSide team={match.away} align="right" />
        </span>
      </div>
      {match.status === "scheduled" && (
        <div className="mt-3 text-center text-xs text-text-secondary">
          <KickoffTimes date={match.date} />
        </div>
      )}
    </motion.article>
  );
}
