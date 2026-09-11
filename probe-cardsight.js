const token = '98dc2360000f4d5cb33e9ba346cb8021';
// tiny blank png
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const buf = Buffer.from(pngBase64, 'base64');

async function tryEndpoint(name, fn) {
  try {
    const r = await fn();
    const text = await r.text();
    let pretty = text;
    try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}
    console.log(`\n===== ${name} HTTP ${r.status} =====`);
    console.log(text.length > 2500 ? text.slice(0, 2500) + '\n...(truncated)' : pretty);
  } catch (e) {
    console.log(`\n===== ${name} ERROR =====`);
    console.log(e.message);
  }
}

(async () => {
  const endpoints = [
    { name: 'POST /v1/identify/card (multipart image)', fn: async () => {
      const form = new FormData();
      form.append('image', new Blob([buf], { type: 'image/png' }), 'card.png');
      return fetch('https://api.cardsight.ai/v1/identify/card', {
        method: 'POST',
        headers: { 'X-API-Key': token },
        body: form
      });
    }},
    { name: 'GET /v1/health or root JSON probe', fn: async () =>
      fetch('https://api.cardsight.ai/v1/identify/card', { headers: { 'X-API-Key': token } })
    }
  ];
  for (const e of endpoints) await tryEndpoint(e.name, e.fn);
})();
