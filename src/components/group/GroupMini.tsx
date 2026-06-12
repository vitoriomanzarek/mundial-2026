import Link from "next/link";
import type { StandingsRowView } from "@/lib/types";
import TeamFlag from "@/components/team/TeamFlag";

interface GroupMiniProps {
  id: string;
  rows: StandingsRowView[];
}

export default function GroupMini({ id, rows }: GroupMiniProps) {
  return (
    <Link
      href="/grupos"
      className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-surface-2"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Grupo <span className="text-accent">{id}</span>
      </h3>
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li
            key={row.teamId}
            className="flex items-center gap-2 text-sm"
          >
            <TeamFlag code={row.code} name={row.name} />
            <span className="truncate">{row.name}</span>
            <span className="ml-auto text-xs tabular-nums text-text-secondary">
              {row.points}
            </span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
