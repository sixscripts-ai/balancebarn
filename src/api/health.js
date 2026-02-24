// Route: /api/health
export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, service: 'balancebarn-api', time: new Date().toISOString() }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store'
    }
  });
}
