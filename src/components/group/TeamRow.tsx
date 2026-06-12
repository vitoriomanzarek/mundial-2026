"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { StandingsRowView } from "@/lib/types";
import TeamFlag from "@/components/team/TeamFlag";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface TeamRowProps {
  row: StandingsRowView;
  position: number;
}

export default function TeamRow({ row, position }: TeamRowProps) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={clsx(
        "grid grid-cols-[1.25rem_1fr_2rem_2.25rem_2.25rem] items-center gap-2 rounded-md px-2 py-1.5",
        "border-l-2 transition-colors hover:bg-surface-2",
        row.qualification === "direct" && "border-l-accent",
        row.qualification === "third" && "border-l-warning",
        row.qualification === null && "border-l-transparent"
      )}
    >
      <span className="text-xs tabular-nums text-text-muted">{position}</span>
      <Link
        href={`/equipo/${row.teamId}`}
        className="flex min-w-0 items-center gap-2 transition-colors hover:text-accent"
      >
        <TeamFlag code={row.code} name={row.name} />
        <span className="truncate text-sm">{row.name}</span>
      </Link>
      <span className="text-right text-sm tabular-nums text-text-secondary">
        {row.played}
      </span>
      <span className="text-right text-sm tabular-nums text-text-secondary">
        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
      </span>
      <span className="text-right text-sm font-semibold">
        <AnimatedNumber value={row.points} />
      </span>
    </motion.div>
  );
}
