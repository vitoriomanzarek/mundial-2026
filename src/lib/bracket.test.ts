import { describe, expect, it } from "vitest";
import type { Group, Match } from "./types";
import {
  KNOCKOUT_SOURCES,
  matchLoserId,
  matchWinnerId,
  resolveKnockout,
  sourceLabel,
} from "./bracket";

function groupMatch(
  id: string,
  groupId: string,
  home: string,
  away: string,
  homeGoals?: number,
  awayGoals?: number
): Match {
  const finished = homeGoals !== undefined && awayGoals !== undefined;
  return {
    id,
    phase: "groups",
    groupId,
    date: "2026-06-11T19:00:00Z",
    venueId: "azteca",
    homeTeamId: home,
    awayTeamId: away,
    status: finished ? "finished" : "scheduled",
    ...(finished ? { result: { homeGoals, awayGoals } } : {}),
  };
}

function koMatch(id: string, overrides: Partial<Match> = {}): Match {
  return {
    id,
    phase: "round32",
    date: "2026-06-29T19:00:00Z",
    venueId: "azteca",
    homeTeamId: null,
    awayTeamId: null,
    status: "scheduled",
    ...overrides,
  };
}

// Grupo A completo: a1 gana todo, a2 segundo, a3 tercero, a4 último.
const GROUP_A: Group = { id: "A", teamIds: ["a1", "a2", "a3", "a4"] };
const GROUP_A_MATCHES: Match[] = [
  groupMatch("G1", "A", "a1", "a2", 2, 0),
  groupMatch("G2", "A", "a1", "a3", 2, 0),
  groupMatch("G3", "A", "a1", "a4", 2, 0),
  groupMatch("G4", "A", "a2", "a3", 2, 0),
  groupMatch("G5", "A", "a2", "a4", 2, 0),
  groupMatch("G6", "A", "a3", "a4", 2, 0),
];

describe("matchWinnerId / matchLoserId", () => {
  it("devuelve null si el partido no terminó", () => {
    expect(matchWinnerId(koMatch("M73"))).toBeNull();
  });

  it("resuelve ganador por goles", () => {
    const match = koMatch("M73", {
      homeTeamId: "x",
      awayTeamId: "y",
      status: "finished",
      result: { homeGoals: 1, awayGoals: 3 },
    });
    expect(matchWinnerId(match)).toBe("y");
    expect(matchLoserId(match)).toBe("x");
  });

  it("resuelve ganador por penales en empate", () => {
    const match = koMatch("M73", {
      homeTeamId: "x",
      awayTeamId: "y",
      status: "finished",
      result: {
        homeGoals: 1,
        awayGoals: 1,
        penalties: { home: 5, away: 4 },
      },
    });
    expect(matchWinnerId(match)).toBe("x");
    expect(matchLoserId(match)).toBe("y");
  });
});

describe("resolveKnockout", () => {
  it("llena 1.º y 2.º de grupo solo cuando el grupo está completo", () => {
    const m73 = koMatch("M73");
    const m79 = koMatch("M79");
    const incompleto = resolveKnockout(
      [...GROUP_A_MATCHES.slice(0, 5), m73, m79],
      [GROUP_A]
    );
    expect(incompleto.get("M73")?.homeTeamId).toBeNull();

    const completo = resolveKnockout([...GROUP_A_MATCHES, m73, m79], [GROUP_A]);
    // M73: 2.º A de local; M79: 1.º A de local
    expect(completo.get("M73")?.homeTeamId).toBe("a2");
    expect(completo.get("M79")?.homeTeamId).toBe("a1");
    // el rival de M79 es un tercero: queda null hasta editarse a mano
    expect(completo.get("M79")?.awayTeamId).toBeNull();
  });

  it("lo escrito en matches.json tiene prioridad sobre lo derivado", () => {
    const m73 = koMatch("M73", { homeTeamId: "manual" });
    const resolved = resolveKnockout([...GROUP_A_MATCHES, m73], [GROUP_A]);
    expect(resolved.get("M73")?.homeTeamId).toBe("manual");
  });

  it("propaga ganadores y perdedores entre rondas", () => {
    const m101 = koMatch("M101", {
      phase: "sf",
      homeTeamId: "x",
      awayTeamId: "y",
      status: "finished",
      result: { homeGoals: 2, awayGoals: 1 },
    });
    const m102 = koMatch("M102", {
      phase: "sf",
      homeTeamId: "z",
      awayTeamId: "q",
      status: "finished",
      result: { homeGoals: 0, awayGoals: 1 },
    });
    const m103 = koMatch("M103", { phase: "third" });
    const m104 = koMatch("M104", { phase: "final" });
    const resolved = resolveKnockout([m101, m102, m103, m104], []);
    expect(resolved.get("M104")).toEqual({ homeTeamId: "x", awayTeamId: "q" });
    expect(resolved.get("M103")).toEqual({ homeTeamId: "y", awayTeamId: "z" });
  });
});

describe("estructura del bracket", () => {
  it("define los 32 partidos eliminatorios", () => {
    expect(Object.keys(KNOCKOUT_SOURCES)).toHaveLength(32);
  });

  it("genera etiquetas legibles", () => {
    expect(sourceLabel({ kind: "group", place: 1, groupId: "E" })).toBe("1.º E");
    expect(
      sourceLabel({ kind: "match", take: "winner", matchId: "M74" })
    ).toBe("Gana M74");
    expect(
      sourceLabel({ kind: "match", take: "loser", matchId: "M101" })
    ).toBe("Pierde M101");
  });
});
