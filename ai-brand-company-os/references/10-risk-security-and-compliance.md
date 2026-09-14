# 10 · Risk, security và compliance

## Phạm vi

Áp dụng dữ liệu, credentials, quyền tài sản, nền tảng, tài chính và người dùng. Đây là engineering/governance launch checklist, không phải chứng nhận tuân thủ hay thay ý kiến tư vấn pháp lý. Owner phải phân công người đủ chuyên môn đánh giá nghĩa vụ phù hợp thực tế trước production.

## Phân loại tài sản

PUBLIC: tài liệu brand được phép công khai. INTERNAL: chiến lược/chưa công bố, WO, model eval. CONFIDENTIAL: margin, supplier terms, audit metadata. RESTRICTED: credentials, customer PII, order/payment details, identity/consent records và signing keys.

Public Git chỉ chứa template, synthetic fixture đã ghi nhãn, schema và báo cáo redacted. Evidence nhạy cảm giữ trong kho hạn quyền; repo chỉ có evidence URI/digest opaque, không signed URL chứa token.

## Incident credential baseline

Hai file Facebook/scripts/inspect_new_token.js và update_new_token.js ở commit nguồn có secret literal. Containment trong release: bỏ literal ở HEAD, thay helper bằng thông báo dừng không in secret, bỏ network publisher, ignore local env/runtime output và cảnh báo packaged legacy.

Owner cần: xác định app/Page/account và phạm vi bị ảnh hưởng trong môi trường an toàn → revoke/rotate trên provider → kiểm tra sessions/quyền/log hoạt động và scheduled posts/campaigns → cấp lại least privilege → xác minh old credential không dùng được mà không đưa nó vào chat → ghi incident evidence redacted. Cần kiểm tra clone/fork/CI cache/artifact và .skill archive; text scan không chứng minh binary/history sạch.

Không tự đổi key ngoài quyền tài khoản. Không rewrite history, xóa repo, log hoặc archive chỉ để scanner xanh. Mọi history cleanup phải có scope/approval và phối hợp người dùng clone; credential rotation là việc riêng không thể thay bằng cleanup.

## Threat model và control

| Đe dọa | Boundary | Control / test |
|---|---|---|
| Prompt injection từ web/DM/file | Data → planner | Không nhận policy/tool instruction từ source; provenance và allowlist |
| Forged approval/self-approval | Planner → signer/executor | Key service tách biệt, bind digest, principal role registry, replay store |
| Secret exfiltration/SSRF | Adapter → mạng | Origin/path allowlist, không URL tùy ý, no token log, egress limits |
| Sửa media sau QA | Artifact → executor | Immutable blob/digest và verify bytes tại gửi |
| Duplicate post/spend | Worker → provider | Durable lease, reservation, idempotency và reconciliation |
| Fake order/payment/refund | Browser/webhook → ledger | Provider authentication, amount/entity/currency check, dedup, tie-out |
| Rights revoked/PII misuse | Evidence → publication/CRM | Expiry/consent purpose check, suppression, quarantine |
| Supply-chain và script legacy | Repo → runner | Entry-point inventory, no blind import, pinned actions, no production secrets trong CI |
| Kill-state stale | Control plane → executor | Fail closed và cache expiry, exercise remote pause |
| Report laundering | Mock → dashboard/gate | Evidence type tags, source signatures, không coi SUCCESS text là fact |

Bản bootstrap loại bỏ live egress trong code được hỗ trợ; điều này không phải sandbox toàn bộ hệ điều hành hoặc ngăn người sửa code tự thêm fetch. Production cần permissions/egress service-level ngoài prompt.

## Dữ liệu cá nhân và người tiêu dùng tại Việt Nam

Nguồn chính thức cần review, kiểm tra ngày hiệu lực và phạm vi áp dụng khi launch:
- [Luật 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup=), hiệu lực 01/01/2026.
- [Nghị định 356/2025/NĐ-CP](https://vanban.chinhphu.vn/?docid=216387&pageid=27160).
- [Cơ sở dữ liệu văn bản pháp luật](https://vbpl.vn/) để đối chiếu bảo vệ người tiêu dùng, quảng cáo, giao dịch và thương mại điện tử đang áp dụng.
- [Cổng thương mại điện tử](https://online.gov.vn/) để kiểm tra quy trình/thủ tục website đúng mô hình.

Không giữ nguyên câu "tuân thủ Nghị định 13/2023" trong source như một chứng nhận cho năm 2026. Cần review purposes, consent/basis, thông báo minh bạch, quyền chủ thể, sharing/processors, retention/deletion, security, incident obligations và chuyển dữ liệu xuyên biên giới nếu có. Thời hạn/thủ tục cụ thể cần pháp chế xác nhận, không tự bịa SLA pháp định.

Marketing consent không gộp mặc định với xử lý đơn. Hash email/phone không tự loại bỏ nghĩa vụ. Dữ liệu tài khoản/payment/địa chỉ chỉ vào scope tối thiểu; model chỉ nhận phần tối thiểu thực sự cần xử lý. Customer request truy cập/xóa phải xác thực và xét retention hợp lệ; không xóa ledger/audit tùy ý.

## Claim, tài sản và nền tảng

Mỗi claim có SKU/batch/supplier/document/validity và reviewer. Badge OEKO-TEX, thông số vải, tỷ lệ hấp thụ, an toàn da, "bán chạy", review verified và số người mua phải có evidence đúng phạm vi. File text không là chứng chỉ.

Mỗi asset ghi creator/license, quyền thương mại/chỉnh sửa/paid, người mẫu/voice consent, territory/time, nguồn file và revocation. Không dùng celebrity likeness để giả endorsement; không xóa watermark khi không có quyền. Quy tắc disclosure AI phụ thuộc nội dung/chính sách hiện hành; không mặc định ai_disclosure_required=false cho mọi trường hợp.

Dùng API chính thức, đúng permissions/login mode/app review; không né rate limit, re-auth hoặc account restrictions. Stop trên 401/403 thay vì luân phiên token để tiếp tục.

## Incident response và phục hồi

P0: credential/PII disclosure, unauthorized spend/refund/post, fake payment recognition, rights/legal harm nghiêm trọng. Ngừng tác vụ bị ảnh hưởng ngay, preserve redacted evidence, xác định scope, alert Owner, revoke/contain đúng quyền, reconcile provider và ghi residual risk. P1: data/claim mismatch, repeated duplicate, stale permissions; quarantine scope và ngăn launch. P2: issue nội bộ không tác động bên ngoài; đưa backlog có owner.

Restore chỉ sau root-cause, remediation test, dữ liệu/queue/budget reconcile và signer đủ quyền. Backup cần mã hóa, restore rehearsal, RPO/RTO do Owner duyệt; backup tồn tại không chứng minh khôi phục được.

## Launch evidence

Secret rotation receipt, source/license/consent registry, risk register, deployment access review, API permission checks, negative tests, audit retention/access, backup restore, incident exercise và Owner signoff. Mọi phần thiếu giữ BLOCKED. Đọc [SECURITY](../../SECURITY.md) và [roadmap](12-implementation-roadmap.md).
