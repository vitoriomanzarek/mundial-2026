# Esquema de datos — JSON estático

Todos los archivos viven en `src/data/`. Edítalos a mano. Los tipos TS espejo están en `src/lib/types.ts`.

---

## `teams.json`

Array de 48 equipos.

```ts
type Team = {
  id: string;          // slug único, ej. "argentina"
  name: string;        // "Argentina"
  code: string;        // ISO alpha-3: "ARG"
  confederation: "CONMEBOL" | "UEFA" | "CONCACAF" | "AFC" | "CAF" | "OFC";
  groupId: string;     // "A" .. "L"
};
```

Ejemplo:

```json
[
  { "id": "argentina", "name": "Argentina", "code": "ARG", "confederation": "CONMEBOL", "groupId": "A" },
  { "id": "mexico",    "name": "México",    "code": "MEX", "confederation": "CONCACAF", "groupId": "A" }
]
```

---

## `groups.json`

12 grupos (A–L), 4 equipos cada uno.

```ts
type Group = {
  id: string;          // "A" .. "L"
  teamIds: string[];   // 4 ids de teams.json
};
```

---

## `venues.json`

16 estadios.

```ts
type Venue = {
  id: string;          // "azteca"
  stadium: string;     // "Estadio Azteca"
  city: string;        // "Ciudad de México"
  country: "MEX" | "USA" | "CAN";
  capacity: number;
};
```

---

## `matches.json`

104 partidos.

```ts
type Match = {
  id: string;                    // "M01", "M02", ...
  phase: "groups" | "round32" | "round16" | "qf" | "sf" | "third" | "final";
  groupId?: string;              // solo si phase === "groups"
  bracketSlot?: string;          // ej. "R16-1" para partidos eliminatorios
  date: string;                  // ISO 8601 UTC: "2026-06-11T20:00:00Z"
  venueId: string;
  homeTeamId: string | null;     // null en eliminatorias hasta definir
  awayTeamId: string | null;
  result?: {
    homeGoals: number;
    awayGoals: number;
    penalties?: { home: number; away: number };
  };
  status: "scheduled" | "live" | "finished";
};
```

Ejemplo:

```json
{
  "id": "M01",
  "phase": "groups",
  "groupId": "A",
  "date": "2026-06-11T20:00:00Z",
  "venueId": "azteca",
  "homeTeamId": "mexico",
  "awayTeamId": null,
  "status": "scheduled"
}
```

---

## Flujo para actualizar un resultado

1. Abrir `matches.json`.
2. Buscar el partido por `id`.
3. Cambiar `status` a `"finished"`.
4. Añadir `result: { homeGoals: X, awayGoals: Y }`.
5. Commit + push. Vercel re-deploya en ~30s.

Las posiciones de grupo se recalculan solas en el siguiente render.

---

## Reglas de validación (a implementar en `lib/data.ts`)

- Cada `groupId` debe existir.
- Cada `teamId` referenciado debe existir.
- Cada `venueId` debe existir.
- Para fase de grupos: `homeTeamId` y `awayTeamId` no nulos.
- Si `status === "finished"`, debe haber `result`.
- En el arranque, `lib/data.ts` corre estas validaciones y lanza error claro si algo está mal.
