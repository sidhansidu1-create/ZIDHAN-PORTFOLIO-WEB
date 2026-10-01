/**
 * Cloudflare Pages Function: /api/submit-hafu-qa
 *
 * Handles Hafu 1st Anniversary Q&A submissions:
 * - Sanitizes questions q1..q5
 * - Proxies server-to-server directly to Google Forms / Google Sheet
 * - Unlocks secret anniversary passcode "hafuzidhu"
 */

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      ...SECURITY_HEADERS,
    },
  });
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    let data;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Check if this is a "Send Love Back" event from the Anniversary page
    if (data.action === 'send-love-back' || data.type === 'love') {
      const count = parseInt(data.count || '1', 10) || 1;
      const timeStr = sanitizeInput(data.timeStr || new Date().toLocaleString());
      const lang = sanitizeInput(data.lang || 'en');

      const GOOGLE_QA_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSefDHrTURd75UxW12xLGEZVbS3w5LrXPQA73jBtZYaqzCizHQ/formResponse';
      const params = new URLSearchParams();
      params.append('entry.522668702', '❤️ [LOVE SENT BACK BY HAFU] ❤️');
      params.append('entry.1145989366', `Sent at: ${timeStr} (${lang.toUpperCase()})`);
      params.append('entry.1067143930', `Love Heart Count: ${count} time(s) 💕`);
      params.append('entry.356707433', '1st Anniversary Love Letter Page (/secret/hafuzidhu/)');
      params.append('entry.736682964', `Hafu tapped "Send Love Back" on your anniversary letter! Love was sent to your heart ${count} time(s)! 🥰✨`);

      const googleRes = await fetch(GOOGLE_QA_FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: params.toString(),
      });

      if (googleRes.ok || googleRes.status === 200 || googleRes.status === 302 || googleRes.status === 303) {
        return jsonResponse(
          {
            success: true,
            count,
            message: 'Love delivered directly to Sidhan! ❤️',
          },
          200
        );
      } else {
        return jsonResponse(
          { success: false, error: 'Failed to record in Google Sheets. Status: ' + googleRes.status },
          502
        );
      }
    }

    const q1 = sanitizeInput(data.q1 || '');
    const q2 = sanitizeInput(data.q2 || '');
    const q3 = sanitizeInput(data.q3 || '');
    const q4 = sanitizeInput(data.q4 || '');
    const q5 = sanitizeInput(data.q5 || '');

    if (!q1 && !q2 && !q3 && !q4 && !q5) {
      return jsonResponse(
        { success: false, error: 'Please answer at least one question before submitting.' },
        400
      );
    }

    // Google Form: HAFUZIDHU (Q1..Q5 field mappings verified)
    const GOOGLE_QA_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSefDHrTURd75UxW12xLGEZVbS3w5LrXPQA73jBtZYaqzCizHQ/formResponse';
    const params = new URLSearchParams();
    params.append('entry.522668702', q1 || '-');
    params.append('entry.1145989366', q2 || '-');
    params.append('entry.1067143930', q3 || '-');
    params.append('entry.356707433', q4 || '-');
    params.append('entry.736682964', q5 || '-');

    const googleRes = await fetch(GOOGLE_QA_FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: params.toString(),
    });

    if (googleRes.ok || googleRes.status === 200 || googleRes.status === 302 || googleRes.status === 303) {
      return jsonResponse(
        {
          success: true,
          passcode: 'hafuzidhu',
          message: "Your answers have been recorded into Sidhan's heart forever! ❤️",
        },
        200
      );
    } else {
      return jsonResponse(
        { success: false, error: 'Failed to record response in Google Sheets. Status: ' + googleRes.status },
        502
      );
    }
  } catch (err) {
    return jsonResponse(
      { success: false, error: 'Internal server error: ' + err.message },
      500
    );
  }
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...CORS_HEADERS,
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}
