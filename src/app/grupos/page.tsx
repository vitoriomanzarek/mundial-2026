import type { Metadata } from "next";
import { getGroups, getMatchesByGroup, getTeamById } from "@/lib/data";
import { computeBestThirds, computeStandings } from "@/lib/standings";
import { getMatches } from "@/lib/data";
import type { GroupView } from "@/lib/types";
import GroupsGrid from "@/components/group/GroupsGrid";

export const metadata: Metadata = {
  title: "Grupos | Mundial 2026",
  description:
    "Los 12 grupos del Mundial 2026 con sus tablas de posiciones en vivo.",
};

function buildGroupViews(): GroupView[] {
  const groups = getGroups();
  const bestThirdGroups = new Set(
    computeBestThirds(groups, getMatches()).map((t) => t.groupId)
  );

  return groups.map((group) => {
    const standings = computeStandings(
      group.teamIds,
      getMatchesByGroup(group.id)
    );
    return {
      id: group.id,
      rows: standings.map((row, index) => {
        const team = getTeamById(row.teamId);
        return {
          teamId: row.teamId,
          name: team?.name ?? row.teamId,
          code: team?.code ?? "",
          played: row.played,
          goalDifference: row.goalDifference,
          points: row.points,
          qualification:
            index < 2
              ? ("direct" as const)
              : index === 2 && bestThirdGroups.has(group.id)
                ? ("third" as const)
                : null,
        };
      }),
    };
  });
}

export default function GruposPage() {
  const groups = buildGroupViews();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Grupos</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Las posiciones se calculan con los partidos finalizados. Avanzan los
          dos primeros de cada grupo y los 8 mejores terceros.
        </p>
      </header>
      <GroupsGrid groups={groups} />
      <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
        <span className="flex items-center gap-2">
          <span className="h-3 w-0.5 rounded bg-accent" />
          Clasificación directa
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-0.5 rounded bg-warning" />
          Entre los mejores terceros
        </span>
      </footer>
    </section>
  );
}
