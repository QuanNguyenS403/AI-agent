# Facebook & Instagram · governed offline department

Bộ phận kênh organic của [Company OS](../ai-brand-company-os/SKILL.md). Publisher/AI pipeline cũ chưa đủ kiểm soát và có kết quả mô phỏng. Bản này thay các đường thực thi nguy hiểm bằng toolkit offline rõ trạng thái.

## Chạy và kết quả mong đợi

Dùng Node.js >=22. Từ root repo:

```sh
npm run validate
npm test
npm run preview
```

Từ Facebook:

| Lệnh | Kết quả | Network / mutation |
|---|---|---|
| npm run preview | SHADOW, drafts, media null, QA NOT_RUN | Không |
| npm run sync-products | Snapshot pijama gắn commit, không live sync | Không |
| npm run health | network_checked=false, credential_checked=false | Không |
| npm run check-progress | Config/bootstrap status, published_count=null | Không |
| npm run pause-publishing | Local lock active; remote_pause_confirmed=false | Không |
| npm run post-now | BLOCKED, exit 2 | Không |
| npm run start-publishing | BLOCKED, exit 2 | Không |
| npm run set-token | BLOCKED, exit 2; không nhận/ghi credential | Không |

update_page_info, inspect_new_token và update_new_token cũng dừng exit 2. Không đưa token vào tham số dòng lệnh. Exit 2 là từ chối có chủ đích, không lỗi cần "sửa" bằng bỏ gate.

## File nào có hiệu lực

[config](config/README.md) liệt kê nguồn runtime. [references](references/README.md) chứa SOP hiện hành. [lib](lib/README.md), [services](services/README.md), [scripts](scripts/README.md) nói rõ API local và giới hạn. [reports](reports/README.md) phân biệt kiểm định thật với report legacy.

Runtime đọc company policy/state, runtime.json và snapshot có kiểm soát; không đọc legacy offer/catalog/QA report để cấp quyền. Config cũ giữ để trace mâu thuẫn nhưng registry đánh dấu QUARANTINE. Hai .skill archive chưa được kiểm định binary, không cài/nạp.

## Mở live trong tương lai

Không có switch bật nhanh. Cần Owner scope, credential rotation, evidence/rights/consent, trusted signer, immutable bundle, durable queue/reservations, one controlled transport, provider reconciliation, negative tests và review code trong M1–M2. Instagram có login/permissions/media lifecycle riêng, chưa có adapter live.

Paid luôn qua Finance G0–G6; không xem "budget đã điền" hoặc "bài đạt reach" là lý do mở Ads.

## Kiểm định và bảo mật

Unit tests chứng minh hành vi offline/dừng, không kiểm chứng token, Meta API, engine tạo ảnh hay deployment. Validator kiểm tra text/links/config/cú pháp, không scan Git history hoặc binary. Đọc [security](../SECURITY.md); Owner còn phải revoke/rotate credential từng commit.
