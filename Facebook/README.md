# Hệ Thống Vận Hành Tự Động Facebook & Instagram QuanNguyenS

Hệ thống quản lý, sản xuất nội dung và tự động hóa xuất bản đa kênh (Omnichannel) cho:
- **Facebook Fanpage:** `Quannguyens` (Page ID: `1213047995235499`)
- **Instagram Business:** `@quannguyens403` (ID: `17841435718022746`)

---

## 1. Năng Lực Tự Động Hóa Đa Nền Tảng (Facebook & Instagram)

Hệ thống hỗ trợ toàn diện các định dạng xuất bản:
1. **Facebook Page:**
   - Bài viết văn bản / Link (`publishPostNow`, `schedulePost`)
   - Ảnh đơn on-set người mẫu (`publishPhotoNow`, `schedulePhoto`)
   - Video chuẩn & Facebook Reels 9:16 (`publishVideoNow`, `scheduleVideo`)
   - Lên lịch tự động 28 ngày trên máy chủ Meta (tắt máy vẫn tự đăng).
2. **Instagram Business (@quannguyens403):**
   - Đăng ảnh đơn on-set (`createInstagramMediaContainer` + `publishInstagramMedia`)
   - Đăng Album nhiều ảnh Carousel (`createInstagramCarouselContainer`)
   - Đăng video ngắn Instagram Reels 9:16 (`publishInstagramReel` kèm tự động render)
   - Đọc chỉ số tương tác, lượt tiếp cận & quản lý bình luận khách hàng.

---

## 2. Cấu Trúc Dự Án

```
d:/Facebook/
├── .env                         # Khóa bí mật API & Token dài hạn (đã bảo mật)
├── package.json                 # Các lệnh thực thi nhanh
├── config/
│   ├── brand_profile.yaml       # Định vị thương hiệu Pyjama QuanNguyenS, tone giọng, chủ đề
│   ├── offer_catalog.json       # Danh mục sản phẩm, bảng giá và ưu đãi
│   ├── policy.yaml              # Tiêu chuẩn kiểm duyệt nội dung & chính sách Meta
│   └── brand.json               # Bộ quy chuẩn màu sắc, hình ảnh
├── lib/
│   ├── facebook-api.js          # Module giao tiếp Meta Graph API
│   └── content-planner.js       # Kế hoạch nội dung 30 ngày (30 bài viết chuẩn SEO/Branding)
├── scripts/
│   ├── test_token.js            # Kiểm tra trạng thái kết nối & thời hạn Token
│   ├── schedule_month.js        # Lệnh nạp 30 bài viết lên lịch Meta cho 30 ngày
│   ├── check_progress.js        # Báo cáo tiến độ, năng suất và số liệu tương tác
│   └── publish_now.js           # Đăng ngay 1 bài viết tức thì
├── data/
│   └── scheduled_calendar.json  # Nhật ký các bài đã lên lịch (ID bài, thời gian)
└── reports/
    └── report_*.json            # Các bản lưu snapshot tiến độ định kỳ
```

---

## 3. Các Lệnh Thao Tác Nhanh

Mở terminal tại thư mục `d:\Facebook` và chạy:

### A. Kiểm tra kết nối & Token:
```bash
npm run health
```

### B. Đồng bộ dữ liệu sản phẩm mới nhất từ website:
```bash
npm run sync-products
```
*Tự động quét mã nguồn website (`src/data/products.js`), phát hiện các sản phẩm mới thêm hoặc sản phẩm bị gỡ bỏ để tự động cập nhật danh mục đăng bài.*

### C. Kích hoạt lên lịch tự động cho tháng (khi có lệnh bắt đầu):
```bash
npm run start-publishing
```
*Lệnh này sẽ nạp toàn bộ 28 bài viết chuẩn nhận diện lên máy chủ Facebook và tự động đăng mỗi tối lúc 19:30.*

### C. Tạm dừng toàn bộ đăng bài (xóa hàng đợi):
```bash
npm run pause-publishing
```
*Hủy toàn bộ các bài viết đang chờ xuất bản trên máy chủ Facebook.*

### C. Kiểm tra tiến độ & Năng suất (Sau 1 tháng hoặc bất cứ lúc nào):
```bash
npm run check-progress
```
*Hiển thị bảng báo cáo: Tổng số bài đã đăng, lượt tương tác (Like/Tim, Bình luận, Chia sẻ), và danh sách các bài đang chờ đăng.*

### D. Đăng ngay 1 bài viết tức thì:
```bash
npm run post-now
```
Hoặc đăng nội dung tùy ý:
```bash
node scripts/publish_now.js "Nội dung bài viết bạn muốn đăng..."
```
