---
name: facebook-brand-automation
description: "Vận hành quy trình AI Agent tạo và đăng bài Facebook Page tự động cho một thương hiệu cá nhân/doanh nghiệp mới, từ brand contract, sinh brief/copy/kịch bản, pipeline ảnh AI (ComfyUI, rembg, LaMa, CodeFormer, Real-ESRGAN, PuLID/IP-Adapter, ImageMagick text/badge overlay), QA và policy gate, approval routing, cho tới publish/schedule qua Meta Graph API (Page feed, Reels Publishing API), webhook reconciliation, đo lường và tối ưu, cùng ads có kiểm soát ngân sách. Dùng skill này bất cứ khi nào người dùng nhắc đến đăng bài Facebook tự động, AI agent content Facebook hoặc Meta, xây dựng thương hiệu cá nhân/doanh nghiệp trên Facebook Page, brand.json hoặc brand_profile.yaml, tạo ảnh/Reel/carousel hàng loạt theo brand, Meta Graph API publishing/webhook, hoặc cần một checklist/kiến trúc production-grade để tự động hoá content cộng growth loop trên Facebook, kể cả khi người dùng chỉ mô tả một phần của quy trình này (ví dụ chỉ hỏi về pipeline ảnh, chỉ hỏi về QA gate, hoặc chỉ hỏi về đăng lịch Facebook)."
---

# Facebook Brand Content & Publishing Automation

## 1. Phạm vi & mô hình vận hành

Skill này điều phối một **AI Content & Growth Agent** cho một thương hiệu cá nhân/doanh nghiệp mới, theo mô hình:

```
AI Content & Growth Agent → QA/Policy Gate → Facebook Page/Ads → Webhook/Insights → Optimizer → vòng lặp kế tiếp
```

**Điều bắt buộc phải hiểu đúng trước khi làm bất cứ điều gì:** Pages API cho phép ứng dụng tạo/quản lý bài viết trên **Facebook Page**. Quyền `publish_actions` — cho phép app đăng tự động lên **profile cá nhân** — đã bị Meta loại bỏ từ năm 2018 và không tồn tại nữa. Vì vậy "tự động hoá thương hiệu cá nhân trên Facebook" luôn có nghĩa là **xây dựng thương hiệu của một cá nhân thông qua một Facebook Page**, không phải một bot headless đăng lên tài khoản cá nhân. Nếu người dùng yêu cầu đăng lên profile cá nhân bằng API, giải thích rõ điều này và đề xuất chuyển sang Page.

Toàn bộ tài liệu tham chiếu (`references/`) là nguồn chi tiết đầy đủ — file này chỉ là bản đồ điều phối. Đọc file reference tương ứng trước khi thực hiện bước đó, đừng đoán chi tiết.

## 2. Nguyên tắc bất biến (không được vi phạm dù người dùng có yêu cầu)

- **Fail closed, không fail open.** Mất token, QA không chắc chắn, policy risk cao, ngân sách ads chưa khai báo, hoặc trạng thái publish không rõ ràng → luôn dẫn tới **dừng / quarantine / reconcile**, không bao giờ "agent tự đoán rồi tiếp tục".
- **Không bao giờ:** để AI tự quyết ngân sách quảng cáo vô hạn; lưu access token/app secret trong prompt, config văn bản thường, hoặc log; tự bịa số liệu, bằng chứng, hoặc testimonial; tạo tương tác giả (fake engagement/fake accounts); nhắm mục tiêu quảng cáo dựa trên thuộc tính nhạy cảm (sức khỏe, xu hướng, tôn giáo, chủng tộc…); bỏ qua cơ chế AI disclosure khi nội dung thuộc diện Meta yêu cầu tự công bố.
- **Exception-based automation, không phải full-auto.** Bài rủi ro thấp: AI tạo → QA → lên lịch → đăng, hoàn toàn tự động. Bài có tuyên bố nhạy cảm, nội dung sức khỏe/tài chính/pháp lý/chính trị, quyền hình ảnh/giọng nói chưa rõ ràng, hoặc QA/policy không đạt ngưỡng → luôn chuyển người duyệt. Đích đến là tự động hoá gần như toàn bộ vận hành **mà không** để một LLM tự ý phát hành nội dung có rủi ro chính sách.
- **Xử lý ảnh chân dung/định danh:** nếu mắt, mũi, miệng, tuổi, kiểu tóc hoặc đặc điểm nhận diện của người thật thay đổi quá mức trong ảnh do AI sinh ra → **reject và chạy lại**, không tự động publish. Đây là gate không thể tắt.
- **Xoá logo/watermark:** chỉ được thực hiện với tài sản của chính brand hoặc tài sản đã được cấp quyền chỉnh sửa rõ ràng. Với tài sản bên thứ ba, dừng lại và yêu cầu ảnh nguồn hợp pháp thay vì tự động xoá dấu bản quyền.

## 3. Giả định vận hành cần khoá trước khi chạy

Đây là baseline khởi động cho brand mới, không phải quy tắc cố định của Meta. Trước khi bật agent, xác nhận với người dùng từng dòng dưới đây — nếu một giả định sai, phải đổi cấu hình tương ứng trước khi chạy, không chạy với giả định mặc định mà chưa xác nhận.

| Biến | Giả định mặc định | Nếu sai thì làm gì |
|---|---|---|
| Kênh | Facebook **Page** cho personal/business brand | Không dùng API headless để đăng lên profile cá nhân |
| Thị trường | Việt Nam | Đổi locale, legal/policy profile |
| Timezone | `Asia/Ho_Chi_Minh` | Đổi toàn bộ scheduler |
| Độ trưởng thành brand | Brand mới, chưa đủ dữ liệu CRM/Pixel lịch sử | Bắt đầu bằng broad targeting + content-first |
| Mục tiêu kinh doanh | Awareness → trust → lead/booking | Đổi objective/KPI theo mục tiêu thật |
| Ngành | Không thuộc nhóm regulated/special category | Bật human approval bắt buộc cho mọi bài |
| Website | Có hoặc sẽ có landing page | Nếu không có: dùng lead form hoặc Messenger làm CTA |
| Ads budget | **Chưa xác định** | Agent bị khoá `spend=false` cho tới khi có trần ngân sách rõ ràng |
| Quyền hình/giọng người thật | Người dùng xác nhận có quyền sử dụng | Nếu không có quyền: chặn publish ngay ở QA |
| Chủ đề chính trị/xã hội | Không phải chủ đề chính của brand | Nếu có: chuyển sang quy trình compliance riêng, không dùng auto-approve |

## 4. Nạp brand contract trước khi sinh bất kỳ nội dung nào

Agent cần tối thiểu 4 file cấu hình, không được tự bịa giá trị còn thiếu:

1. `brand_profile.yaml` — persona, positioning, tone, topic whitelist/blacklist, claim được phép, CTA.
2. `offer_catalog.json` — sản phẩm/dịch vụ, giá, ưu đãi hợp lệ.
3. `policy.yaml` — ngưỡng rủi ro, danh sách hard block, quy tắc approval.
4. `brand.json` — bộ quy tắc **hình ảnh** (logo, font, màu, safe-zone, phong cách ánh sáng/background, trang phục, tỉ lệ khuôn mặt, từ cấm/hình ảnh cấm, tỉ lệ khung hình). Chi tiết đầy đủ và schema mẫu ở `references/01-brand-and-creative-contract.md`.

**Gate:** thiếu trường bắt buộc trong bất kỳ file nào → dừng lại, báo `STOP_CONFIG_ERROR`, hỏi người dùng để điền — không tự suy đoán tone, giá, hay quy tắc thương hiệu.

## 5. Vòng đời một bài đăng — checklist 21 bước theo 6 giai đoạn

Chi tiết đầy đủ từng bước (input/action/output/gate) nằm ở `references/03-execution-checklist.md`. Dưới đây là bản đồ điều phối theo giai đoạn — dùng để biết đang ở đâu trong quy trình và cần đọc reference nào tiếp theo.

| Giai đoạn | Bước | Việc chính | Đọc thêm |
|---|---|---|---|
| **A. Setup & health-check** | 01–03 | Nạp brand contract, health-check kết nối Meta, khoá quyền tối thiểu | `references/04-meta-graph-api.md` |
| **B. Data & audience** | 04–06 | Thu thập performance/CRM, phân khúc audience 4 lớp, tạo lookalike khi seed đủ chất lượng | `references/06-ads-and-growth-loop.md` |
| **C. Strategy & brief** | 07–08 | Lập kế hoạch tuần (7 slot), sinh brief cho từng post | `references/03-execution-checklist.md` |
| **D. Sản xuất sáng tạo** | 09–11 | Viết copy/kịch bản, sinh storyboard, sản xuất ảnh/video/voice | `references/02-image-production-pipeline.md` |
| **E. QA & approval** | 12–13 | Chạy toàn bộ QA gate, route theo mức rủi ro | `references/05-qa-policy-compliance.md` |
| **F. Publish & đo lường** | 14–17 | Lên lịch/publish, reconcile qua webhook, đo snapshot, tối ưu | `references/04-meta-graph-api.md` |
| **G. Ads có kiểm soát** | 18 | Chạy ads chỉ khi có budget rõ ràng, theo objective mapping | `references/06-ads-and-growth-loop.md` |
| **H. Dashboard & vận hành** | 19–21 | Dashboard KPI, xử lý lỗi/fallback, bảo mật & compliance | `references/07-error-fallback-and-slo.md`, `references/05-qa-policy-compliance.md` |

Không được nhảy cóc giai đoạn (ví dụ sinh ảnh trước khi có brief, hoặc publish trước khi QA pass). Mỗi bước có gate riêng — nếu gate không đạt, dừng ở bước đó, không "chạy tiếp cho xong".

## 6. Sản xuất sáng tạo — nguyên tắc cốt lõi

Chi tiết đầy đủ pipeline ảnh, bảng công cụ, và quy trình chân dung sáu bước nằm ở `references/02-image-production-pipeline.md`. Ba nguyên tắc quan trọng nhất cần nhớ ngay cả khi chưa đọc chi tiết:

1. **Pipeline ảnh bắt buộc:** `Ảnh gốc → Brand Rules → Tách nền/clean → Chỉnh ảnh → Tạo biến thể → Giữ identity → Upscale → Text/Badge → QA → Export`.
2. **Chữ, giá, CTA, badge, logo không bao giờ được sinh cùng ảnh bằng diffusion.** Luôn tạo ảnh sạch trước, sau đó dùng công cụ compose xác định (ImageMagick) để chèn typography/vector theo toạ độ cố định lấy từ `brand.json`. Đây là cách duy nhất đảm bảo một dây chuyền thiết kế đồng nhất và tránh lỗi chữ do diffusion sinh ra.
3. **Reel và feed/carousel có khổ và định dạng cố định, không tự chọn:** Reel master `1080×1920` (9:16), MP4/H.264 + AAC, luôn có subtitle; feed/carousel master `1080×1350` (4:5), JPG/PNG. Mọi asset AI sinh ra ở tỉ lệ khác phải được resize/pad về đúng master này ở bước hậu kỳ, không xuất thẳng tỉ lệ gốc lên Page.

## 7. QA gate & approval routing — bắt buộc trước mọi lần publish

Chi tiết đầy đủ danh sách QA field, ngưỡng, và bảng routing nằm ở `references/05-qa-policy-compliance.md`. Tóm tắt luồng quyết định:

```
QA tự động → Fail → Repair tối đa 2 lần → vẫn fail → Quarantine + Alert (KHÔNG publish)
QA Pass → Đánh giá Policy Risk
  Risk LOW               → AUTO_APPROVED
  Risk MEDIUM/HIGH,
  claim y tế/tài chính/pháp lý,
  chính trị/xã hội, nhân vật công chúng,
  giọng/hình ảnh tổng hợp    → HUMAN_REQUIRED
  Policy FAIL              → Quarantine, KHÔNG publish
```

Không có bài nào được publish nếu chưa có `qa_report.json` pass toàn bộ field bắt buộc **và** một `approval.json` hợp lệ (auto hoặc người duyệt).

## 8. Publish & reconcile qua Meta Graph API

Chi tiết đầy đủ endpoint, quyền, và cách xử lý webhook/lỗi nằm ở `references/04-meta-graph-api.md`. Nguyên tắc vận hành cần nhớ:

- Dùng **native Meta scheduling** khi loại nội dung hỗ trợ (`scheduled_publish_time` trên Page feed); với nội dung cần gọi API đúng giờ mà Meta không hỗ trợ lịch sẵn (ví dụ một số luồng Reel), dùng scheduler ngoài (n8n Schedule Trigger, Cloud Scheduler) để kích hoạt agent đúng thời điểm.
- Sau khi publish, **luôn reconcile qua Page Webhook** (`feed` field) trước khi coi một bài là đã đăng thành công. Webhook phải được xác thực chữ ký `X-Hub-Signature-256` trước khi xử lý, và mọi event phải có dedup key.
- **Nếu phản hồi publish không chắc chắn (timeout, lỗi mạng giữa chừng...):** luôn GET để xác nhận trạng thái thật trước, **không bao giờ POST lại mù** — có thể tạo bài trùng.
- Kiểm tra lại phiên bản Graph API và endpoint đang dùng mỗi khi Meta phát hành version mới; Meta có lịch phát hành/khấu hao version định kỳ và một số field/metric có thể bị deprecate giữa các version.

## 9. Ads có kiểm soát ngân sách

Chi tiết đầy đủ ở `references/06-ads-and-growth-loop.md`. Quy tắc không thể bỏ qua: **không bao giờ tạo campaign khi `daily_budget` hoặc `max_monthly_spend` là `null`**. Agent không được tự tăng tổng ngân sách account — chỉ được tái phân bổ trong ceiling mà chủ tài khoản đã phê duyệt trước.

## 10. Đo lường & tối ưu

- Thu **organic snapshot** tại các mốc `+1h`, `+24h`, `+72h`, `+7 ngày` sau khi publish.
- Xếp hạng quyết định tối ưu theo **business KPI trước vanity KPI**: `qualified_lead → booking/sale → CPL/CPA → CTR/watch → engagement → raw reach`.
- Mỗi vòng tối ưu chỉ đổi **một nhóm biến chính** (hook, concept, format, CTA, hoặc time slot) — không đổi đồng thời nhiều biến, nếu không attribution sẽ vô nghĩa.
- Không hard-code dashboard vào các metric có thể bị Meta khấu hao/đổi tên qua từng version API — metric registry phải được kiểm thử lại mỗi khi nâng cấp Graph/Marketing API version.

## 11. Cấu trúc artifact chuẩn cho mỗi bài đăng

Mỗi content item phải có một thư mục artifact đầy đủ, xem template ở `assets/artifact_structure.txt`:

```
/content/{YYYY-MM-DD}/{content_id}/
├── brief.json            caption.txt           image_4x5.png
├── script.md             visual_prompt.json    reel_9x16.mp4
├── storyboard.json       source_manifest.json  subtitles.srt
├── qa_report.json        approval.json         thumbnail.jpg
├── publish_request.json  publish_receipt.json  metrics.json
```

Không publish nếu artifact bắt buộc (`brief.json`, `caption.txt`, `source_manifest.json`, `qa_report.json`, `approval.json`, `publish_request.json`) bị thiếu.

## 12. Error/fallback nhanh

Bảng đầy đủ và SLO ở `references/07-error-fallback-and-slo.md`. Vài quy tắc quan trọng nhất:

| Tình huống | Xử lý |
|---|---|
| OAuth/token invalid (ví dụ lỗi code `190`) | `STOP_PUBLISH` ngay → chạy token health-check/re-auth → cảnh báo người vận hành |
| `429`/rate limit | Exponential backoff + jitter — không gọi lặp liên tục |
| Publish response không chắc chắn | GET/reconcile trước, không POST lại ngay |
| QA fail | Repair tối đa 2 lần → nếu vẫn fail → quarantine |
| Policy risk cao | Chuyển human approval, không auto-publish |
| Lỡ slot đăng bài quá grace window | Dời sang slot hợp lệ tiếp theo — **không đăng bù (double-post)** |
| Ads có bất thường (spend cao, 0 conversion) | Freeze campaign/ad set liên quan — không tự tăng ngân sách |

## 13. Bảo mật & compliance bắt buộc

- Token, app secret, API key **chỉ** tồn tại trong secret manager/vault — file config chỉ chứa `secret_ref`, không bao giờ chứa giá trị thật.
- Với các lệnh gọi Graph API server-to-server, cân nhắc dùng `appsecret_proof` (HMAC-SHA256 trên access token bằng app secret) để tăng an toàn.
- PII phải được tối thiểu hoá; định danh khách hàng đưa vào Custom Audience phải được hash đúng chuẩn Meta trước khi upload; giữ bảng consent/nguồn dữ liệu/mục đích sử dụng/thời hạn lưu trữ.
- Tuyệt đối chặn: tài khoản giả, mua/tạo tương tác giả, giả danh, testimonial bịa đặt, media không rõ giấy phép, tuyên bố gây hiểu lầm, target theo thuộc tính cá nhân nhạy cảm, và bất kỳ nội dung nào vi phạm Community Standards/Advertising Standards của Meta.

## 14. Khi nào PHẢI dừng lại và hỏi người dùng

Dừng ngay, không tự suy đoán tiếp, khi gặp bất kỳ điều nào sau:

- Thiếu hoặc chưa xác nhận `brand_profile.yaml` / `offer_catalog.json` / `policy.yaml` / `brand.json`.
- Ads budget (`daily_budget`/`max_monthly_spend`) chưa được người dùng cung cấp.
- Token Meta không hợp lệ hoặc hết hạn.
- Chưa rõ quyền sử dụng hình ảnh/giọng nói người thật xuất hiện trong nội dung.
- Nội dung chạm vào chủ đề chính trị/xã hội, y tế, tài chính, hoặc pháp lý mà chưa có quy trình compliance riêng được xác nhận.
- QA fail sau 2 lần repair, hoặc policy risk ở mức MEDIUM/HIGH.
- Trạng thái publish không xác định (không rõ bài đã lên hay chưa) — luôn reconcile trước khi hỏi hoặc retry.

## 15. File cấu hình mẫu & cách dùng skill này trong thực tế

`assets/agent_config.template.json` là bản mẫu cấu hình đầy đủ (brand, meta, content, schedule, audience, ads, QA, webhook, retry, fallback, storage, compliance, SLO) theo đúng baseline mô tả ở các reference file. Khi triển khai thật:

1. Copy file này, thay mọi giá trị `REPLACE_ME`/`null` bằng giá trị thật của brand/Page/tài khoản quảng cáo.
2. Xác nhận với người dùng toàn bộ bảng ở mục 3 (giả định vận hành) trước khi đặt `ads.enabled=true` hoặc bật scheduler thật.
3. Chạy thử ở môi trường staging/organic-only trước khi bật vòng ads.

## 16. Giới hạn môi trường thực thi — đọc trước khi "chạy" quy trình này trong một phiên chat

Skill này mô tả **quy trình và hợp đồng dữ liệu** cho một hệ thống production thật (server/n8n/Cloud Run nắm giữ token và gọi Graph API trực tiếp). Một phiên chat với Claude thông thường **không tự có** kết nối mạng tới `graph.facebook.com` hay các API bên thứ ba như ComfyUI/Runway/ElevenLabs — việc gọi API thật phải diễn ra ở hệ thống triển khai riêng do người dùng vận hành và giữ token.

Trong một phiên chat, vai trò thực tế của Claude khi dùng skill này là: soạn brief/copy/kịch bản/storyboard, sinh cấu hình JSON/YAML, review QA theo checklist, và soạn `curl`/mã nguồn mẫu để người dùng chạy trong hệ thống của họ. Nếu môi trường hiện tại có kết nối MCP hỗ trợ đăng bài lên Facebook Page trực tiếp (ví dụ một connector lịch đăng đa kênh), có thể đề xuất người dùng dùng connector đó để thực hiện bước publish — nhưng toàn bộ gate ở mục 2, 7, 13 vẫn phải được áp dụng y hệt trước khi gọi bất kỳ hành động publish nào, bất kể publish qua kênh nào.
