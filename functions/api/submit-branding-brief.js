/**
 * Cloudflare Pages Function: /api/submit-branding-brief
 *
 * Architecture: Cloudflare Pages Functions
 * Features:
 * - Hardened Serverless API Endpoint: POST /api/submit-branding-brief
 * - Secure Google Forms Proxying for Client Branding Questionnaire
 * - Automatic Field Mapping and Sanitization
 */

const GOOGLE_BRAND_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfT_B0rzcI7ecV9rgn77iHsJDi497kiIWLcM9w7xv-WKgarKA/formResponse';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...SECURITY_HEADERS,
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, { headers: SECURITY_HEADERS });
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

    const brandName = sanitizeInput(data.brand_name || data['entry.1521972625'] || '');
    if (!brandName || brandName.length < 1) {
      return jsonResponse({ success: false, error: 'Brand Name is required.' }, 400);
    }

    const params = new URLSearchParams();

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
      return jsonResponse({
        success: false,
        error: 'Unable to reach Google Forms endpoint directly. Please copy or send your brief via WhatsApp.'
      }, 502);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'Server error: ' + err.message }, 500);
  }
}
