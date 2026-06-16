# Instrucciones para Claude Code

Eres el ejecutor. La arquitectura está cerrada en `ARCHITECTURE.md` y el esquema de datos en `data-schema.md`. Léelos antes de empezar. No tomes decisiones que contradigan esos documentos sin avisar primero.

## Contexto del proyecto

- Página web para visualizar el Mundial 2026.
- Stack: Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + Recharts.
- Estilo: moderno y minimalista, fondo oscuro.
- Idioma: solo español.
- Datos: JSON estático en `src/data/`.
- Deploy: GitHub → Vercel.

## Cómo proceder

Trabaja por **fases** según `ARCHITECTURE.md §9`. Al terminar cada fase, haz commit con mensaje claro y espera confirmación antes de pasar a la siguiente.

### Fase 1 — Esqueleto (empieza aquí)

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint` (acepta defaults restantes).
2. Instala: `npm i framer-motion recharts lucide-react clsx`.
3. Configura `tailwind.config.ts` con la paleta de `ARCHITECTURE.md §7`.
4. Configura fuente Inter vía `next/font` en `src/app/layout.tsx`.
5. Crea `src/app/globals.css` con reset mínimo y `bg-background text-text-primary` en `body`.
6. **Favicon:** copia `assets/favicon.svg` → `src/app/icon.svg` y `assets/apple-touch-icon.svg` → `src/app/apple-icon.svg`. Next.js 14 los detecta por convención de nombre, no requiere código extra. Verifica que aparezca el balón verde-menta en la pestaña del navegador.
7. Crea `Header.tsx` con nav simple a `/`, `/grupos`, `/partidos`, `/eliminatorias`.
8. `src/app/page.tsx` con un hero "Mundial 2026" en negro y verde menta.
9. `git init`, primer commit, crea repo `mundial-2026` en GitHub, push.
10. Para. Avisa al usuario para que conecte Vercel.

### Fase 2 — Datos

1. Crea `src/lib/types.ts` con las interfaces de `data-schema.md`.
2. Crea `src/data/teams.json` con los 48 equipos clasificados. Si no tienes la lista oficial completa al día, deja un placeholder con los confirmados (México, USA, Canadá como anfitriones y los que tengas) y comenta cuáles faltan. **No inventes equipos.**
3. Crea `src/data/groups.json`, `venues.json`, `matches.json` con los datos públicos confirmados; donde falten, deja arrays vacíos con un TODO comentado en JSON5 — o usa un archivo `.todo.md` adjunto.
4. Crea `src/lib/data.ts` con funciones tipadas: `getTeams()`, `getGroups()`, `getMatches()`, `getTeamById()`. Incluye validación de integridad referencial al cargar.
5. Crea `src/lib/standings.ts` con la lógica de cálculo (ver `ARCHITECTURE.md §8`). Escribe tests sencillos con Vitest si te alcanza el tiempo.

### Fase 3 a 7

Sigue el orden de `ARCHITECTURE.md §9`. Cada fase debe terminar con:
- Código funcional (no roto).
- `npm run build` sin errores.
- Commit descriptivo.

## Reglas de oro

- **No metas dependencias nuevas sin justificación.** El stack está cerrado.
- **Server Components por defecto.** Solo añade `'use client'` cuando uses hooks, eventos, Framer Motion o Recharts.
- **Mobile-first.** Diseña primero el componente en 375px, luego escala.
- **Tipos estrictos.** Nada de `any`. Si necesitas un tipo, agrégalo en `lib/types.ts`.
- **Sin emojis en el código** salvo que estén dentro de strings de UI que el usuario apruebe.
- **Nombres de archivos en inglés, contenido visible en español.**

## Cuando dudes

Pregunta al usuario antes de:
- Cambiar la paleta o tipografía.
- Añadir una librería que no esté en `ARCHITECTURE.md §2`.
- Crear nuevas rutas no listadas.
- Mover archivos JSON a otra estructura.

## Comandos útiles

```bash
npm run dev          # desarrollo
npm run build        # verificar producción
npm run lint         # si configuras eslint
```

## Entregable de la sesión

Al final de cada fase, deja un comentario en chat resumiendo:
1. Qué archivos creaste/modificaste.
2. Qué quedó pendiente para la siguiente fase.
3. Qué decisión tuviste que tomar sobre la marcha (si la hubo).
