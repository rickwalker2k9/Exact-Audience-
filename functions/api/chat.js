export async function onRequestPost(context) {
  const { request, env } = context;
  
  const body = await request.json();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env["Prospect Tool"]}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.text();
  
  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
