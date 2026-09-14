const pipeline = require('../services/ai_pipeline');

async function test() {
  const sampleProduct = {
    name: 'THE DAYBREAK SET',
    subtitle: 'Pijama Phong Cách Châu Âu · Sọc Hồng Nắng Sớm',
    fabric: '165 GSM Cotton-Modal',
    price: 390000
  };

  const result = await pipeline.runFullProduction({
    product: sampleProduct,
    daySlot: 'Thứ 2 (19:30)'
  });

  console.log('\n📦 DỮ LIỆU ĐÓNG GÓI SẴN SÀNG CHO FACEBOOK & INSTAGRAM:');
  console.log('   - Sẵn sàng xuất bản:', result.ready_for_publish ? 'CÓ (YES)' : 'KHÔNG (NO)');
  console.log('   - Điểm Vision AI:', (result.qa_score * 100).toFixed(1) + '%');
  console.log('   - Tài sản ảnh:', result.image_asset);
  console.log('   - Tài sản video Reels:', result.video_asset);
  console.log('\n📝 Caption đã sinh:\n' + result.caption);
}

test().catch(console.error);
