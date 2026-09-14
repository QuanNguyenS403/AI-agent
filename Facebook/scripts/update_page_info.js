const fs = require('fs');
const path = require('path');
const fb = require('../lib/facebook-api');

async function updatePage() {
  console.log('====================================================');
  console.log('🎨 CẬP NHẬT THÔNG TIN NHẬN DIỆN THƯƠNG HIỆU CHO FANPAGE');
  console.log('====================================================\n');

  // 1. Update Profile Picture / Logo
  const logoPath = 'd:/Pijima/pijama/public/images/logo.jpg';
  if (fs.existsSync(logoPath)) {
    console.log('🖼️ 1. Đang cập nhật Avatar/Logo chính thức từ:', logoPath);
    try {
      const form = new FormData();
      const fileBuffer = fs.readFileSync(logoPath);
      form.append('source', new Blob([fileBuffer], { type: 'image/jpeg' }), 'logo.jpg');
      form.append('access_token', fb.pageToken);

      const res = await fetch(`${fb.baseUrl}/${fb.pageId}/picture`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      console.log('   ✔️ Kết quả cập nhật Avatar/Logo:', data);
    } catch (err) {
      console.error('   ❌ Lỗi cập nhật Avatar/Logo:', err.message);
    }
  }

  // 2. Update Page Fields (About, Description, Website, Phone, Email, Address)
  console.log('\n📝 2. Đang cập nhật thông tin giới thiệu & liên hệ...');
  
  const fieldsToUpdate = [
    { field: 'about', value: 'QuanNguyenS — 10PM Pijama | European Casual Luxury. Dressed for Life. Even at Home.' },
    { field: 'description', value: 'QuanNguyenS định nghĩa lại trang phục nghỉ ngơi qua phong cách European Casual Luxury — pijama chuẩn mực châu Âu, mềm mại khi ngủ, thanh lịch ra phố. "Giấc ngủ đẹp cũng là một cách yêu thương chính mình." Hotline: 0981 753 082.' },
    { field: 'bio', value: 'Dressed for Life. Even at Home. 10PM Pijama chuẩn phong cách châu Âu.' },
    { field: 'website', value: 'https://github.com/QuanNguyenS403/pijama' },
    { field: 'phone', value: '+84981753082' },
    { field: 'emails', value: JSON.stringify(['ducquan16102006@gmail.com']) }
  ];

  for (const item of fieldsToUpdate) {
    try {
      const params = new URLSearchParams();
      params.append(item.field, item.value);
      params.append('access_token', fb.pageToken);

      const res = await fetch(`${fb.baseUrl}/${fb.pageId}`, {
        method: 'POST',
        body: params
      });
      const data = await res.json();
      if (data.success) {
        console.log(`   ✔️ Đã cập nhật [${item.field}]: thành công!`);
      } else {
        console.log(`   ℹ️ [${item.field}]:`, data.error ? data.error.message : data);
      }
    } catch (e) {
      console.log(`   ⚠️ [${item.field}] không thể cập nhật qua API:`, e.message);
    }
  }

  // 3. Upload & Set Cover Photo
  const coverPath = 'd:/Pijima/pijama/public/images/classic-set-brown-main.jpg';
  if (fs.existsSync(coverPath)) {
    console.log('\n🖼️ 3. Đang tải ảnh bìa (Cover Photo) đại diện BST Thu Đông 2026...');
    try {
      const form = new FormData();
      const fileBuffer = fs.readFileSync(coverPath);
      form.append('source', new Blob([fileBuffer], { type: 'image/jpeg' }), 'cover.jpg');
      form.append('caption', 'QuanNguyenS — BST Thu Đông 2026 · European Casual Luxury');
      form.append('access_token', fb.pageToken);

      const photoRes = await fetch(`${fb.baseUrl}/${fb.pageId}/photos`, {
        method: 'POST',
        body: form
      });
      const photoData = await photoRes.json();
      console.log('   ✔️ Đã tải ảnh lên Page, ID:', photoData.id);

      if (photoData.id) {
        // Set as page cover
        const coverParams = new URLSearchParams({
          cover: photoData.id,
          access_token: fb.pageToken
        });
        const setCoverRes = await fetch(`${fb.baseUrl}/${fb.pageId}`, {
          method: 'POST',
          body: coverParams
        });
        const setCoverData = await setCoverRes.json();
        console.log('   ✔️ Kết quả đặt làm ảnh bìa (Cover):', setCoverData);
      }
    } catch (err) {
      console.log('   ℹ️ Lưu ý về ảnh bìa:', err.message);
    }
  }

  console.log('\n====================================================');
  console.log('🏁 HOÀN TẤT CẬP NHẬT HỒ SƠ NHẬN DIỆN FANPAGE!');
  console.log('====================================================');
}

updatePage().catch(console.error);
