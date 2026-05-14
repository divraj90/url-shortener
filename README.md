# LinkSnip - URL Shortener

> A minimal URL shortener that converts long URLs into short, shareable links with custom domain support.

## What is this?

LinkSnip takes a long URL and generates a short code that redirects to the original URL. Users can choose from preset short domains or add their own custom domain.

## How it Shortens URLs

```
User Input                    Generated Short URL
─────────────                 ───────────────────
https://example.com/very      ──► https://x.co/abc123
/long/url/with/many            ──► https://linksnip.dev/xyz789
/parameters
```

1. User submits a long URL + selects a short domain
2. System generates a random 6-character code (e.g., `abc123`)
3. Short URL is stored as: `https://{domain}/{code}` → `original_url`
4. When访问 short URL, system redirects to the stored original URL

## Architecture

```
┌─────────────┐
│   User      │  1. POST URL + domain
│  Browser    │───────────────────▶
└─────────────┘
      │                              ┌──────────────┐
      │  2. Returns short URL        │   API        │
      │◀─────────────────────────────│  (functions) │
      │                              └──────────────┘
      │
      │  3. Access short URL
      ▼──────────────────────────────────────────▶  4. Redirects to original URL
```

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Cloudflare Pages Functions |
| Deployment | Cloudflare Pages |

## Project Structure

```
url-shortener/
├── index.html              # Main frontend UI
├── functions/
│   └── api/
│       └── shorten.js     # API endpoint handler
├── worker.js              # Cloudflare Worker (alternative)
├── wrangler.toml         # Deployment configuration
└── README.md
```

## API Endpoint

```
POST /api/shorten
Content-Type: application/json

Request:
{
  "url": "https://example.com/long/url",
  "domain": "x.co"
}

Response:
{
  "shortUrl": "https://x.co/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/long/url"
}
```