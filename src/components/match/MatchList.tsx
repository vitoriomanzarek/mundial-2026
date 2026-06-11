"use client";

import { useMemo, useState } from "react";
import type { MatchView } from "@/lib/types";
import { CDMX_TZ, dayKey, formatDayLong } from "@/lib/dates";
import MatchCard from "./MatchCard";
import MatchFilters, { EMPTY_FILTERS, type FilterState } from "./MatchFilters";

interface MatchListProps {
  matches: MatchView[];
  groups: string[];
  venues: { id: string; label: string }[];
}

export default function MatchList({
  matches,
  groups,
  venues,
}: MatchListProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const days = useMemo(() => {
    const seen = new Map<string, string>();
    for (const match of matches) {
      const key = dayKey(match.date, CDMX_TZ);
      if (!seen.has(key)) seen.set(key, formatDayLong(match.date, CDMX_TZ));
    }
    return Array.from(seen, ([key, label]) => ({ key, label }));
  }, [matches]);

  const filtered = useMemo(
    () =>
      matches.filter((match) => {
        if (filters.phase && match.phase !== filters.phase) return false;
        if (filters.group && match.groupId !== filters.group) return false;
        if (filters.venue && match.venueId !== filters.venue) return false;
        if (filters.day && dayKey(match.date, CDMX_TZ) !== filters.day)
          return false;
        return true;
      }),
    [matches, filters]
  );

  const byDay = useMemo(() => {
    const groupsByDay = new Map<string, MatchView[]>();
    for (const match of filtered) {
      const key = dayKey(match.date, CDMX_TZ);
      const bucket = groupsByDay.get(key);
      if (bucket) bucket.push(match);
      else groupsByDay.set(key, [match]);
    }
    return Array.from(groupsByDay, ([key, dayMatches]) => ({
      key,
      label: formatDayLong(dayMatches[0].date, CDMX_TZ),
      matches: dayMatches,
    }));
  }, [filtered]);

  return (
    <div>
      <MatchFilters
        groups={groups}
        venues={venues}
        days={days}
        value={filters}
        onChange={setFilters}
      />
      {byDay.length === 0 ? (
        <p className="mt-12 text-center text-sm text-text-muted">
          No hay partidos que coincidan con esos filtros.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {byDay.map((day) => (
            <section key={day.key}>
              <h2 className="mb-3 text-sm font-semibold capitalize text-text-secondary">
                {day.label}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {day.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
