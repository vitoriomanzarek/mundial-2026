import type { Metadata } from "next";
import { getGroups, getMatches, getTeamById, getVenues } from "@/lib/data";
import type { MatchTeamView, MatchView } from "@/lib/types";
import MatchList from "@/components/match/MatchList";

export const metadata: Metadata = {
  title: "Partidos | Mundial 2026",
  description:
    "Calendario completo de los 104 partidos del Mundial 2026 con resultados, sedes y horarios.",
};

function toTeamView(teamId: string | null): MatchTeamView | null {
  if (!teamId) return null;
  const team = getTeamById(teamId);
  if (!team) return null;
  return { id: team.id, name: team.name, code: team.code };
}

export default function PartidosPage() {
  const venues = getVenues();
  const venueById = new Map(venues.map((v) => [v.id, v]));

  const matches: MatchView[] = [...getMatches()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((match) => {
      const venue = venueById.get(match.venueId);
      return {
        id: match.id,
        phase: match.phase,
        groupId: match.groupId,
        date: match.date,
        venueId: match.venueId,
        stadium: venue?.stadium ?? match.venueId,
        city: venue?.city ?? "",
        home: toTeamView(match.homeTeamId),
        away: toTeamView(match.awayTeamId),
        result: match.result,
        status: match.status,
      };
    });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Partidos</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Los 104 partidos del torneo en orden cronológico. Horarios en hora
          del centro de México (CDMX).
        </p>
      </header>
      <MatchList
        matches={matches}
        groups={getGroups().map((g) => g.id)}
        venues={venues.map((v) => ({ id: v.id, label: v.stadium }))}
      />
    </section>
  );
}
