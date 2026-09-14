# 08 · Dữ liệu, đo lường và experimentation

## Nguồn sự thật

Commerce server/provider chứng minh order và payment facts; ledger close chứng minh cash/cost/profit; platform API chứng minh platform metrics; consent/right registry chứng minh phạm vi được phép. Browser events và LLM output không chứng minh tiền. Không đưa dữ liệu khách hàng raw vào public repo, reports hoặc model context.

Nguồn pin của pijama ở [source manifest](../../integrations/pijama/source-manifest.json). File có trong source không bảo đảm deployment live giống commit đó.

## Event envelope

Schema [event-envelope](../schemas/event-envelope.schema.json) gồm event_id, event_name, schema_version, source, source_event_id, occurred_at, received_at, environment, entity_ref, correlation_id, consent_ref, payload đã allowlist. Producer phải authenticated, chữ ký webhook checked trước normalize; không xem field source do client gửi là trustworthy.

Production cần dedup unique(source, source_event_id), immutable raw evidence trong kho hạn quyền, normalized version, clock skew guard, late event policy và transaction boundary. Sửa event bằng correction record, không rewrite lịch sử. Event ID không chứa email/phone. Hash định danh vẫn có thể là dữ liệu cá nhân; không coi hash là giấy phép marketing.

## Taxonomy và funnel

| Event chuẩn đề xuất | Nguồn | Nghĩa / không được suy ra |
|---|---|---|
| content.preview_created | Toolkit offline | Draft, chưa published |
| content.published_verified | Provider + reconcile | Đã đối chiếu public object, không chỉ queue accepted |
| product.viewed | Browser có consent phù hợp | Hành vi trình duyệt, có bot/coverage limitations |
| cart.item_added | Browser | Ý định, không doanh thu |
| checkout.submitted | Commerce server | Đơn được validator chấp nhận |
| payment.customer_claimed | Commerce server | Khách báo đã chuyển, không cash |
| payment.verified | Provider/bank + reconciliation | Chứng cứ thanh toán, cần xử lý refund/liability |
| order.fulfilled | Fulfillment có chứng từ | Giao hàng; COD chưa đồng nghĩa cash remitted |
| refund.settled | Provider/bank + case | Hoàn trả thật và cost reversal |
| customer.marketing_consent_changed | Consent service | Purpose/channel/time/version; withdrawal có hiệu lực |

Taxonomy là contract cần triển khai adapter/emitter. Pijama source hiện có order events phục vụ đồng bộ giao diện, không được gọi chúng là event bus tài chính hoàn chỉnh. Audit text tìm thấy read pijama_utm, chưa thấy capture tương ứng hoặc dataLayer/gtag/fbq; không khẳng định website live không cài tracking ngoài repo.

## Metric registry

Mỗi metric cần owner, business meaning, numerator/denominator, unit, granularity, timezone, inclusion/exclusion, dedup rule, attribution version, freshness SLA, uncertainty và source refs. Division by zero/missing source trả null với quality reason, không 0.

MONEY: cash settled, refunds, COGS, cost, reserve, realized organic profit, available cash, committed spend. GROWTH: qualified visits, server accepted orders, verified payments, refund-adjusted conversion, repeat purchase, attributed organic contribution. RISK: coverage/freshness, unresolved evidence, permission incidents, duplicate/external side-effect count.

Metric mapping theo Meta version trong config; field bị deprecated → UNKNOWN + migration issue, không âm thầm dùng tên mới khác nghĩa. Platform reach không cộng giữa Page/IG để suy ra unique people.

## UTM và attribution

Contract đề xuất: utm_source=facebook hoặc instagram; utm_medium=organic_social (paid_social chỉ sau gate); utm_campaign=initiative_id; utm_content=content_id/distribution_id. Không đưa PII vào URL. Allowlist và giới hạn độ dài; không coi UTM browser tự khai là bằng chứng bất biến.

Lưu first/last touch có timestamp và consent basis; server order chứa nguồn đã normalize. Direct, unknown, affiliate và paid không tự relabel organic. Chọn attribution window/model trước phân tích, lưu version. Platform-reported, modeled và financially reconciled là ba view riêng.

Attribution chưa xác minh → organic_profit_for_gate UNKNOWN, dù đã có tổng doanh thu. Không dùng toàn bộ cash làm "organic" vì Ads đang tắt: khách có thể đến từ referral/offline/nguồn không đo được.

## Experiment contract

Preregister experiment_id, hypothesis, eligibility, randomization unit (nếu có), control/treatment, primary metric, guardrails, baseline, MDE, sample size method, power/significance hoặc decision framework được duyệt, run window, conversion/refund lag, exclusion và stop rules.

Tránh thay hook, price, landing và audience cùng lúc nếu muốn kết luận nguyên nhân. Không peeking rồi dừng khi thấy thắng; dùng fixed horizon hoặc sequential method đã ghi trước. Kiểm tra sample-ratio mismatch khi randomize, contamination và bot traffic. Không có đủ sample → INCONCLUSIVE, không phóng đại từ vài đơn.

Kết quả chứa effect estimate, interval/uncertainty, achieved sample, exclusions, costs, limits và reproducible query/version. Content observational comparison không được gọi causal lift. Store learning gồm điều biết, điều chưa biết và quyết định áp dụng; giữ cả thí nghiệm thất bại.

## Data quality và launch gate

Kiểm tra schema validity, duplicate rate, event ordering, late arrivals, missing joins, refund linkage, price/currency, consent purpose, provider-to-ledger tie-out và audit integrity. Không cấp Capital Gate khi data stale/mismatch. SLA/threshold chưa Owner duyệt để null và BLOCKED.

Alert phải nêu time window, affected WO/metrics/gates và safe action. Không gửi raw customer payload trong alert. Access logging, retention và deletion workflow cần owner, lawful basis và legal review; xem [risk](10-risk-security-and-compliance.md).

## Definition of Done

Không đánh dấu measurement IMPLEMENTED chỉ có JSON schema. Cần emitter/adapter, database, dedup/replay test, real authorized staging samples, reconciliation reports, privacy checks, alert exercise và verified metric queries. Release bootstrap chỉ cung cấp schema/registry/source audit.
