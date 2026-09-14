const fs = require('fs');
const path = require('path');

// Helper to parse .env without external deps
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

loadEnv();

const appId = process.env.FB_APP_ID;
const appSecret = process.env.FB_APP_SECRET;
const pageToken = process.env.FB_PAGE_TOKEN;
const graphVersion = process.env.FB_GRAPH_VERSION || 'v20.0';

async function checkToken() {
  const debugUrl = `https://graph.facebook.com/debug_token?input_token=${pageToken}&access_token=${appId}|${appSecret}`;
  const res = await fetch(debugUrl);
  const data = await res.json();
  console.log('=== TOKEN HEALTH CHECK ===');
  console.log(JSON.stringify(data, null, 2));

  const pageRes = await fetch(`https://graph.facebook.com/${graphVersion}/me?access_token=${pageToken}`);
  const pageData = await pageRes.json();
  console.log('=== PAGE METADATA ===');
  console.log(JSON.stringify(pageData, null, 2));
}

checkToken().catch(console.error);
