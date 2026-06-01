/**
 * One-time script to obtain a Gmail OAuth 2.0 refresh token.
 *
 * Prerequisites:
 *   1. A Google Cloud project with the Gmail API enabled.
 *   2. An OAuth 2.0 Client ID (Desktop application type).
 *   3. Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your .env file.
 *
 * Usage:
 *   node get-gmail-refresh-token.js
 *
 * The script will:
 *   1. Print a URL — open it in your browser.
 *   2. Sign in with the Google account whose Gmail you want to read.
 *   3. Grant permission (you'll see a warning since the app is unverified — click "Advanced" → "Go to...").
 *   4. You'll be redirected to a localhost page that may fail to load — copy the "code=" parameter from the URL.
 *   5. Paste the code back into this terminal.
 *   6. The script exchanges the code for a refresh token and prints it.
 *   7. Copy the refresh token into your .env file as GMAIL_REFRESH_TOKEN.
 */

require('dotenv').config();
const { google } = require('googleapis');
const http = require('http');
const url = require('url');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your .env file.');
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost:3000/oauth2callback' // Must match the redirect URI in Google Cloud Console
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// ── Method A: Automatic via local HTTP server ──────────────────────────

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const parsed = url.parse(req.url, true);

      if (parsed.pathname === '/oauth2callback') {
        const code = parsed.query.code;

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>Authorization successful!</h1><p>You can close this window and return to the terminal.</p>');

          try {
            const { tokens } = await oAuth2Client.getToken(code);
            server.close();
            resolve(tokens);
          } catch (err) {
            server.close();
            reject(err);
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing authorization code.');
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(3000, () => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',   // ← REQUIRED to get a refresh token
        prompt: 'consent',        // ← Forces re-consent, ensures refresh token is returned
        scope: SCOPES,
      });

      console.log('\n🔗 Open this URL in your browser:\n');
      console.log(authUrl);
      console.log('\n⏳ Waiting for authorization...\n');
    });

    server.on('error', reject);
  });
}

// ── Method B: Manual copy-paste fallback ────────────────────────────────

async function manualFlow() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  console.log('\n🔗 Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n📋 After granting access, you will be redirected to a page that may not load.');
  console.log('     Copy the FULL URL from the address bar and paste it below:              \n');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const fullUrl = await new Promise((resolve) => {
    readline.question('Paste the redirect URL here: ', (answer) => {
      readline.close();
      resolve(answer);
    });
  });

  const parsed = url.parse(fullUrl, true);
  const code = parsed.query.code;

  if (!code) {
    throw new Error('No "code" parameter found in the URL. Make sure you copied the full redirect URL.');
  }

  const { tokens } = await oAuth2Client.getToken(code);

  return tokens;
}

// ── Main ────────────────────────────────────────────────────────────────

(async () => {
  try {
    let tokens;

    // Try automatic flow first; fall back to manual on failure
    try {
      tokens = await startServer();
    } catch {
      console.log('⚠️  Automatic flow failed, switching to manual copy-paste mode...');
      tokens = await manualFlow();
    }

    console.log('\n✅ Success! Here are your tokens:\n');
    console.log('────────────────────────────────────────────────────────────');
    console.log(`Refresh Token:  ${tokens.refresh_token}`);
    console.log(`Access Token:   ${tokens.access_token?.slice(0, 30)}...`);
    console.log(`Expiry Date:    ${tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'N/A'}`);
    console.log('────────────────────────────────────────────────────────────');
    console.log('\n📝 Copy the Refresh Token above and paste it into your .env file:');
    console.log('     GMAIL_REFRESH_TOKEN=<your-refresh-token>      \n');

    if (!tokens.refresh_token) {
      console.warn('⚠️  WARNING: No refresh token was returned.');
      console.warn('    This usually means you already authorized this app before.');
      console.warn('    Go to https://myaccount.google.com/permissions, remove the app, and run this script again.\n');
    }

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);

  }
})();