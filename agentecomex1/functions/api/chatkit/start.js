export async function onRequestPost({ env }) {
  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1"
    },
    body: JSON.stringify({
      workflow_id: env.CHATKIT_WORKFLOW_ID
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify({ client_secret: data.client_secret }), {
    headers: { "Content-Type": "application/json" }
  });
}