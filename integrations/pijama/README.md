# Pijama · read-only source integration

README, package.json, PROTECTED-DATA.md, src/, server/, API/checkout/order/payment và sản phẩm **đã có** trong [repo pijama](https://github.com/QuanNguyenS403/pijama/tree/828409af7a26a2a5f4b4420789fc753588c9e1dc). Không tạo bản commerce mới hoặc sửa protected data trong task này.

## Danh mục nạp

- [source-manifest.json](source-manifest.json): 129 file text được truy xuất có blob SHA, vai trò và protected flag.
- [tree-manifest.json](tree-manifest.json): toàn cây Git pin, bao gồm đường dẫn source/assets/tests.
- [api-contract.json](api-contract.json): 35 route declarations, middleware quan sát ở khai báo, payment normalization và giới hạn truy cập.
- [product-snapshot.json](product-snapshot.json): ba SKU, tên/giá/size/preorder/initial stock ở source; không có chứng nhận/review/PII.
- [decision-inbox.json](decision-inbox.json): các quyết định chưa có bằng chứng hoặc thẩm quyền.

Source pin: 828409af7a26a2a5f4b4420789fc753588c9e1dc. Retrieval không phải thực thi code/test hoặc chứng nhận mọi dòng. Không thử endpoint production.

## Cách nạp đúng

Agent cần checkout pijama riêng ở commit pin qua GitHub được phép, đọc PROTECTED-DATA đầy đủ, README/package và source theo manifest. Không đặt nội dung giả vào đường dẫn còn thiếu. Nếu commit/file chưa truy cập được, báo BLOCKED và giữ pending; không dùng một bản nhớ từ chat làm thay nguồn.

Nguồn price/stock/catalog thuộc commerce; snapshot chỉ đủ nghiên cứu. Không dynamic import source JS từ remote, không đồng bộ bằng git pull trong task đăng bài, không gọi API admin/submit/payment/CRM để "thử tích hợp". Mọi adapter mới phải được cấp exact read-only scope và dùng private sanitized export/staging fixtures.

## Phát hiện cần lưu ý

Frontend payment status khác server initial; admin toggle/default có thể tạo nhãn PAID nên cần bank/provider reconciliation. UTM hiện chỉ thấy read trong checkoutConfig, chưa thấy capture/emitter trong source đã kiểm tra. Service/offer/material/review evidence còn conflict/unverified; stock là khởi tạo, không realtime.

README Node 18/20 khác engines >=22 ở package. PROTECTED-DATA nhắc PDF kỹ thuật không có trong tree; yêu cầu Owner cung cấp, không tạo giấy tờ xưởng giả. Các phát hiện là source-level, không chứng nhận trạng thái live.

## Acceptance cho integration production

Authorized source adapter, schema/event validation, pseudonymization, dedup/replay/out-of-order/partial refund tests, provider/order/ledger tie-out, consent/retention review, drift detection và approval. Hiện các file ở đây là source contracts, không connector commerce live.
