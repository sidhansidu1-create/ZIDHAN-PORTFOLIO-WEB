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

    const clientName = sanitizeInput(data.client_name || '');
    const clientEmail = sanitizeInput(data.client_email || '');
    const clientPhone = sanitizeInput(data.client_phone || '');
    const clientMeta = (clientName || clientEmail || clientPhone)
      ? `\n\n[CLIENT CONTACT]\nName: ${clientName || 'N/A'}\nEmail: ${clientEmail || 'N/A'}\nWhatsApp/Phone: ${clientPhone || 'N/A'}`
      : '';

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
