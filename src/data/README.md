# Datos del Mundial 2026

JSON estático. Los tipos espejo viven en `src/lib/types.ts` y la validación de integridad en `src/lib/data.ts` (corre al cargar; si algo está mal, el build falla con un error claro).

## Actualización automática

El workflow `.github/workflows/update-results.yml` corre cada 15 minutos
durante el torneo: consulta football-data.org (secret `FOOTBALL_DATA_TOKEN`),
ejecuta `scripts/update-results.mjs` y commitea `matches.json` si hay cambios.
También llena los equipos de eliminatorias cuando la API los conoce. Si una
tanda de penales llega sin marcador, el log avisa y se corrige a mano. Lo que
edites a mano se respeta mientras coincida con la API.

## Cómo actualizar un resultado a mano

1. Abrir `matches.json`.
2. Buscar el partido por `id` (M01 a M104, número oficial FIFA).
3. Cambiar `status` a `"finished"`.
4. Añadir `"result": { "homeGoals": X, "awayGoals": Y }` (en eliminatorias, opcionalmente `"penalties": { "home": A, "away": B }`).
5. Commit + push. Vercel re-deploya solo.

Las posiciones de grupo se recalculan en runtime; nunca se guardan.

## Cómo llenar un cruce de eliminatorias

Cuando se conozcan los equipos de un partido eliminatorio, reemplazar `homeTeamId`/`awayTeamId` (null) por los ids de `teams.json`.

Cruces oficiales (fuente: FIFA, sorteo dic 2025):

| id | Slot | Cruce |
|---|---|---|
| M73 | R32-1 | 2.º A vs 2.º B |
| M74 | R32-2 | 1.º E vs 3.º A/B/C/D/F |
| M75 | R32-3 | 1.º F vs 2.º C |
| M76 | R32-4 | 1.º C vs 2.º F |
| M77 | R32-5 | 1.º I vs 3.º C/D/F/G/H |
| M78 | R32-6 | 2.º E vs 2.º I |
| M79 | R32-7 | 1.º A vs 3.º C/E/F/H/I |
| M80 | R32-8 | 1.º L vs 3.º E/H/I/J/K |
| M81 | R32-9 | 1.º D vs 3.º B/E/F/I/J |
| M82 | R32-10 | 1.º G vs 3.º A/E/H/I/J |
| M83 | R32-11 | 2.º K vs 2.º L |
| M84 | R32-12 | 1.º H vs 2.º J |
| M85 | R32-13 | 1.º B vs 3.º E/F/G/I/J |
| M86 | R32-14 | 1.º J vs 2.º H |
| M87 | R32-15 | 1.º K vs 3.º D/E/I/J/L |
| M88 | R32-16 | 2.º D vs 2.º G |
| M89 | R16-1 | Ganador M74 vs Ganador M77 |
| M90 | R16-2 | Ganador M73 vs Ganador M75 |
| M91 | R16-3 | Ganador M76 vs Ganador M78 |
| M92 | R16-4 | Ganador M79 vs Ganador M80 |
| M93 | R16-5 | Ganador M83 vs Ganador M84 |
| M94 | R16-6 | Ganador M81 vs Ganador M82 |
| M95 | R16-7 | Ganador M86 vs Ganador M88 |
| M96 | R16-8 | Ganador M85 vs Ganador M87 |
| M97 | QF-1 | Ganador M89 vs Ganador M90 |
| M98 | QF-2 | Ganador M93 vs Ganador M94 |
| M99 | QF-3 | Ganador M91 vs Ganador M92 |
| M100 | QF-4 | Ganador M95 vs Ganador M96 |
| M101 | SF-1 | Ganador M97 vs Ganador M98 |
| M102 | SF-2 | Ganador M99 vs Ganador M100 |
| M103 | TP-1 | Perdedor M101 vs Perdedor M102 |
| M104 | F-1 | Ganador M101 vs Ganador M102 |

## Notas

- `code` en `teams.json` usa el trigram FIFA (GER, NED, SUI, ENG, SCO...), no ISO 3166-1, porque Inglaterra y Escocia no tienen código ISO propio. Las banderas en `public/flags/` se nombran con este código.
- Las fechas son ISO 8601 UTC. La UI convierte a hora local y CDMX.
- `city` en `venues.json` usa el nombre de ciudad sede oficial FIFA en español (Dallas, no Arlington; Boston, no Foxborough).
