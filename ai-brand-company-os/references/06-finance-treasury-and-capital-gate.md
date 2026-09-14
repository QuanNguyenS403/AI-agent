# 06 · Finance, treasury và Capital Gate

## Tiền và lợi nhuận không phải cùng một đại lượng

Order submitted là ý định mua; cash received là tiền có chứng từ provider/bank; revenue recognition cần chính sách kế toán phù hợp; realized organic profit cho capital gate là chỉ tiêu quản trị bảo thủ, không thay báo cáo kế toán/thuế.

VND dùng số nguyên không âm cho amounts; ledger correction dùng entry reversal, không sửa entry cũ. Không dùng float tiền, NaN, Infinity, chuỗi số hoặc default 0 cho chi phí chưa biết. Thiếu COGS/fees/refund exposure làm gate FAIL.

Đề xuất công thức quản trị, cần Owner/Finance duyệt:
net_collected = cash_settled − cash_refunds − disputed_cash;
contribution = net_collected − allocated_COGS − fulfillment − shipping_subsidy − payment_fees − affiliate_cost;
realized_organic_profit = phần contribution được attribution organic có chứng cứ − organic_operating_cost − provisions chưa trùng khoản đã trừ.

Phải có rule phân bổ chi phí chung và refund window. Chi phí LLM, content, phần mềm không miễn phí chỉ vì gọi là organic. Không trừ reserve hai lần trong profit và cash available.

## Ledger và reconciliation production

Entry cần immutable id, source event id, debit/credit accounts, amount/currency, occurred/recorded time, source evidence/digest, order reference đã pseudonymize, attribution version, created_by và reversal_of khi sửa. Import dedup theo source+event ID; unique constraints; balanced transaction; close period/version.

Đối soát ít nhất bank/provider ↔ order/payment ↔ refunds/chargebacks ↔ ledger. Admin toggle PAID là tín hiệu cần đối chiếu, không tự đủ bằng chứng cash. COD delivered chưa chứng minh tiền courier đã remitted.

Mismatched amount/order/currency, duplicate provider transaction, missing sequence, stale import và unexplained adjustment chuyển exception queue. Finance không được tự bù bằng entry "marketing revenue" hoặc đổi attribution để đạt gate.

Bản hiện tại **chưa có ledger/database/reconciliation runtime**. Local Capital Gate evaluator chỉ tạo diagnostic proposal, không ký receipt và luôn authorizes_spend=false.

## Reserve và budget envelope

Owner/Finance định nghĩa protected cash: vận hành bắt buộc, fulfillment/preorder liabilities, refund/chargeback reserve, thuế/nghĩa vụ, emergency reserve và cam kết chưa settlement. Khoản tiền bị hạn chế mục đích không được đem chạy Ads.

available_cash = verified_unrestricted_cash − reserve_requirement − committed_exposure.
Budget request không được vượt phần tái đầu tư organic profit được duyệt và available_cash. Mọi threshold unset/null, currency mismatch hoặc số âm không hợp lệ → FAIL.

Envelope production có id, currency, amount_total, daily_limit khi áp dụng, account/campaign scope, valid_from/expires_at, policy version, gate receipt id, source close id, signer Finance/Governance/Owner theo quyền, pending_spend/settled_spend/remaining và stop-loss. Không có default vô hạn. Reservation concurrent phải atomic; không chỉ kiểm tra remaining trước network.

## G0–G6: tất cả phải đạt

| Gate | Điều kiện | Evidence / người chịu trách nhiệm |
|---|---|---|
| G0 Governance | Owner policy, secrets/rights/compliance launch review, emergency controls pass | Governance và Owner; incident P0 không mở |
| G1 Commerce integrity | Checkout/payment/refund/fulfillment đúng, capacity và policy rõ | Commerce test + reconciliation; Product/Conversion |
| G2 Organic economics | Đơn organic đã settlement đủ mẫu/window, realized profit dương đạt ngưỡng | Finance close + attribution version |
| G3 Treasury | Cash/reserve/exposure đã xác minh, tiền khả dụng đủ test envelope | Bank/provider + ledger + reserve policy |
| G4 Measurement | Coverage/freshness/identity/dedup đạt ngưỡng; không attribution giả | Analytics data-quality report và Finance tie-out |
| G5 Operational readiness | Có người xử lý incident, stop-loss, rollback, account rights và delivery capacity | Exercise/runbook evidence; Governance |
| G6 Authorization | Owner cho phép phạm vi paid; request cụ thể; Finance/Governance tách principal; receipt còn hạn | Signed gate + signed envelope, không self-approval |

Threshold phải Owner phê chuẩn: min organic settled orders, min observation days, min realized profit, min attribution coverage, max refund rate, max data age, reserve requirement, max reinvestment fraction và max test budget. Không tự invent số để đạt PASS; [config](../config/capital-policy.json) để null cho các quyết định chưa có.

## Receipt và thu hồi

Evaluator tính gate từ dữ liệu có typed provenance; không tin mảng G0:PASS do LLM gửi. Production gate receipt cần evaluation_id, G0–G6 findings, evidence digests, source close/policy versions, evaluated_at, expires_at, signatures. PASS hết hạn hoặc một nguồn thay đổi/revoked → FAIL, hủy reservation chưa execute.

Tái kiểm tra trước từng action chi; monitor bất thường trong khi campaign tồn tại. Gate pass không mở ngân sách mới, không cho tăng daily/lifetime caps, không cho dùng tài khoản khác.

## Stress tests bắt buộc

Duplicate order/payment/refund; COD chưa remitted; pending transfer; admin toggle; thiếu phí; NaN/negative cash; stale bank import; partial refund; reorder dữ liệu; hai worker cùng reserve; currency khác; gate hết hạn sau scheduling; threshold bị agent nới; pause provider thất bại. Mọi case phải giữ chi trong envelope hoặc dừng và báo remaining exposure.

Dashboard MONEY hiện planned contract, không hiển thị cash=0 khi chưa kết nối: dùng null/UNKNOWN. Ads budget=0 là giới hạn chính sách, không phải số dư tài khoản.
