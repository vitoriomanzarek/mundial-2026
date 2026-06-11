"use client";

import type { ChangeEvent } from "react";
import { phaseLabels } from "./MatchCard";

export interface FilterState {
  phase: string;
  group: string;
  venue: string;
  day: string;
}

export const EMPTY_FILTERS: FilterState = {
  phase: "",
  group: "",
  venue: "",
  day: "",
};

interface MatchFiltersProps {
  groups: string[];
  venues: { id: string; label: string }[];
  days: { key: string; label: string }[];
  value: FilterState;
  onChange: (value: FilterState) => void;
}

const selectClass =
  "h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-text-primary outline-none transition-colors hover:bg-surface-2 focus:border-accent";

export default function MatchFilters({
  groups,
  venues,
  days,
  value,
  onChange,
}: MatchFiltersProps) {
  const set =
    (key: keyof FilterState) => (event: ChangeEvent<HTMLSelectElement>) =>
      onChange({ ...value, [key]: event.target.value });

  const hasFilters =
    value.phase !== "" ||
    value.group !== "" ||
    value.venue !== "" ||
    value.day !== "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filtrar por fase"
        className={selectClass}
        value={value.phase}
        onChange={set("phase")}
      >
        <option value="">Todas las fases</option>
        {Object.entries(phaseLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filtrar por grupo"
        className={selectClass}
        value={value.group}
        onChange={set("group")}
      >
        <option value="">Todos los grupos</option>
        {groups.map((id) => (
          <option key={id} value={id}>
            Grupo {id}
          </option>
        ))}
      </select>
      <select
        aria-label="Filtrar por sede"
        className={selectClass}
        value={value.venue}
        onChange={set("venue")}
      >
        <option value="">Todas las sedes</option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filtrar por día"
        className={selectClass}
        value={value.day}
        onChange={set("day")}
      >
        <option value="">Todos los días</option>
        {days.map((day) => (
          <option key={day.key} value={day.key}>
            {day.label}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="h-9 rounded-md px-3 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
