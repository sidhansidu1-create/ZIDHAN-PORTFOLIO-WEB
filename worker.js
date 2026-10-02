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

    // Route: /api/submit-hafu-qa
    if (url.pathname === '/api/submit-hafu-qa') {
      if (request.method !== 'POST') {
        return jsonResponse(
          { success: false, error: 'Method Not Allowed' },
          405,
          { 'Allow': 'POST' }
        );
      }
      return handleSubmitHafuQA(request, env, url);
    }

    // Route: /api/submit-branding-brief
    if (url.pathname === '/api/submit-branding-brief') {
      if (request.method !== 'POST') {
        return jsonResponse(
          { success: false, error: 'Method Not Allowed' },
          405,
          { 'Allow': 'POST' }
        );
      }
      return handleSubmitBrandingBrief(request, env, url);
    }

    // Route: /brand-discovery
    if (url.pathname === '/brand-discovery') {
      const pageRes = await env.ASSETS.fetch(new Request(new URL('/brand-discovery.html', request.url), request));
      const res = new Response(pageRes.body, pageRes);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        res.headers.set(key, value);
      }
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    if (url.pathname === '/brand' || url.pathname === '/brand/' || url.pathname === '/brand-discovery/' || url.pathname === '/brand-qa' || url.pathname === '/discovery') {
      return Response.redirect(`${url.origin}/brand-discovery`, 301);
    }

    // Canonical redirects for secret routes
    if (url.pathname === '/secret/hafu') {
      return Response.redirect(`${url.origin}/secret/hafu/`, 301);
    }
    if (url.pathname === '/secret/hafuzidhu') {
      return Response.redirect(`${url.origin}/secret/hafuzidhu/`, 301);
    }
    if (url.pathname === '/secret') {
      return Response.redirect(`${url.origin}/secret/hafu/`, 301);
    }
    if (url.pathname === '/secret/brand' || url.pathname === '/secret/brand/' || url.pathname === '/secret/brand/index.html') {
      return Response.redirect(`${url.origin}/brand-discovery`, 301);
    }

    // Static Asset Delivery with Security Headers
    try {
      let response = await env.ASSETS.fetch(request);

      // Clean URL fallback for assets without extensions
      if (response.status === 404 && !url.pathname.includes('.')) {
        const cleanPath = url.pathname.replace(/\/$/, '') + '.html';
        const cleanRes = await env.ASSETS.fetch(new Request(new URL(cleanPath, request.url), request));
        if (cleanRes.status < 400) {
          response = cleanRes;
        }
      }

      if (response.status === 304 || response.status === 204) {
        return response;
      }

      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!newHeaders.has(key)) {
          newHeaders.set(key, value);
        }
      }
      if (url.pathname.startsWith('/secret') || url.pathname.includes('brand')) {
        newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return env.ASSETS.fetch(request);
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

/**
 * Handle Hafu 1st Anniversary Q&A Submission -> Proxies directly to Google Forms
 */
async function handleSubmitHafuQA(request, env, url) {
  try {
    let data;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const q1 = sanitizeInput(data.q1 || '');
    const q2 = sanitizeInput(data.q2 || '');
    const q3 = sanitizeInput(data.q3 || '');
    const q4 = sanitizeInput(data.q4 || '');
    const q5 = sanitizeInput(data.q5 || '');

    if (!q1 && !q2 && !q3 && !q4 && !q5) {
      return jsonResponse({ success: false, error: 'Please answer at least one question before submitting.' }, 400);
    }

    // Google Form: HAFUZIDHU (Q1..Q5 field mappings)
    const GOOGLE_QA_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSefDHrTURd75UxW12xLGEZVbS3w5LrXPQA73jBtZYaqzCizHQ/formResponse';
    const params = new URLSearchParams();
    params.append('entry.522668702', q1 || '-');
    params.append('entry.1145989366', q2 || '-');
    params.append('entry.1067143930', q3 || '-');
    params.append('entry.356707433', q4 || '-');
    params.append('entry.736682964', q5 || '-');

    const googleRes = await fetch(GOOGLE_QA_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (googleRes.ok || googleRes.status === 200 || googleRes.status === 302 || googleRes.status === 303) {
      return jsonResponse({
        success: true,
        passcode: 'hafuzidhu',
        message: 'Your answers have been recorded into Sidhan\'s heart forever! ❤️'
      }, 200);
    } else {
      return jsonResponse({ success: false, error: 'Failed to record response in Google Sheets. Please try again.' }, 502);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message }, 500);
  }
}

/**
 * Handle Client Branding Discovery Brief Submission -> Proxies directly to Google Forms
 */
async function handleSubmitBrandingBrief(request, env, url) {
  try {
    let data;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    const brandName = sanitizeInput(data.brand_name || data['entry.1521972625'] || '');
    if (!brandName || brandName.length < 1) {
      return jsonResponse({ success: false, error: 'Brand Name is required.' }, 400);
    }

    const GOOGLE_BRAND_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfT_B0rzcI7ecV9rgn77iHsJDi497kiIWLcM9w7xv-WKgarKA/formResponse';
    const params = new URLSearchParams();

    // Helper to append field or list
    function addEntry(entryId, val) {
      if (!val) return;
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (item && typeof item === 'string') params.append(entryId, item.trim());
        });
      } else if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed) params.append(entryId, trimmed);
      }
    }

    // Client contact details
    const clientName = sanitizeInput(data.client_name || '');
    const clientEmail = sanitizeInput(data.client_email || '');
    const clientPhone = sanitizeInput(data.client_phone || '');
    const clientMeta = (clientName || clientEmail || clientPhone)
      ? `\n\n[CLIENT CONTACT]\nName: ${clientName || 'N/A'}\nEmail: ${clientEmail || 'N/A'}\nWhatsApp/Phone: ${clientPhone || 'N/A'}`
      : '';

    // SECTION 1 — BASIC INFORMATION
    addEntry('entry.1521972625', brandName);
    addEntry('entry.54569691', sanitizeInput(data.links || data['entry.54569691'] || ''));
    addEntry('entry.89056443', sanitizeInput(data.product_service || data['entry.89056443'] || ''));
    addEntry('entry.854336900', sanitizeInput(data.brand_stage || data['entry.854336900'] || 'A new brand'));

    // SECTION 2 — BRAND OVERVIEW
    addEntry('entry.66466776', sanitizeInput(data.brand_story || data['entry.66466776'] || ''));
    addEntry('entry.850314655', sanitizeInput(data.inspiration || data['entry.850314655'] || ''));
    addEntry('entry.1720951003', sanitizeInput(data.problem_solved || data['entry.1720951003'] || ''));
    addEntry('entry.1219397370', sanitizeInput(data.differentiation || data['entry.1219397370'] || ''));
    addEntry('entry.1035738402', sanitizeInput(data.main_goals || data['entry.1035738402'] || ''));
    addEntry('entry.820805609', sanitizeInput(data.future_vision || data['entry.820805609'] || ''));
    addEntry('entry.1234135220', sanitizeInput(data.core_message || data['entry.1234135220'] || ''));

    // SECTION 3 — TARGET AUDIENCE
    addEntry('entry.1773681969', sanitizeInput(data.target_audience || data['entry.1773681969'] || ''));
    addEntry('entry.1449430324', sanitizeInput(data.age_group || data['entry.1449430324'] || ''));
    addEntry('entry.1432340557', sanitizeInput(data.gender_focus || data['entry.1432340557'] || 'Both'));
    addEntry('entry.1052678168', sanitizeInput(data.buyer_profile || data['entry.1052678168'] || ''));
    addEntry('entry.2056083537', sanitizeInput(data.brand_emotions || data['entry.2056083537'] || ''));
    addEntry('entry.1034928443', sanitizeInput(data.target_countries || data['entry.1034928443'] || ''));

    // SECTION 4 — BRAND PERSONALITY
    addEntry('entry.1740452696', sanitizeInput(data.brand_persona || data['entry.1740452696'] || ''));
    const personalityWords = data.personality_words || data['entry.726000006'];
    addEntry('entry.726000006', personalityWords);
    addEntry('entry.703871801', sanitizeInput(data.feeling_create || data['entry.703871801'] || ''));
    addEntry('entry.1087755955', sanitizeInput(data.brand_inspiration || data['entry.1087755955'] || ''));
    addEntry('entry.1870790955', sanitizeInput(data.visual_style || data['entry.1870790955'] || ''));

    // SECTION 5 — LOGO & VISUAL IDENTITY
    addEntry('entry.1494830036', sanitizeInput(data.has_logo || data['entry.1494830036'] || 'No'));
    addEntry('entry.554797467', sanitizeInput(data.logo_type || data['entry.554797467'] || 'Wordmark'));
    addEntry('entry.596838607', sanitizeInput(data.symbols_wanted || data['entry.596838607'] || 'None specified'));
    addEntry('entry.77259235', sanitizeInput(data.symbols_avoid || data['entry.77259235'] || ''));
    addEntry('entry.1926740340', sanitizeInput(data.preferred_colors || data['entry.1926740340'] || ''));
    addEntry('entry.1897757883', sanitizeInput(data.design_density || data['entry.1897757883'] || 'Minimal Design'));

    // SECTION 6 — COMPETITORS & MARKET
    addEntry('entry.1588766165', sanitizeInput(data.competitors || data['entry.1588766165'] || ''));
    addEntry('entry.1239299568', sanitizeInput(data.competitor_likes_dislikes || data['entry.1239299568'] || ''));
    addEntry('entry.1320178685', sanitizeInput(data.brand_uniqueness || data['entry.1320178685'] || ''));
    addEntry('entry.2047112130', data.market_position || data['entry.2047112130']);

    // SECTION 7 — SOCIAL MEDIA & CONTENT
    addEntry('entry.1311960900', data.social_platforms || data['entry.1311960900']);
    addEntry('entry.1074356999', sanitizeInput(data.content_types || data['entry.1074356999'] || ''));
    addEntry('entry.1310025804', sanitizeInput(data.social_visual_style || data['entry.1310025804'] || ''));
    addEntry('entry.1315593454', sanitizeInput(data.consistent_theme || data['entry.1315593454'] || 'Yes'));

    // SECTION 8 — PROJECT REQUIREMENTS
    addEntry('entry.1240339524', data.services_needed || data['entry.1240339524']);
    addEntry('entry.144580768', sanitizeInput(data.deliverables || data['entry.144580768'] || ''));
    addEntry('entry.264083599', sanitizeInput(data.has_deadline || data['entry.264083599'] || 'No'));

    const rawNotes = sanitizeInput(data.anything_else || data['entry.507504509'] || 'No additional notes.');
    const deadlineExtra = data.deadline_date ? `\nTarget Deadline: ${data.deadline_date}` : '';
    const finalNotes = `${rawNotes}${deadlineExtra}${clientMeta}`;
    addEntry('entry.507504509', finalNotes);

    const googleRes = await fetch(GOOGLE_BRAND_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (googleRes.ok || googleRes.status === 200 || googleRes.status === 302 || googleRes.status === 303) {
      return jsonResponse({
        success: true,
        message: 'Your branding discovery brief has been successfully submitted to Muhammed Sidhan!'
      }, 200);
    } else {
      // Even if Google returns 502/status, we still inform client gracefully
      return jsonResponse({
        success: false,
        error: 'Unable to reach Google Forms endpoint directly. Please copy or send your brief via WhatsApp.'
      }, 502);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message }, 500);
  }
}

