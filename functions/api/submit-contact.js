// Cloudflare Pages Function for contact form spam protection and forwarding
export async function onRequestPost(context) {
  try {
    const request = context.request;
    const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';

    // 1. Rate Limiting (Limit to 3 submissions per minute per IP address)
    if (!globalThis.ipRateLimits) {
      globalThis.ipRateLimits = new Map();
    }
    const now = Date.now();
    // Clean up expired rate limits older than 60 seconds
    for (const [key, val] of globalThis.ipRateLimits.entries()) {
      if (now - val.timestamp > 60000) {
        globalThis.ipRateLimits.delete(key);
      }
    }
    const currentLimit = globalThis.ipRateLimits.get(ip) || { count: 0, timestamp: now };
    if (currentLimit.count >= 3 && now - currentLimit.timestamp <= 60000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many requests. Please try again in a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      if (now - currentLimit.timestamp > 60000) {
        currentLimit.count = 1;
        currentLimit.timestamp = now;
      } else {
        currentLimit.count++;
      }
      globalThis.ipRateLimits.set(ip, currentLimit);
    }

    // 2. Parse form data
    const data = await request.formData();
    const name = data.get('entry.269513773') || '';
    const email = data.get('entry.1315283641') || '';
    const message = data.get('entry.1248789437') || '';
    const website = data.get('website');
    const formLoadTimeStr = data.get('form_load_time');
    const turnstileResponse = data.get('cf-turnstile-response');

    // 3. Honeypot check (field must be empty)
    if (website && website.trim() !== '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Spam detected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Timestamp check (must be at least 3 seconds since form load)
    const formLoadTime = parseInt(formLoadTimeStr, 10);
    if (!formLoadTime || now - formLoadTime < 3000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Submission too fast. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Cloudflare Turnstile token validation
    if (!turnstileResponse) {
      return new Response(
        JSON.stringify({ success: false, error: 'Verification required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const secretKey = context.env.TURNSTILE_SECRET_KEY || '1x00000000000000000000000000000000';
    const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    const verifyResponse = await fetch(turnstileUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: secretKey,
        response: turnstileResponse,
        remoteip: ip
      })
    });

    const verifyJson = await verifyResponse.json();
    if (!verifyJson.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Security verification failed. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Forward submission to Google Forms (URL-encoded POST request)
    const googleFormUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeeY05n7skKAStonYKY544id_LPvJvf7naQJeQ9BqMo1FvMyg/formResponse';
    const params = new URLSearchParams();
    params.append('entry.269513773', name);
    params.append('entry.1315283641', email);
    params.append('entry.1248789437', message);

    const googleResponse = await fetch(googleFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (googleResponse.ok) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to deliver message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
