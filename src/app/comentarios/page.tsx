import type { Metadata } from "next";
import FeedbackForm from "@/components/ui/FeedbackForm";

export const metadata: Metadata = {
  title: "Comentarios | Mundial 2026",
  description: "Envíanos tus comentarios y sugerencias sobre el sitio.",
};

export default function ComentariosPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Comentarios</h1>
        <p className="mt-2 text-sm text-text-secondary">
          ¿Viste un dato incorrecto, algo que no funciona o tienes una idea?
          Cuéntanos. No guardamos nada más que lo que escribas aquí.
        </p>
      </header>
      <FeedbackForm />
    </section>
  );
}
