import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-text-muted">
        11 de junio – 19 de julio
      </p>
      <h1 className="text-5xl font-semibold tracking-[-0.02em] sm:text-7xl">
        Mundial <span className="text-accent">2026</span>
      </h1>
      <p className="mt-6 max-w-md text-base text-text-secondary">
        48 selecciones, 16 sedes, 104 partidos. Grupos, calendario y bracket
        eliminatorio en una sola vista.
      </p>
      <div className="mt-10 flex gap-3">
        <Link
          href="/grupos"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Ver grupos
        </Link>
        <Link
          href="/partidos"
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-2"
        >
          Calendario
        </Link>
      </div>
    </section>
  );
}
