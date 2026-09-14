# 02 · Tổ chức và điều lệ từng agent

## Cơ cấu trách nhiệm

Owner đặt luật và hạn mức. Governance độc lập với CEO; Finance giữ kiểm soát vốn, không chịu mệnh lệnh tăng chi từ CEO. CEO quản lý portfolio organic; trưởng phòng là vai trò logic, không nhất thiết một model/process riêng. Không nhân bản agent để nhân bản quyền.

| Agent | Đầu vào → đầu ra | KPI có ý nghĩa | Cấm / reviewer |
|---|---|---|---|
| governance | Policy, WO, evidence → decision có lý do | Policy violation, thời gian xử lý risk | Không tự sửa luật; Owner review |
| ceo | Mục tiêu, MONEY/GROWTH/RISK → portfolio và WO | Outcome đã đối soát, WIP, blocker age | Không tự cấp vốn; Governance review |
| finance | Bank/provider/order/cost evidence → ledger và envelope proposal | Reconciliation coverage, realized profit, reserve | Không tự phê duyệt chi; Owner/Governance review |
| market-research | Nguồn công khai hợp lệ → market brief | Độ tin cậy nguồn, insight được kiểm nghiệm | Không scraping trái phép; Analytics review |
| customer-intelligence | Feedback đã tối thiểu hóa → nhu cầu/phản đối | Insight có provenance, complaint resolution | Không lộ PII; Governance review |
| product | Catalog/feedback/evidence → truth records và issue | SKU coverage, số claim unresolved | Không tự sửa giá/catalog protected; Owner review |
| brand | Truth, Owner positioning → brand contract | Nhất quán và hiểu đúng thông điệp | Không giả endorsement; Governance review |
| creative | Brief, quyền assets → media bundle | First-pass QA, fidelity sản phẩm | Không bịa ảnh sản phẩm thành hàng thật; QA review |
| content | Brief/claim allowlist → copy/script | Qualified intent, content-assisted outcome | Không tự duyệt copy; QA review |
| seo | Trang/site inventory → technical/content proposal | Non-brand qualified traffic, conversion | Không link spam hoặc sửa site trái quyền; Conversion review |
| social-media | Approved bundle → schedule proposal/receipt | Độ chính xác lịch, không duplicate | Không bypass gateway; Governance review |
| community | Tin nhắn hợp lệ/policy → reply draft/escalation | Resolution, hài lòng, opt-out | Không mass DM; Support/Governance review |
| crm | Consent, event segment → lifecycle proposal | Retention, unsubscribe, complaint | Không tự gửi hoặc upload audience; Governance review |
| affiliate | Đối tác/right/terms → proposal và reconciliation | Net contribution sau hoa hồng/hoàn trả | Không ký hợp đồng hoặc fake referral; Finance review |
| conversion | Funnel/checkout evidence → experiment proposal | Completed paid orders, checkout error | Không sửa payment/pricing protected; Owner review |
| analytics | Validated events/cost → metric snapshot | Freshness, reconciliation, attribution coverage | Không biến UNKNOWN thành organic; Finance review |
| experimentation | Hypothesis + baseline → preregistration và kết luận | Decision quality, repeatability | Không p-hack, đổi KPI sau kết quả; Analytics review |
| customer-support | Policy/đơn có quyền xem → ticket/draft | Resolved issue, refund-error rate | Không refund/đổi trạng thái tiền; Owner review |
| quality-assurance | Artifact/source/rights → QA findings | False-pass, critical miss, rejection precision | Không tự tạo và duyệt cùng bundle; Governance review |
| paid-acquisition | Gate/envelope approved → test proposal | Incremental contribution, verified CAC | Mặc định disabled; Finance/Governance review |

## Contract bắt buộc cho mỗi agent

Registry cần id, version, manager, purpose, action allowlist, data scopes, default autonomy, risk ceiling, environment, work-order types, input/output schema, reviewer, cost/concurrency/time limits, eval profile, owner quyết định và trạng thái. [Registry](../config/agent-registry.json) là baseline **offline**, không mô tả quyền production chưa cấp.

Agent không được giữ key ký approval, credential của Finance, credential Owner hoặc write access vào policy. Signer và executor là service boundary riêng khi triển khai thật. Hai agent cùng dùng một credential/quyền ký không được tính là separation of duties.

## Handoff contract

Mỗi handoff truyền WO ID, dependency version, URI+digest artifact, schema version, câu hỏi cụ thể, due date, confidence và unresolved issues; không chuyển nguyên chat/customer database. Bên nhận xác minh schema/digest/freshness, accept hoặc reject với reason code. Không có ack thì chưa chuyển trách nhiệm.

CEO xử lý dependency cycle bằng cắt scope/đổi thứ tự, không cưỡng ép reviewer PASS. SLA đề xuất nội bộ: ack trong một chu kỳ làm việc; P0 route ngay khi phát hiện. Đây chưa phải SLA chăm sóc khách hàng đã cam kết.

## WIP và chi phí

Khởi động một WO đang thực hiện mỗi agent, tối đa ba initiative đồng thời; có thể thay qua policy phê duyệt. LLM inference, image generation, lưu trữ, SaaS, coupon và affiliate đều là chi phí, không chỉ Ads. Nếu chưa có cost envelope, chỉ dùng công cụ offline đã nằm trong môi trường được phép; không tự mua dịch vụ.

## Onboarding/offboarding

Onboarding: đọc luật → kiểm tra data scope → eval âm tính → shadow → review → cấp action lease có expiry. Offboarding: revoke grants/leases, chuyển WO dở, giữ audit, thu hồi session/service identity. Tạo agent mới bằng prompt không tự cấp quyền. Re-prompt/model upgrade phải chạy regression trước khi giữ autonomy cũ.

## Tổ chức không có năng lực runtime tương ứng

Bản này có registry, schema và local validator. Chưa có 20 worker độc lập, message bus, supervisor, vault hoặc dashboard. Các phòng ban có thể tạo draft theo contract; không báo "đã tuyển/kích hoạt 20 agent" chỉ vì có 20 bản ghi.
