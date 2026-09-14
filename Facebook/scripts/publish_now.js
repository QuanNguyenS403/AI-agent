const path = require('path');
const fb = require('../lib/facebook-api');

async function publishNow() {
  const caption = process.argv[2] || `Khi cánh cửa khép lại sau một ngày dài với những bộn bề của thế giới bên ngoài, bạn thường chọn trở về với điều gì?

Tại QuanNguyenS, niềm tin giản dị là sự chỉn chu và thanh lịch không nên dừng lại nơi ngưỡng cửa. 10PM Pijama ra đời từ một định nghĩa về lối sống: European Casual Luxury — phong cách pijama chuẩn mực châu Âu, nơi bạn được buông bỏ mọi gò bó nhưng vẫn trọn vẹn vẻ thư thái và yêu kiều ngay tại nhà.

"Giấc ngủ đẹp cũng là một cách yêu thương chính mình."

Từng thớ sợi êm ái, từng đường viền tương phản được hoàn thiện với sự nâng niu dành riêng cho làn da của bạn. Chào mừng bạn bước vào không gian nghỉ ngơi có phong vị cùng QuanNguyenS.

✨ Thiết kế The Stillwater Set (Caro Navy) — Khởi đầu cho những buổi tối tĩnh tại.

#QuanNguyenS #10PMPijama #DressedForLifeEvenAtHome #PijamaChauAu #SlowLiving #QuietLuxury`;

  const imagePath = process.argv[3] || 'd:/Pijima/pijama/public/images/classic-set-navy-thumb-1.jpg';

  // 🔒 GATE KIỂM TRA CHẶN ẢNH FLAT-LAY / NỀN TRẮNG (ANTI-SPY PROTECTION)
  const filename = path.basename(imagePath).toLowerCase();
  if (filename.includes('-main.') || filename.includes('flat-lay') || filename.includes('white-bg')) {
    console.error('❌ LỖI NGHIÊM TRỌNG BỊ CHẶN (VISUAL POLICY VIOLATION):');
    console.error(`Tệp ảnh "${filename}" là ảnh sản phẩm chụp phẳng (flat-lay) / nền trắng không có người mẫu!`);
    console.error('Quy chuẩn thương hiệu QuanNguyenS bắt buộc 100% ảnh xuất bản phải là ẢNH NGƯỜI MẪU ON-SET (Model-in-Action) để chống đối thủ spy sản phẩm.');
    console.error('Vui lòng chọn các ảnh người mẫu có hậu tố -thumb-1.jpg, -thumb-2.jpg, -thumb-3.jpg trong config/model_assets_registry.json.');
    process.exit(1);
  }

  console.log('🚀 Đang chuẩn bị xuất bản bài viết lên Fanpage Quannguyens...');
  console.log(`👗 Đính kèm ảnh người mẫu on-set: ${path.basename(imagePath)} (Đã vượt qua kiểm duyệt Visual Anti-Spy)`);
  
  const res = await fb.publishPhotoNow({
    caption,
    imagePath
  });

  console.log('✅ ĐÃ ĐĂNG BÀI THÀNH CÔNG LÊN FACEBOOK!');
  console.log(`Post/Photo ID: ${res.id}`);
}

publishNow().catch(console.error);
