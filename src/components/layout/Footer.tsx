export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          Mundial <span className="text-accent">2026</span> · México, Estados
          Unidos y Canadá
        </span>
        <span>
          <a
            href="/comentarios"
            className="underline-offset-2 transition-colors hover:text-text-secondary hover:underline"
          >
            Comentarios
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/vitoriomanzarek/mundial-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition-colors hover:text-text-secondary hover:underline"
          >
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
