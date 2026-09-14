# 12 · Roadmap triển khai và Definition of Done

Bộ tài liệu không tự sinh runtime. Bản hiện tại là bootstrap offline với test; chưa có live publisher, ledger, durable queue hoặc dashboard. Milestone chỉ VERIFIED khi có code, tests thực chạy, audit/error handling, evidence và rollback phù hợp phạm vi.

| Milestone | Dependencies | Đầu ra / acceptance bắt buộc |
|---|---|---|
| M0 Contain & secure | Owner account quyền riêng khi rotate | Tắt live code, bỏ literal secret ở HEAD, source scan, rotation evidence và legacy artifact review |
| M1 Truth & policy | M0 | Schema/registry, conflict inbox; policy fail-closed; signer/truth service boundary; field/version/evidence expiry tests |
| M2 Work orders & publisher | M1, app/channel permission | Durable queue/lease/outbox, immutable bundle, signed approvals, one controlled adapter; scheduler/direct-call bypass/replay/race tests |
| M3 Commerce, data & finance | M1, commerce access scope | Read-only adapter, normalized events, dedup, append-only balanced ledger, refund/COGS/cash reconciliation; no protected mutation |
| M4 Organic company | M2/M3 + truth/rights/support | Shadow từng agent rồi supervised scope nhỏ; tested research→QA→publish→measure loop |
| M5 Owner control plane | M1/M3 | MONEY/GROWTH/RISK, Decision Inbox và kill controls; actual data/permissions/unknown-state tests |
| M6 Capital Gate | M3/M5, Owner thresholds | G0–G6 tính từ evidence thật, signed expiring receipts, atomic envelope reservations, revoke/stale tests |
| M7 Paid controlled test | M6 + Owner exact authorization | Review Marketing API adapter, finite envelope, stop-loss exercise, provider pause verification; dry-run trước live |
| M8 Eval & promotion | M1, lặp mọi milestone | Regression/holdout/adversarial/shadow evidence; independent promotion/demotion, no self-grant |

M8 không chờ đến cuối mới viết test. M4 có thể phát triển offline song song với M2/M3, nhưng không được launch nếu dependency launch gate chưa đạt.

## Definition of Done theo phạm vi

- Code/contract có boundary rõ và không dựa vào LLM tự giữ lời.
- Unit/integration/negative tests; CI logs/link đúng commit. Test mock không là provider staging test.
- Lint/syntax/schema/link/secret checks phù hợp stack; không bỏ lỗi bằng xóa test.
- Error messages redacted, timeouts/bounded retry/unknown reconciliation, audit references.
- Runbook, ownership, migration/rollback và residual risk.
- docs/implementation/status.md cập nhật mức thực: NOT_STARTED, IN_PROGRESS, IMPLEMENTED, VERIFIED hoặc BLOCKED.
- Không "production-ready" nếu credentials, data, signer, consent hoặc deployment chưa kiểm định.

## ADR cần quyết định

ADR-001 dùng modular Node toolkit offline, không rewrite commerce. ADR-002 read-only source contract thay import code/prod DB trực tiếp. ADR-003 live transport khóa cho đến security/authorization runtime hoàn chỉnh. Các quyết định database/queue/vault/cloud do deployment owner chọn theo volume, recovery và cost; không thêm vendor trả phí mặc định.

## Triển khai an toàn

Dev/test không có production secrets. Staging có tài khoản/test fixtures được phép, không trộn customer PII. Production dùng service identity riêng, least privilege, egress allowlist và independent signer. CI được đọc source và chạy test; không cấp quyền Meta, bank hay customer database.

Rollout canary theo action/agent/account, không all-or-nothing autonomy. Rollback code không rollback side effects ngoài mạng: cần reconcile/delete/pause đúng quyền và theo runbook. Archive evidence trước migration; restore rehearsal trước khi tin backup.

## Thứ tự tiếp theo sau bộ file này

Đóng P0 credential phía provider và review .skill archives; Owner chốt truth/service/rights. Xây M1 signer/evidence store với test isolation, M2 queue/state persistence và M3 event/finance adapter được cấp quyền. Có thể làm schemas/tests/drafts ngay nhưng không dùng mock PASS để đánh dấu toàn milestone xong.
