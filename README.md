# QuanNguyenS · AI Brand Company OS

Hệ điều hành công ty AI cho thương hiệu QuanNguyenS / 10PM Pijama. Organic tạo giá trị và lợi nhuận đã đối soát trước; paid acquisition chỉ được xem xét sau Capital Gate. Đây là **bộ quy chế + công cụ bootstrap offline**, không phải tuyên bố đã có một công ty tự vận hành production.

## Bắt đầu

1. Đọc [Company OS skill](ai-brand-company-os/SKILL.md) và [hiến pháp](ai-brand-company-os/references/01-company-constitution.md).
2. Đọc [manifest nạp dữ liệu](docs/implementation/ingestion-manifest.md); không coi file tồn tại là năng lực đã triển khai.
3. Đọc [Facebook skill](Facebook/SKILL.md), [hướng dẫn](Facebook/README.md), [hợp đồng pijama](integrations/pijama/README.md).
4. Chạy bằng Node.js 22 hoặc mới hơn:

```sh
npm run validate
npm test
npm run preview
```

Các lệnh trên không cần credential, không gọi Meta, không gửi email và không thay đổi commerce. Không cần cài dependency bên thứ ba.

## Trạng thái mặc định

```text
COMPANY_STATE=BOOTSTRAP
DEFAULT_AUTONOMY=A0
EXTERNAL_PUBLISHING=false
PAID_ACQUISITION=false
ADS_BUDGET_VND=0
CAPITAL_GATE=FAIL
DRY_RUN=true
```

Transport phát hành thật bị khóa trong mã của phiên bản này: sửa boolean hoặc đưa vào JSON approval giả không mở được publisher. Để triển khai live phải thực hiện các milestone trong [roadmap](ai-brand-company-os/references/12-implementation-roadmap.md), review mã và cấp quyền riêng; không có cờ "bypass".

## Cấu trúc và nguồn sự thật

| Phần | Trách nhiệm |
|---|---|
| ai-brand-company-os/ | Hiến pháp, quyền hạn, work orders, finance, data, risk và đánh giá agent |
| Facebook/ | Bộ phận nội dung Facebook/Instagram, preview offline và hợp đồng adapter |
| integrations/pijama/ | Danh mục nguồn gắn commit, API/commerce contract, snapshot có giới hạn và Decision Inbox |
| docs/implementation/ | Trạng thái triển khai, phụ thuộc, work orders và bằng chứng cần có |
| tests/; scripts/ | Test hồi quy và kiểm tra tính đầy đủ/cú pháp/liên kết/secret trong văn bản |
| reports/ | Báo cáo kiểm định có phạm vi rõ ràng, không chứa dữ liệu khách hàng |

Repo commerce [pijama](https://github.com/QuanNguyenS403/pijama) đã có README, package, PROTECTED-DATA, src và server; **không tạo một bản commerce giả trong repo này**. Snapshot nguồn không phải tồn kho live, không xác minh giấy chứng nhận hay review.

Owner điều hành qua đúng ba dashboard **MONEY, GROWTH, RISK**; Decision Inbox nằm bên trong RISK và liên kết hai dashboard còn lại. Hiện dashboard là hợp đồng dữ liệu, chưa có giao diện production.

## Bảo mật và lịch sử

Đọc [SECURITY](SECURITY.md) trước khi vận hành. Hai script cũ có credential literal; bản mới vô hiệu đường thực thi đó. Không thể kết luận credential đã bị thu hồi chỉ từ Git. Owner cần revoke/rotate và rà soát lịch sử, bản clone, artifact đóng gói. Các file .skill đóng gói cũ không nằm trong đường nạp được hỗ trợ.

Các báo cáo/campaign/config cũ chỉ có giá trị lịch sử. Nguồn được phép dùng và phần bị cách ly ghi tại [registry](Facebook/config/source-registry.json). Không dùng nhãn APPROVED/SUCCESS cũ làm approval hoặc bằng chứng thật.
