import type { Group, Match } from "./types";
import { computeStandings } from "./standings";

export type SlotSource =
  | { kind: "group"; place: 1 | 2; groupId: string }
  | { kind: "third"; label: string }
  | { kind: "match"; take: "winner" | "loser"; matchId: string };

function g(place: 1 | 2, groupId: string): SlotSource {
  return { kind: "group", place, groupId };
}

function t(label: string): SlotSource {
  return { kind: "third", label };
}

function w(matchId: string): SlotSource {
  return { kind: "match", take: "winner", matchId };
}

function l(matchId: string): SlotSource {
  return { kind: "match", take: "loser", matchId };
}

/**
 * Cruces oficiales FIFA (sorteo dic 2025). Los terceros dependen de la
 * tabla de asignación de FIFA según qué grupos clasifiquen; esos slots
 * se llenan editando matches.json cuando sean oficiales.
 */
export const KNOCKOUT_SOURCES: Record<string, [SlotSource, SlotSource]> = {
  M73: [g(2, "A"), g(2, "B")],
  M74: [g(1, "E"), t("3.º A/B/C/D/F")],
  M75: [g(1, "F"), g(2, "C")],
  M76: [g(1, "C"), g(2, "F")],
  M77: [g(1, "I"), t("3.º C/D/F/G/H")],
  M78: [g(2, "E"), g(2, "I")],
  M79: [g(1, "A"), t("3.º C/E/F/H/I")],
  M80: [g(1, "L"), t("3.º E/H/I/J/K")],
  M81: [g(1, "D"), t("3.º B/E/F/I/J")],
  M82: [g(1, "G"), t("3.º A/E/H/I/J")],
  M83: [g(2, "K"), g(2, "L")],
  M84: [g(1, "H"), g(2, "J")],
  M85: [g(1, "B"), t("3.º E/F/G/I/J")],
  M86: [g(1, "J"), g(2, "H")],
  M87: [g(1, "K"), t("3.º D/E/I/J/L")],
  M88: [g(2, "D"), g(2, "G")],
  M89: [w("M74"), w("M77")],
  M90: [w("M73"), w("M75")],
  M91: [w("M76"), w("M78")],
  M92: [w("M79"), w("M80")],
  M93: [w("M83"), w("M84")],
  M94: [w("M81"), w("M82")],
  M95: [w("M86"), w("M88")],
  M96: [w("M85"), w("M87")],
  M97: [w("M89"), w("M90")],
  M98: [w("M93"), w("M94")],
  M99: [w("M91"), w("M92")],
  M100: [w("M95"), w("M96")],
  M101: [w("M97"), w("M98")],
  M102: [w("M99"), w("M100")],
  M103: [l("M101"), l("M102")],
  M104: [w("M101"), w("M102")],
};

export function matchWinnerId(match: Match): string | null {
  if (match.status !== "finished" || !match.result) return null;
  if (!match.homeTeamId || !match.awayTeamId) return null;
  const { homeGoals, awayGoals, penalties } = match.result;
  if (homeGoals > awayGoals) return match.homeTeamId;
  if (awayGoals > homeGoals) return match.awayTeamId;
  if (penalties) {
    return penalties.home > penalties.away
      ? match.homeTeamId
      : match.awayTeamId;
  }
  return null;
}

export function matchLoserId(match: Match): string | null {
  const winner = matchWinnerId(match);
  if (!winner) return null;
  return winner === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
}

export function sourceLabel(source: SlotSource): string {
  switch (source.kind) {
    case "group":
      return `${source.place}.º ${source.groupId}`;
    case "third":
      return source.label;
    case "match":
      return source.take === "winner"
        ? `Gana ${source.matchId}`
        : `Pierde ${source.matchId}`;
  }
}

function isGroupComplete(groupId: string, matches: Match[]): boolean {
  const groupMatches = matches.filter((m) => m.groupId === groupId);
  return (
    groupMatches.length === 6 &&
    groupMatches.every((m) => m.status === "finished")
  );
}

function resolveSource(
  source: SlotSource,
  matches: Match[],
  groups: Group[]
): string | null {
  switch (source.kind) {
    case "group": {
      if (!isGroupComplete(source.groupId, matches)) return null;
      const group = groups.find((grp) => grp.id === source.groupId);
      if (!group) return null;
      const standings = computeStandings(
        group.teamIds,
        matches.filter((m) => m.groupId === source.groupId)
      );
      return standings[source.place - 1]?.teamId ?? null;
    }
    case "third":
      // La asignación oficial de terceros se edita a mano en matches.json.
      return null;
    case "match": {
      const match = matches.find((m) => m.id === source.matchId);
      if (!match) return null;
      return source.take === "winner"
        ? matchWinnerId(match)
        : matchLoserId(match);
    }
  }
}

export interface ResolvedSlot {
  homeTeamId: string | null;
  awayTeamId: string | null;
}

/**
 * Resuelve los equipos de cada partido eliminatorio: lo que ya esté
 * en matches.json tiene prioridad; si falta, se deriva de las tablas
 * finales de grupo o del ganador/perdedor del partido previo.
 */
export function resolveKnockout(
  matches: Match[],
  groups: Group[]
): Map<string, ResolvedSlot> {
  const resolved = new Map<string, ResolvedSlot>();
  for (const [matchId, [homeSource, awaySource]] of Object.entries(
    KNOCKOUT_SOURCES
  )) {
    const match = matches.find((m) => m.id === matchId);
    if (!match) continue;
    resolved.set(matchId, {
      homeTeamId:
        match.homeTeamId ?? resolveSource(homeSource, matches, groups),
      awayTeamId:
        match.awayTeamId ?? resolveSource(awaySource, matches, groups),
    });
  }
  return resolved;
}
