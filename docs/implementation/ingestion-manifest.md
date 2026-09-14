# Manifest nạp dữ liệu

Audit source ngày 2026-09-14. AI-agent baseline 72e9c67ed4f62de697625e680771a139341e070a; pijama pin 828409af7a26a2a5f4b4420789fc753588c9e1dc. Các file Company OS được biên soạn trong lần bổ sung này, không giả là đã tồn tại ở baseline.

## Thứ tự cho builder agent

| Thứ tự | Nguồn | Rule cần nạp / runtime chịu trách nhiệm |
|---|---|---|
| 1 | README.md | Maturity offline, không tự mở live |
| 2 | ai-brand-company-os/SKILL.md | Router luật và thứ tự nạp |
| 3 | references/00-current-state-audit.md | Source evidence và phạm vi audit |
| 4 | references/01-company-constitution.md | Quyền Owner, giới hạn không vượt |
| 5 | references/03-governance-autonomy-and-approvals.md | Executor enforce, signer isolation |
| 6 | references/02-organization-and-agent-charters.md | Registry, separation, handoff |
| 7 | references/04-operating-system-and-work-orders.md | WO schema/state/lease/idempotency |
| 8 | references/10-risk-security-and-compliance.md | Secrets, rights, privacy, incident |
| 9 | references/08-data-measurement-and-experimentation.md | Event/metric/provenance/uncertainty |
| 10 | references/06-finance-treasury-and-capital-gate.md | Ledger/reserve/G0–G6 |
| 11 | references/05-organic-growth-engine-meta.md | Organic research→QA→learning |
| 12 | references/09-owner-dashboards.md | MONEY/GROWTH/RISK |
| 13 | references/11-quannguyens-operating-plan.md | SKU constraints và kế hoạch có điều kiện |
| 14 | references/12-implementation-roadmap.md | Milestone DoD, rollout |
| 15 | references/13-agent-evaluation-and-promotion.md | Critical eval, independent promotion |
| 16 | references/07-paid-acquisition-agent.md | Không paid trước gate/envelope |
| 17 | Facebook/SKILL.md | Department router, no bypass |
| 18 | Facebook/README.md | Lệnh thật và blocked exit codes |
| 19 | Toàn config/references/services/lib/scripts/reports liên quan của Facebook | Xem source-registry, READMEs từng thư mục và required-files.json |
| 20 | README/package/PROTECTED/src/server/tests của pijama | Source-manifest có 129 file truy xuất; read-only, không thực thi code từ source |

references/ trong các hàng 3–16 là ai-brand-company-os/references/. Đọc thêm reference 14 cho commerce integration. [required-files](required-files.json) là inventory bootstrap runtime/docs cần có, kiểm bằng npm run validate.

## Trạng thái và sự trung thực khi nạp

Nguồn mới: AUTHORED_AND_STATIC_REVIEWED, không phải historical restoration nguyên văn. Source cũ: truy xuất text đầy đủ vào phạm vi review nhưng chỉ phân tích sâu các boundaries liên quan; manifest pijama ghi RETRIEVED/TARGETED_STATIC_NOT_FULL_CERTIFICATION. Không khẳng định đã audit mọi dòng hoặc chạy tests commerce. Binary chưa inspect được không được nạp executable.

Mỗi builder tiếp theo phải thêm ingestion receipt riêng gồm commit, files actually read, unresolved conflicts và mapping rule→component→test/evidence. Không copy nhãn VERIFIED từ manifest này làm chứng minh nó đã đọc.

## Mâu thuẫn / Owner decisions

Chi tiết trong [Decision Inbox](../../integrations/pijama/decision-inbox.json): credential rotation, material/certificates, offers/service, preorder/stock/size, UGC/rights, payment/attribution, privacy và money thresholds. Mặc định NO_NEW_AUTHORITY; không có chữ ký/decision được bịa.

## Runtime coverage

Internal schema/policy/WO proposal và hard lock có code/tests; trusted signer, distributed queue, real media QA, Meta/IG transport, commerce adapter, ledger/dashboards và live eval còn NOT_STARTED/BLOCKED. [status](status.md) phân loại theo đúng phạm vi. Docs không làm thay các thành phần đó.
