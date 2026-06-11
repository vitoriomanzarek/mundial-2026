import { describe, expect, it } from "vitest";
import type { Match } from "./types";
import { computeBestThirds, computeStandings } from "./standings";

const TEAMS = ["aa", "bb", "cc", "dd"];

function match(
  id: string,
  home: string,
  away: string,
  homeGoals?: number,
  awayGoals?: number
): Match {
  const finished = homeGoals !== undefined && awayGoals !== undefined;
  return {
    id,
    phase: "groups",
    groupId: "A",
    date: "2026-06-11T19:00:00Z",
    venueId: "azteca",
    homeTeamId: home,
    awayTeamId: away,
    status: finished ? "finished" : "scheduled",
    ...(finished ? { result: { homeGoals, awayGoals } } : {}),
  };
}

describe("computeStandings", () => {
  it("devuelve filas en cero sin partidos jugados", () => {
    const rows = computeStandings(TEAMS, [match("M1", "aa", "bb")]);
    expect(rows).toHaveLength(4);
    for (const row of rows) {
      expect(row.played).toBe(0);
      expect(row.points).toBe(0);
    }
  });

  it("asigna 3 puntos por victoria y 1 por empate", () => {
    const rows = computeStandings(TEAMS, [
      match("M1", "aa", "bb", 2, 0),
      match("M2", "cc", "dd", 1, 1),
    ]);
    const byId = Object.fromEntries(rows.map((r) => [r.teamId, r]));
    expect(byId.aa.points).toBe(3);
    expect(byId.bb.points).toBe(0);
    expect(byId.cc.points).toBe(1);
    expect(byId.dd.points).toBe(1);
  });

  it("ordena por puntos, luego diferencia de gol, luego goles a favor", () => {
    // bb: 3pts DG+3 | cc: 3pts DG+1 GF2 | aa: 3pts DG+1 GF1 | dd: 0pts
    const rows = computeStandings(TEAMS, [
      match("M1", "aa", "dd", 1, 0),
      match("M2", "bb", "dd", 3, 0),
      match("M3", "cc", "dd", 2, 1),
    ]);
    expect(rows.map((r) => r.teamId)).toEqual(["bb", "cc", "aa", "dd"]);
  });

  it("desempata con head-to-head cuando todo lo demás es igual", () => {
    // aa y cc terminan con 3pts, DG 0 y GF 1; cc le ganó a aa,
    // así que va arriba aunque alfabéticamente iría después.
    const rows = computeStandings(TEAMS, [
      match("M1", "cc", "aa", 1, 0),
      match("M2", "aa", "dd", 1, 0),
      match("M3", "bb", "cc", 1, 0),
    ]);
    expect(rows.map((r) => r.teamId)).toEqual(["bb", "cc", "aa", "dd"]);
  });

  it("calcula GF, GC y DG acumulados", () => {
    const rows = computeStandings(TEAMS, [
      match("M1", "aa", "bb", 3, 1),
      match("M2", "aa", "cc", 0, 2),
    ]);
    const aa = rows.find((r) => r.teamId === "aa")!;
    expect(aa.played).toBe(2);
    expect(aa.goalsFor).toBe(3);
    expect(aa.goalsAgainst).toBe(3);
    expect(aa.goalDifference).toBe(0);
  });
});

describe("computeBestThirds", () => {
  it("devuelve los 8 mejores terceros ordenados por DG", () => {
    // En cada grupo: g1 y g2 le ganan 2-0 a g4, y g3 le gana a g4
    // por margen m (2 en los grupos A-D, 1 en E-L). El tercero es
    // siempre g3 con 3pts; su DG (+2 o +1) decide el ranking global.
    const groups = "ABCDEFGHIJKL".split("").map((id, i) => ({
      id,
      teamIds: [`${id}1`, `${id}2`, `${id}3`, `${id}4`],
    }));
    const matches: Match[] = groups.flatMap((g, i) => {
      const m = i < 4 ? 2 : 1;
      return [
        { ...match(`${g.id}-1`, `${g.id}1`, `${g.id}4`, 2, 0), groupId: g.id },
        { ...match(`${g.id}-2`, `${g.id}2`, `${g.id}4`, 2, 0), groupId: g.id },
        { ...match(`${g.id}-3`, `${g.id}3`, `${g.id}4`, m, 0), groupId: g.id },
      ];
    });
    const thirds = computeBestThirds(groups, matches);
    expect(thirds).toHaveLength(8);
    for (const third of thirds) {
      expect(third.row.teamId.endsWith("3")).toBe(true);
      expect(third.row.points).toBe(3);
    }
    // Los terceros con DG+2 (grupos A-D) van primero; entre iguales,
    // orden alfabético de grupo. El grupo L (DG+1) queda fuera.
    expect(thirds.map((t) => t.groupId)).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H",
    ]);
  });
});
