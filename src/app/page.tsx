import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGroups, getMatchViews, getMatchesByGroup, getTeamById } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import type { StandingsRowView } from "@/lib/types";
import Countdown from "@/components/ui/Countdown";
import MatchCard from "@/components/match/MatchCard";
import GroupMini from "@/components/group/GroupMini";

function buildMiniGroups(): { id: string; rows: StandingsRowView[] }[] {
  return getGroups().map((group) => ({
    id: group.id,
    rows: computeStandings(group.teamIds, getMatchesByGroup(group.id)).map(
      (row) => {
        const team = getTeamById(row.teamId);
        return {
          teamId: row.teamId,
          name: team?.name ?? row.teamId,
          code: team?.code ?? "",
          played: row.played,
          goalDifference: row.goalDifference,
          points: row.points,
          qualification: null,
        };
      }
    ),
  }));
}

export default function Home() {
  const matchViews = getMatchViews();
  const scheduled = matchViews.filter((m) => m.status === "scheduled");
  const upcoming = scheduled.slice(0, 6);

  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-text-muted">
          11 de junio – 19 de julio
        </p>
        <h1 className="text-5xl font-semibold tracking-[-0.02em] sm:text-7xl">
          Mundial <span className="text-accent">2026</span>
        </h1>
        <p className="mt-6 max-w-md text-base text-text-secondary">
          48 selecciones, 16 sedes, 104 partidos. Grupos, calendario y bracket
          eliminatorio en una sola vista.
        </p>
        <div className="mt-12">
          <Countdown matches={scheduled.slice(0, 12)} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Próximos partidos</h2>
          <Link
            href="/partidos"
            className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            Ver calendario <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Grupos</h2>
          <Link
            href="/grupos"
            className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            Ver tablas completas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {buildMiniGroups().map((group) => (
            <GroupMini key={group.id} id={group.id} rows={group.rows} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <Link
          href="/eliminatorias"
          className="flex items-center justify-between rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 hover:bg-surface-2"
        >
          <div>
            <h2 className="text-xl font-semibold">Bracket eliminatorio</h2>
            <p className="mt-1 text-sm text-text-secondary">
              De dieciseisavos a la final del 19 de julio en el MetLife
              Stadium.
            </p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-accent" />
        </Link>
      </section>
    </>
  );
}
