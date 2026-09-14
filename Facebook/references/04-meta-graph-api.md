# 04 · Meta API integration contract

## Version và nguồn

Ngày kiểm tra 2026-09-14, [changelog Graph API](https://developers.facebook.com/docs/graph-api/changelog/) liệt kê v25.0. Pin ở config/runtime.json; không hard-code version trong nhiều script. Thông báo một version sắp ra không chứng minh version ấy đã available.

Mỗi lần triển khai/nâng cấp cần kiểm tra docs current, support window, out-of-cycle changes và metrics permissions; cập nhật source date, contract tests và migration issue. Chưa có credential/app permission validation trong audit này.

## Facebook và Instagram

Facebook Page không phải personal profile. Instagram Professional có login modes/permission names và account relationships riêng. Chọn một mode theo [Instagram Platform](https://developers.facebook.com/docs/instagram-platform/) rồi lập capability matrix theo account/app/media type; không trộn token hay giả định Page token có mọi quyền IG.

[Instagram publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) hiện mô tả 100 API posts/rolling 24 giờ; đừng dùng số cũ từ blog năm 2023 làm quota hiện tại. Đó là giới hạn nền tảng, không mục tiêu cadence. Kiểm tra live usage/limits khi triển khai.

## Future transport requirements

Page feed/photo/Reels và Instagram media container→status→publish có lifecycle khác nhau; không dựng endpoint generic "publish mọi thứ". Native scheduling chỉ dùng cho endpoint hỗ trợ. Capability chưa test = disabled.

Adapter chỉ gọi origin/path allowlist; không nhận absolute URL từ WO. Credential từ secret manager, tối thiểu quyền, tách dev/staging/prod; không log headers/query/raw provider payload. Giới hạn redirects/response size/timeouts. Không thử credential từ Git.

Webhook: xác thực raw bytes với signature theo sản phẩm, verify challenge đúng config, timing-safe compare, replay/dedup store, size limits và queue ACK an toàn. Không dùng event timestamp thay validation chữ ký.

401/403/OAuth invalid → stop; 429 → bounded backoff theo provider signal. Timeout mutation → reconcile, không POST lại mù. Provider ID/accepted chưa có nghĩa final publication verified. Lưu correlation/provider object và kiểm tra target/content/visibility/status.

## Maturity

FacebookAPI là hard-deny class, không có fetch/_request thật. Đây là containment có kiểm thử, không SDK Meta hoàn chỉnh. Không gỡ throw chỉ để demo live; phải triển khai signer/WO/durable idempotency và review M2 trước.
