import type { Metadata } from "next";
import { getGroups, getMatches, getTeamById } from "@/lib/data";
import {
  KNOCKOUT_SOURCES,
  matchWinnerId,
  resolveKnockout,
  sourceLabel,
} from "@/lib/bracket";
import type {
  BracketMatchView,
  BracketTeamView,
  Match,
  MatchTeamView,
} from "@/lib/types";
import Bracket from "@/components/bracket/Bracket";

export const metadata: Metadata = {
  title: "Eliminatorias | Mundial 2026",
  description:
    "El bracket eliminatorio del Mundial 2026, de dieciseisavos a la final.",
};

function toTeamView(teamId: string | null): MatchTeamView | null {
  if (!teamId) return null;
  const team = getTeamById(teamId);
  if (!team) return null;
  return { id: team.id, name: team.name, code: team.code };
}

function buildSide(
  match: Match,
  teamId: string | null,
  label: string,
  isHome: boolean
): BracketTeamView {
  const finished = match.status === "finished" && match.result;
  const winnerId = matchWinnerId(match);
  return {
    team: toTeamView(teamId),
    label,
    goals: finished
      ? isHome
        ? match.result!.homeGoals
        : match.result!.awayGoals
      : null,
    penalties:
      finished && match.result!.penalties
        ? isHome
          ? match.result!.penalties.home
          : match.result!.penalties.away
        : null,
    isWinner: winnerId !== null && winnerId === teamId,
  };
}

export default function EliminatoriasPage() {
  const matches = getMatches();
  const resolved = resolveKnockout(matches, getGroups());

  const views: Record<string, BracketMatchView> = {};
  for (const match of matches) {
    const slot = resolved.get(match.id);
    const sources = KNOCKOUT_SOURCES[match.id];
    if (!slot || !sources) continue;
    views[match.id] = {
      id: match.id,
      date: match.date,
      status: match.status,
      home: buildSide(match, slot.homeTeamId, sourceLabel(sources[0]), true),
      away: buildSide(match, slot.awayTeamId, sourceLabel(sources[1]), false),
    };
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Eliminatorias
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          De dieciseisavos a la final. Los slots se llenan conforme avanza el
          torneo; toca un partido para verlo en el calendario.
        </p>
      </header>
      <Bracket matches={views} />
    </section>
  );
}
