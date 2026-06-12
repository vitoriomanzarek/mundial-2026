import type { Metadata } from "next";
import { getGroups, getMatchViews, getVenues } from "@/lib/data";
import MatchList from "@/components/match/MatchList";

export const metadata: Metadata = {
  title: "Partidos | Mundial 2026",
  description:
    "Calendario completo de los 104 partidos del Mundial 2026 con resultados, sedes y horarios.",
};

export default function PartidosPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Partidos</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Los 104 partidos del torneo en orden cronológico. Horarios en hora
          del centro de México (CDMX).
        </p>
      </header>
      <MatchList
        matches={getMatchViews()}
        groups={getGroups().map((g) => g.id)}
        venues={getVenues().map((v) => ({ id: v.id, label: v.stadium }))}
      />
    </section>
  );
}
