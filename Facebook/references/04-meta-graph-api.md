# Meta Graph API Integration

## 1. Version hiện hành

Tính đến **1/9/2026**, phiên bản Graph API/Marketing API mới nhất là **v26.0**, phát hành ngày **29/7/2026** (đã xác minh lại qua tài liệu changelog chính thức của Meta). Meta phát hành version mới định kỳ và khấu hao version cũ theo lịch riêng — **luôn kiểm tra lại version hiện hành trước khi triển khai thật**, vì endpoint/field có thể đổi hoặc bị deprecate giữa các version (ví dụ một số metric reach/impressions cũ đã được thay thế bằng metric mới trong các version gần đây). Không hard-code giả định version vào code production mà không có cơ chế kiểm tra định kỳ.

## 2. Bảng quyền (permissions) theo mục đích

| Mục đích | Quyền cần thiết |
|---|---|
| Organic publishing | `pages_show_list`, `pages_read_engagement`, `pages_manage_posts` |
| Page feed Webhooks | thêm `pages_manage_metadata` (cùng `pages_show_list`) |
| Ads reporting | `ads_read` |
| Ads management (tạo/sửa campaign) | `ads_management` — có thể cần Advanced Access/App Review tuỳ cách app truy cập asset |

`pages_manage_posts` cho phép tạo/sửa/xoá Page posts và phụ thuộc vào các quyền Page liên quan khác ở trên.

## 3. Endpoint chính (minh hoạ theo v26.0 — kiểm tra lại version trước khi dùng)

```
base_url:              https://graph.facebook.com/v26.0
page_feed_endpoint:    /{page_id}/feed
reels_endpoint:        /{page_id}/video_reels
subscribed_apps:       /{page_id}/subscribed_apps
debug_token_endpoint:  /debug_token
ads_insights_endpoint: /{ad_account_id}/insights
```

- **Page post tiêu chuẩn:** có thể lên lịch bằng cách gọi `/{page_id}/feed` với nội dung ở trạng thái chưa publish kèm `scheduled_publish_time`.
- **Reel:** dùng Reels Publishing API riêng (`/{page_id}/video_reels`) cho Facebook Page — không dùng chung endpoint feed thông thường cho video dạng Reel.
- **Kiểm tra token:** dùng `/debug_token` để lấy metadata của token (hạn dùng, scope, app liên kết) trước khi thực hiện bất kỳ publish nào — đây là bước health-check bắt buộc (☐ 02 trong checklist).

## 4. Ví dụ gọi API (minh hoạ cấu trúc — chạy trong hệ thống production giữ token, không chạy trong phiên chat)

Lên lịch một Page post:

```bash
curl -X POST "https://graph.facebook.com/v26.0/{page_id}/feed" \
  -F "message=<nội_dung_caption>" \
  -F "link=<url_nếu_có>" \
  -F "published=false" \
  -F "scheduled_publish_time=<unix_timestamp>" \
  -F "access_token=<PAGE_ACCESS_TOKEN>"
```

Kiểm tra token trước khi dùng:

```bash
curl -G "https://graph.facebook.com/v26.0/debug_token" \
  --data-urlencode "input_token=<PAGE_ACCESS_TOKEN>" \
  --data-urlencode "access_token=<APP_ACCESS_TOKEN>"
```

Reconcile sau khi publish (GET để xác nhận trạng thái thật trước khi retry bất cứ điều gì):

```bash
curl -G "https://graph.facebook.com/v26.0/{post_id}" \
  --data-urlencode "fields=id,created_time,is_published" \
  --data-urlencode "access_token=<PAGE_ACCESS_TOKEN>"
```

## 5. Page Webhooks & reconciliation

- Subscribe field `feed` trên Page Webhook để nhận thay đổi Page gần thời gian thực.
- **Bắt buộc** xác thực chữ ký header `X-Hub-Signature-256` trước khi enqueue/xử lý bất kỳ payload webhook nào — không tin payload chưa xác thực.
- Mọi event phải có **dedup key** (idempotency theo `event_id`) để tránh xử lý trùng khi Meta gửi lại webhook.
- **Idempotency cho publish:** dùng khoá `content_id:scheduled_at` để đảm bảo không đăng trùng một content item hai lần dù job bị chạy lại.
- Nếu phản hồi publish không chắc chắn (timeout, mất kết nối giữa chừng...): **GET để reconcile trạng thái thật trước, không bao giờ POST lại mù** — retry publish khi chưa biết kết quả lần trước có thể tạo bài trùng lặp trên Page.

## 6. Bảo mật khi gọi API

- Token, app secret, API key chỉ tồn tại trong Vault/Secret Manager; config chỉ chứa `secret_ref` (ví dụ `secret://meta/page_access_token`), không bao giờ chứa giá trị thật trong file cấu hình hay log.
- Với các lệnh gọi Graph API server-to-server, có thể áp dụng `appsecret_proof` — một tham số được tính bằng HMAC-SHA256 trên access token dùng app secret làm khoá — để tăng cường xác thực request.
- Meta áp dụng rate limit và trả về usage header để ứng dụng theo dõi mức sử dụng API. Khi gặp lỗi `429`/áp lực rate limit: dùng exponential backoff kèm jitter, **không gọi lặp liên tục (hammer API)**.
- Lỗi OAuth/token invalid (ví dụ error code `190`) phải dẫn tới `STOP_PUBLISH` ngay lập tức, kích hoạt quy trình token health-check/re-auth, và cảnh báo người vận hành — không retry publish khi token đã biết là invalid.

## 7. Scheduler bên ngoài

Dùng **native Meta scheduling** (`scheduled_publish_time`) bất cứ khi nào endpoint/loại content hỗ trợ. Với các loại nội dung cần gọi API đúng giờ mà Meta không có lịch sẵn phù hợp, dùng một scheduler ngoài để kích hoạt agent:

- **n8n** — có Schedule Trigger phù hợp cho MVP/workflow orchestration.
- **Cloud Scheduler** (hoặc tương đương) — hỗ trợ cron và retry theo exponential backoff, phù hợp cho production.

## 8. Lưu ý về giới hạn môi trường chat

Trong một phiên chat với Claude, môi trường thực thi (bash tool) thường **không** có kết nối mạng tới `graph.facebook.com` theo mặc định — mọi lệnh `curl` ở trên là **mẫu tham khảo để chạy trong hệ thống production riêng** (server/n8n/Cloud Run) do người dùng vận hành và giữ token, chứ không phải để chạy trực tiếp trong phiên chat. Nếu người dùng muốn Claude thực sự thực hiện hành động publish trong phiên làm việc, cách phù hợp là dùng một connector/MCP hỗ trợ đăng bài mạng xã hội (nếu môi trường có sẵn) thay vì gọi Graph API thô — nhưng mọi gate ở mục QA/policy vẫn phải áp dụng trước khi gọi hành động publish, bất kể qua kênh nào.
