# QA Gate, Approval Routing & Compliance

## 1. QA tự động — danh sách field bắt buộc

`qa_report.json` phải **pass toàn bộ** các field sau trước khi một bài được xem xét approval:

```
factual_claims_verified    = true
brand_voice_score          >= threshold (từ policy.yaml)
duplicate_score            <= threshold (từ policy.yaml)
copyright_or_license_verified = true
pii_leak                   = false
secret_leak                = false
broken_link                = false
aspect_ratio_pass          = true
caption_safe_area_pass     = true
policy_pass                = true
ai_disclosure_resolved     = true
```

Nếu bất kỳ field nào fail: repair tối đa 2 lần, sau đó nếu vẫn fail → `QUARANTINE` (không publish), gửi alert cho người vận hành.

## 2. AI disclosure — khi nào bắt buộc

Meta yêu cầu người đăng tự công bố (self-disclose) đối với một số nội dung tổ chức (organic content) có **video photorealistic** hoặc **audio nghe như thật** được tạo/chỉnh sửa bằng kỹ thuật số. Ads Manager cũng có cơ chế disclosure/"AI info" riêng đối với media do AI tạo trong quảng cáo. Trước khi publish bất kỳ Reel/video nào dùng voice tổng hợp hoặc nhân vật tổng hợp, kiểm tra field `ai_disclosure_resolved` — nếu nội dung thuộc diện phải công bố mà chưa được xử lý, đây là một `POLICY_FAIL`, không phải cảnh báo có thể bỏ qua.

## 3. Approval routing — bảng quyết định đầy đủ

| Điều kiện | Kết quả |
|---|---|
| Risk `LOW` + QA pass toàn bộ | `AUTO_APPROVED` |
| Risk `MEDIUM` hoặc `HIGH` | `HUMAN_REQUIRED` |
| Regulated claim (y tế/tài chính/pháp lý) | `HUMAN_REQUIRED` |
| Chủ đề chính trị/vấn đề xã hội | `HUMAN_REQUIRED` |
| Có nhân vật công chúng xuất hiện | `HUMAN_REQUIRED` |
| Giọng/hình ảnh tổng hợp (synthetic likeness/voice) chưa xác minh quyền | `HUMAN_REQUIRED` |
| Copyright chưa chắc chắn | `HUMAN_REQUIRED` |
| `POLICY_FAIL` ở bất kỳ mức nào | `QUARANTINE` — **không publish** |

Danh sách trigger chuyển human approval đầy đủ (dùng để cấu hình `policy.yaml`):

```
MEDIUM_RISK
HIGH_RISK
health_claim
financial_claim
legal_claim
political_or_social_issue
public_figure
synthetic_likeness
synthetic_voice_without_verified_rights
copyright_uncertain
```

Danh sách hard block (không bao giờ được publish, kể cả qua human approval — nếu phát hiện, coi là lỗi hệ thống cần sửa upstream):

```
fabricated_testimonial
fabricated_evidence
secret_leak
pii_violation
unlicensed_media
fake_engagement
impersonation
prohibited_targeting
policy_violation
```

## 4. Nguyên tắc viết copy để tránh policy risk

- Không cho phép copy agent tự "bịa" số liệu hoặc case study — mọi claim định lượng bắt buộc có `source_ref` xác thực được.
- Loại bỏ engagement bait (ví dụ "tag một người bạn", "comment số 1 nếu đồng ý" nhằm thao túng thuật toán) — đây là dạng hành vi bị Meta coi là inauthentic engagement.
- Community Standards của Meta có quy định riêng về spam và cấm các mô hình tạo tương tác giả — copy/CTA không được thiết kế để lách các quy định này.

## 5. Bảo mật & compliance (bước 21 trong checklist)

- Token, app secret, API key **chỉ** tồn tại trong Vault/Secret Manager; file config chỉ chứa `secret_ref`, không bao giờ giá trị thật.
- Với server-to-server Graph calls, có thể dùng `appsecret_proof` (HMAC-SHA256 trên access token bằng app secret).
- Webhook phải xác thực chữ ký (`X-Hub-Signature-256`) trước khi enqueue xử lý.
- PII phải được tối thiểu hoá; Customer Audience identifiers phải được hash đúng chuẩn Meta trước khi upload; giữ bảng consent/nguồn dữ liệu/mục đích sử dụng/thời hạn lưu trữ, và đảm bảo có quy trình xoá dữ liệu khi cần.
- Tuyệt đối chặn: tài khoản giả, mua/tạo tương tác giả, giả danh (impersonation), testimonial bịa đặt, media không rõ giấy phép sử dụng, tuyên bố gây hiểu lầm (deceptive claims), target quảng cáo dựa trên thuộc tính cá nhân nhạy cảm, và bất kỳ nội dung nào vi phạm Community Standards/Advertising Standards của Meta.

## 6. Nguyên tắc fail-closed cho toàn bộ compliance

Điểm quan trọng nhất xuyên suốt toàn bộ hệ thống: **mất token, QA không chắc chắn, policy risk cao, ngân sách chưa khai báo, hoặc trạng thái publish không xác định đều phải dẫn đến dừng/quarantine/reconcile** — không bao giờ dẫn tới "agent tự đoán rồi tiếp tục chạy". Đây không phải một tuỳ chọn cấu hình có thể tắt để "chạy nhanh hơn".
