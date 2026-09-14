# Error Handling, Fallback & SLO

## 1. Bảng lỗi/xử lý đầy đủ

| Lỗi | Xử lý |
|---|---|
| AI generation timeout | Retry ×2 → fallback provider/template |
| Video generation fail | Fallback static/carousel |
| `429`/rate pressure | Exponential backoff + jitter; không hammer API |
| OAuth/token invalid (ví dụ code `190`) | `STOP_PUBLISH` → chạy token health-check/re-auth → cảnh báo |
| Publish response không chắc chắn | GET/reconcile trước; **không POST lại ngay** |
| Webhook lặp | Dedup theo event/idempotency key |
| QA fail | Repair tối đa ×2 → quarantine |
| Policy risk cao | Chuyển human approval |
| Lỡ slot < grace window | Vẫn publish nếu còn hợp lệ trong khung giờ |
| Lỡ slot > grace window | Dời sang slot hợp lệ tiếp theo; **không đăng bù (double-post)** |
| Ads anomaly (spend cao, bất thường) | Freeze campaign/ad set liên quan; không tự tăng budget |

Meta áp dụng rate limit và trả về usage header để ứng dụng theo dõi mức sử dụng API. Lỗi OAuth/token cần được xử lý chủ động thay vì retry vô hạn.

## 2. Bảng fallback theo loại thất bại

```
video_generation_failure        → STATIC_OR_CAROUSEL
voice_generation_failure        → TEXT_CAPTION_OR_ALTERNATE_TTS
qa_failure_after_repairs        → QUARANTINE
unknown_publish_state           → RECONCILE_BEFORE_RETRY
high_policy_risk                → HUMAN_APPROVAL
scheduler_late_beyond_grace     → MOVE_TO_NEXT_VALID_SLOT
```

## 3. Cấu hình retry đề xuất

```json
{
  "retry": {
    "generation": {
      "max_attempts": 2,
      "fallback_to_static_creative": true
    },
    "meta_api": {
      "max_attempts": 5,
      "strategy": "exponential_backoff_with_jitter",
      "retry_429": true,
      "retry_unknown_publish_without_reconciliation": false
    },
    "oauth_error": {
      "stop_publish": true,
      "trigger_token_health_check": true,
      "alert": true
    }
  }
}
```

Lưu ý: `retry_unknown_publish_without_reconciliation: false` là bắt buộc — không bao giờ retry một publish khi chưa biết chắc kết quả lần gọi trước.

## 4. SLO nội bộ đề xuất

```
publish_success_rate        >= 99%
duplicate_publish_count     = 0
secret_leak_count           = 0
unapproved_high_risk_publish = 0
unsupported_claim_publish   = 0
webhook_duplicate_side_effect = 0
```

Đây là các con số **SLO nội bộ đề xuất** để agent tự giám sát, không phải benchmark do Meta công bố. Điều chỉnh theo thực tế vận hành của từng brand sau giai đoạn thử nghiệm.

## 5. Nguyên tắc tổng quát khi thiết kế fallback

Điểm quan trọng nhất: **fail closed**. Bất kỳ trạng thái không chắc chắn nào (mất token, QA không rõ, policy risk cao, budget chưa khai báo, publish state không xác định) đều phải dẫn tới dừng/quarantine/reconcile — không bao giờ dẫn tới "agent tự đoán rồi tiếp tục". Đây là nguyên tắc thiết kế xuyên suốt toàn bộ hệ thống, không riêng phần error handling.
