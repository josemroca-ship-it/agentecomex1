export async function onRequestPost({ env }) {
  try {
    if (!env.OPENAI_API_KEY) return new Response('Missing OPENAI_API_KEY', { status: 500 });
    if (!env.CHATKIT_WORKFLOW_ID) return new Response('Missing CHATKIT_WORKFLOW_ID', { status: 500 });

    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1"   // ⚠️ Obligatorio
      },
      body: JSON.stringify({
        workflow_id: env.CHATKIT_WORKFLOW_ID
      })
    });

    const txt = await r.text();
    console.log('OpenAI response status', r.status, txt); // útil para logs en Cloudflare
    if (!r.ok) return new Response(`OpenAI ${r.status}: ${txt}`, { status: r.status });

    const data = JSON.parse(txt || "{}");
    if (!data.client_secret) return new Response(`Missing client_secret. Raw: ${txt}`, { status: 500 });

    return new Response(JSON.stringify({ client_secret: data.client_secret }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(`Server error: ${e?.message}`, { status: 500 });
  }
}
