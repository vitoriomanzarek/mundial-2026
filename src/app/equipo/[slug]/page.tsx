import type { Metadata } from "next";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { getMatchViews, getMatchesByTeam, getTeamById, getTeams } from "@/lib/data";
import { computeTeamRecord } from "@/lib/standings";
import type { Match } from "@/lib/types";
import TeamBadge from "@/components/team/TeamBadge";
import PointsChart, {
  type PointsChartDatum,
} from "@/components/team/PointsChart";
import MatchCard from "@/components/match/MatchCard";

interface TeamPageProps {
  params: { slug: string };
}

export function generateStaticParams(): { slug: string }[] {
  return getTeams().map((team) => ({ slug: team.id }));
}

export function generateMetadata({ params }: TeamPageProps): Metadata {
  const team = getTeamById(params.slug);
  if (!team) return { title: "Equipo | Mundial 2026" };
  return {
    title: `${team.name} | Mundial 2026`,
    description: `Partidos, resultados y evolución de puntos de ${team.name} en el Mundial 2026.`,
  };
}

function buildPointsData(teamId: string, matches: Match[]): PointsChartDatum[] {
  const data: PointsChartDatum[] = [{ label: "Inicio", points: 0 }];
  let points = 0;
  for (const match of matches) {
    if (match.phase !== "groups") continue;
    if (match.status !== "finished" || !match.result) continue;
    const isHome = match.homeTeamId === teamId;
    const rivalId = isHome ? match.awayTeamId : match.homeTeamId;
    const rival = rivalId ? getTeamById(rivalId) : null;
    const goalsFor = isHome ? match.result.homeGoals : match.result.awayGoals;
    const goalsAgainst = isHome
      ? match.result.awayGoals
      : match.result.homeGoals;
    points += goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0;
    data.push({ label: `vs ${rival?.code ?? "?"}`, points });
  }
  return data;
}

function buildStreak(teamId: string, matches: Match[]): ("G" | "E" | "P")[] {
  const streak: ("G" | "E" | "P")[] = [];
  for (const match of matches) {
    if (match.status !== "finished" || !match.result) continue;
    const isHome = match.homeTeamId === teamId;
    const goalsFor = isHome ? match.result.homeGoals : match.result.awayGoals;
    const goalsAgainst = isHome
      ? match.result.awayGoals
      : match.result.homeGoals;
    streak.push(goalsFor > goalsAgainst ? "G" : goalsFor === goalsAgainst ? "E" : "P");
  }
  return streak;
}

export default function TeamPage({ params }: TeamPageProps) {
  const team = getTeamById(params.slug);
  if (!team) notFound();

  const teamMatches = [...getMatchesByTeam(team.id)].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const record = computeTeamRecord(team.id, teamMatches);
  const pointsData = buildPointsData(team.id, teamMatches);
  const streak = buildStreak(team.id, teamMatches);
  const matchViews = getMatchViews(teamMatches);

  const stats = [
    { label: "PJ", value: record.played },
    { label: "G", value: record.won },
    { label: "E", value: record.drawn },
    { label: "P", value: record.lost },
    { label: "GF", value: record.goalsFor },
    { label: "GC", value: record.goalsAgainst },
    {
      label: "DG",
      value:
        record.goalDifference > 0
          ? `+${record.goalDifference}`
          : record.goalDifference,
    },
    { label: "Pts", value: record.points },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <TeamBadge
        name={team.name}
        code={team.code}
        groupId={team.groupId}
        confederation={team.confederation}
      />

      <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-center"
          >
            <div className="text-lg font-semibold tabular-nums">
              {stat.value}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {streak.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
          <span>Racha:</span>
          <span className="flex gap-1.5">
            {streak.map((result, index) => (
              <span
                key={index}
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold",
                  result === "G" && "bg-accent/15 text-accent",
                  result === "E" && "bg-surface-2 text-text-secondary",
                  result === "P" && "bg-accent-2/15 text-accent-2"
                )}
              >
                {result}
              </span>
            ))}
          </span>
        </div>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold">
        Evolución de puntos
      </h2>
      {pointsData.length > 1 ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <PointsChart data={pointsData} />
        </div>
      ) : (
        <p className="rounded-xl border border-border bg-surface p-6 text-sm text-text-muted">
          La gráfica aparece cuando el equipo tenga partidos jugados.
        </p>
      )}

      <h2 className="mb-3 mt-10 text-lg font-semibold">Sus partidos</h2>
      <div className="flex flex-col gap-3">
        {matchViews.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
