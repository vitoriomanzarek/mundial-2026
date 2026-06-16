# Backlog — Mundial 2026

> Lo que falta o se puede mejorar. Para lo ya construido, ver `BITACORA.md`. Orden: lo más urgente arriba.

## P0 — Durante el torneo (revisar a diario)

- [ ] **Monitorear el workflow `update-results.yml`.** Verificar en Actions de GitHub que corra cada 15 min en la franja de partidos y que commitee sin warnings de equipos sin mapear. Hoy hay 2/104 partidos finalizados; el resto deberían ir cayendo solos.
- [ ] **Revisar logs por `AVISO: equipo de la API sin mapear`** y agregar el alias al `TEAM_KEYS` de `scripts/update-results.mjs` cuando aparezca un equipo con nombre distinto en football-data.org.
- [ ] **Penales sin marcador**: si el log dice `pendingPenalties: [...]`, abrir `matches.json` y completar `result.penalties` a mano, sino el bracket no avanza ese cruce.
- [ ] **Llenar cruces de eliminatorias** conforme avance el torneo (`homeTeamId`/`awayTeamId` que estén en `null`). El script intenta llenarlos automáticamente cuando la API los conoce; verificar.

## P1 — Validaciones y pulido pendiente

- [ ] **Lighthouse formal** — correr `lighthouse https://vermundial2026.vercel.app` y dejar el score en `BITACORA.md`. Meta: Performance ≥95, Accessibility ≥95 (`ARCHITECTURE.md §12`).
- [ ] **Verificar `lucide-react`** — `package.json` tiene `^1.17.0`, pero la versión publicada que importamos suele ser `^0.x`. Confirmar que los iconos (`ArrowRight`, etc.) renderizan en producción y, si no, fijar versión correcta.
- [ ] **ESLint + Prettier** — `ARCHITECTURE.md §2` los marca como parte del stack, pero `create-next-app` se corrió con `--no-eslint` (ver CLAUDE.md). Decidir si se configura o se descarta de la arquitectura.
- [ ] **Tests de `lib/bracket.ts`** — confirmar que cubren el caso "ganador por penales" y "cruce sin equipos definidos aún".
- [ ] **Validar zona horaria** en `Countdown` y `MatchCard` — todos los `date` están en UTC; verificar que CDMX se muestre bien al cruzar medianoche.

## P2 — Mejoras de UX que estaban implícitas en el plan

- [ ] **Indicador "EN VIVO"** visual en `MatchCard` cuando `status === "live"`. El script ya marca el estado; el componente debería pulsear o destacarse.
- [ ] **Auto-refresh ligero** en `/grupos` y `/partidos` durante partidos en vivo (revalidate o ISR con tag) para que el usuario vea el marcador sin recargar.
- [ ] **Sección "mejores terceros"** en `/grupos`: hoy se marcan con la barra warning pero no hay una tabla aparte que muestre el ranking de los 8.
- [ ] **Filtro por fecha** en `/partidos` — `MatchFilters` ya tiene grupo y sede; agregar selector de día.
- [ ] **Página de sede** `/sede/[id]` — no estaba en `ARCHITECTURE.md §5` pero ya tenemos los datos; sería 1h de trabajo y enriquece el sitio.

## P3 — Calidad de código y mantenimiento

- [ ] **Storybook o página `/playground`** para los componentes (`MatchCard`, `StandingsTable`, `BracketSlot`) en sus distintos estados (scheduled/live/finished, ganador/perdedor, sin equipos).
- [ ] **Snapshot/visual regression** mínimo — al menos screenshot test de home y `/grupos`.
- [ ] **README de `src/data/`** está parcialmente escrito; completar la tabla de cruces oficiales.
- [ ] **CHANGELOG.md** — si el sitio se va a actualizar pasivamente, no hace falta. Si seguirá creciendo después del Mundial, vale tenerlo.

## P4 — Post-Mundial (después del 19 de julio)

- [ ] **Vista "Resumen del torneo"** — campeón, máximo goleador, datos curiosos. No estaba en el plan; sería un cierre lindo.
- [ ] **Archivo del Mundial** — desactivar `Countdown` y `update-results.yml` cuando termine.
- [ ] **Decidir el futuro del repo** — ¿queda como página estática histórica? ¿se reusa como template para Mundial 2030?

---

## No reabrir (decisiones cerradas en `ARCHITECTURE.md §10`)

- Sin base de datos, sin auth, sin tracking pesado, solo español, mobile-first.
- Server Components por defecto; `'use client'` solo donde haga falta.
- Stack cerrado: no se suman librerías sin justificación.
