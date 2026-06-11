import Link from "next/link";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/grupos", label: "Grupos" },
  { href: "/partidos", label: "Partidos" },
  { href: "/eliminatorias", label: "Eliminatorias" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-text-primary"
        >
          Mundial <span className="text-accent">2026</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
