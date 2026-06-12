// Actualiza src/data/matches.json con resultados de football-data.org (v4).
// Uso: FOOTBALL_DATA_TOKEN=xxx node scripts/update-results.mjs
// Corre en GitHub Actions cada 15 minutos durante el torneo.

import { readFileSync, writeFileSync } from "node:fs";

const API_URL = "https://api.football-data.org/v4/competitions/WC/matches";
const TOURNAMENT_END = Date.parse("2026-07-21T00:00:00Z");

// id propio -> identificadores de football-data (tla y nombres en inglés)
const TEAM_KEYS = {
  mexico: ["MEX", "mexico"],
  sudafrica: ["RSA", "ZAF", "south africa"],
  "corea-del-sur": ["KOR", "korea republic", "south korea"],
  chequia: ["CZE", "czechia", "czech republic"],
  canada: ["CAN", "canada"],
  bosnia: ["BIH", "bosnia and herzegovina", "bosnia-herzegovina"],
  catar: ["QAT", "qatar"],
  suiza: ["SUI", "CHE", "switzerland"],
  brasil: ["BRA", "brazil"],
  haiti: ["HAI", "HTI", "haiti"],
  marruecos: ["MAR", "morocco"],
  escocia: ["SCO", "scotland"],
  "estados-unidos": ["USA", "united states", "usa"],
  paraguay: ["PAR", "PRY", "paraguay"],
  turquia: ["TUR", "turkey", "turkiye", "türkiye"],
  australia: ["AUS", "australia"],
  curazao: ["CUW", "curacao", "curaçao"],
  ecuador: ["ECU", "ecuador"],
  alemania: ["GER", "DEU", "germany"],
  "costa-de-marfil": ["CIV", "ivory coast", "cote d'ivoire", "côte d'ivoire"],
  japon: ["JPN", "japan"],
  "paises-bajos": ["NED", "NLD", "netherlands"],
  suecia: ["SWE", "sweden"],
  tunez: ["TUN", "tunisia"],
  belgica: ["BEL", "belgium"],
  egipto: ["EGY", "egypt"],
  iran: ["IRN", "iran"],
  "nueva-zelanda": ["NZL", "new zealand"],
  "cabo-verde": ["CPV", "cape verde", "cabo verde"],
  "arabia-saudita": ["KSA", "SAU", "saudi arabia"],
  espana: ["ESP", "spain"],
  uruguay: ["URU", "URY", "uruguay"],
  francia: ["FRA", "france"],
  irak: ["IRQ", "iraq"],
  noruega: ["NOR", "norway"],
  senegal: ["SEN", "senegal"],
  argelia: ["ALG", "DZA", "algeria"],
  argentina: ["ARG", "argentina"],
  austria: ["AUT", "austria"],
  jordania: ["JOR", "jordan"],
  colombia: ["COL", "colombia"],
  "rd-congo": ["COD", "dr congo", "congo dr", "democratic republic of the congo"],
  portugal: ["POR", "PRT", "portugal"],
  uzbekistan: ["UZB", "uzbekistan"],
  croacia: ["CRO", "HRV", "croatia"],
  inglaterra: ["ENG", "england"],
  ghana: ["GHA", "ghana"],
  panama: ["PAN", "panama"],
};

const keyToId = new Map();
for (const [id, keys] of Object.entries(TEAM_KEYS)) {
  for (const key of keys) keyToId.set(key.toLowerCase(), id);
}

function mapTeam(apiTeam) {
  if (!apiTeam) return null;
  for (const candidate of [apiTeam.tla, apiTeam.name, apiTeam.shortName]) {
    if (!candidate) continue;
    const id = keyToId.get(candidate.toLowerCase());
    if (id) return id;
  }
  if (apiTeam.name && apiTeam.name !== "TBD") {
    console.warn(`AVISO: equipo de la API sin mapear: "${apiTeam.name}" (${apiTeam.tla ?? "?"})`);
  }
  return null;
}

function findLocalMatch(matches, homeId, awayId, utcDate) {
  if (homeId && awayId) {
    const byTeams = matches.filter(
      (m) =>
        (m.homeTeamId === homeId && m.awayTeamId === awayId) ||
        (m.homeTeamId === awayId && m.awayTeamId === homeId)
    );
    if (byTeams.length === 1) return byTeams[0];
  }
  // Eliminatorias con equipos aún null: empatar por fecha y hora exactas.
  const kickoff = Date.parse(utcDate);
  const byDate = matches.filter(
    (m) => m.phase !== "groups" && Date.parse(m.date) === kickoff
  );
  if (byDate.length === 1) return byDate[0];
  return null;
}

const token = process.env.FOOTBALL_DATA_TOKEN;
if (!token) {
  console.error("Falta la variable FOOTBALL_DATA_TOKEN");
  process.exit(1);
}

if (Date.now() > TOURNAMENT_END) {
  console.log("El torneo terminó; nada que actualizar.");
  process.exit(0);
}

const response = await fetch(API_URL, {
  headers: { "X-Auth-Token": token },
});
if (!response.ok) {
  console.error(`La API respondió ${response.status}: ${await response.text()}`);
  process.exit(1);
}
const { matches: apiMatches = [] } = await response.json();
console.log(`API: ${apiMatches.length} partidos recibidos`);

const matchesUrl = new URL("../src/data/matches.json", import.meta.url);
const matches = JSON.parse(readFileSync(matchesUrl, "utf8"));

let changes = 0;
const pendingPenalties = [];

for (const apiMatch of apiMatches) {
  const homeId = mapTeam(apiMatch.homeTeam);
  const awayId = mapTeam(apiMatch.awayTeam);
  const local = findLocalMatch(matches, homeId, awayId, apiMatch.utcDate);
  if (!local) continue;

  // La API invierte local/visitante en raras ocasiones; respetar la nuestra
  // salvo que la nuestra esté vacía.
  const sameOrder =
    local.homeTeamId === null || local.homeTeamId === homeId;

  // Llenar equipos de eliminatorias cuando se conocen.
  if (local.homeTeamId === null && homeId) {
    local.homeTeamId = homeId;
    changes++;
  }
  if (local.awayTeamId === null && awayId) {
    local.awayTeamId = awayId;
    changes++;
  }

  const fullTime = apiMatch.score?.fullTime;
  if (!fullTime || fullTime.home === null || fullTime.away === null) continue;
  const apiHomeGoals = sameOrder ? fullTime.home : fullTime.away;
  const apiAwayGoals = sameOrder ? fullTime.away : fullTime.home;

  if (apiMatch.status === "FINISHED") {
    const result = { homeGoals: apiHomeGoals, awayGoals: apiAwayGoals };
    if (apiMatch.score.duration === "PENALTY_SHOOTOUT") {
      const pen = apiMatch.score.penalties;
      if (pen && pen.home !== null && pen.away !== null) {
        result.penalties = sameOrder
          ? { home: pen.home, away: pen.away }
          : { home: pen.away, away: pen.home };
      } else {
        pendingPenalties.push(local.id);
      }
    }
    const before = JSON.stringify({ s: local.status, r: local.result });
    local.status = "finished";
    local.result = result;
    if (before !== JSON.stringify({ s: local.status, r: local.result })) {
      changes++;
      console.log(
        `${local.id}: finalizado ${local.homeTeamId} ${result.homeGoals}-${result.awayGoals} ${local.awayTeamId}`
      );
    }
  } else if (apiMatch.status === "IN_PLAY" || apiMatch.status === "PAUSED") {
    const before = JSON.stringify({ s: local.status, r: local.result });
    local.status = "live";
    local.result = { homeGoals: apiHomeGoals, awayGoals: apiAwayGoals };
    if (before !== JSON.stringify({ s: local.status, r: local.result })) {
      changes++;
      console.log(`${local.id}: en vivo ${apiHomeGoals}-${apiAwayGoals}`);
    }
  }
}

if (pendingPenalties.length > 0) {
  console.warn(
    `AVISO: definir penales a mano en: ${pendingPenalties.join(", ")} ` +
      "(la API no entregó el marcador de la tanda; el bracket no avanza ese cruce hasta corregirlo)"
  );
}

if (changes === 0) {
  console.log("Sin cambios.");
} else {
  writeFileSync(matchesUrl, JSON.stringify(matches, null, 2) + "\n");
  console.log(`${changes} cambios escritos en src/data/matches.json`);
}
