export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'POST') {
    try {
      const data = await request.json();
      // KV se purana array le aao, naya add karo, wapas save
      let subs = await env.FORM_KV.get('all_submissions', { type: 'json' }) || [];
      subs.push(data);
      // Limit rakh sakte ho agar bahut zyada na ho (e.g. last 100)
      if (subs.length > 200) subs = subs.slice(-200);
      await env.FORM_KV.put('all_submissions', JSON.stringify(subs));
      return new Response('Saved', { status: 200 });
    } catch (err) {
      return new Response('Error saving: ' + err.message, { status: 500 });
    }
  }

  if (request.method === 'GET') {
    try {
      const subs = await env.FORM_KV.get('all_submissions', { type: 'json' }) || [];
      return new Response(JSON.stringify(subs), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response('Error fetching', { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
