import teamsJson from "@/data/teams.json";
import groupsJson from "@/data/groups.json";
import venuesJson from "@/data/venues.json";
import matchesJson from "@/data/matches.json";
import type { Group, Match, Team, Venue } from "./types";

const teams = teamsJson as unknown as Team[];
const groups = groupsJson as unknown as Group[];
const venues = venuesJson as unknown as Venue[];
const matches = matchesJson as unknown as Match[];

let validated = false;

function fail(message: string): never {
  throw new Error(`[data] Integridad de datos rota: ${message}`);
}

function validate(): void {
  if (validated) return;

  const teamIds = new Set(teams.map((t) => t.id));
  const groupIds = new Set(groups.map((g) => g.id));
  const venueIds = new Set(venues.map((v) => v.id));

  if (teamIds.size !== teams.length) fail("ids de equipo duplicados");
  if (groupIds.size !== groups.length) fail("ids de grupo duplicados");
  if (venueIds.size !== venues.length) fail("ids de sede duplicados");

  for (const team of teams) {
    if (!groupIds.has(team.groupId)) {
      fail(`el equipo "${team.id}" referencia el grupo inexistente "${team.groupId}"`);
    }
  }

  for (const group of groups) {
    if (group.teamIds.length !== 4) {
      fail(`el grupo "${group.id}" tiene ${group.teamIds.length} equipos, deben ser 4`);
    }
    for (const teamId of group.teamIds) {
      if (!teamIds.has(teamId)) {
        fail(`el grupo "${group.id}" referencia el equipo inexistente "${teamId}"`);
      }
      const team = teams.find((t) => t.id === teamId);
      if (team && team.groupId !== group.id) {
        fail(`el equipo "${teamId}" está en el grupo "${group.id}" pero declara groupId "${team.groupId}"`);
      }
    }
  }

  const matchIds = new Set<string>();
  for (const match of matches) {
    if (matchIds.has(match.id)) fail(`id de partido duplicado "${match.id}"`);
    matchIds.add(match.id);

    if (!venueIds.has(match.venueId)) {
      fail(`el partido "${match.id}" referencia la sede inexistente "${match.venueId}"`);
    }
    if (Number.isNaN(Date.parse(match.date))) {
      fail(`el partido "${match.id}" tiene fecha inválida "${match.date}"`);
    }
    if (match.homeTeamId !== null && !teamIds.has(match.homeTeamId)) {
      fail(`el partido "${match.id}" referencia el equipo inexistente "${match.homeTeamId}"`);
    }
    if (match.awayTeamId !== null && !teamIds.has(match.awayTeamId)) {
      fail(`el partido "${match.id}" referencia el equipo inexistente "${match.awayTeamId}"`);
    }
    if (match.phase === "groups") {
      if (!match.groupId || !groupIds.has(match.groupId)) {
        fail(`el partido de grupos "${match.id}" no tiene un groupId válido`);
      }
      if (match.homeTeamId === null || match.awayTeamId === null) {
        fail(`el partido de grupos "${match.id}" debe tener ambos equipos definidos`);
      }
    }
    if (match.status === "finished" && !match.result) {
      fail(`el partido "${match.id}" está finalizado pero no tiene resultado`);
    }
  }

  validated = true;
}

export function getTeams(): Team[] {
  validate();
  return teams;
}

export function getGroups(): Group[] {
  validate();
  return groups;
}

export function getVenues(): Venue[] {
  validate();
  return venues;
}

export function getMatches(): Match[] {
  validate();
  return matches;
}

export function getTeamById(id: string): Team | undefined {
  return getTeams().find((t) => t.id === id);
}

export function getTeamBySlug(slug: string): Team | undefined {
  return getTeamById(slug);
}

export function getGroupById(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id);
}

export function getVenueById(id: string): Venue | undefined {
  return getVenues().find((v) => v.id === id);
}

export function getMatchesByGroup(groupId: string): Match[] {
  return getMatches().filter((m) => m.groupId === groupId);
}

export function getMatchesByTeam(teamId: string): Match[] {
  return getMatches().filter(
    (m) => m.homeTeamId === teamId || m.awayTeamId === teamId
  );
}
