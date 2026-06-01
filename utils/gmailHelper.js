require('dotenv').config();
const { google } = require('googleapis');

async function getGmailClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

async function getLatestOtp(query, pattern, retries = 5, delayMs = 3000) {
  console.log('\n📬 Starting OTP fetch from Gmail...');
  console.log(`  Query   : "${query}"`);
  console.log(`  Pattern : ${pattern}`);
  console.log(`  Retries : ${retries} × ${delayMs / 1000}s delay\n`);

  const gmail = await getGmailClient();

  // Record start time to only pick up NEW emails
  const startTime = Date.now();

  for (let i = 1; i <= retries; i++) {
    console.log(`🔄 Attempt ${i}/${retries} — searching Gmail...`);

    try {
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 1,
      });

      const messages = res.data.messages;
      console.log(`  📩 Messages found: ${messages ? messages.length : 0}`);

      if (messages && messages.length > 0) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: messages[0].id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'Date'],
        });

        const headers = msg.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value;
        const from    = headers.find(h => h.name === 'From')?.value;
        const date    = headers.find(h => h.name === 'Date')?.value;

        console.log(`  📌 Subject : ${subject}`);
        console.log(`  👤 From    : ${from}`);
        console.log(`  🕐 Date    : ${date}`);

        // Check email is recent (within last 5 minutes)
        const emailTime = new Date(date).getTime();
        const ageSeconds = (Date.now() - emailTime) / 1000;
        console.log(`  ⏱️  Email age: ${Math.round(ageSeconds)}s`);

        if (ageSeconds > 300) {
          console.warn(`  ⚠️  Email is too old (${Math.round(ageSeconds)}s), waiting for newer one...`);
        } else {
          // ✅ Extract OTP from subject line
          const match = subject?.match(pattern);
          if (match) {
            console.log(`\n✅ OTP found in subject: ${match[0]}\n`);
            return match[0];
          } else {
            console.warn(`  ⚠️  Pattern did not match subject: "${subject}"`);
          }
        }
      } else {
        console.log('  📭 No matching emails found yet');
      }

    } catch (err) {
      console.error(`  ❌ Error on attempt ${i}:`, err.message);
    }

    if (i < retries) {
      console.log(`  ⏳ Waiting ${delayMs / 1000}s before next attempt...\n`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  throw new Error(`❌ OTP not found after ${retries} attempts`);
}

module.exports = { getLatestOtp };