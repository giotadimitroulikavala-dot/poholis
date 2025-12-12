export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const allowedOriginsPattern = /^https?:\/\/(foothubhd\.info|foothubhd\.online)/;
  const origin = request.headers.get('origin') || request.headers.get('referer');

  if (!origin || !allowedOriginsPattern.test(origin)) {
    return Response.redirect('https://foothubhd.info', 302);
  }

  const targetURL = 'https://f003.backblazeb2.com/';
  const newURL = new URL(request.url);
  newURL.hostname = new URL(targetURL).hostname;

  const proxyRequest = new Request(newURL.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow',
  });

  proxyRequest.headers.set('host', new URL(targetURL).hostname);

  try {
    const response = await fetch(proxyRequest);
    const modifiedResponse = new Response(response.body, response);

    if (newURL.pathname.endsWith('.ts')) {
      modifiedResponse.headers.set('Cache-Control', 'public, max-age=2, s-maxage=2');
    } else {
      modifiedResponse.headers.set('Cache-Control', 'no-cache');
    }

    return modifiedResponse;

  } catch (error) {
    return new Response('Error fetching resource', { status: 500 });
  }
}
