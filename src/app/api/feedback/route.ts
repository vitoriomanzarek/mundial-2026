const REPO = "vitoriomanzarek/mundial-2026";
const FEEDBACK_EMAIL = "victorsm2893@gmail.com";
const MAX_NAME = 80;
const MAX_MESSAGE = 2000;

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function sendEmail(name: string, message: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mundial 2026 <onboarding@resend.dev>",
      to: [FEEDBACK_EMAIL],
      subject: `Nuevo comentario de ${name || "anónimo"}`,
      html: `<p><strong>De:</strong> ${escapeHtml(name) || "anónimo"}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });
  if (!response.ok) {
    console.error(`Resend respondió ${response.status}`);
  }
}

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

  // El correo es notificación secundaria: si falla, el issue ya quedó.
  try {
    await sendEmail(name, message);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }

  return Response.json({ ok: true });
}
