# 14 · Tích hợp pijama read-only

[Hướng dẫn tích hợp](../../integrations/pijama/README.md), [source manifest](../../integrations/pijama/source-manifest.json), [API contract](../../integrations/pijama/api-contract.json) và [snapshot](../../integrations/pijama/product-snapshot.json) là cửa vào cho agent. Không copy src/server thành repo thứ hai, không dynamic import JavaScript sản phẩm từ remote và không dùng credential commerce để marketing.

## Nguồn và thư mục

Pin 828409af7a26a2a5f4b4420789fc753588c9e1dc. README mô tả ứng dụng; package engines >=22, type=module; src chứa React pages/components/data/store; server/index.js định tuyến Express; server/apiHandler.js xử lý order; pricing/stock validators kiểm tra server; paymentWebhook.js xử lý payment evidence; orderPersistence.js lưu disk; Google Sheets/email là integrations.

Đã truy xuất 129 file text trọng tâm (README/package/PROTECTED/env mẫu, src/server và tests) để kiểm tra tĩnh theo nhóm. Manifest liệt kê SHA từng file; "retrieved" không đồng nghĩa audit mọi dòng hay chạy tests. Ảnh/binary và PDF kỹ thuật không được xác minh nội dung trong lượt này. Tài liệu PDF được PROTECTED-DATA nhắc không xuất hiện trong tree đã lấy; cần Owner cung cấp, không tự tạo chứng chỉ/tài liệu xưởng.

## Protected boundary

Không sửa products.js, email templates/config, pricingValidator.js, stockValidator.js, .env.example hoặc thông số kỹ thuật được protected policy liệt kê. Không format/refactor chúng theo yêu cầu chung. Một sửa đổi cụ thể cần Owner nêu exact file/field/scope.

Giá canonical server quyết định amount; marketing không tính lại coupon/ship để ghi vào order. Không tạo duplicate order, toggle PAID, gọi confirm/refund/admin/sync-batch hoặc gửi email trong quá trình sync dữ liệu.

## State và bất đồng cần xử lý

Frontend BANK_TRANSFER khởi tạo PENDING_VERIFICATION; server/apiHandler.js ghi AWAITING_PAYMENT cho payment status. CUSTOMER_CLAIMED_PAID không phải PAID. AdminOrders có đường toggle/default payment status; vì vậy nhãn PAID không thay evidence provider + bank reconciliation.

GET /api/orders/status và các endpoint lookup/tracking/events cần review scope/auth/PII trên deployment trước cấp agent truy cập. /api/payment/generate-qr nhận amount/bank fields từ client trong source; cần review binding với validated order. Đây là finding từ code, không khẳng định exploit được trên production.

## Adapter target

Thiết kế read-only bằng approved API/export đã pseudonymize. Contract tách catalog, order summary, payment evidence, refund và source revision. Provider/customer/order raw payload nằm trong private store. Agent chỉ cần aggregate và opaque IDs. Unknown payment/currency/source -> quarantine, không normalize về successful.

Dedup theo upstream event ID, record both occurred/received times, immutable corrections. Event replay/out-of-order không được tăng revenue hai lần. Attribution evidence cần server-bound capture và consent; browser-provided utm không đủ một mình.

## Freshness và drift

Snapshot chỉ đủ bootstrap. Thay commit nguồn tạo drift report gồm paths/SHA/field changes; protected mismatch -> Decision Inbox. Không tự cập nhật source pin rồi publish bằng approval cũ. Công bố giá/stock/lead time cần live freshness policy do Owner chốt.

Test adapter phải dùng fixtures synthetic. Chưa có network commerce adapter hoặc quyền đọc production trong release này. Mọi claim "integration hoạt động" cần staging/live evidence riêng.
