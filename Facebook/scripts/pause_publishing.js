const fb = require('../lib/facebook-api');

async function pausePublishing() {
  console.log('🛑 Đang tạm dừng toàn bộ hoạt động đăng bài trên Facebook...');
  const scheduled = await fb.getScheduledPosts(100);
  console.log(`Tìm thấy ${scheduled.length} bài viết trong hàng đợi.`);

  for (const post of scheduled) {
    await fetch(`${fb.baseUrl}/${post.id}?access_token=${fb.pageToken}`, { method: 'DELETE' });
    console.log(`Đã hủy lịch đăng bài: ${post.id}`);
  }

  console.log('✅ ĐÃ TẠM DỪNG THÀNH CÔNG: Toàn bộ hàng đợi đã được xóa sạch.');
  console.log('Hệ thống sẽ KHÔNG đăng bất cứ bài nào cho đến khi bạn chạy lệnh kích hoạt lại.');
}

pausePublishing().catch(console.error);
