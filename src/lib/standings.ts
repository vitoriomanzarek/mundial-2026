import type { Match, StandingsRow } from "./types";

function emptyRow(teamId: string): StandingsRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function applyResult(
  row: StandingsRow,
  goalsFor: number,
  goalsAgainst: number
): void {
  row.played += 1;
  row.goalsFor += goalsFor;
  row.goalsAgainst += goalsAgainst;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
  if (goalsFor > goalsAgainst) {
    row.won += 1;
    row.points += 3;
  } else if (goalsFor === goalsAgainst) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

function compareRows(a: StandingsRow, b: StandingsRow): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference)
    return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return 0;
}

function headToHeadWinner(
  aId: string,
  bId: string,
  matches: Match[]
): string | null {
  const direct = matches.find(
    (m) =>
      m.status === "finished" &&
      m.result &&
      ((m.homeTeamId === aId && m.awayTeamId === bId) ||
        (m.homeTeamId === bId && m.awayTeamId === aId))
  );
  if (!direct || !direct.result) return null;
  const { homeGoals, awayGoals } = direct.result;
  if (homeGoals === awayGoals) return null;
  const winner = homeGoals > awayGoals ? direct.homeTeamId : direct.awayTeamId;
  return winner;
}

/**
 * Calcula la tabla de un grupo desde sus partidos finalizados.
 * Orden: Pts, DG, GF, head-to-head (solo desempate entre dos),
 * y como último recurso orden alfabético del id (determinista,
 * en lugar de sorteo).
 */
export function computeStandings(
  teamIds: string[],
  groupMatches: Match[]
): StandingsRow[] {
  const rows = new Map<string, StandingsRow>(
    teamIds.map((id) => [id, emptyRow(id)])
  );

  for (const match of groupMatches) {
    if (match.status !== "finished" || !match.result) continue;
    if (!match.homeTeamId || !match.awayTeamId) continue;
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (!home || !away) continue;
    applyResult(home, match.result.homeGoals, match.result.awayGoals);
    applyResult(away, match.result.awayGoals, match.result.homeGoals);
  }

  return Array.from(rows.values()).sort((a, b) => {
    const base = compareRows(a, b);
    if (base !== 0) return base;
    const winner = headToHeadWinner(a.teamId, b.teamId, groupMatches);
    if (winner === a.teamId) return -1;
    if (winner === b.teamId) return 1;
    return a.teamId.localeCompare(b.teamId);
  });
}

/**
 * Récord acumulado de un equipo sobre sus partidos finalizados
 * (incluye eliminatorias si las jugó).
 */
export function computeTeamRecord(
  teamId: string,
  matches: Match[]
): StandingsRow {
  const row = emptyRow(teamId);
  for (const match of matches) {
    if (match.status !== "finished" || !match.result) continue;
    if (match.homeTeamId === teamId) {
      applyResult(row, match.result.homeGoals, match.result.awayGoals);
    } else if (match.awayTeamId === teamId) {
      applyResult(row, match.result.awayGoals, match.result.homeGoals);
    }
  }
  return row;
}

/**
 * Los 8 mejores terceros lugares entre todos los grupos,
 * ordenados por Pts, DG, GF.
 */
export function computeBestThirds(
  groups: { id: string; teamIds: string[] }[],
  allMatches: Match[]
): { groupId: string; row: StandingsRow }[] {
  const thirds = groups.map((group) => {
    const groupMatches = allMatches.filter((m) => m.groupId === group.id);
    const standings = computeStandings(group.teamIds, groupMatches);
    return { groupId: group.id, row: standings[2] };
  });

  return thirds
    .sort((a, b) => {
      const base = compareRows(a.row, b.row);
      if (base !== 0) return base;
      return a.groupId.localeCompare(b.groupId);
    })
    .slice(0, 8);
}
