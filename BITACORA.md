# Bitácora — Mundial 2026

> Historial cronológico de lo construido, fase por fase. Para lo que falta, ver `BACKLOG.md`.

## Estado al 16 de junio de 2026

El sitio está **en producción** en Vercel (`vermundial2026.vercel.app`), con las siete fases de `ARCHITECTURE.md §9` cerradas y varios extras encima. El torneo ya arrancó (11 de jul → 19 de jul) y hay 2 de 104 partidos finalizados en `matches.json` (M01 México 2-0 Sudáfrica, M02 Corea del Sur 2-1 Chequia). Los resultados se actualizan solos vía GitHub Actions + football-data.org cada 15 min en la franja de partidos.

---

## Fase 1 — Esqueleto ✅

- Next.js 14 (App Router) + TypeScript + Tailwind inicializados con `src-dir` e import alias `@/*`.
- Dependencias del stack cerrado: `framer-motion`, `recharts`, `lucide-react`, `clsx`.
- `tailwind.config.ts` con la paleta de `ARCHITECTURE.md §7` (fondo `#0A0A0B`, accent verde menta `#00D9A3`, accent-2 coral, etc.).
- Inter variable cargada vía `next/font` en `src/app/layout.tsx`.
- `globals.css` con reset mínimo y `bg-background text-text-primary` en el body.
- Favicon balón verde menta (`src/app/icon.svg` + `apple-icon.svg`) — detectados por convención de nombre.
- `Header.tsx` con nav a `/`, `/grupos`, `/partidos`, `/eliminatorias` (luego se le agregó `/comentarios`).
- `page.tsx` con hero "Mundial 2026".
- Repo `mundial-2026` en GitHub, conectado a Vercel con deploy automático en `main`.

## Fase 2 — Datos ✅

- `src/lib/types.ts` con todas las interfaces de `data-schema.md` (Team, Group, Venue, Match, MatchResult) más vistas derivadas (`MatchView`, `StandingsRowView`, `GroupView`, `BracketMatchView`).
- `src/data/teams.json` con los 48 equipos reales (incluye nombres en español, código FIFA alpha-3, confederación, grupo).
- `src/data/groups.json` con los 12 grupos A–L (4 equipos cada uno).
- `src/data/venues.json` con las 16 sedes.
- `src/data/matches.json` con los 104 partidos (72 de grupos, 16 de dieciseisavos, 8 octavos, 4 cuartos, 2 semis, tercer puesto, final).
- `src/lib/data.ts` con `getTeams()`, `getGroups()`, `getMatches()`, `getTeamById()`, `getMatchesByGroup()`, `getMatchesByTeam()`, `getMatchViews()` y validación de integridad referencial al cargar (lanza error claro si rompe).
- `src/lib/standings.ts` con `computeStandings`, `computeBestThirds`, `computeTeamRecord` (orden Pts → DG → GF, 8 mejores terceros).
- `src/lib/dates.ts` con formateo en español y zona CDMX.
- `src/data/README.md` documentando flujo de edición manual y cruces oficiales de eliminatorias.

## Fase 3 — Vista de grupos ✅

- `GroupCard.tsx`, `StandingsTable.tsx`, `TeamRow.tsx`, `GroupsGrid.tsx`, `GroupMini.tsx`.
- `/grupos` con grid responsivo (3×4 desktop → 1×12 móvil) y leyenda de zonas (clasificación directa / mejores terceros).
- Reordenamiento animado de filas con `<motion.div layout>` y `AnimatedNumber` para los puntos.

## Fase 4 — Vista de partidos ✅

- `MatchCard.tsx`, `MatchList.tsx`, `MatchFilters.tsx`, `ScoreDisplay.tsx`.
- `/partidos` con los 104 partidos en orden cronológico, filtros por grupo y sede, horarios en hora CDMX.

## Fase 5 — Bracket ✅

- `Bracket.tsx`, `BracketSlot.tsx`.
- `src/lib/bracket.ts` con `KNOCKOUT_SOURCES`, `resolveKnockout`, `matchWinnerId`, `sourceLabel`: llena los slots cuando termina cada fase, respetando ganadores por penales.
- `/eliminatorias` de dieciseisavos a final.

## Fase 6 — Detalle de equipo ✅

- Ruta dinámica `/equipo/[slug]` con `generateStaticParams` para los 48 equipos.
- `TeamBadge.tsx`, `PointsChart.tsx` (Recharts).
- Stats PJ/G/E/P/GF/GC/DG/Pts, racha visual (G/E/P), evolución de puntos y lista de sus partidos.

## Fase 7 — Pulido ✅

- Home con `Countdown` al próximo partido (hidratación segura, en cliente).
- Metadata, `viewport` con themeColor `#0A0A0B`, OG dinámica vía `src/app/opengraph-image.tsx`.
- Responsive verificado mobile-first.

---

## Extras fuera del plan original

Cosas que no estaban en `ARCHITECTURE.md §9` pero se sumaron porque resolvían problemas concretos:

- **Auto-actualización de resultados** — `scripts/update-results.mjs` + `.github/workflows/update-results.yml` consulta football-data.org cada 15 min en horario de partidos, mapea equipos a nuestros ids en español, llena cruces eliminatorios cuando se conocen, detecta penales y commitea `matches.json`. Esto evita tener que editar JSON a mano durante el Mundial.
- **Buzón de comentarios** — `/comentarios` con `FeedbackForm` y API route `src/app/api/feedback/route.ts` que crea un issue en GitHub (label `feedback`) y notifica por email vía Resend. Honeypot anti-bot, validación de longitud, mensajes en español. Requiere secrets `GITHUB_FEEDBACK_TOKEN` y `RESEND_API_KEY`.
- **Tests con Vitest** — `bracket.test.ts`, `data.test.ts`, `standings.test.ts`. Script `npm test`.
- **Vercel Analytics** — integrado en el layout.

---

## Decisiones tomadas sobre la marcha

- **Auto-update vs edición manual**: se optó por el flujo automático (football-data.org → GitHub Actions) en lugar de editar `matches.json` a mano cada vez. Edición manual sigue funcionando como fallback.
- **Comentarios → GitHub issues**: en lugar de montar una base de datos para feedback, se usan issues. Cero infraestructura.
- **Etiquetas de penales**: si la API no devuelve la tanda, el log avisa y el bracket queda en espera de corrección manual (`pendingPenalties` en el script).
- **Lucide-react 1.x**: `package.json` declara `lucide-react: ^1.17.0`. La versión moderna es `0.x` (lucide-react usa rangos `^0.y.z`). Validar si la importada coincide con lo esperado por el código.

---

## Métricas de éxito (estado actual)

- Build de producción: pasa ✅
- Tests Vitest: pasan ✅
- Datos: 48/48 equipos, 12/12 grupos, 16/16 sedes, 104/104 partidos.
- Partidos finalizados a hoy: 2/104.
- Lighthouse: pendiente de medición formal post-Mundial.
