const fs = require('fs');
const path = require('path');

const appId = '3341130182741925';
const appSecret = '39d833a2e9c1f1e53e146296d8fd84aa';
const rawToken = 'EAAvevX2wz6UBSU75iBnr7BvTDZBLQzJsXDxYByiB7l0AOoPSde0dYtZBDkQOzZBJVhH5ZBz1hKOOSigmKlZBFNekHrKfOQqOnswf6vgQfOeiLa7z8hlCzBffH6RvRShupsRJNVkMyZAZC9oWFNFlFEZCG275ART13lCXYlmKfCp6ipxh1Y3IDSnBSi9ym0GZBEv9PnVZA7WAAwNYly8KZCuTwiKiMSZBZAAtZAs0OPq19WZAS4ZD';
const pageId = '1213047995235499';

async function updateToken() {
  console.log('====================================================');
  console.log('🔑 BẮT ĐẦU CẬP NHẬT VÀ NÂNG CẤP ACCESS TOKEN MỚI');
  console.log('====================================================\n');

  // 1. Debug input token
  const debugUrl = `https://graph.facebook.com/debug_token?input_token=${rawToken}&access_token=${appId}|${appSecret}`;
  const debugRes = await fetch(debugUrl);
  const debugData = await debugRes.json();
  console.log('1️⃣ Thông tin token đầu vào:');
  console.log(JSON.stringify(debugData, null, 2));

  let finalToken = rawToken;

  // 2. Exchange token if it has expiration date
  if (debugData?.data?.expires_at > 0) {
    console.log('\n⏳ Token hiện tại có thời hạn ngắn, đang tiến hành nâng cấp sang Long-lived / Permanent token...');
    const exUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${rawToken}`;
    const exRes = await fetch(exUrl);
    const exData = await exRes.json();
    console.log('Kết quả exchange:', exData);
    if (exData.access_token) {
      finalToken = exData.access_token;
    }
  }

  // 3. Verify final token
  const verifyUrl = `https://graph.facebook.com/debug_token?input_token=${finalToken}&access_token=${appId}|${appSecret}`;
  const verifyRes = await fetch(verifyUrl);
  const verifyData = await verifyRes.json();
  console.log('\n2️⃣ Trạng thái token sau xử lý:');
  console.log(JSON.stringify(verifyData, null, 2));

  // 4. Update .env file
  const envPath = path.resolve(__dirname, '../.env');
  const envContent = `# Facebook Graph API Credentials
FB_APP_ID=${appId}
FB_APP_SECRET=${appSecret}
FB_PAGE_TOKEN=${finalToken}
FB_PAGE_ID=${pageId}
FB_GRAPH_VERSION=v20.0
TIMEZONE=Asia/Ho_Chi_Minh
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n✅ ĐÃ CẬP NHẬT FILE .env THÀNH CÔNG!');

  // 5. Test page info
  const meRes = await fetch(`https://graph.facebook.com/v20.0/me?access_token=${finalToken}`);
  const meData = await meRes.json();
  console.log('\n3️⃣ Xác thực Fanpage với token mới:');
  console.log(JSON.stringify(meData, null, 2));
  console.log('====================================================');
}

updateToken().catch(console.error);
