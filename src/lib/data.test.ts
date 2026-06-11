import { describe, expect, it } from "vitest";
import { getGroups, getMatches, getTeams, getVenues } from "./data";

describe("integridad de datos", () => {
  it("carga sin errores de validación", () => {
    expect(() => getTeams()).not.toThrow();
  });

  it("tiene 48 equipos, 12 grupos, 16 sedes y 104 partidos", () => {
    expect(getTeams()).toHaveLength(48);
    expect(getGroups()).toHaveLength(12);
    expect(getVenues()).toHaveLength(16);
    expect(getMatches()).toHaveLength(104);
  });

  it("cada grupo tiene 6 partidos de fase de grupos", () => {
    const matches = getMatches();
    for (const group of getGroups()) {
      const count = matches.filter((m) => m.groupId === group.id).length;
      expect(count, `grupo ${group.id}`).toBe(6);
    }
  });

  it("cada equipo juega exactamente 3 partidos de grupos", () => {
    const played = new Map<string, number>();
    for (const m of getMatches()) {
      if (m.phase !== "groups") continue;
      for (const id of [m.homeTeamId, m.awayTeamId]) {
        if (id) played.set(id, (played.get(id) ?? 0) + 1);
      }
    }
    for (const team of getTeams()) {
      expect(played.get(team.id), team.id).toBe(3);
    }
  });

  it("las fases eliminatorias tienen la cantidad correcta de partidos", () => {
    const byPhase = (phase: string) =>
      getMatches().filter((m) => m.phase === phase).length;
    expect(byPhase("round32")).toBe(16);
    expect(byPhase("round16")).toBe(8);
    expect(byPhase("qf")).toBe(4);
    expect(byPhase("sf")).toBe(2);
    expect(byPhase("third")).toBe(1);
    expect(byPhase("final")).toBe(1);
  });
});
