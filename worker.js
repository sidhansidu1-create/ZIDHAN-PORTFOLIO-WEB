/**
 * Cloudflare Worker entry point for Zidhan Portfolio.
 *
 * Architecture: Workers with Assets (wrangler.jsonc).
 * - POST /api/submit-contact  → handled here (spam checks + Google Forms forwarding)
 * - Everything else           → served from the static assets binding (ASSETS)
 *
 * NOTE: The functions/ directory is only honoured by Cloudflare Pages deployments.
 * This project is a Worker with Assets, so API routes must be defined here.
 */

// In-memory rate-limit store. Persists for the lifetime of the Worker isolate.
const ipRateLimits = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route: POST /api/submit-contact
    if (url.pathname === '/api/submit-contact' && request.method === 'POST') {
      return handleSubmitContact(request, env);
    }

    // All other requests: serve static assets
    return env.ASSETS.fetch(request);
  },
};

async function handleSubmitContact(request, env) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';
    const now = Date.now();

    // 1. Rate Limiting — max 3 submissions per IP per 60 seconds
    for (const [key, val] of ipRateLimits.entries()) {
      if (now - val.timestamp > 60000) ipRateLimits.delete(key);
    }
    const limit = ipRateLimits.get(ip) || { count: 0, timestamp: now };
    if (limit.count >= 3 && now - limit.timestamp <= 60000) {
      return jsonResponse({ success: false, error: 'Too many requests. Please try again in a minute.' }, 429);
    }
    if (now - limit.timestamp > 60000) {
      limit.count = 1;
      limit.timestamp = now;
    } else {
      limit.count++;
    }
    ipRateLimits.set(ip, limit);

    // 2. Parse form data
    const data = await request.formData();
    const name             = data.get('entry.269513773')    || '';
    const email            = data.get('entry.1315283641')   || '';
    const message          = data.get('entry.1248789437')   || '';
    const website          = data.get('website')            || '';
    const formLoadTimeStr  = data.get('form_load_time')     || '0';
    const turnstileToken   = data.get('cf-turnstile-response') || '';

    // 3. Honeypot check — field must be empty (bots fill it, humans don't see it)
    if (website.trim() !== '') {
      return jsonResponse({ success: false, error: 'Spam detected.' }, 400);
    }

    // 4. Timestamp check — must be at least 3 seconds since form load
    const formLoadTime = parseInt(formLoadTimeStr, 10);
    if (!formLoadTime || now - formLoadTime < 3000) {
      return jsonResponse({ success: false, error: 'Submission too fast. Please wait a moment and try again.' }, 400);
    }

    // 5. Basic field validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      return jsonResponse({ success: false, error: 'All fields are required.' }, 400);
    }

    // 6. Cloudflare Turnstile token validation
    // If the client signals that the Turnstile script failed to load (ad-blocker / network
    // issue), we skip token verification but keep all other spam guards active.
    const SKIP_TURNSTILE = turnstileToken === 'TURNSTILE_LOAD_FAILED';

    if (!turnstileToken) {
      return jsonResponse({ success: false, error: 'Verification required. Please complete the challenge.' }, 400);
    }

    if (!SKIP_TURNSTILE) {
      // Use real secret from env, fall back to Cloudflare test secret for dev
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

    // 7. Forward to Google Forms
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

    if (googleRes.ok) {
      return jsonResponse({ success: true }, 200);
    } else {
      return jsonResponse({ success: false, error: 'Failed to deliver message. Please try again.' }, 500);
    }

  } catch (err) {
    return jsonResponse({ success: false, error: 'Internal server error: ' + err.message }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
