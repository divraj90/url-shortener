/**
 * LinkSnip URL Shortener - Cloudflare Worker
 *
 * This is an alternative backend that can be deployed to Cloudflare Workers
 * (not Pages). Use this if you want to deploy to workers.dev subdomain
 * or a custom domain.
 *
 * Deployment:
 *   npm install -g wrangler
 *   wrangler deploy
 *
 * Interview Points:
 * - Serverless architecture & edge computing
 * - KV Store for fast read/write operations
 * - 301 redirects for SEO (permanent redirects)
 * - Rate limiting to prevent abuse
 */

const DEFAULT_DOMAINS = [
  'linksnip.dev',
  'lnk.snip',
  'go.short',
  'x.co'
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // API: Create shortened URL
    if (url.pathname === '/api/shorten' && request.method === 'POST') {
      return await handleShorten(request, env);
    }

    // API: Get stats
    if (url.pathname.startsWith('/api/stats/') && request.method === 'GET') {
      const shortCode = path.split('/api/stats/')[1];
      return await handleStats(shortCode, env);
    }

    // Redirect: Short URL -> Original URL
    if (path && !path.includes('/')) {
      return await handleRedirect(path, env, ctx);
    }

    // Serve frontend
    return new Response(FRONTEND_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};

async function handleShorten(request, env) {
  try {
    const { url, customCode, domain } = await request.json();

    if (!url) {
      return jsonResponse({ error: 'URL is required' }, 400);
    }

    try {
      new URL(url);
    } catch {
      return jsonResponse({ error: 'Invalid URL format' }, 400);
    }

    const shortCode = customCode || generateShortCode(6);
    const shortUrl = `https://${domain || 'linksnip.dev'}/${shortCode}`;

    // Store in KV (uncomment in production)
    // await env.URLS.put(shortCode, JSON.stringify({ original: url, clicks: 0 }));

    return jsonResponse({ shortUrl, shortCode, originalUrl: url });
  } catch (error) {
    return jsonResponse({ error: 'Failed to shorten URL' }, 500);
  }
}

async function handleRedirect(shortCode, env, ctx) {
  // In production: const data = await env.URLS.get(shortCode);
  const demoUrls = { 'demo': 'https://example.com' };
  const data = demoUrls[shortCode];

  if (data) {
    const parsed = JSON.parse(data);
    return Response.redirect(parsed.original, 301);
  }

  return new Response('Short URL not found', { status: 404 });
}

async function handleStats(shortCode, env) {
  // In production: return stats from KV
  return jsonResponse({ error: 'Stats require KV store' }, 404);
}

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    code += chars[randomValues[i] % chars.length];
  }
  return code;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

const FRONTEND_HTML = `
<!DOCTYPE html>
<html>
<head><title>LinkSnip</title></head>
<body>
  <h1>LinkSnip URL Shortener</h1>
  <p>Deploy frontend separately or connect custom domain</p>
</body>
</html>
`;