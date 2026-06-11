"use client";

import { motion } from "framer-motion";
import type { GroupView } from "@/lib/types";
import StandingsTable from "./StandingsTable";

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function GroupCard({ group }: { group: GroupView }) {
  return (
    <motion.article
      variants={item}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h2 className="mb-4 text-lg font-semibold">
        Grupo <span className="text-accent">{group.id}</span>
      </h2>
      <StandingsTable rows={group.rows} />
    </motion.article>
  );
}
