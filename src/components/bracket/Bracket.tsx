"use client";

import { motion } from "framer-motion";
import type { BracketMatchView } from "@/lib/types";
import BracketSlot from "./BracketSlot";

interface BracketColumn {
  title: string;
  ids: string[];
}

const COLUMNS: BracketColumn[] = [
  { title: "Dieciseisavos", ids: ["M74", "M77", "M73", "M75", "M83", "M84", "M81", "M82"] },
  { title: "Octavos", ids: ["M89", "M90", "M93", "M94"] },
  { title: "Cuartos", ids: ["M97", "M98"] },
  { title: "Semifinal", ids: ["M101"] },
  { title: "Final", ids: ["M104", "M103"] },
  { title: "Semifinal", ids: ["M102"] },
  { title: "Cuartos", ids: ["M99", "M100"] },
  { title: "Octavos", ids: ["M91", "M92", "M95", "M96"] },
  { title: "Dieciseisavos", ids: ["M76", "M78", "M79", "M80", "M86", "M88", "M85", "M87"] },
];

export default function Bracket({
  matches,
}: {
  matches: Record<string, BracketMatchView>;
}) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {COLUMNS.map((column, columnIndex) => (
          <motion.div
            key={`${column.title}-${columnIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: columnIndex * 0.06,
              ease: "easeOut",
            }}
            className="flex flex-col"
          >
            <h2 className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {column.title}
            </h2>
            <div className="flex flex-1 flex-col justify-around gap-3">
              {column.ids.map((id) => {
                const match = matches[id];
                if (!match) return null;
                if (id === "M104") {
                  return (
                    <div key={id} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                        Final
                      </span>
                      <BracketSlot match={match} />
                    </div>
                  );
                }
                if (id === "M103") {
                  return (
                    <div key={id} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-text-muted">
                        Tercer puesto
                      </span>
                      <BracketSlot match={match} />
                    </div>
                  );
                }
                return <BracketSlot key={id} match={match} />;
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
