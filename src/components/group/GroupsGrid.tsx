"use client";

import { motion } from "framer-motion";
import type { GroupView } from "@/lib/types";
import GroupCard from "./GroupCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export default function GroupsGrid({ groups }: { groups: GroupView[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </motion.div>
  );
}
