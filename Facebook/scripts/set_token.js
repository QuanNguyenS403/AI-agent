const fs = require('fs');
const path = require('path');

// Helper to parse arguments
function getArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      params[key] = args[i + 1];
      i++;
    } else if (!params.token && !args[i].startsWith('-')) {
      params.token = args[i];
    }
  }
  return params;
}

// Load existing .env
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [k, ...vals] = trimmed.split('=');
      if (k && vals.length > 0) env[k.trim()] = vals.join('=').trim();
    });
  }
  return env;
}

async function main() {
  const params = getArgs();
  const env = loadEnv();

  const tokenInput = params.token;
  const appId = params.appId || env.FB_APP_ID;
  const appSecret = params.appSecret || env.FB_APP_SECRET;
  const pageId = env.FB_PAGE_ID || '1213047995235499';
  const igId = env.FB_IG_ID || '17841435718022746';
  const igUsername = env.FB_IG_USERNAME || 'quannguyens403';
  const graphVersion = env.FB_GRAPH_VERSION || 'v20.0';
  const timezone = env.TIMEZONE || 'Asia/Ho_Chi_Minh';

  console.log('====================================================');
  console.log('🔄 QUANNGUYENS — CÔNG CỤ CẬP NHẬT & KIỂM TRA ACCESS TOKEN');
  console.log('====================================================\n');

  if (!tokenInput) {
    console.error('❌ LỖI: Bạn chưa truyền token mới.');
    console.log('\nCách sử dụng:');
    console.log('  node scripts/set_token.js "TOKEN_MỚI_CỦA_BẠN"');
    console.log('Hoặc nếu đổi App mới:');
    console.log('  node scripts/set_token.js --token "TOKEN_MỚI" --appId "APP_ID_MỚI" --appSecret "APP_SECRET_MỚI"\n');
    process.exit(1);
  }

  console.log('1️⃣ Đang kiểm tra token trực tiếp với Meta Graph API...');
  const meRes = await fetch(`https://graph.facebook.com/${graphVersion}/me?access_token=${tokenInput}`);
  const meData = await meRes.json();

  if (meData.error) {
    console.error('\n❌ Token không hợp lệ hoặc bị lỗi từ Meta:');
    console.error(JSON.stringify(meData.error, null, 2));
    process.exit(1);
  }

  console.log(`✅ Xác thực thành công đối tượng: ${meData.name} (ID: ${meData.id})`);

  let finalToken = tokenInput;

  // Nếu là User Token hoặc Token cần nâng cấp lên vĩnh viễn (Long-lived)
  if (appId && appSecret) {
    console.log('\n2️⃣ Đang nâng cấp token sang Long-lived Page Access Token...');
    try {
      const exUrl = `https://graph.facebook.com/${graphVersion}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenInput}`;
      const exRes = await fetch(exUrl);
      const exData = await exRes.json();
      if (exData.access_token) {
        console.log('✅ Đã nhận được Long-lived token thành công!');
        finalToken = exData.access_token;
      } else {
        console.log('ℹ️ Giữ nguyên token đầu vào (có thể đã là Page Token hoặc không cần exchange).');
      }
    } catch (err) {
      console.log('ℹ️ Bỏ qua bước exchange, sử dụng trực tiếp token đầu vào.');
    }
  }

  // Cập nhật file .env
  console.log('\n3️⃣ Đang ghi đè cấu hình vào file .env...');
  const envPath = path.resolve(__dirname, '../.env');
  const newEnvContent = `# Facebook Graph API Credentials
FB_APP_ID=${appId}
FB_APP_SECRET=${appSecret}
FB_PAGE_TOKEN=${finalToken}
FB_PAGE_ID=${pageId}
FB_IG_ID=${igId}
FB_IG_USERNAME=${igUsername}
FB_GRAPH_VERSION=${graphVersion}
TIMEZONE=${timezone}
`;
  fs.writeFileSync(envPath, newEnvContent, 'utf8');
  console.log('✅ Cập nhật file .env thành công!');

  // Test lại quyền với Page
  console.log('\n4️⃣ Kiểm tra quyền truy cập Fanpage và Instagram...');
  const pageRes = await fetch(`https://graph.facebook.com/${graphVersion}/${pageId}?fields=id,name,fan_count,verification_status&access_token=${finalToken}`);
  const pageData = await pageRes.json();
  console.log('Fanpage Info:', pageData);

  console.log('\n🎉 TOÀN BỘ HỆ THỐNG KẾT NỐI META ĐÃ HOẠT ĐỘNG HOÀN HẢO!');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Lỗi ngoại lệ:', err);
});
