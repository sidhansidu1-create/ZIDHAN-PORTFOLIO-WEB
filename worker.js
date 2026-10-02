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
      data = {};
      for (const [key, value] of formData.entries()) {
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      }
    }

    const brandName = sanitizeInput(data.brand_name || data['entry.1521972625'] || '');
    if (!brandName || brandName.length < 1) {
      return jsonResponse({ success: false, error: 'Brand Name is required.' }, 400);
    }

    const GOOGLE_BRAND_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfT_B0rzcI7ecV9rgn77iHsJDi497kiIWLcM9w7xv-WKgarKA/formResponse';
    const params = new URLSearchParams();

    // Client contact details
    const clientName = sanitizeInput(data.client_name || '');
    const clientEmail = sanitizeInput(data.client_email || '');
    const clientPhone = sanitizeInput(data.client_phone || '');
    const clientMeta = (clientName || clientEmail || clientPhone)
      ? `\n\n[CLIENT CONTACT]\nName: ${clientName || 'N/A'}\nEmail: ${clientEmail || 'N/A'}\nWhatsApp/Phone: ${clientPhone || 'N/A'}`
      : '';

    // Helper to append field or list
    function appendField(entryId, value) {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item && typeof item === 'string' && item.trim()) {
            params.append(entryId, item.trim());
          }
        });
      } else if (typeof value === 'string' && value.trim()) {
        params.append(entryId, value.trim());
      }
    }

    // Direct mapping of all Google Form entry IDs with fallback to friendly aliases & defaults
    const fieldMap = {
      'entry.1521972625': data['entry.1521972625'] || data.brand_name,
      'entry.54569691': data['entry.54569691'] || data.links,
      'entry.89056443': data['entry.89056443'] || data.product_service || '-',
      'entry.854336900': data['entry.854336900'] || data.brand_stage || 'A new brand',
      'entry.66466776': data['entry.66466776'] || data.brand_story || '-',
      'entry.850314655': data['entry.850314655'] || data.inspiration,
      'entry.1720951003': data['entry.1720951003'] || data.problem_solved || '-',
      'entry.1219397370': data['entry.1219397370'] || data.differentiation || '-',
      'entry.1035738402': data['entry.1035738402'] || data.main_goals || '-',
      'entry.820805609': data['entry.820805609'] || data.future_vision,
      'entry.1234135220': data['entry.1234135220'] || data.core_message || '-',
      'entry.1773681969': data['entry.1773681969'] || data.target_audience || '-',
      'entry.1449430324': data['entry.1449430324'] || data.age_group || '-',
      'entry.1432340557': data['entry.1432340557'] || data.gender_focus || 'Both',
      'entry.1052678168': data['entry.1052678168'] || data.buyer_profile || '-',
      'entry.2056083537': data['entry.2056083537'] || data.brand_emotions || '-',
      'entry.1034928443': data['entry.1034928443'] || data.target_countries || '-',
      'entry.1740452696': data['entry.1740452696'] || data.brand_persona || '-',
      'entry.726000006': data['entry.726000006'] || data.personality_words || 'Modern',
      'entry.703871801': data['entry.703871801'] || data.feeling_create || data.tone_of_voice || '-',
      'entry.1087755955': data['entry.1087755955'] || data.brand_inspiration,
      'entry.1870790955': data['entry.1870790955'] || data.visual_style || '-',
      'entry.1494830036': data['entry.1494830036'] || data.has_logo || 'No',
      'entry.554797467': data['entry.554797467'] || data.logo_type || 'Wordmark',
      'entry.596838607': data['entry.596838607'] || data.symbols_wanted,
      'entry.77259235': data['entry.77259235'] || data.symbols_avoid,
      'entry.1926740340': data['entry.1926740340'] || data.preferred_colors,
      'entry.1897757883': data['entry.1897757883'] || data.design_density || 'Minimal Design',
      'entry.1588766165': data['entry.1588766165'] || data.competitors || '-',
      'entry.1239299568': data['entry.1239299568'] || data.competitor_likes_dislikes || '-',
      'entry.1320178685': data['entry.1320178685'] || data.brand_uniqueness || '-',
      'entry.2047112130': data['entry.2047112130'] || data.market_position || 'Premium',
      'entry.1311960900': data['entry.1311960900'] || data.social_platforms || 'Instagram',
      'entry.1074356999': data['entry.1074356999'] || data.content_types,
      'entry.1310025804': data['entry.1310025804'] || data.social_visual_style,
      'entry.1315593454': data['entry.1315593454'] || data.consistent_theme || 'Yes',
      'entry.1240339524': data['entry.1240339524'] || data.services_needed || 'Brand Identity',
      'entry.144580768': data['entry.144580768'] || data.deliverables || '-',
      'entry.264083599': data['entry.264083599'] || data.has_deadline || 'No',
    };

    for (const [entryId, value] of Object.entries(fieldMap)) {
      appendField(entryId, value);
    }

    // Append any "Other:" option write-ins (entry.XXXXX.other_option_response)
    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith('.other_option_response') && typeof value === 'string' && value.trim()) {
        params.append(key, value.trim());
      }
    }

    // Final notes with deadline date & client contact metadata
    const rawNotes = sanitizeInput(data.anything_else || data['entry.507504509'] || 'No additional notes.');
    const deadlineExtra = data.deadline_date ? `\nTarget Deadline: ${data.deadline_date}` : '';
    const finalNotes = `${rawNotes}${deadlineExtra}${clientMeta}`;
    params.append('entry.507504509', finalNotes);

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
      return jsonResponse({
        success: false,
        error: 'Unable to reach Google Forms endpoint directly. Please copy or send your brief via WhatsApp.'
      }, 502);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message }, 500);
  }
}

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

