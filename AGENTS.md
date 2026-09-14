# Quy tắc cho coding agent

Đọc ai-brand-company-os/SKILL.md trước khi sửa hệ thống. Quy chế là yêu cầu thiết kế; trạng thái thực tế ở docs/implementation/status.md.

- Chỉ làm trong phạm vi yêu cầu Owner. Không suy diễn "tăng trưởng tối đa" thành quyền spam, giả review, tiêu tiền, gửi tin hay đổi dữ liệu commerce.
- Giữ BOOTSTRAP, A0, dry-run, ngân sách 0. Publisher offline bị khóa bằng mã, không tự mở khi test xanh.
- Không đọc/tái sử dụng credential từ Git history. Không ghi PII/token/cookie vào prompt, log hoặc commit.
- Giữ pijama read-only; đọc PROTECTED-DATA.md ở commit nguồn. Quyền sửa AI-agent không phải quyền sửa pijama.
- Mọi thay đổi chính sách/quyền/ngân sách phải có diff, lý do, test âm tính và approval đúng thẩm quyền. Không tự duyệt thay đổi của chính mình.
- Không sửa/xóa lịch sử người dùng để làm kiểm tra xanh. Giữ dữ liệu legacy nhưng cách ly khỏi runtime.
- Chạy npm run validate và npm test; báo rõ lệnh chưa chạy hoặc thất bại. Không ghi VERIFIED nếu chỉ review văn bản.
- Báo cáo không coi preview, mock, trạng thái do LLM sinh hay Git commit là bằng chứng phát hành/thanh toán.
- Không push production hoặc kích hoạt external action khi chưa có quyền cho hành động đó.
