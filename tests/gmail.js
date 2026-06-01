require('dotenv').config();
const { google } = require('googleapis');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  throw new Error('Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in your environment.');
}

function extractBody(payload) {
  if (!payload) return '';
  if (payload.parts) {
    return payload.parts.map(extractBody).join('');
  }
  return payload.body?.data || '';
}

async function getLatestOtp(query = 'subject:OTP', regex = /\\b(\\d{4,6})\\b/) {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const listRes = await gmail.users.messages.list({ userId: 'me', q: query, maxResults: 1 });
  if (!listRes.data.messages || !listRes.data.messages.length) return null;

  const msgId = listRes.data.messages[0].id;
  const msgRes = await gmail.users.messages.get({ userId: 'me', id: msgId, format: 'full' });

  const bodyData = extractBody(msgRes.data.payload);
  const decoded = Buffer.from(bodyData.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  const match = decoded.match(regex);
  return match ? match[1] : null;
}

module.exports = { getLatestOtp };