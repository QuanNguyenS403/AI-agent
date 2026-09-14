# 11 · Kế hoạch vận hành QuanNguyenS / 10PM Pijama

## Baseline có bằng chứng và điều chưa chốt

Repo nguồn mô tả brand pijama/homewear với thẩm mỹ European Casual Luxury và ba SKU. Đây là dữ liệu code pin ngày 2026-09-14, không chứng nhận tình trạng sản phẩm/thương hiệu ngoài đời.

| SKU | Tên ở nguồn | Giá VND ở source | Size | Preorder ở source |
|---|---|---:|---|---|
| the-classic-set | THE DAYBREAK SET | 390000 | S/M | Bật, 7–10 ngày làm việc |
| the-cafe-look | THE STILLWATER SET | 550000 | M/L | Không thấy cấu hình preorder |
| the-evening-edit | THE HEARTH SET | 750000 | S/M | Bật, 7–10 ngày làm việc |

Giá/size là observed snapshot không giấy phép publication. Không lấy stock khởi tạo làm scarcity. Snapshot không sao chép review, tên khách, bank details hoặc claim chứng nhận thành approved truth. [Decision Inbox](../../integrations/pijama/decision-inbox.json) cần Owner xử lý thành phần vải/GSM/chứng chỉ, policy đổi size, khuyến mãi legacy, rights/UGC và attribution.

## 0–30 ngày: dựng nền tin cậy

Đây là thứ tự công việc đề xuất, không lịch tự động đang chạy và không cam kết ngày launch. M0 containment, M1 truth/policy và M2 workflow phải đạt acceptance trước live.

Đầu ra: source manifest; các trường mâu thuẫn có decision; Owner xác nhận định vị/khách hàng/mức giá/policy có thể công bố; rights/evidence registry; 3–5 draft/tuần trong shadow; test không phát hành khi thiếu approval; checklist checkout/payment để commerce owner đánh giá.

Tập trung content fit/design/preorder FAQ đã xác minh. Không dùng claim "ngủ ngon", "an toàn mọi làn da", "hấp thụ gấp..." hoặc testimonial từ sample data để tăng chuyển đổi. Có thể viết proposal nhưng phải gắn BLOCKED claim.

## 31–60 ngày: supervised organic có điều kiện

Chỉ bắt đầu nếu M2 production publisher được review riêng, secret rotation, truth/rights, consent và commerce readiness đã pass. Nếu chưa đạt, tiếp tục shadow và khắc phục blocker, không chạy kịp lịch bằng cách bỏ gate.

Đầu ra mục tiêu: vài nội dung đã duyệt mỗi tuần theo capacity; community/support reply draft với escalation; funnel/events/UTM thực; đối soát order/payment/refund/COGS; dashboard đọc data đúng; experiment preregistration.

Mỗi tuần chọn tối đa một nhóm biến sáng tạo để học. Thu feedback về fit/preorder/checkout thay vì chỉ xem likes. Không quảng bá giao nhanh cho SKU preorder. Không mở affiliate trả phí hoặc CRM marketing khi terms/consent chưa có.

## 61–90 ngày: mở rộng năng lực organic, đánh giá vốn

Tối ưu workflow đã đạt SLO/eval, không tự tăng quyền cho mọi agent. Finance thực hiện period close và bảo thủ về refund lag. Analytics phân loại organic/unknown rõ, Product cập nhật freshness/rights, Governance review incident/grants.

Nếu và chỉ nếu G0–G6 pass theo thresholds Owner đã duyệt: tạo micro-test paid proposal với envelope hữu hạn; vẫn cần code/authorization riêng. Nếu FAIL, kết quả hợp lệ là tiếp tục organic; mốc 90 ngày không tạo quyền Ads.

## Decision Owner cần

Tên/định vị và guideline hình; chủ sở hữu Page/IG/website; source truth được ký theo SKU; chính sách giá/offer/service hiện hành; quyền model/ảnh/nhạc/UGC; consent/retention; người ký độc lập; số vốn/reserve/chi phí tối đa; các threshold để đo gate; ngưỡng support/fulfillment.

Không đưa secret vào Decision Inbox. Decision cần file/field/scope chính xác, nhất là protected commerce. Việc xác nhận giá một SKU không cho phép sửa toàn catalog.

## Điều kiện thành công

Có process tạo nội dung hữu ích và trung thực, giảm phản đối/return do hiểu sai, khách mua và thanh toán được xác minh, chi phí được ghi đầy đủ, luật/quyền không bị bỏ qua. Outcome có thể là phát hiện chưa nên chạy Ads. Không đặt mục tiêu doanh thu/follower số cụ thể khi chưa có baseline, capacity và ngân sách được duyệt.
