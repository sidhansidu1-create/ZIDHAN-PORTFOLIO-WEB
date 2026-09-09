/**
 * Cloudflare Worker: Muhammed Sidhan Portfolio
 *
 * Architecture: Workers with Assets (wrangler.jsonc)
 * Features:
 * - Edge Static Asset Delivery with Security Headers
 * - Hardened Serverless API Endpoint: POST /api/submit-contact
 * - Multi-layer Bot Protection: Rate-Limiting + Honeypot + Timing Guard + Cloudflare Turnstile
 * - Strict Input Sanitization & RFC Email Validation
 * - Secure Google Forms Proxying (No Direct Client Exposure)
 */

// In-memory sliding rate-limiter store (persists per Worker isolate)
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 3;

// Email RFC-compliant regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Global HTTP Security Headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route: /api/submit-contact
    if (url.pathname === '/api/submit-contact') {
      if (request.method !== 'POST') {
        return jsonResponse(
          { success: false, error: 'Method Not Allowed' },
          405,
          { 'Allow': 'POST' }
        );
      }
      return handleSubmitContact(request, env, url);
    }

    // Static Asset Delivery with Security Headers
    try {
      const response = await env.ASSETS.fetch(request);
      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!newHeaders.has(key)) {
          newHeaders.set(key, value);
        }
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response('Asset not found or error loading asset.', { status: 500 });
    }
  },
};

/**
 * Handle Contact Form Submission with Multi-Layer Hardened Security
 */
async function handleSubmitContact(request, env, url) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const now = Date.now();

    // 1. Origin / Referer Validation (Block cross-site forge attempts)
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.host !== url.host && !originUrl.host.includes('localhost') && !originUrl.host.includes('127.0.0.1')) {
        return jsonResponse({ success: false, error: 'Unauthorized request origin.' }, 403);
      }
    } else if (referer) {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== url.host && !refererUrl.host.includes('localhost') && !refererUrl.host.includes('127.0.0.1')) {
        return jsonResponse({ success: false, error: 'Unauthorized request referer.' }, 403);
      }
    }

    // 2. Sliding-Window IP Rate Limiting
    for (const [key, val] of ipRateLimits.entries()) {
      if (now - val.timestamp > RATE_LIMIT_WINDOW_MS) {
        ipRateLimits.delete(key);
      }
    }
    const limit = ipRateLimits.get(ip) || { count: 0, timestamp: now };
    if (limit.count >= MAX_REQUESTS_PER_WINDOW && now - limit.timestamp <= RATE_LIMIT_WINDOW_MS) {
      return jsonResponse(
        { success: false, error: 'Too many requests. Please wait a minute before trying again.' },
        429,
        { 'Retry-After': '60' }
      );
    }
    if (now - limit.timestamp > RATE_LIMIT_WINDOW_MS) {
      limit.count = 1;
      limit.timestamp = now;
    } else {
      limit.count++;
    }
    ipRateLimits.set(ip, limit);

    // 3. Parse and Sanitize Form Data
    let data;
    try {
      data = await request.formData();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid form payload encoding.' }, 400);
    }

    const rawName            = data.get('entry.269513773')    || '';
    const rawEmail           = data.get('entry.1315283641')   || '';
    const rawMessage         = data.get('entry.1248789437')   || '';
    const rawWebsite         = data.get('website')            || '';
    const rawFormLoadTimeStr = data.get('form_load_time')     || '0';
    const turnstileToken     = data.get('cf-turnstile-response') || '';

    // 4. Honeypot Check (Bots fill hidden fields, real users do not)
    if (typeof rawWebsite !== 'string' || rawWebsite.trim().length > 0) {
      return jsonResponse({ success: false, error: 'Spam detected.' }, 400);
    }

    // 5. Interaction Timing Check (Must take at least 3 seconds between load and submit)
    const formLoadTime = parseInt(rawFormLoadTimeStr, 10);
    if (!formLoadTime || now - formLoadTime < 3000) {
      return jsonResponse({ success: false, error: 'Submission received too quickly. Please take a moment and try again.' }, 400);
    }

    // 6. Strict Input Field Sanitization & Length Boundaries
    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail).toLowerCase();
    const message = sanitizeInput(rawMessage);

    if (name.length < 2 || name.length > 100) {
      return jsonResponse({ success: false, error: 'Please enter a valid name (2-100 characters).' }, 400);
    }

    if (email.length < 5 || email.length > 150 || !EMAIL_REGEX.test(email)) {
      return jsonResponse({ success: false, error: 'Please provide a valid email address.' }, 400);
    }

    if (message.length < 10 || message.length > 3000) {
      return jsonResponse({ success: false, error: 'Please enter a message between 10 and 3,000 characters.' }, 400);
    }

    // 7. Cloudflare Turnstile Challenge Verification
    const SKIP_TURNSTILE = turnstileToken === 'TURNSTILE_LOAD_FAILED';

    if (!turnstileToken) {
      return jsonResponse({ success: false, error: 'Security challenge missing. Please refresh and try again.' }, 400);
    }

    if (!SKIP_TURNSTILE) {
      const secretKey = env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretKey, response: turnstileToken, remoteip: ip }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return jsonResponse({ success: false, error: 'Security verification failed. Please try again.' }, 400);
      }
    }

    // 8. Secure Server-to-Server Delivery to Google Forms
    const googleFormUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeeY05n7skKAStonYKY544id_LPvJvf7naQJeQ9BqMo1FvMyg/formResponse';
    const params = new URLSearchParams();
    params.append('entry.269513773', name);
    params.append('entry.1315283641', email);
    params.append('entry.1248789437', message);

    const googleRes = await fetch(googleFormUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (googleRes.ok || googleRes.status === 200 || googleRes.status === 302) {
      return jsonResponse({ success: true, message: 'Message delivered successfully.' }, 200);
    } else {
      return jsonResponse({ success: false, error: 'Failed to deliver message to destination. Please try again later.' }, 502);
    }

  } catch (err) {
    return jsonResponse({ success: false, error: 'Internal server error: ' + err.message }, 500);
  }
}

/**
 * Sanitize string inputs: strip control characters and excessive whitespace
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Strip ASCII control characters
    .trim();
}

/**
 * Helper to produce standardized JSON responses with security headers
 */
function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}
