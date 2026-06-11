export const CDMX_TZ = "America/Mexico_City";

/** Clave de día para agrupar/filtrar, en una zona horaria dada: "2026-06-11" */
export function dayKey(iso: string, timeZone: string = CDMX_TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

/** "jueves 11 de junio" */
export function formatDayLong(iso: string, timeZone: string = CDMX_TZ): string {
  const formatted = new Intl.DateTimeFormat("es-MX", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
  return formatted.replace(", ", " ");
}

/** "13:00". Sin timeZone usa la del navegador. */
export function formatTime(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    ...(timeZone ? { timeZone } : {}),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** Zona horaria del navegador (solo cliente). */
export function browserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
