# 07 · Error, fallback và SLO

| Trường hợp | Hành vi an toàn | Tiếp tục khi |
|---|---|---|
| Config thiếu/sai kiểu | DENY | Sửa có review/test |
| Claim/rights chưa xác minh | Quarantine | Evidence/current approval |
| Invalid token/permission | Không lách quyền | Operator authorized xử lý |
| Rate limited | Bounded backoff/deadline | Provider signal hợp lệ |
| Mutation timeout | RECONCILING | Xác minh remote |
| Media changed/approval expired | Thu hồi READY | Revision và approval mới |
| QA chưa chạy | NOT_RUN | Engine/reviewer thực |
| Data/ledger stale | UNKNOWN/Gate FAIL | Reconciliation |
| Remote stop thất bại | Ngừng dispatch, alert exposure | Provider pause verified |

SLO production phải Owner duyệt theo capacity: deadline, freshness, reconciliation delay, error budget và support escalation. Chưa có baseline thì null/BLOCKED, không hứa 99.9% hoặc support 24/7.

Retry giới hạn, phân loại transient/permanent, jitter, DLQ redacted, replay có authorization mới. Unknown publication không phải failure chắc chắn. Local stop không xóa provider schedule.

Runbook: detect → scope/stop → preserve redacted evidence → owner alert → authorized repair → reconcile → regression → independent restore. Không in token/raw customer data hoặc xóa report lỗi để dashboard xanh.

Bản offline không mô phỏng kiểm tra mạng thành health PASS; network_checked=false. Exit 2 ở mutation CLI là thiết kế mong đợi.
