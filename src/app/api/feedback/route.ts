const REPO = "vitoriomanzarek/mundial-2026";
const MAX_NAME = 80;
const MAX_MESSAGE = 2000;

export async function POST(request: Request) {
  let payload: { name?: string; message?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  // Honeypot: los bots llenan este campo oculto; los humanos no.
  if (payload.website) {
    return Response.json({ ok: true });
  }

  const message = payload.message?.trim() ?? "";
  const name = payload.name?.trim() ?? "";
  if (message.length === 0) {
    return Response.json({ error: "Escribe un mensaje" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE || name.length > MAX_NAME) {
    return Response.json({ error: "Mensaje demasiado largo" }, { status: 400 });
  }

  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    return Response.json(
      { error: "El buzón no está configurado todavía" },
      { status: 503 }
    );
  }

  const title = `Feedback: ${message.slice(0, 60)}${message.length > 60 ? "…" : ""}`;
  const body = [
    message,
    "",
    "---",
    `De: ${name || "anónimo"}`,
    `Fecha: ${new Date().toISOString()}`,
  ].join("\n");

  const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body, labels: ["feedback"] }),
  });

  if (!response.ok) {
    console.error(`GitHub respondió ${response.status}`);
    return Response.json(
      { error: "No se pudo guardar el comentario" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
