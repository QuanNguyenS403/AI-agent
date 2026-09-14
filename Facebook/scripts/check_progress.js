const fs = require('fs');
const path = require('path');
const fb = require('../lib/facebook-api');

async function checkProgress() {
  console.log('====================================================');
  console.log('📊 BÁO CÁO TIẾN ĐỘ & NĂNG SUẤT VẬN HÀNH QUANNGUYENS');
  console.log('====================================================\n');

  // Step 1: Health check
  const health = await fb.healthCheck();
  console.log('1️⃣ THÔNG TIN HỆ THỐNG & KẾT NỐI');
  console.log(`   - Tên Fanpage:        ${health.pageName}`);
  console.log(`   - Page ID:            ${health.pageId}`);
  console.log(`   - Trạng thái Token:   ${health.tokenValid ? '✅ HỢP LỆ' : '❌ HẾT HẠN'}`);
  if (health.expiresAt === 0) {
    console.log(`   - Hạn dùng Token:     ♾️ VÔ THỜI HẠN (Never Expires - Vĩnh viễn)`);
  } else {
    const expiryDate = new Date(health.expiresAt * 1000);
    const daysRemaining = Math.max(0, Math.round((health.expiresAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
    console.log(`   - Hạn dùng Token:     ${expiryDate.toLocaleString('vi-VN')} (Còn ~${daysRemaining} ngày)`);
  }

  // Instagram Connection Status
  try {
    const igProfile = await fb.getInstagramProfile();
    console.log(`   - Tài khoản Instagram: @${igProfile.username} (ID: ${igProfile.id})`);
    console.log(`   - Trạng thái IG:      ✅ ĐÃ LIÊN KẾT (Followers: ${igProfile.followers_count} | Posts: ${igProfile.media_count})`);
  } catch (igErr) {
    console.log(`   - Tài khoản Instagram: ⚠️ Chưa liên kết (${igErr.message})`);
  }
  console.log('----------------------------------------------------\n');

  // Step 2: Published posts & metrics
  console.log('2️⃣ BÀI VIẾT ĐÃ ĐĂNG & HIỆU SUẤT TƯƠNG TÁC');
  const feed = await fb.getFeed(20);
  console.log(`   - Tổng số bài đăng gần đây thu thập: ${feed.length} bài`);

  let totalReactions = 0;
  let totalComments = 0;
  let totalShares = 0;

  feed.forEach((post, idx) => {
    const reactions = post.reactions?.summary?.total_count || 0;
    const comments = post.comments?.summary?.total_count || 0;
    const shares = post.shares?.count || 0;
    totalReactions += reactions;
    totalComments += comments;
    totalShares += shares;

    const snippet = (post.message || '[Hình ảnh/Video]').replace(/\n/g, ' ').slice(0, 60);
    const pubDate = new Date(post.created_time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    console.log(`   [${idx + 1}] (${pubDate}) | 👍 ${reactions} | 💬 ${comments} | 🔄 ${shares} | "${snippet}..."`);
  });

  console.log('\n   📈 TỔNG KẾT TƯƠNG TÁC:');
  console.log(`      + Tổng lượt thích/thả tim:  ${totalReactions}`);
  console.log(`      + Tổng bình luận khách hàng: ${totalComments}`);
  console.log(`      + Tổng lượt chia sẻ:         ${totalShares}`);
  console.log('----------------------------------------------------\n');

  // Step 3: Scheduled Queue (Posts waiting to publish)
  console.log('3️⃣ HÀNG ĐỢI BÀI VIẾT ĐANG CHỜ ĐĂNG TỰ ĐỘNG (SCHEDULED QUEUE)');
  const scheduled = await fb.getScheduledPosts();
  console.log(`   - Số lượng bài chờ đăng trên máy chủ Meta: ${scheduled.length} bài`);

  scheduled.sort((a, b) => a.scheduled_publish_time - b.scheduled_publish_time);

  scheduled.slice(0, 10).forEach((p, idx) => {
    const sDate = new Date(p.scheduled_publish_time * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const snippet = (p.message || '').replace(/\n/g, ' ').slice(0, 50);
    console.log(`   [${idx + 1}] Lên lịch lúc: ${sDate} | "${snippet}..."`);
  });

  if (scheduled.length > 10) {
    console.log(`   ... và còn ${scheduled.length - 10} bài viết khác tiếp nối.`);
  }

  console.log('----------------------------------------------------\n');

  // Save report to file
  const reportDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportData = {
    timestamp: new Date().toISOString(),
    pageName: health.pageName,
    pageId: health.pageId,
    tokenValid: health.tokenValid,
    tokenExpiresAt: health.expiresAt === 0 ? 'NEVER_EXPIRES' : new Date(health.expiresAt * 1000).toISOString(),
    daysRemaining: health.expiresAt === 0 ? 'INFINITY' : Math.max(0, Math.round((health.expiresAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24))),
    publishedCount: feed.length,
    totalReactions,
    totalComments,
    totalShares,
    scheduledCount: scheduled.length,
    scheduledPosts: scheduled.map(p => ({
      id: p.id,
      scheduledTime: new Date(p.scheduled_publish_time * 1000).toISOString(),
      snippet: (p.message || '').slice(0, 80)
    }))
  };

  const reportFile = path.resolve(reportDir, `report_${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2), 'utf8');

  console.log(`📁 Đã lưu file báo cáo chi tiết tại: reports/`);
  console.log('====================================================\n');
}

checkProgress().catch(console.error);
