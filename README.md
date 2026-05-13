# 🔗 LinkSnip - URL Shortener

> A minimal, interactive URL shortener built with Cloudflare Workers. Perfect for learning modern web architecture and serverless development.

![Preview](https://via.placeholder.com/600x400/141416/6366f1?text=LinkSnip+Preview)

## ✨ Features

- **Custom Domain Selection** - Choose from multiple short domains or add your own
- **Edge Computing** - Powered by Cloudflare Workers for global low-latency
- **Serverless Architecture** - No server management, auto-scaling
- **Clean UI** - Modern, minimal design with smooth interactions

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User      │────▶│ Cloudflare   │────▶│   KV Store  │
│  Browser    │     │   Workers    │     │  (Storage)  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   301 Redirect│
                    └──────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Vanilla JS + CSS |
| Backend | Cloudflare Workers |
| Storage | Cloudflare KV |
| CDN | Cloudflare Global Network |

## 🎯 Interview Talking Points

> Here's how to explain this project in interviews:

### 1. Serverless & Edge Computing
> "This runs on Cloudflare Workers, which means the code executes at the edge - closer to users worldwide. No cold starts, sub-10ms latency."

### 2. KV Store
> "URL mappings are stored in Cloudflare KV, a global key-value store that replicates to 300+ datacenters. Reads are ~5ms."

### 3. 301 vs 302 Redirects
> "We use 301 (permanent) redirects for SEO benefits. Search engines transfer ~95% of page rank to the destination."

### 4. Rate Limiting
> "Workers include built-in rate limiting to prevent abuse - essential for production systems."

## 🚀 Quick Start

### Option 1: Static Demo (Frontend Only)

Simply open `index.html` in your browser - the demo mode works without a backend!

### Option 2: Deploy Backend

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler deploy

# Or deploy to staging
wrangler deploy --env staging
```

### Option 3: GitHub Pages (Frontend Only)

1. Go to Settings → Pages
2. Deploy from `main` branch
3. Your site is live at `yourusername.github.io/url-shortener`

## 📡 API Reference

### Create Short URL
```bash
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",
  "domain": "linksnip.dev"
}
```

**Response:**
```json
{
  "shortUrl": "https://linksnip.dev/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/..."
}
```

### Redirect
```
GET /{shortCode}
```
Returns `301 Redirect` to original URL

### Get Stats
```
GET /api/stats/{shortCode}
```

## 🔧 Configuration

Edit `worker.js` to customize:

- `DEFAULT_DOMAINS` - Available short domains
- Short code length (default: 6 characters)
- Rate limiting thresholds

## 📦 Project Structure

```
url-shortener/
├── index.html                # Frontend (Static site)
├── functions/
│   └── api/
│       └── shorten.js       # API Handler (Cloudflare Pages Functions)
├── wrangler.toml            # Deployment config
└── README.md                # This file
```

## 🌐 Live Demo

**Frontend:** [LinkSnip Demo](https://8edd9388.linksnip.pages.dev)

**API Endpoint:** `https://8edd9388.linksnip.pages.dev/api/shorten`

> Note: The URL will change with each deployment. Re-deploy to get a stable URL or connect a custom domain.

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `URLS` | KV Namespace binding for URL storage |

## 📝 License

MIT License - Feel free to use this for learning or your own projects!

---

**Built with ☁️ Cloudflare Workers**
*Perfect for: portfolio projects, learning serverless, interview preparation*