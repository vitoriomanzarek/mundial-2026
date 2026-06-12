"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorText("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Error al enviar");
      }
      setStatus("sent");
      setName("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setErrorText(
        error instanceof Error ? error.message : "Error al enviar"
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="font-medium text-accent">Gracias por tu comentario.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm text-text-secondary underline-offset-2 hover:underline"
        >
          Enviar otro
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm text-text-secondary">
          Nombre <span className="text-text-muted">(opcional)</span>
        </label>
        <input
          id="nombre"
          type="text"
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm text-text-secondary">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          required
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="¿Qué mejorarías? ¿Encontraste un error en algún dato?"
        />
      </div>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {status === "error" && (
        <p className="text-sm text-accent-2">{errorText}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Enviando..." : "Enviar comentario"}
      </button>
    </form>
  );
}
