# Technical SEO & Performance Architecture

This document outlines the technical SEO, Core Web Vitals, security, and edge hosting optimizations engineered into the website.

---

## 1. Edge Hosting & Delivery Architecture

* **Platform:** Cloudflare Workers with Assets (`wrangler.jsonc` + `worker.js`)
* **Edge CDN:** 330+ global data centers providing ultra-low TTFB (Time to First Byte < 50ms).
* **HTTP/3 & TLS 1.3:** Enabled by default on Cloudflare edge, reducing SSL handshake latency.
* **Serverless Backend:** `POST /api/submit-contact` securely proxies submissions without exposing client API keys or sensitive endpoints.

---

## 2. Core Web Vitals (CWV) Optimization

### A. Largest Contentful Paint (LCP) < 1.2s
* **Strategy:** Critical hero assets are served via Cloudinary CDN with automatic format negotiation (`f_auto`) and intelligent compression (`q_auto`).
* **Implementation:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://res.cloudinary.com">
  ```
* Critical above-the-fold images utilize `fetchpriority="high"` and `loading="eager"`.

### B. Cumulative Layout Shift (CLS) = 0.00
* All portfolio images declare explicit `width` and `height` attributes (e.g. `width="1920" height="1080"` or `width="1080" height="1080"`), allowing the browser engine to calculate aspect ratios prior to image download.
* Font display uses `display=swap` to avoid invisible text flashing (FOIT).

### C. Interaction to Next Paint (INP) < 50ms
* Minified JavaScript execution (`script.min.js`) is deferred (`defer` attribute), keeping the main thread free during DOM parsing.
* Non-critical Font Awesome CSS loads asynchronously via the `media="print" onload="this.media='all'"` technique with a `<noscript>` fallback.

---

## 3. Production HTTP Security Headers

As configured in `worker.js`, every static and dynamic response from the site delivers hardened HTTP security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 4. Crawl Budget & Indexability Health Check

1. **Clean URL Structure:** Static flat URLs (`/` and `/campaign.html`) without session IDs, trailing slashes, or query parameter bloat.
2. **Proper Error Handling:** Missing routes properly return standard HTTP 404/500 status codes rather than soft-404 pages.
3. **Robots Directives:** `/robots.txt` explicitly allows search bots (Googlebot, Bingbot, Applebot) and AI crawlers (GPTBot, PerplexityBot, ClaudeBot), while protecting backend API directories (`/api/`).
4. **Canonical Consistency:** Prevents duplicate indexation across HTTP/HTTPS, `www` vs non-`www`, and staging worker URLs.
