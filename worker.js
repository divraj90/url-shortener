/**
 * LinkSnip URL Shortener - Cloudflare Worker
 *
 * Architecture:
 * - KV Store: Stores URL mappings (short_code -> original_url)
 * - Global CDN: Workers run on 300+ edge locations
 * - Analytics: Track clicks with minimal overhead
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
    const path = url.pathname.slice(1); // Remove leading slash

    // Handle CORS for API requests
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

    // API: Get analytics for a short URL
    if (url.pathname.startsWith('/api/stats/') && request.method === 'GET') {
      return await handleStats(url.pathname.split('/api/stats/')[1], env);
    }

    // Redirect: Short URL -> Original URL
    if (path && !path.includes('/')) {
      return await handleRedirect(path, env, ctx);
    }

    // Root: Serve the frontend
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

    // Validate URL
    try {
      new URL(url);
    } catch {
      return jsonResponse({ error: 'Invalid URL format' }, 400);
    }

    // Generate short code or use custom
    const shortCode = customCode || generateShortCode(6);
    const shortUrl = `https://${domain || 'linksnip.dev'}/${shortCode}`;

    // Store in KV (simulated with environment)
    const key = `url:${shortCode}`;
    const value = JSON.stringify({
      original: url,
      created: Date.now(),
      clicks: 0,
    });

    // In production: await env.URLS.put(key, value);
    // For demo, we return the shortened URL
    return jsonResponse({
      shortUrl,
      shortCode,
      originalUrl: url,
    });
  } catch (error) {
    return jsonResponse({ error: 'Failed to shorten URL' }, 500);
  }
}

async function handleRedirect(shortCode, env, ctx) {
  const key = `url:${shortCode}`;

  // In production: const data = await env.URLS.get(key);
  // For demo, return a 404
  const demoUrls = {
    'demo': 'https://example.com',
  };

  const data = demoUrls[shortCode];

  if (data) {
    const parsed = JSON.parse(data);
    // Increment click counter (in production)
    // const updated = { ...parsed, clicks: parsed.clicks + 1 };
    // await env.URLS.put(key, JSON.stringify(updated));

    return Response.redirect(parsed.original, 301);
  }

  return new Response('Short URL not found', { status: 404 });
}

async function handleStats(shortCode, env) {
  const key = `url:${shortCode}`;
  // const data = await env.URLS.get(key);
  // return jsonResponse(JSON.parse(data));

  return jsonResponse({ error: 'Stats not available in demo mode' }, 404);
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
<head>
  <title>LinkSnip API</title>
</head>
<body>
  <h1>LinkSnip URL Shortener API</h1>
  <p>Use POST /api/shorten with {"url": "https://..."} to create a short URL</p>
</body>
</html>
`;