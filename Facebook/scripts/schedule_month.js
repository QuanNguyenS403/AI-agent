const fs = require('fs');
const path = require('path');
const fb = require('../lib/facebook-api');
const { posts30Days } = require('../lib/content-planner');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scheduleMonth() {
  console.log('====================================================');
  console.log('🚀 BẮT ĐẦU LÊN LỊCH 30 NGÀY TỰ ĐỘNG CHO QUANNGUYENS');
  console.log('====================================================\n');

  // Step 1: Health check
  const health = await fb.healthCheck();
  if (!health.tokenValid) {
    console.error('❌ Token không hợp lệ hoặc đã hết hạn!');
    process.exit(1);
  }
  console.log(`✅ Fanpage: ${health.pageName} (ID: ${health.pageId})`);
  console.log(`✅ Quyền hạn: ${health.tokenScopes.join(', ')}`);
  console.log(`✅ Token hạn dùng: ${health.expiresAt === 0 ? 'VÔ THỜI HẠN (Never Expires)' : new Date(health.expiresAt * 1000).toLocaleString('vi-VN')}\n`);

  // Step 1.5: Auto-sync products from website database
  try {
    const { syncProducts } = await import('./sync_products.mjs');
    await syncProducts();
  } catch (err) {
    console.warn('⚠️ Cảnh báo: Không thể tự động đồng bộ từ website, sử dụng catalog hiện tại:', err.message);
  }

  // Step 2: Check current scheduled posts
  const existingScheduled = await fb.getScheduledPosts();
  console.log(`ℹ️ Hiện tại đang có ${existingScheduled.length} bài viết chờ đăng trên Page.\n`);

  // Ensure data directory exists
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Calculate schedule times starting tomorrow at 19:30 VN Time (UTC+7 -> 12:30 UTC)
  const now = new Date();
  const results = [];

  console.log('📅 Tiến hành lên lịch chi tiết cho từng ngày:');
  console.log('----------------------------------------------------');

  for (let i = 0; i < posts30Days.length; i++) {
    const post = posts30Days[i];
    const postDay = i + 1;

    // Calculate target date: tomorrow + i days at 19:30:00 (VN Time)
    // VN Time is UTC+7
    const targetDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + postDay,
      12, 30, 0 // 12:30 UTC = 19:30 ICT
    ));

    const scheduledTimestamp = Math.floor(targetDate.getTime() / 1000);
    const dateFormatted = targetDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const timeFormatted = '19:30';
    try {
      console.log(`⏳ [Ngày ${postDay}/${posts30Days.length}] (${dateFormatted} ${timeFormatted}) - [${post.pillar}] "${post.theme}"...`);
      const response = await fb.schedulePost({
        message: post.message,
        scheduledPublishTime: scheduledTimestamp
      });

      console.log(`   ✔️ ĐÃ LÊN LỊCH THÀNH CÔNG! Post ID: ${response.id}`);
      results.push({
        day: postDay,
        theme: post.theme,
        scheduledDate: dateFormatted,
        scheduledTime: timeFormatted,
        timestamp: scheduledTimestamp,
        postId: response.id,
        status: 'SCHEDULED'
      });

      // Avoid hitting Meta rate limit (wait 1.5s between posts)
      await sleep(1500);
    } catch (err) {
      console.error(`   ❌ Lỗi khi lên lịch ngày ${postDay}:`, err.message);
      results.push({
        day: postDay,
        theme: post.theme,
        scheduledDate: dateFormatted,
        scheduledTime: timeFormatted,
        timestamp: scheduledTimestamp,
        error: err.message,
        status: 'FAILED'
      });
    }
  }

  // Save log
  const logFile = path.resolve(dataDir, 'scheduled_calendar.json');
  fs.writeFileSync(logFile, JSON.stringify(results, null, 2), 'utf8');

  const successCount = results.filter(r => r.status === 'SCHEDULED').length;
  console.log('\n====================================================');
  console.log(`🎉 HOÀN THÀNH: Đã lên lịch thành công ${successCount}/${posts30Days.length} bài viết trên Facebook!`);
  console.log(`📁 File nhật ký: data/scheduled_calendar.json`);
  console.log('🌐 Facebook Meta sẽ tự động phát hành các bài viết này theo đúng ngày giờ định sẵn!');
  console.log('====================================================');
}

scheduleMonth().catch(console.error);
