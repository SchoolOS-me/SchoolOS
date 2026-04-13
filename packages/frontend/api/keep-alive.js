export default async function handler(request, response) {
  const target = "https://api.schoolos.me/api/health/";

  try {
    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent": "schoolos-vercel-keepalive",
        "Cache-Control": "no-store",
      },
    });

    const body = await upstream.text();

    response.status(200).json({
      ok: upstream.ok,
      target,
      upstreamStatus: upstream.status,
      ranAt: new Date().toISOString(),
      body: body.slice(0, 500),
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      target,
      ranAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Keep-alive request failed.",
    });
  }
}
