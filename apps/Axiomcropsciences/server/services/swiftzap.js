// SwiftZap SMS OTP integration.
// Docs: https://swiftzap.in/sms-api-docs
//
// POST https://signetaiserver.swiftzap.in/api/v1/sms/send
// Headers:
//   Content-Type: application/json
//   x-api-key: <client api key>
// Body:
//   { to, message, dltTemplateId }
//
// Until SWIFTZAP_API_KEY and SWIFTZAP_TEMPLATE_ID are set, this service runs in
// dev mode: no external API call is made and routes can expose the OTP outside
// production for local testing.

const {
  SWIFTZAP_BASE_URL,
  SWIFTZAP_API_KEY,
  SWIFTZAP_TEMPLATE_ID,
  SWIFTZAP_OTP_MESSAGE,
} = process.env;

const DEFAULT_BASE_URL = 'https://signetaiserver.swiftzap.in/api';
const DEFAULT_OTP_MESSAGE = 'Dear customer, your OTP is {{OTP}}.';

const isConfigured = () => Boolean(SWIFTZAP_API_KEY && SWIFTZAP_TEMPLATE_ID);

function getBaseUrl() {
  return (SWIFTZAP_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
}

function normalizeRecipient(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function buildOtpMessage(code) {
  const template = SWIFTZAP_OTP_MESSAGE || DEFAULT_OTP_MESSAGE;
  return template
    .replace(/\{\{\s*OTP\s*\}\}/gi, code)
    .replace(/\{#var#\}/gi, code);
}

async function parseSwiftZapResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json().catch(() => ({}));
  }

  const text = await res.text().catch(() => '');
  return text ? { message: text } : {};
}

/**
 * Send an OTP code to a phone via SwiftZap.
 * @param {string} phone Full E.164 number, e.g. "+919876543210"
 * @param {string} code The plain OTP to deliver, e.g. "493021"
 * @returns {Promise<{ devMode: boolean, provider?: string, logId?: string, remainingBalance?: number }>}
 */
async function sendOtp(phone, code) {
  if (!isConfigured()) {
    console.log(`[SwiftZap DEV] OTP for ${phone}: ${code}`);
    return { devMode: true };
  }

  const to = normalizeRecipient(phone);
  if (!to) {
    throw new Error('OTP send failed: recipient phone number is invalid.');
  }

  const res = await fetch(`${getBaseUrl()}/v1/sms/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': SWIFTZAP_API_KEY,
    },
    body: JSON.stringify({
      to,
      message: buildOtpMessage(code),
      dltTemplateId: SWIFTZAP_TEMPLATE_ID,
    }),
  });

  const data = await parseSwiftZapResponse(res);
  if (!res.ok) {
    const message = data.message || data.error || 'SwiftZap request failed.';
    throw new Error(`OTP send failed (${res.status}): ${String(message).slice(0, 200)}`);
  }

  if (data.ok === false) {
    const message = data.message || data.error || 'SwiftZap rejected the SMS request.';
    throw new Error(`OTP send failed: ${String(message).slice(0, 200)}`);
  }

  return {
    devMode: false,
    provider: 'swiftzap',
    logId: data.logId,
    remainingBalance: data.remainingBalance,
  };
}

module.exports = { sendOtp, isConfigured };
