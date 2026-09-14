# 02 · Pipeline ảnh/video và bằng chứng thật

Mục tiêu giữ sản phẩm đúng, quyền tài sản rõ và chất lượng có thể kiểm tra. Pipeline là giao diện thiết kế, không xác nhận đã tích hợp các model được nhắc trong config legacy.

Input: WO/brief, approved product refs, source assets + digests, license/model release, requested output spec và cost envelope. Không có quyền engine/tài sản/chi phí thì BLOCKED.

Luồng: kiểm tra nguồn → storyboard/shot list → generation/edit bằng tool được cấp quyền → kiểm tra identity/product fidelity → compose logo/typography/giá deterministically khi cần chính xác → export → QA độc lập → immutable bundle. Không sửa sản phẩm thành kiểu dáng/màu/vải khác rồi coi ảnh là bằng chứng hàng thật.

Generation receipt cần provider/job ID, model/version, params/seed khi có, source digests, time, cost, output digest và real storage URI. Nếu không gọi provider, status=NOT_IMPLEMENTED và output=null. Không invent đường dẫn Windows/media giả, score Vision hay job id.

Âm nhạc, voice và người mẫu cần rights riêng theo channel/territory/time và paid usage. Không tự xóa watermark của bên thứ ba. Synthetic media có disclosure decision theo chính sách hiện hành; không mặc định bỏ disclosure.

QA: file tồn tại và decode được, MIME/size/duration/ratio/audio/subtitle phù hợp, OCR đọc text/giá, sản phẩm đúng, không artifact gây hiểu lầm, rights/truth còn hiệu lực. Nếu score chưa đo trả null. Brand/gate hard failures không được lấy trung bình thành PASS.

Repair tối đa 2 vòng baseline, giữ revision history; quá hạn → quarantine. Không tự mua tool/SaaS để tiếp tục. Bản AIPipeline hiện chỉ trả planning draft và các trạng thái chưa triển khai trung thực.
