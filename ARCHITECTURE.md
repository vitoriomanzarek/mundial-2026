# Mundial 2026 — Arquitectura

> Documento maestro de diseño técnico. Léelo antes de tocar código.

## 1. Visión del producto

Una página web visual e interactiva donde se vea de un vistazo:
- Los 12 grupos del Mundial 2026 con sus equipos y puntos acumulados.
- El calendario de partidos (quién juega contra quién, dónde, cuándo).
- El bracket eliminatorio que se llena conforme avanza el torneo.
- Animaciones sutiles cuando los puntos cambian o un equipo avanza.

**Tono visual:** moderno y minimalista. Fondo oscuro, tipografía limpia, espacios generosos, micro-animaciones. Inspiración: The Athletic, Linear, Apple.

**Idioma:** solo español.
**Datos:** JSON estático editado a mano (sin API por ahora).

---

## 2. Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSG por defecto, ideal para datos estáticos, deploy trivial en Vercel |
| Lenguaje | **TypeScript** | Type safety con los datos estructurados |
| Estilos | **Tailwind CSS** | Velocidad de iteración, sistema de diseño consistente |
| Animaciones | **Framer Motion** | Transiciones de layout, números animados, reordenamiento de tablas |
| Gráficos | **Recharts** | Curva de aprendizaje baja, gráficas de evolución de puntos |
| Iconos | **lucide-react** | Banderas las traemos por separado (ver §6) |
| Fuente | **Inter** (variable) vía `next/font` | Limpia, óptima para datos |
| Linting | ESLint + Prettier | Higiene básica |
| Deploy | Vercel | Integración con GitHub, gratis para hobby |

**No usamos:** Redux, librerías de state pesadas, CSS-in-JS. El estado global es mínimo (los datos son estáticos).

---

## 3. Estructura de carpetas

```
mundial/
├── README.md
├── ARCHITECTURE.md            ← este archivo
├── CLAUDE.md                  ← instrucciones para Claude Code
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── .gitignore
├── .env.example
├── public/
│   ├── flags/                 ← SVGs de banderas (ver §6)
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← shell global, fuentes, metadata
│   │   ├── page.tsx           ← home (overview)
│   │   ├── grupos/page.tsx    ← vista de los 12 grupos
│   │   ├── partidos/page.tsx  ← calendario completo
│   │   ├── eliminatorias/page.tsx  ← bracket
│   │   ├── equipo/[slug]/page.tsx  ← detalle de equipo
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── NavTabs.tsx
│   │   ├── group/
│   │   │   ├── GroupCard.tsx       ← tarjeta de grupo con tabla
│   │   │   ├── StandingsTable.tsx  ← tabla animada de posiciones
│   │   │   └── TeamRow.tsx
│   │   ├── match/
│   │   │   ├── MatchCard.tsx       ← tarjeta de partido (vs)
│   │   │   ├── MatchList.tsx
│   │   │   ├── MatchFilters.tsx    ← filtros por fecha/grupo/sede
│   │   │   └── ScoreDisplay.tsx
│   │   ├── bracket/
│   │   │   ├── Bracket.tsx         ← árbol eliminatorio
│   │   │   └── BracketSlot.tsx
│   │   ├── team/
│   │   │   ├── TeamFlag.tsx        ← bandera + nombre
│   │   │   ├── TeamBadge.tsx
│   │   │   └── PointsChart.tsx     ← Recharts: evolución de puntos
│   │   └── ui/
│   │       ├── AnimatedNumber.tsx  ← contador animado
│   │       ├── Tag.tsx
│   │       └── Card.tsx
│   ├── data/
│   │   ├── teams.json         ← 48 equipos
│   │   ├── groups.json        ← 12 grupos con 4 equipos cada uno
│   │   ├── venues.json        ← 16 estadios
│   │   ├── matches.json       ← 104 partidos
│   │   └── README.md          ← cómo editar los JSON
│   ├── lib/
│   │   ├── data.ts            ← funciones para leer y combinar los JSON
│   │   ├── standings.ts       ← calcular posiciones desde resultados
│   │   ├── bracket.ts         ← lógica de avance eliminatorio
│   │   ├── dates.ts           ← formateo de fechas en español
│   │   └── types.ts           ← interfaces TypeScript
│   └── styles/
│       └── theme.ts           ← tokens de color/spacing si hace falta
```

---

## 4. Modelo de datos

Ver `data-schema.md` para el detalle completo. Resumen:

- **Team**: id, slug, nombre, código FIFA, confederación, grupo.
- **Group**: id (A–L), equipos[4].
- **Venue**: id, ciudad, país, estadio, capacidad.
- **Match**: id, fase (grupos/octavos/cuartos/semi/final), grupo?, fecha ISO, sede, equipoLocal, equipoVisitante, resultado?, estado (programado/en_vivo/finalizado).
- **Result**: golesLocal, golesVisitante, penalesLocal?, penalesVisitante?.

Las posiciones (puntos, GF, GC, DG) **se calculan en runtime** desde los partidos finalizados — nunca se guardan. Esto evita inconsistencias.

---

## 5. Rutas y vistas

### `/` — Home
- Hero con countdown al próximo partido.
- Carrusel/grid pequeño de los próximos 6 partidos.
- Mini-resumen de los 12 grupos (4 filas × 3 columnas).
- Link a bracket.

### `/grupos` — Grupos
- Grid responsive de 12 `GroupCard` (3×4 en desktop, 2×6 en tablet, 1×12 en móvil).
- Cada tarjeta: nombre del grupo, tabla con banderas, puntos animados, indicador de clasificación (top 2 + mejores terceros).
- Cuando un equipo sube de posición, animación de reordenamiento con `<motion.div layout>`.

### `/partidos` — Partidos
- Lista cronológica de los 104 partidos.
- Filtros: por fase, grupo, sede, día.
- Cada `MatchCard`: hora local + hora CDMX, banderas grandes, marcador (si jugado), estadio y ciudad.

### `/eliminatorias` — Bracket
- Bracket visual horizontal desde octavos hasta final.
- Slots vacíos hasta que termine la fase de grupos; se van llenando.
- Click en un slot lleva al partido correspondiente en `/partidos`.

### `/equipo/[slug]` — Detalle de equipo
- Header con bandera grande y nombre.
- Tabla de sus 3 (o más) partidos.
- Gráfica de evolución de puntos con Recharts.
- Estadísticas: GF, GC, DG, racha.

---

## 6. Banderas

Usamos **SVG locales** en `public/flags/{codigo}.svg` con códigos ISO 3166-1 alpha-3 (ARG, MEX, USA, etc.). Fuente recomendada: paquete `country-flag-icons` o descarga desde [flagcdn.com](https://flagcdn.com/) en SVG. El componente `<TeamFlag code="ARG" />` los renderiza.

Razón: cargar 48 banderas como SVG locales es trivial, rápido y sin dependencias de red.

---

## 7. Sistema de diseño

### Paleta (Tailwind tokens en `tailwind.config.ts`)

```
background: #0A0A0B    (casi negro, no puro)
surface:    #141416    (cards)
surface-2:  #1C1C1F    (hover, tabla)
border:     #27272A
text-primary:   #FAFAFA
text-secondary: #A1A1AA
text-muted:     #71717A
accent:     #00D9A3    (verde menta — clasificación, marcadores en vivo)
accent-2:   #FF4D6D    (rosa coral — eliminación, alerta)
warning:    #FFB800
```

### Tipografía
- **Inter** variable.
- Display (hero): 48–72px, peso 600, tracking -0.02em.
- H1: 32px / 600.
- H2: 24px / 600.
- Body: 15px / 400.
- Datos (puntos, marcadores): tabular-nums, peso 600.

### Espaciado
Escala Tailwind por defecto. Padding generoso en cards (`p-6`), gaps amplios (`gap-6`).

### Animaciones (Framer Motion)
- `AnimatedNumber`: contador que sube de 0→puntos en 600ms con easing.
- Reordenamiento de filas: `layout` prop con `transition={{ duration: 0.4, ease: 'easeInOut' }}`.
- Aparición de tarjetas: stagger de 50ms, fade + slide-up 8px.
- Hover en MatchCard: subtle lift (`y: -2`, shadow).

---

## 8. Lógica de cálculo de posiciones (`lib/standings.ts`)

Para cada equipo en un grupo, iterar sus partidos finalizados:
- **PJ** = partidos jugados.
- **G/E/P** = ganados/empatados/perdidos.
- **GF/GC/DG** = goles a favor / en contra / diferencia.
- **Pts** = G×3 + E×1.

Ordenar por: Pts ↓, DG ↓, GF ↓, head-to-head, fair play (omitir si no hay datos), sorteo.

Para terceros: tomar los mejores 8 terceros lugares por Pts → DG → GF.

---

## 9. Fases de construcción

### Fase 1: Esqueleto (1–2h)
- Inicializar Next.js, Tailwind, Framer Motion, Recharts.
- Configurar fuentes, paleta, layout global.
- Datos placeholder mínimos.
- Página home con "Hola Mundial".
- Deploy de prueba en Vercel.

### Fase 2: Datos y modelos (1h)
- Llenar `teams.json`, `groups.json`, `venues.json` completos.
- Cargar `matches.json` con fechas y sedes (resultados vacíos).
- Tipos TS y funciones de lectura.

### Fase 3: Vista de grupos (2h)
- `GroupCard` con tabla calculada.
- `StandingsTable` con animación de reordenamiento.
- Página `/grupos` con grid responsivo.

### Fase 4: Vista de partidos (2h)
- `MatchCard` con banderas, marcador, sede.
- Filtros funcionales.
- Página `/partidos`.

### Fase 5: Bracket (2h)
- Layout del árbol.
- Lógica para llenar slots cuando termina la fase de grupos.
- Animación al revelar ganadores.

### Fase 6: Detalle de equipo + chart (1h)
- Ruta dinámica `/equipo/[slug]`.
- Gráfica de evolución con Recharts.

### Fase 7: Pulido (1–2h)
- Home con countdown.
- Meta tags, OG image.
- Responsive en móvil.
- Lighthouse > 95.

**Total estimado:** ~10–12h de trabajo.

---

## 10. Decisiones explícitas (no reabrir sin razón)

1. **No usamos base de datos.** Todo es JSON estático versionado en Git.
2. **No autenticación.** Es una página pública de solo lectura.
3. **Server Components por defecto.** Solo lo interactivo (filtros, animaciones) es `'use client'`.
4. **Mobile-first.** Cada componente se diseña primero en 375px.
5. **Sin tracking ni analytics** en v1.
6. **Sin internacionalización.** Solo español. Si más adelante hace falta, migrar a `next-intl`.

---

## 11. Despliegue

1. `git init && git add . && git commit -m "init"`.
2. Crear repo en GitHub `mundial-2026` (público).
3. `git push`.
4. Conectar repo en Vercel (auto-detecta Next.js).
5. Domain custom opcional.

Cada push a `main` redeploy automático. Para actualizar un resultado: editar `matches.json`, commit, push.

---

## 12. Métricas de éxito

- Carga inicial < 1s (datos estáticos).
- Lighthouse Performance ≥ 95, Accessibility ≥ 95.
- Funcional en móvil 375px sin scroll horizontal.
- Cero errores en consola.
