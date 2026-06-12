"use client";

import { useEffect, useState } from "react";
import type { MatchView } from "@/lib/types";
import { CDMX_TZ, formatDayLong, formatTime } from "@/lib/dates";
import TeamFlag from "@/components/team/TeamFlag";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-surface px-3 py-2 sm:px-4 sm:py-3">
      <span className="text-2xl font-semibold tabular-nums sm:text-3xl">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}

/**
 * Cuenta regresiva al próximo partido. Recibe los partidos programados
 * ordenados y elige en el cliente el primero que aún no empieza, así la
 * página estática no se desactualiza entre deploys.
 */
export default function Countdown({ matches }: { matches: MatchView[] }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const next =
    now === null
      ? null
      : matches.find((m) => new Date(m.date).getTime() > now);

  const remaining = next && now ? new Date(next.date).getTime() - now : null;
  const days = remaining ? Math.floor(remaining / 86_400_000) : 0;
  const hours = remaining ? Math.floor((remaining % 86_400_000) / 3_600_000) : 0;
  const minutes = remaining ? Math.floor((remaining % 3_600_000) / 60_000) : 0;
  const seconds = remaining ? Math.floor((remaining % 60_000) / 1000) : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
        Próximo partido
      </p>
      <div className="flex gap-2 sm:gap-3">
        <TimeBox value={now === null ? "--" : pad(days)} label="días" />
        <TimeBox value={now === null ? "--" : pad(hours)} label="hrs" />
        <TimeBox value={now === null ? "--" : pad(minutes)} label="min" />
        <TimeBox value={now === null ? "--" : pad(seconds)} label="seg" />
      </div>
      {next && (
        <div className="flex flex-col items-center gap-1 text-sm">
          <span className="flex items-center gap-2 font-medium">
            {next.home && (
              <>
                <TeamFlag code={next.home.code} name={next.home.name} />
                {next.home.name}
              </>
            )}
            <span className="text-text-muted">vs</span>
            {next.away && (
              <>
                {next.away.name}
                <TeamFlag code={next.away.code} name={next.away.name} />
              </>
            )}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDayLong(next.date)} · {formatTime(next.date, CDMX_TZ)} CDMX ·{" "}
            {next.stadium}, {next.city}
          </span>
        </div>
      )}
    </div>
  );
}
