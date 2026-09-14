# 09 · Ba dashboard Owner

Đây là contract UI/data chưa phải ứng dụng dashboard đã deploy. Chỉ có ba entry point cấp Owner: MONEY, GROWTH, RISK. Các màn hình chi tiết, logs và Decision Inbox nằm dưới chúng, không tạo dashboard thứ tư.

## MONEY

Hiển thị currency, thời điểm data, cash verified, revenue theo policy accounting, cash refunds, COGS, operating costs, realized organic profit, reserve, available cash, committed/pending spend và envelope remaining. Mỗi số có source close ID và reconciliation status.

UNKNOWN hiển thị chưa đủ dữ liệu, không 0. Tách tiền đang nắm giữ với lợi nhuận được phép tái đầu tư. Budget=0 là policy, không phải balance. Nút approve envelope yêu cầu đúng signer/account/scope/time và xác thực mạnh; UI không tự có quyền ký.

## GROWTH

Funnel qualified visits → cart → accepted checkout → verified payment → delivered/refunded → repeat purchase. Hiển thị organic attribution coverage, net contribution, conversion lag, content-assisted vs attributable outcomes, retention cohort và experiment result.

Reach/CTR/views là chẩn đoán phụ, không làm headline lợi nhuận. Có date range/attribution version và source freshness. Không cộng metrics trùng người hoặc so paid với organic bằng hai cửa sổ khác nhau. Small sample ghi rõ.

## RISK

Company state, external transport status, kill switches, credential health (không giá trị), autonomy/grants/expiry, incidents, consent/rights/claim expiry, stale inputs, protected-data requests, audit/backup health và Capital Gate G0–G6.

Decision Inbox mỗi item có ID, loại, nguồn mâu thuẫn, target field/action, options, recommendation, cost/risk, required signer, deadline, default no-action, impacted WO và status. Owner click accept không tự thay secret/protected repo; cần authorized executor và audit.

## Interaction design

Owner kiểm tra risk trước, money tiếp, growth sau. Critical risk/cash mismatch phải có banner cùng source time. Alert có ưu tiên và dedup, không spam "không có gì mới". Acknowledge khác resolve; dismiss khác approve. Thay limits phải hiển thị diff và xác nhận riêng.

Emergency control hiển thị rõ local dispatch stopped hay remote campaigns confirmed paused. Không tạo cảm giác an toàn giả khi provider không đáp ứng.

## Contract kỹ thuật cần triển khai

Read model từ event/ledger đã xác minh; row-level access, identity separation, cache TTL và revocation; audit view redacted. Browser không giữ provider/admin credentials. Approval endpoint bind request digest và CSRF/auth protections phù hợp.

DoD: tính từ source thật, reconcile tie-out, schema/API contract, zero/unknown/partial/error UI, permissions test, approval replay/stale tests, alerts và recovery exercise. Screenshot đẹp hoặc mock JSON không được ghi production-ready.
