"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { BracketMatchView, BracketTeamView } from "@/lib/types";
import { formatDayShort } from "@/lib/dates";
import TeamFlag from "@/components/team/TeamFlag";

function SlotRow({ side }: { side: BracketTeamView }) {
  if (!side.team) {
    return (
      <span className="flex h-7 items-center px-2.5 text-[11px] text-text-muted">
        {side.label}
      </span>
    );
  }
  return (
    <span
      className={clsx(
        "flex h-7 items-center gap-2 px-2.5 text-xs",
        side.isWinner ? "font-semibold" : "text-text-secondary"
      )}
    >
      <TeamFlag code={side.team.code} name={side.team.name} />
      <span className={clsx(side.isWinner && "text-accent")}>
        {side.team.code}
      </span>
      <span className="ml-auto tabular-nums">
        {side.goals !== null && (
          <>
            {side.goals}
            {side.penalties !== null && (
              <span className="text-[10px] text-text-muted">
                {" "}
                ({side.penalties})
              </span>
            )}
          </>
        )}
      </span>
    </span>
  );
}

export default function BracketSlot({ match }: { match: BracketMatchView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/partidos#${match.id}`}
        aria-label={`Ver partido ${match.id} en el calendario`}
        className="block w-44 rounded-lg border border-border bg-surface py-1 transition-colors hover:border-accent/40 hover:bg-surface-2"
      >
        <SlotRow side={match.home} />
        <span className="mx-2.5 block h-px bg-border" />
        <SlotRow side={match.away} />
        <span className="block px-2.5 pb-1 pt-0.5 text-right text-[10px] text-text-muted">
          {match.id} · {formatDayShort(match.date)}
        </span>
      </Link>
    </motion.div>
  );
}
