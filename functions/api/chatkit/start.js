export async function onRequestPost({ env }) {
  try {
    if (!env.OPENAI_API_KEY) return new Response('Missing OPENAI_API_KEY', { status: 500 });
    if (!env.CHATKIT_WORKFLOW_ID) return new Response('Missing CHATKIT_WORKFLOW_ID', { status: 500 });

    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1"
      },
      // eeeeee👇 La API espera `workflow` (no `workflow_id`)
      // eeeeee👇 La API espera `workflow` (no `workflow_id`)
      body: JSON.stringify({
        // puedes pasar el ID como string…
        workflow: env.CHATKIT_WORKFLOW_ID
        // …o como objeto: { id: env.CHATKIT_WORKFLOW_ID }
        // workflow: { id: env.CHATKIT_WORKFLOW_ID }

        // opcional: versión concreta del workflow (si tienes wfv_...)
        // version: "wfv_xxxxx"

        // opcional: identificador de usuario final (para trazas)
        // user: { id: "user-123" }
      })
    });

    const txt = await r.text();
    if (!r.ok) return new Response(`OpenAI ${r.status}: ${txt}`, { status: r.status });

    const data = JSON.parse(txt || "{}");
    if (!data.client_secret) return new Response(`Missing client_secret. Raw: ${txt}`, { status: 500 });

    return new Response(JSON.stringify({ client_secret: data.client_secret }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(`Server error: ${e?.message || e}`, { status: 500 });
  }
}
