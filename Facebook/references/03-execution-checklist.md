# Execution Checklist — 21 bước chi tiết

Mỗi bước dưới đây có Input, Action, Output, và Gate rõ ràng. Không được coi một bước là "xong" nếu Output chưa được tạo ra hoặc Gate chưa được kiểm tra.

---

**☐ 01 — Load brand contract**
Input: `brand_profile.yaml`, `offer_catalog.json`, `policy.yaml` (và `brand.json` cho phần hình ảnh — xem `01-brand-and-creative-contract.md`).
Action: kiểm tra persona, positioning, topic whitelist/blacklist, tone, claim được phép, CTA.
Output: `runtime_brand_context.json`.
Gate: thiếu trường bắt buộc → `STOP_CONFIG_ERROR`.

**☐ 02 — Health-check Meta integration**
Input: `page_id`, `app_id`, secret references.
Action: xác minh Graph API version đang dùng, tính hợp lệ của Page Access Token, quyền hiện có, và quyền sở hữu/truy cập Page; dùng endpoint `/debug_token` để kiểm tra metadata của token.
Output: `integration_health.json`.
Gate: token invalid hoặc lỗi OAuth → không được publish bất cứ điều gì.

**☐ 03 — Khoá quyền tối thiểu**
Organic publishing cần: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`. Thêm `pages_manage_metadata` nếu dùng Page feed Webhooks. Ads reporting dùng `ads_read`; tạo/quản lý quảng cáo cần quyền Marketing API tương ứng như `ads_management`, có thể cần Advanced Access/App Review tuỳ cách app truy cập asset.
Output: `permission_manifest.json`.

**☐ 04 — Thu thập dữ liệu đầu vào**
Input: lịch sử bài đăng, Page Insights, Ads Insights, dữ liệu website/Conversions API, CRM, lead form.
Action: chuẩn hoá về `content_id`, `creative_id`, `audience_id`, `campaign_id`, timestamp cả UTC và local timezone.
Output: `performance_daily.parquet`, `audience_signals.parquet`.

**☐ 05 — Phân khúc audience**
Agent duy trì bốn lớp audience:

| Segment | Tiêu chí | Nguồn |
|---|---|---|
| `cold` | Chưa tương tác/chưa có first-party signal | Broad/allowed targeting |
| `warm` | Page/video/content engagers | Meta Engagement Custom Audience |
| `intent` | Website visitors, leads, booking initiators | Pixel/Conversions API/lead data |
| `value` | Qualified lead/customer/high-LTV | CRM first-party |

Customer identifiers đưa lên Customer File Custom Audience phải được hash theo đúng quy trình chuẩn hoá của Meta trước khi upload.
Output: `audience_registry.json`.

**☐ 06 — Tạo Lookalike khi seed đủ chất lượng**
Ưu tiên seed theo thứ tự: `high-LTV customer > qualified lead > converter > high-intent visitor > high-quality engager`. Không dùng "mọi follower" làm seed mặc định. Bắt đầu test ở lớp tương đồng cao nhất (ví dụ 1%) trong vùng địa lý được chọn, sau đó mới mở rộng dần nếu cần thêm reach.
Gate: không tạo Lookalike chỉ vì "đủ số lượng" — seed phải đúng business outcome. Với Special Ad Categories, các tuỳ chọn audience (bao gồm Lookalike) có thể bị hạn chế trong một số nhóm quảng cáo.

**☐ 07 — Lập strategy tuần**
Tần suất: chạy vào Chủ Nhật 23:30 hoặc Thứ Hai 05:30.
Input: performance 28 ngày gần nhất + content history 60 ngày + business goal hiện tại.
Action: chọn 7 topic, pillar, funnel stage, format, CTA, và hypothesis cho tuần.
Output: `weekly_plan.json`.
QA: không được trùng semantic với nội dung 60 ngày gần nhất quá ngưỡng đã cấu hình trong `policy.yaml`.

**☐ 08 — Sinh brief cho từng post**
Input: một slot trong `weekly_plan.json`.
Output: `brief.json` (xem cấu trúc mẫu ở `01-brand-and-creative-contract.md`).
Gate: không cho copy agent tự "bịa" số liệu hoặc case study — mọi claim định lượng bắt buộc có `source_ref` thật.

**☐ 09 — Viết copy/kịch bản**
Image/carousel: xuất `caption.txt` + `carousel_copy.json`.
Reel: xuất `script.md` + `voiceover.txt`.
Constraints: 1 hook, 1 argument, 1 CTA; loại bỏ filler, keyword stuffing, engagement bait, và thông tin không có nguồn.

**☐ 10 — Sinh storyboard và visual prompt**
Input: `script.md`.
Output: `storyboard.json`, `visual_prompt.json`.
Mỗi scene phải xác định: duration, framing, action, subject, background, text overlay, motion, transition, continuity key.

**☐ 11 — Sản xuất tài sản**
Image: AI image → resize/crop → brand overlay (ImageMagick) → `*.png`/`*.jpg`. Xem đầy đủ pipeline ở `02-image-production-pipeline.md`.
Video: text/image-to-video → assemble (FFmpeg) → voice → captions → loudness/format normalization → `reel_master.mp4`.

**☐ 12 — QA tự động**
Xem đầy đủ danh sách field bắt buộc và bảng approval routing ở `05-qa-policy-compliance.md`.

**☐ 13 — Approval routing**
`LOW risk + QA pass` → `AUTO_APPROVED`.
`MEDIUM/HIGH risk`, claim thuộc diện regulated, chính trị/vấn đề xã hội, nhân vật công chúng, giọng/hình ảnh tổng hợp, sức khỏe/tài chính/pháp lý → `HUMAN_REQUIRED`.
`POLICY_FAIL` → quarantine, **không publish**.

**☐ 14 — Schedule/publish**
Bài Page tiêu chuẩn có thể lên lịch bằng API với trạng thái chưa publish và `scheduled_publish_time`. Reel dùng Reels Publishing API riêng cho Page.
Input: `publish_request.json`.
Output: `publish_receipt.json` chứa `post_id`, `publish_at`, `status`, `request_id`.
Ưu tiên dùng **native Meta scheduling** khi loại nội dung/endpoint hỗ trợ; với loại nội dung cần gọi API đúng giờ, dùng scheduler ngoài (n8n Schedule Trigger, Cloud Scheduler với cron + retry exponential backoff) để kích hoạt agent.

**☐ 15 — Reconcile bằng Webhook**
Subscribe Page `feed` Webhook để nhận thay đổi Page (cần quyền `pages_manage_metadata` + `pages_show_list`). Payload phải được xác thực bằng chữ ký `X-Hub-Signature-256` trước khi xử lý.
Output: cập nhật `publish_status=CONFIRMED`.
Idempotency: mọi event phải có dedup key; không retry publish "mù" khi chưa biết lần trước đã thành công hay chưa — luôn reconcile (GET) trước.

**☐ 16 — Đo hiệu quả theo snapshot**
Thu organic snapshot tại `+1h`, `+24h`, `+72h`, `+7 ngày`. Ads Insights có thể pull mỗi 3–6 giờ khi đang test, và reconcile lại vào cuối ngày.
Output: `metrics_snapshot.parquet`.

**☐ 17 — Tối ưu nội dung/lịch**
Mỗi tuần agent xếp hạng theo business KPI trước vanity KPI: `qualified_lead → booking/sale → CPL/CPA → CTR/watch → engagement → raw reach`.
Agent chỉ thay **một nhóm biến quan trọng mỗi vòng**: hook, concept, format, CTA, hoặc time slot — không đổi đồng thời mọi thứ, nếu không attribution sẽ mất ý nghĩa.

**☐ 18 — Chạy ads có kiểm soát**
Xem đầy đủ ở `06-ads-and-growth-loop.md`. Không tạo campaign khi `daily_budget` hoặc `max_monthly_spend` là `null`.

**☐ 19 — Dashboard và quyết định tuần kế tiếp**
Data model tối thiểu: `fact_content`, `fact_organic_snapshot`, `fact_ads_daily`, `fact_conversion`, `dim_creative`, `dim_audience`, `dim_campaign`.
Không hard-code dashboard vào các metric legacy — Meta có thể thay đổi/khấu hao Insights field qua từng phiên bản API, nên metric registry phải được kiểm thử lại khi nâng Graph/Marketing API version.

Công thức nội bộ:

```
CTR        = link_clicks / impressions
CPC        = spend / link_clicks
CPL        = spend / leads
CPA        = spend / conversions
CVR        = conversions / qualified_sessions_or_clicks
ROAS       = attributed_revenue / spend
Publish SR = successful_posts / attempted_posts
```

**☐ 20 — Error/fallback**
Xem đầy đủ bảng trạng thái ở `07-error-fallback-and-slo.md`.

**☐ 21 — Security/compliance**
Xem đầy đủ ở `05-qa-policy-compliance.md`.

---

## Flowchart tổng thể (tham khảo nhanh)

```
Scheduler → Load Brand + Offer + Policy → Load Organic/Ads/CRM Signals → Weekly Strategy + Calendar
  → Create Brief → Generate Copy/Script → Storyboard + Visual Prompts
  → Generate Image/Video/Voice → Render + Subtitle + Encode
  → [Automated QA] --fail--> Repair (tối đa 2) --vẫn fail--> Quarantine/Alert
  → [Automated QA] --pass--> [Policy Risk]
       --Low--> Auto Approved
       --Medium/High--> Human Approval --reject--> Quarantine
                                        --approve--> Auto Approved
  → [Content Type]
       --Page Post--> Schedule/Pages API
       --Reel--> Scheduler + Reels API
  → Published → Page Webhook → Signature Verify + Dedup → Publish Reconciliation
  → Organic/Ads Insights → Warehouse + Dashboard → Weekly Optimizer → (quay lại Weekly Strategy)

(song song) Load Organic/Ads/CRM Signals → Custom Audience Builder → Warm/Intent/Value
  → Lookalike Candidates → [Ads Spend Authorized?]
       --No--> Organic Only
       --Yes--> Campaign + Creative Tests → Organic/Ads Insights
```
