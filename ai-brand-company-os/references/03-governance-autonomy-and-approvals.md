# 03 · Governance, autonomy và approval

## Nguyên tắc cưỡng chế

Mọi tác động bên ngoài phải được kiểm soát tại adapter/executor, không chỉ trong prompt hay scheduler. UNKNOWN tương đương DENY. Policy evaluator đưa ra decision không tự biến thành capability cho provider. Trong bản bootstrap, tất cả external action luôn DENY bằng mã, kể cả truyền allowed=true hoặc chữ ký giả.

## Autonomy theo action và môi trường

| Mức | Phạm vi tối đa | Điều kiện |
|---|---|---|
| A0 | Quan sát nguồn được phép, proposal nội bộ | Không external mutation, không tiêu tiền |
| A1 | Tạo draft/artifact/analysis trong sandbox | WO hợp lệ, review trước handoff |
| A2 | Thực thi action low-risk đã duyệt từng lần | Production executor + lease + approval riêng |
| A3 | Low-risk trong playbook và envelope đã ký | Eval, giám sát liên tục, scope nhỏ |
| A4 | Tối ưu portfolio trong giới hạn Owner | Không có quyền tự đổi luật, trần vốn hoặc protected data |

Quyền hiệu lực là giao của Owner policy, agent grant, môi trường, action, resource scope, thời gian, cost envelope và kill state; lấy mức hạn chế nhất. Risk tier không phải autonomy.

## Risk và approval matrix

| Hành động | Risk | Approval tối thiểu trước live |
|---|---|---|
| Đọc nguồn công khai đã allowlist | R0 | Grant nội bộ, không credential hay PII |
| Tạo draft/analysis | R1 | WO và grant; chưa được gửi ra ngoài |
| Đăng bài đã QA/truth/rights pass | R2 | Reviewer độc lập + Governance cấp execution lease |
| Trả lời riêng khách hàng, CRM, affiliate outreach | R2/R3 | Consent/purpose scope + reviewer + policy kênh |
| Thay profile, xóa bài, thay website | R3 | Owner chỉ rõ target/diff; rollback/recovery plan |
| Ngân sách/Ads/refund/giá/payment/protected data | R4 | Owner + Finance (tiền) + Governance, tách người làm/người ký |
| Secret exposure, tạm dừng cục bộ | Emergency | Có thể dừng ngay; mở lại cần incident review |

Receipt auto chỉ được tạo bởi policy service được cấp quyền cho action/phiên bản đó; LLM không được tự gán AUTO_APPROVED. Mọi risk không nhận diện chuyển R4 hoặc DENY, không mặc định LOW.

## Authorization contract production

Request phải bind: actor_id, actor_version, action, target/resource, environment, work_order_id, policy_version, canonical payload digest, artifact bundle digest, input source versions, amount/currency nếu có, idempotency key và khoảng thời gian thực thi.

Approval receipt phải có receipt_id, request_digest, signer_id, signer_role, key_id, decision, issued_at, expires_at, nonce, scope và signature. Registry signer ở service độc lập, không nhận signer_role do request tự khẳng định. Kiểm tra chữ ký trên canonical bytes; thuật toán/key allowlist; thời gian UTC; TTL tối đa; key không revoked; signer đủ quyền; không trùng tác giả. Với Finance/Governance yêu cầu hai principal khác nhau.

Chữ ký valid chưa đủ nếu payload đã đổi caption, link, target, schedule, media bytes, budget hoặc policy. Bất kỳ thay đổi nào tạo revision mới, thu hồi QA/approval cũ. Không tin approval từ file JSON do chính agent ghi.

Replay protection: receipt một lần hoặc grant có usage quota; tiêu thụ nonce và giữ reservation trong transaction với WO lease/budget. Cache policy/kill state hết hạn → DENY. Audit phải ghi outcome cả ALLOW và DENY, không ghi secret.

Schema ở [approval-receipt](../schemas/approval-receipt.schema.json) là contract; không phải triển khai chữ ký, trusted signer store hay durable nonce store. Phiên bản này không có production approval issuer.

## Kiểm tra theo thứ tự ở executor tương lai

1. Xác thực service identity và request schema; giới hạn body size.
2. Đọc kill state hiện tại; nếu không đọc được, dừng.
3. Nạp policy được ký, đúng version/environment; kiểm tra registry và grant.
4. Giữ lease WO bằng compare-and-swap, chống hai worker.
5. Tính lại payload/media digests từ bytes sẽ gửi; kiểm tra source freshness, truth, rights và QA.
6. Kiểm tra approval signatures, separation of duties, nonce, thời gian và resource scope.
7. Nếu tiền: đối soát Capital Gate, envelope, reserve, pending exposure và stop-loss.
8. Reserve quota/budget/idempotency trong transaction; append audit; gửi đúng một mutation.
9. Persist provider response; nếu không rõ kết quả chuyển RECONCILING, không blind retry.
10. Ghi outcome và giải phóng reservation chỉ khi có bằng chứng.

Không tách check và execute qua hàng giờ mà không kiểm tra lại. Phê duyệt lúc lên lịch không bảo đảm quyền còn hiệu lực lúc đến giờ.

## Kill switches và khôi phục

Có GLOBAL_EXTERNAL, PUBLISHING, CRM_SEND, PAID_SPEND và resource-specific stop. Bật một stop không cần tăng quyền; dừng local worker không tự hủy lịch đã nằm trên Meta hay campaign đang chạy. Để dừng remote cần endpoint được kiểm soát, credential thích hợp và xác nhận provider. Báo rõ phần remote chưa dừng.

Mở lại cần incident_id đã đóng, Owner/Governance ký theo risk, policy mới, test rollback, kiểm tra queue stale và cập nhật dashboard. Không tự mở khi timer hết hoặc lỗi tạm biến mất.

## Acceptance / negative tests

Thiếu policy, flag string "false", NaN amount, timestamp sai, receipt hết hạn, signer giả, self-approval, đổi artifact, nonce replay, revocation giữa scheduling/execution, worker race và direct API bypass đều phải DENY. Bản offline kiểm chứng hard lock và input checks; các test hệ phân tán/cryptographic production còn nằm trong roadmap.

Xem [hiến pháp](01-company-constitution.md), [finance](06-finance-treasury-and-capital-gate.md) và [risk](10-risk-security-and-compliance.md).
