# 00 · Audit nguồn và giới hạn kết luận

Audit ngày 2026-09-14. AI-agent baseline: 72e9c67ed4f62de697625e680771a139341e070a; pijama: 828409af7a26a2a5f4b4420789fc753588c9e1dc. Phạm vi: cây Git và mã/tài liệu text được truy xuất; không đăng nhập production, không thử token, không thanh toán hoặc xem dữ liệu khách hàng.

## Phát hiện có thể truy lại

| Mức | Bằng chứng nguồn | Ý nghĩa / xử lý |
|---|---|---|
| P0 | Facebook/scripts/inspect_new_token.js và update_new_token.js ở baseline | Có credential literal. Thay script bằng đường dừng an toàn; Owner revoke/rotate. Không in giá trị hoặc dùng lại |
| P0 | Facebook/services/ai_pipeline.js ở baseline | Sinh SUCCESS, QA PASS và đường dẫn media cố định mà không gọi engine. Không phải production evidence; thay bằng SHADOW/BLOCKED |
| P0 | Facebook/scripts/schedule_month.js và lib/facebook-api.js ở baseline | Có đường phát hành trực tiếp; chưa chứng minh gateway/QA không bị bỏ qua. Phiên bản bootstrap chặn toàn bộ transport |
| P1 | Facebook config và pijama/src/data/products.js | Claim vải/định lượng không đồng nhất. Mỗi SKU cần evidence riêng |
| P1 | pijama/src/data/pricing.js, policies.js, products.js | Giá legacy, ưu đãi và đổi size/trả hàng khác nhau. Chưa được quảng bá ưu đãi từ legacy |
| P1 | pijama/src/data/products.js | Stock là dữ liệu nguồn, có preorder và size khác nhau. Không dùng làm "chỉ còn X" |
| P1 | products.js/sampleReviews và reviews.js | Rating/verified text không chứng minh người mua thật và quyền dùng testimonial |
| P1 | checkoutConfig.js, adminOrdersHandler.js, paymentWebhook.js | Trạng thái payment có nhiều đường ghi. Cash cần provider/bank evidence và reconciliation; không suy diễn từ nhãn PAID |
| P1 | checkoutConfig.js và toàn bộ src/server text đã kiểm tra | Có đọc pijama_utm nhưng chưa thấy emitter/capture tương ứng trong phạm vi; chưa có attribution được xác minh |
| P1 | README/package.json của pijama | README nêu Node 18/20; package engines >=22. Dùng package để chuẩn bị môi trường, xin Owner cho sửa README commerce riêng |

## Không được suy ra

Không có bằng chứng test thương mại đã chạy trong audit này, không chứng nhận bảo mật hoặc pháp lý production. Không khẳng định credential còn hợp lệ, review chắc chắn giả, website live đã dùng tất cả component legacy, hoặc mọi API đều public. Phát hiện ở source là tín hiệu cần kiểm định deployment.

Không tìm thấy Company OS ở main baseline. Bộ tài liệu lần này là phiên bản được biên soạn từ yêu cầu và nguồn hiện có, không tuyên bố khôi phục nguyên văn commit cục bộ từng được nhắc ở hội thoại khác.

## Khắc phục trong phạm vi AI-agent

Bổ sung quy chế, config bootstrap, schema, toolkit offline và test; thay publisher/scheduler/credential helper có rủi ro; đánh dấu legacy; lưu manifest source có SHA. Không ghi đè pijama, không thay số liệu sản phẩm, không viết credential.

## Gate còn mở

Credential rotation; chủ sở hữu tài sản/kênh; claim và service policy; consent/retention; production commerce/auth audit; attribution; ledger, COGS và reserve; durable work queue; signer isolation; external transport có review. Toàn bộ giữ Organic LOCKED, Capital Gate FAIL và Ads DISABLED.

Tham chiếu [decision inbox](../../integrations/pijama/decision-inbox.json) và [roadmap](12-implementation-roadmap.md).
