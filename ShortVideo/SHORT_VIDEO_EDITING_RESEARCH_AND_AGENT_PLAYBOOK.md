# Hệ thống dựng video ngắn ≤60 giây — nghiên cứu và nhiệm vụ cho AI-agent
Ngày nghiên cứu: 15/09/2026. Ngôn ngữ vận hành: tiếng Việt. Repo: QuanNguyenS403/AI-agent.
Trạng thái: **Bản bàn giao có nghiên cứu trực tiếp nhưng chưa đủ bằng chứng để chứng nhận bộ phong cách “đều viral”.** Các đặc tả dựng dưới đây là đề xuất sản xuất cần thử nghiệm, không phải kết quả đo video gốc.

## 1. Mục tiêu và quyết định đề xuất

Nhận script đã được content creator và digital marketing duyệt; chuyển thành video TikTok 9:16 dài tối đa 60 giây, có thể xuất phiên bản Facebook Reels, Instagram Reels và YouTube Shorts. Không thay thế thông điệp của đội nội dung bằng công thức câu view.

Xây 6 mô-đun dựng, dùng chung nhận diện nhưng thay đổi nhịp theo script:

| ID | Phong cách | Script phù hợp | Độ dài thử nghiệm | Vai trò nhạc |
|---|---|---|---|---|
| S1 | Lời thoại trực diện + hình chứng minh | Pain point, giải thích, review, bán hàng | 20–45 giây | Nền thấp; ưu tiên nhịp lời |
| S2 | Storytelling có B-roll, mở bằng tình huống | Vlog, câu chuyện, founder, trải nghiệm | 30–60 giây | Chuyển cung cảm xúc |
| S3 | Hài tình huống + nhịp nghỉ phản ứng | POV, đối thoại, expectation/reality | 10–30 giây | Có thể ngắt để làm rõ punchline |
| S4 | Routine cảm giác + âm thanh hành động | Daily routine, GRWM, sống chậm | 15–40 giây | Nhẹ hoặc không nhạc; foley làm nhịp |
| S5 | Montage sản phẩm theo nhạc | Lookbook, quảng bá, ra mắt, outfit | 8–25 giây | Dẫn nhịp; điểm chạm hành động khớp accent |
| S6 | Match cut / biến đổi / visual reveal | Before-after hợp lệ, styling, chuyển bối cảnh | 6–20 giây | Nhấn khoảnh khắc biến đổi |

Ưu tiên triển khai S1, S2, S4; dùng S3 và S5 có chọn lọc; S6 là mô-đun đặc biệt vì đòi hỏi footage khớp và dễ lỗi khi sinh AI. Đây là thứ tự theo tính linh hoạt và sự phù hợp brand, không phải xếp hạng lượt xem đã đo.

Không tồn tại một kiểu edit đảm bảo viral cho mọi script. Hook cần khiến người xem hiểu điều đáng xem ngay: kết quả, mâu thuẫn, bất ngờ hoặc cảm giác. Beat hỗ trợ điểm nhấn; không thay thế lý do xem.

## 2. Phạm vi truy cập thực tế và độ tin cậy

Đã mở trực tiếp TikTok, Instagram, Facebook và YouTube trong trình duyệt. Tuy nhiên không đồng nghĩa đã xem và nghe trọn vẹn mọi video.

Quy ước:
- V: quan sát trực tiếp một hoặc một số khung hình.
- M: đọc metadata/giao diện trực tiếp.
- D: nguồn văn bản xác nhận.
- A: nghe và kiểm chứng âm thanh; **chưa có mẫu nào đạt A trong phiên này**.
- H: giả thuyết sáng tạo/đề xuất, không phải quan sát.

### Nhật ký nguồn

| ID | Nguồn | Điều thực sự kiểm tra được | Hiệu suất thấy được | Giới hạn |
|---|---|---|---|---|
| R01 | [TikTok bảng tin](https://www.tiktok.com/) | M: xuất hiện DŨNG ĐÂY / dung.mat_ket_noi, thời lượng 5 giây, nhãn hợp tác có trả phí | 87.2K thích; 2.326 bình luận; 4.405 lưu; 16.4K chia sẻ | Không lấy được permalink; không có view; không phân tích hình/nhạc; loại khỏi bộ mẫu chuẩn |
| R02 | [Zach King TikTok](https://www.tiktok.com/@zachking) | M: hồ sơ hiển thị 86.9M follower, 1.3B lượt thích, playlist Most Popular | Chỉ là chỉ số tài khoản | Danh sách video báo lỗi sau một lần tải lại; không suy diễn lượt xem từng video |
| R03 | Zach King – Magic Broomstick | D: Guinness xác nhận 2,2 tỷ view tại 15/03/2022; đăng 09/12/2019 | Bằng chứng viral lịch sử, không phải trend hiện tại | Trang TikTok video gốc bị ERR_BLOCKED_BY_CLIENT; chưa xem/nghe trực tiếp |
| R04 | [Daniel Schiffer × Artlist, Instagram](https://www.instagram.com/reel/DGnfZA4xFgp/) | V+M: người nói trước máy; chữ lớn trắng, từ nhấn vàng, viền tối; khung hình có chuyển động/nhòe | Giao diện 1,2K thích, 14 bình luận; ngày 28/02/2025 | Chưa có view, chưa đủ kết luận viral; chưa đo nhịp cắt; không coi ảnh nhòe là bằng chứng chắc chắn của một hiệu ứng cụ thể |
| R05 | [Ken Tan – Some snaps from vietnam](https://www.facebook.com/kentouchd/videos/some-snaps-from-vietnam-capcut/1044045961850171/) | V+M: video 24 giây; khung hình người trong không gian kiến trúc vàng/cam; không thấy chữ chèn trong khung đã quan sát | 415 view; 20 reactions; 3 bình luận | Mẫu đối chứng ít view; quay ở Việt Nam không chứng minh creator Việt Nam; không dùng làm bằng chứng viral Việt |
| R06 | [Khaby – Khaby works on site!, YouTube](https://www.youtube.com/shorts/8acvbSCIsBc) | M: kênh @khabylame, tên clip | 333 nghìn thích; 1.039 bình luận | Player đen, bấm phát chưa xác nhận playback; chưa biết view/thời lượng; không phân tích shot |
| R07 | [Dino Vũ – NEM CHUA RIM, YouTube](https://www.youtube.com/shorts/oGuSaNxcDa0) | M: @NgònNgonbyDino, âm thanh được ghi “New Land · ALBIS” | 104 thích; 7 bình luận | Chưa xem/nghe được clip; không xếp viral |
| R08 | Dino Vũ Instagram reels | Chuyển tới màn hình đăng nhập | Không có số liệu trực tiếp dùng được | Chưa nghiên cứu video ở trang này |
| R09 | [TikTok Creative Codes](https://ads.tiktok.com/business/en/creative-codes) | D: tài liệu chính chủ về sản xuất, cấu trúc và âm thanh | Hướng dẫn quảng cáo | Không chứng minh một preset cụ thể viral organic |
| R10 | [TikTok – cách dùng Commercial Music Library](https://ads.tiktok.com/resources/help/article/how-to-use-the-commercial-music-library) | D: chọn vùng, placement, mood, thể loại, thời lượng; dùng cho organic/paid theo phạm vi áp dụng | Cập nhật July 2026 | Không suy ra quyền dùng nhạc trên nền tảng khác |
| R11 | [Guinness: Zach King](https://www.guinnessworldrecords.com/news/2022/11/internet-illusionist-zach-king-breaks-record-for-most-viewed-video-on-tiktok-724834) | D: xác nhận địa điểm California, USA và kỷ lục lịch sử ở R03 | 2,2 tỷ view tại mốc đã nêu | Không coi toàn bộ khán giả là người Mỹ |

Các số làm tròn giữ nguyên như giao diện. Chưa có audience geography, retention, traffic source, doanh thu hay ngân sách của các mẫu. “Creator Mỹ” và “video phân phối đến khán giả Mỹ” là hai thuộc tính khác nhau.

Tìm TikTok “vlog một ngày” báo lỗi máy chủ, thử lại một lần vẫn lỗi. Không đổi khu vực/fingerprint hoặc lách chặn. Instagram có trang xem được và trang yêu cầu đăng nhập; không xem đó là lỗi của toàn nền tảng.

**Khoảng thiếu cần hoàn thành:** mẫu Việt Nam được xem/nghe đầy đủ; mẫu TikTok USA hiện hành; dữ liệu view cùng tuổi bài; phân tích timecode và beat thực đo. Chưa có cơ sở nói đã rút ra “phong cách viral được xác nhận từ cả Việt Nam và USA”.

## 3. Các kết luận có thể sử dụng ngay

### 3.1. Điều có bằng chứng

R04 cho thấy một cách làm lời thoại dễ đọc: mặt người + phụ đề tương phản + phân cấp từ khóa. Chỉ số tương tác quan sát được không đủ chứng minh viral. Có thể học cơ chế trình bày, không cần sao chép kiểu chữ vàng/viền dày.

R05 là đối chứng hữu ích: một khung hình đẹp và nhãn CapCut không đủ chứng minh khả năng lan truyền. Không dùng riêng view thấp để kết luận edit dở; còn nhiều biến như tài khoản, phân phối và chủ đề.

R03/R11 cung cấp bằng chứng viral lịch sử cho ý tưởng ảo giác rồi giải thích: hình ảnh tạo câu hỏi và có phần giải đáp. Suy luận áp dụng cho brand là mở bằng biến đổi có thể hiểu ngay, rồi cho thấy cách thực hiện; không kết luận kỹ thuật đó đang trend năm 2026.

R09 khuyến nghị nội dung phù hợp TikTok, khung dọc 9:16, vùng tránh giao diện, cấu trúc hook–body–close, kích thích thị giác và âm thanh. Đây là nền tảng thiết kế; các con số nhịp dựng trong tài liệu này là thông số thử nghiệm riêng.

### 3.2. Hướng kết hợp Việt Nam và quốc tế

Chưa đủ mẫu trực quan để gán đặc tính “người Việt thích X, người Mỹ thích Y”. Thay vào đó kiểm nghiệm:
- Việt Nam: câu chữ nói tự nhiên, tình huống địa phương cụ thể, phụ đề tiếng Việt đúng dấu.
- Mỹ: phiên bản tiếng Anh viết lại theo cách nói bản địa; kiểm tra bối cảnh, đơn vị, CTA và nhu cầu người xem.
- Quốc tế: học cấu trúc hình ảnh ít phụ thuộc ngôn ngữ; không bê nguyên meme, khẩu âm hoặc nhạc.
- Không dùng Khaby (quốc tế/Italy) hay Daniel Schiffer (Toronto theo hồ sơ tìm kiếm) như bằng chứng creator USA. Zach King là mẫu Mỹ có nguồn xác nhận.

## 4. Nhận diện riêng: QuanNguyenS / 10PM Pijama

Dựa trên các file đã đọc trong repo:
- Facebook/config/brand_profile.yaml: European Casual Luxury, sống chậm, tinh tế; sản phẩm trên người mẫu; tránh flat-lay và nền trắng đơn điệu.
- Facebook/config/policy.yaml: yêu cầu thông điệp rõ, CTA, tránh clickbait và claims sai; giới hạn nhạc bên thứ ba.
- Facebook/README.md: mô tả hệ thống Facebook/Instagram.
- Facebook/services/ai_pipeline.js: định hướng on-set, màu Burgundy/Ivory/Mocha, video I2V.

Đề xuất tên nội bộ bộ nhận diện: **10PM — Nhịp sống có chủ đích**. Tên này là đề xuất, không phải tài sản brand đã phê duyệt.

Dùng màu chữ ivory/trắng tương phản, burgundy để nhấn tối đa một cụm; sans dễ đọc có đủ dấu tiếng Việt. Giữ màu sản phẩm đúng reference; không ép LUT làm sai màu vải. Dùng nhịp chuyển từ bận rộn sang thư giãn; âm thanh đặc trưng lấy từ hành động như đặt điện thoại xuống, kéo rèm, bước chân, vải chuyển động.

S1/S2 ưu tiên lời kể; S4 ưu tiên cảm giác; S3 dùng hài nhẹ, tự nhận ra bản thân; S5/S6 tập trung chuyển động người mẫu và outfit. Không mặc định mọi bài phải cinematic hoặc “chill”. Không lấy ngoại hình người nổi tiếng làm yêu cầu sao chép người mẫu.

Quy tắc câu dài/nhịp chậm trong brand_profile hiện tại có thể xung đột caption ngắn của TikTok. Giải pháp: chia phụ đề theo cụm nghĩa mà không viết lại câu đã duyệt; chỉ đề xuất sửa hook riêng để content owner duyệt nếu thay nghĩa. Không tự sửa quy chuẩn brand.

## 5. Playbook dựng 6 phong cách

Mọi timecode trong phần này là **timeline minh họa tự thiết kế**, không phải phân tích timecode nguồn.

### S1 — Lời thoại trực diện + hình chứng minh

Cấu trúc 30 giây: 0–2 vấn đề cụ thể; 2–6 tình huống; 6–20 giải thích kèm chứng minh; 20–26 kết quả; 26–30 CTA.

Cắt ở ranh giới ý hoặc bỏ đoạn lặp. Đừng cắt mất nhịp hít thở/biểu cảm cần thiết. Xen B-roll khi lời nói nhắc thứ người xem cần nhìn thấy. Punch-in nhẹ vào kết luận, không zoom mỗi từ. Phụ đề 1–2 dòng, hiện theo cụm nghĩa; ưu tiên đọc đủ thay vì hiệu ứng karaoke dồn dập.

Nhạc instrumental ít dải mid gây cạnh tranh lời. Accent chỉ ở hook/chuyển luận điểm. Khi không có nhạc, lời và hình vẫn phải rõ. Pain point phải có giải pháp/bằng chứng trong video, không hứa quá nội dung.

Ví dụ 10PM: “Bạn có thay đồ sau khi về nhà, hay vẫn mặc nguyên bộ cả tối?” → cảnh kết thúc công việc → người mặc outfit di chuyển → CTA chọn phong cách. Không gán chữa mất ngủ cho quần áo.

### S2 — Storytelling có B-roll

Cấu trúc 45 giây: 0–3 tình huống chưa trọn; 3–12 bối cảnh; 12–27 trở ngại; 27–37 lựa chọn/giải quyết; 37–45 kết quả.

Lời kể là trục chính. J-cut đưa tiếng cảnh tới trước hình; L-cut giữ tiếng cảnh trước qua hình mới khi cần liền mạch. Mỗi cảnh B-roll phải thêm thông tin, chứng minh hoặc cảm xúc. Nhịp chậm vẫn cần tiến triển; không dùng 15 giây đầu chỉ giới thiệu.

Nhạc đổi cường độ ở điểm chuyển câu chuyện; có thể giữ một shot xuyên nhiều beat khi biểu cảm đáng xem. CTA xuất hiện sau payoff. Không tạo lời chứng thực khách hàng giả.

### S3 — Hài tình huống có khoảng nghỉ

Cấu trúc 18 giây: 0–2 đặt tình huống; 2–7 dựng kỳ vọng; 7–10 đảo chiều; 10–14 phản ứng; 14–18 chốt/loop tự nhiên.

Giữ trục nhìn và vị trí nhân vật ổn định khi một người đóng nhiều vai. Cho người xem đủ thời gian nhận ra sự trái ngược. Chỉ một hiệu ứng âm thanh đúng lúc thường tốt hơn xếp chồng nhiều meme.

Nhịp nghỉ thử 0,2–0,6 giây trước phản ứng; điều chỉnh theo diễn xuất, không phải công thức cố định. Nhạc có thể ngắt trước punchline, trở lại sau phản ứng. Không bắt diễn viên nói nhanh để đuổi kịp beat.

Ví dụ: “Tối nay ngủ sớm” → chuẩn bị rất kỹ → vẫn chọn outfit đi mua đồ gần nhà. Hài dựa vào tình huống đời thường, không hạ thấp cơ thể/người mua.

### S4 — Routine cảm giác / foley

Cấu trúc 24 giây: 0–2 hành động hấp dẫn; 2–6 xác lập buổi tối; 6–18 chuỗi 4–6 hành động; 18–22 cảm giác hoàn thành; 22–24 câu chốt/loop.

Xen cận–trung–toàn, giữ hướng chuyển động nhất quán. Thu tiếng thật riêng: rèm, bước chân, công tắc, vải, cốc đặt xuống. Dùng âm thanh tương ứng vật liệu; tiếng vải không thành tiếng giấy.

Nhạc optional. Foley cần nổi rõ nhưng không gây giật mình. Không gọi là ASMR chỉ vì nhạc nhỏ; phải có lớp âm chi tiết thực sự kiểm nghe được. Cảnh sản phẩm vẫn trên người mẫu theo repo.

### S5 — Sản phẩm dựng theo nhạc

Cấu trúc 16 giây: 0–2 hình hero đang chuyển động; 2–6 tổng thể; 6–10 chi tiết trên người; 10–14 ứng dụng; 14–16 giữ outfit + CTA.

Dựng trên một đoạn nhạc có câu nhạc trọn. Chọn 3–5 accent quan trọng, không cắt mọi tiếng hi-hat. Match action: bước chân chạm sàn, tay chạm cổ áo, xoay người đạt vị trí đẹp. Speed ramp dùng trên đoạn chuyển động đủ frame; không làm méo dáng/vải.

Tránh mỗi cảnh một transition khác nhau. Không đặt caption quan trọng vào shot cực ngắn. Nếu dùng 0,25 giây cho flash chuyển động thì không yêu cầu người xem đọc câu dài ở đó.

### S6 — Match cut / biến đổi

Cấu trúc 10 giây: 0–2 nêu điều bất thường; 2–4 chuẩn bị hành động; 4–5 biến đổi; 5–8 cho nhìn rõ kết quả; 8–10 chốt.

Trước dựng cần footage có khung, tỷ lệ người, vị trí tay, hướng sáng và chuyển động tương thích. Che điểm cắt bằng hành động có chủ đích; không dùng flash để giấu mọi lỗi continuity.

Beat accent vào frame reveal. Sau reveal giữ shot đủ lâu để nhận ra sản phẩm. S6 không nên là mặc định: tốn công tạo footage và dễ thành kỹ xảo thiếu câu chuyện.

## 6. Hệ thống bắt beat chuyên nghiệp

### 6.1. Phân biệt ba nhịp

1. Nhịp lời: cụm nghĩa, trọng âm, khoảng nghỉ.
2. Nhịp hành động: bắt đầu, tăng tốc, điểm chạm, kết thúc.
3. Nhịp nhạc: beat, downbeat, accent, câu nhạc, break.

S1/S2 chọn nghĩa và biểu cảm trước; S5 chọn hành động + nhạc; S3 chọn timing hài; S4 chọn âm thanh hành động. Điểm cắt không bắt buộc trùng beat nếu làm hỏng câu chuyện.

### 6.2. Quy trình phân tích nhạc

- Nhận file nhạc hợp lệ, lưu audio_id, vùng dùng, nền tảng, ngày kiểm tra quyền và đoạn in/out.
- Phát hiện tempo như gợi ý; nghe kiểm half-time/double-time, nhạc đổi tempo và vị trí beat đầu.
- Đặt marker thủ công/kiểm nghe cho downbeat, accent, đầu câu nhạc, break và drop.
- Chọn một câu nhạc hợp độ dài. Không kéo giãn lời thoại để nhét vào lưới nhạc.
- Lập bảng điểm nhấn: sự kiện hình → loại accent → marker nhạc → tolerance → lý do.
- Render rồi kiểm lại file xuất. Timeline đúng nhưng encoder, retime hoặc offset âm thanh vẫn có thể tạo lệch.
- Nếu chưa kiểm nghe được: audio_review_status=pending; không tự chấm PASS.

### 6.3. Toán nhịp và frame

Với nhạc tempo ổn định: beat_interval_seconds = 60 / BPM.
Ví dụ tự thiết kế: 120 BPM → 0,5 giây/beat; nhịp 4/4 → 2 giây/ô nhịp; 8 ô → 16 giây.
30 fps → 15 frame/beat ở 120 BPM. 24 fps → 12 frame/beat. Nếu kết quả lẻ phải tính từng mốc tuyệt đối, không cộng dồn frame đã làm tròn.

frame_i = round((audio_offset_seconds + beat_time_i) × fps).
Với tempo thay đổi, dùng beat_time_i đã đo; không áp một BPM cho toàn clip.

Mục tiêu QA nội bộ thử nghiệm: accent rõ lệch không quá khoảng 1 frame; nếu lệch có chủ đích để cảm nhận tốt hơn phải ghi lý do. Đây là tiêu chuẩn làm việc đề xuất, không phải ngưỡng TikTok công bố hay bảo đảm người xem giữ lại.

### 6.4. Beat sheet minh họa 16 giây, 120 BPM, 30 fps

| Thời gian | Frame | Hình | Âm | Ý đồ |
|---|---:|---|---|---|
| 0,0 | 0 | Người mẫu đang tiến vào khung | Bắt đầu câu nhạc + tiếng bước nhẹ | Không mở logo trống |
| 2,0 | 60 | Bước chạm sàn, toàn thân | Downbeat | Xác lập outfit |
| 4,0 | 120 | Tay chạm cổ áo, cận | Accent + foley nhỏ | Chi tiết thật |
| 6,0 | 180 | Quay về trung cảnh | Beat nhẹ | Đổi tỷ lệ nhìn |
| 8,0 | 240 | Xoay người hoàn thành | Accent mạnh | Payoff chuyển động |
| 10,0 | 300 | Giữ hình, vải chuyển động | Nhạc tiếp tục, không nhất thiết cắt | Cho xem sản phẩm |
| 12,0 | 360 | Bối cảnh ứng dụng khác | Đầu cụm nhạc | Thêm thông tin |
| 14,0 | 420 | Hero + CTA dễ đọc | Giảm mật độ âm | Kết rõ |
| 16,0 | 480 | Điểm kết clip | Kết câu, không click | Không cắt cụt âm |

Không sao chép bảng này cho mọi bài nhạc. Nếu nhạc có intro/pickup, mốc 0 không tự động là downbeat.

### 6.5. Mix và kiểm nghe

Ưu tiên lời rõ trên loa điện thoại. Giảm nhạc khi nói, đưa lên ở khoảng trống. Kiểm plosive, sibilance, noise, clipping, lệch lip-sync, foley bị lặp. Không dùng một mức phần trăm volume cho mọi bản thu.

Có thể thử mục tiêu nội bộ khoảng -16 đến -14 LUFS integrated, true peak không quá -1 dBTP, rồi điều chỉnh theo nội dung và file test; đây không phải thông số bắt buộc của TikTok. Routine yên tĩnh không cần ép loudness giống montage. Kiểm tai nghe lẫn loa nhỏ; xem một lượt không tiếng để kiểm ý nghĩa hình/phụ đề.

Nguồn R10 hướng dẫn chọn nhạc theo vùng và placement trên TikTok. Kiểm quyền riêng cho Facebook/Instagram/YouTube; không mặc định giấy phép TikTok dùng được xuyên nền tảng. Nhạc thịnh hành không tự động là nhạc được phép cho nội dung brand.

## 7. Giao ước đầu vào từ đội nội dung

Một job chỉ sẵn sàng dựng khi có:
- script_id, script_version, người/phần việc duyệt nội dung.
- Mục tiêu chính: reach, save/share, consideration hoặc chuyển đổi.
- Thị trường và ngôn ngữ; đối tượng; một thông điệp.
- Lời thoại nguyên văn, câu bắt buộc giữ, claims và bằng chứng.
- SKU/reference sản phẩm đang hiệu lực; tài sản hình/footage.
- Khoảng thời lượng mong muốn ≤60 giây.
- CTA đã duyệt; trạng thái quyền nhạc, hình, người mẫu.
- Những chi tiết được phép sáng tạo: hook hình, cutaway, caption nhấn, transition.
- Điều không được đổi: màu, form, chi tiết sản phẩm; ý nghĩa lời nói.

Thiếu footage: xuất shot list hoặc yêu cầu asset, không trả một đường dẫn giả. Có thể chuẩn bị storyboard trong lúc thiếu tài nguyên; job ghi awaiting_assets.

## 8. Bàn giao công việc cho các vai trò AI agent

Đây là phân công cho hệ thống cần triển khai, không phải tuyên bố các agent đã chạy trong phiên nghiên cứu.

| Vai trò | Đầu vào | Nhiệm vụ | Đầu ra / nghiệm thu |
|---|---|---|---|
| Research Agent | Thị trường, niche, mục tiêu | Thu thập clip gốc, chỉ số, hạn chế truy cập, phân nhóm tuổi bài | Reference ledger có URL và trạng thái xem/nghe |
| Creative Director | Script + ledger + brand | Chọn 1 style chính, tối đa 1 phụ; giải thích vì sao | Edit brief + hook variants giữ nguyên lời hứa |
| Storyboard Agent | Brief + asset inventory | Lập shot list, timecode, continuity | Timeline có mục đích từng shot |
| Music & Sound Agent | Nhịp cảm xúc + audio có quyền | Beat map, accent, foley, mix plan | Audio manifest + marker + review |
| Video Editor Agent | Footage + timeline + audio | Dựng, caption, color, xuất master | File thật + project/EDL có thể sửa |
| QA Agent | Render + script + reference | Kiểm toàn video, tiếng, nội dung, kỹ thuật | Báo cáo PASS/FAIL có timecode thực |
| Growth Analyst | Post ID + metrics | So sánh theo cohort, tìm điểm rơi retention | Đề xuất sửa một biến cho thử nghiệm sau |
| Orchestrator | Job state | Điều phối, retry có giới hạn, lưu version | Trạng thái dựa trên artifact thật |

Thứ tự job: received → assets_validated → brief_ready → rough_cut → audio_review → visual_qa → ready_for_review → approved_for_publish → published → measured.

FAIL quay lại đúng công đoạn. Không dùng điểm QA “đẹp” để bỏ qua lỗi sản phẩm, âm thanh hoặc claim. Đăng social/ads là công việc riêng theo quyền hiện có; nhiệm vụ lần này chỉ bàn giao tài liệu, không cấp quyền tự chi tiền hay tự đăng.

## 9. Khoảng trống repo và nhiệm vụ kỹ thuật cụ thể

Bản đọc repo main trong phiên có tree SHA 72e9c67ed4f62de697625e680771a139341e070a. Không khẳng định toàn bộ hệ thống chưa hoạt động; các nhận xét sau giới hạn ở file đã kiểm tra.

### P0 — Loại bỏ kết quả sản xuất giả

Trong Facebook/services/ai_pipeline.js:
- generateMainImage trả SUCCESS và đường dẫn ảnh cố định.
- editImageWithKontext trả danh sách edits cố định.
- generateVideoI2V trả SUCCESS, đường dẫn video mẫu và audio_profile dạng mô tả; chưa thấy gọi dịch vụ render thật trong method này.
- inspectQualityWithVision trả checklist/điểm số cố định.
- runFullProduction truyền ảnh vào QA; ready_for_publish lấy từ QA đó dù trả kèm video.

Nhiệm vụ: thay bằng adapter thực hoặc trả NOT_IMPLEMENTED/FAILED rõ ràng; kiểm file tồn tại, probe duration/resolution/fps/audio; QA video riêng. Không cho log SUCCESS đồng nghĩa job đã render thành công.

Nghiệm thu: thiếu API hoặc asset phải fail đúng; ảnh PASS không làm video PASS; lỗi một shot được ghi timecode và chặn ready_for_publish.

### P1 — Tạo subsystem ShortVideo độc lập

Các đường dẫn sau là **đề xuất cần triển khai, chưa được tạo bởi bản bàn giao này**:
- ShortVideo/config/style-presets.json
- ShortVideo/schemas/edit-job.schema.json
- ShortVideo/research/reference-ledger.jsonl
- ShortVideo/services/script-to-timeline.js
- ShortVideo/services/audio-analysis.js
- ShortVideo/services/render-video.js
- ShortVideo/services/video-qa.js
- ShortVideo/reports/

Dùng adapter đọc brand/catalog từ Facebook/config; không copy thành hai nguồn sự thật. Đường dẫn asset cấu hình được, không hard-code ổ D:. Job id idempotent; render lỗi có retry giới hạn; không tự đăng lại vì timeout.

### P2 — Thiết kế kiểm định có ích

- Asset không tồn tại → chặn render.
- Job dài 61 giây → fail thời lượng.
- Video không có audio khi audio_required=true → fail.
- Accent mục tiêu lệch nhiều frame → fail hoặc ghi intentional_offset đã duyệt.
- QA chỉ có kết quả ảnh → video không được publish.
- Nhạc chưa có phạm vi quyền phù hợp → trạng thái pending, không tự thay bằng bài trending bất kỳ.
- Claims không có bằng chứng → trả content owner.
- Render từ cùng job/version không tạo lệnh đăng trùng.

Chọn công cụ dựng dựa vào stack thực: NLE cho xử lý giàu ngữ cảnh, hoặc renderer lập trình cho preset lặp lại. Không cam kết AI làm tốt mọi footage chỉ bằng prompt. Chất lượng bắt beat cuối cùng cần kiểm file có tiếng thật.

## 10. Schema minh họa một edit job

JSON sau là mẫu giao ước; chưa phải config thực thi của repo.

```json
{
  "job_id": "10pm-demo-001",
  "script_id": "approved-script-id",
  "script_version": 1,
  "market": "VN",
  "language": "vi",
  "goal": "consideration",
  "style_primary": "S1",
  "style_secondary": "S4",
  "target_duration_seconds": 30,
  "max_duration_seconds": 60,
  "fps": 30,
  "resolution": [1080, 1920],
  "script_locked": true,
  "product_reference": null,
  "source_assets": [],
  "audio": {
    "asset_id": null,
    "license_verified": false,
    "platforms_allowed": [],
    "regions_allowed": [],
    "bpm_measured": null,
    "beat_times_seconds": [],
    "audio_review_status": "pending"
  },
  "timeline": [],
  "qa": {
    "video_reviewed": false,
    "audio_reviewed": false,
    "claims_verified": false,
    "product_match": null,
    "render_probe": null
  },
  "publish_authorized": false,
  "status": "awaiting_assets"
}
```

Mỗi timeline item cần source_asset, source_in/out, timeline_in/out, shot_purpose, dialogue, subtitle, audio_marker, transition và continuity_notes. Không dùng null thành giá trị mặc định an toàn để tự PASS.

## 11. Chương trình nghiên cứu bổ sung: đủ điều kiện gọi mẫu viral

Đây là backlog bắt buộc trước khi quảng bá bộ preset là “đã xác nhận viral Việt Nam và USA”. Không được báo đã hoàn thành quota khi mới đọc hồ sơ.

Mục tiêu lô đầu 24 clip xem/nghe được:
- 10 TikTok Việt Nam: tối thiểu 4 creator, không chỉ một niche.
- 10 TikTok từ creator Mỹ: tối thiểu 4 creator; ghi audience geography=unknown nếu không có dữ liệu.
- 4 đối chiếu Facebook/Instagram/YouTube, khử trùng lặp cùng creative.
- Cân đối 6 loại script; ít nhất 6 mẫu đối chứng bình thường/ít view.
- Ưu tiên bài 30–90 ngày gần nhất để xét tính hiện hành; tách mẫu lịch sử vào nhóm evergreen.
- Clip >60 giây chỉ tham khảo cấu trúc, không tính vào quota video ngắn.

Mỗi clip cần:
1. URL gốc, creator, nền tảng, ngày đăng, ngày quan sát, thời lượng.
2. Views/likes/comments/shares/saves theo dữ liệu có thật; thiếu để null.
3. Nhãn sponsored/paid/organic/unknown.
4. Ngôn ngữ, market evidence, source of audience location.
5. Xem toàn bộ hai lượt: lượt nội dung, lượt dựng/âm thanh.
6. Timecode hook, first cut, payoff, CTA, âm thanh nổi, khoảng nghỉ.
7. Shot log: duration, kích cỡ cảnh, chuyển cảnh, chữ.
8. Beat map thực đo nếu có quyền dùng file để phân tích.
9. Cái học được, cái không hợp brand, mức công sản xuất.
10. Trạng thái quan sát V/M/D/A; không trộn mô tả tìm kiếm với hình thực xem.

### Tiêu chí “viral” nội bộ để sàng lọc

Không dùng một mốc triệu view cho tất cả tài khoản.
- So view ở cùng tuổi bài (ví dụ 7 ngày), cùng nền tảng, thị trường và khoảng độ dài.
- So với median tối thiểu 10 bài tương đương gần nhất của creator nếu thu thập được.
- Có thể đánh dấu “outlier ứng viên” khi view ≥3× median; đây là heuristic nội bộ.
- Nếu tuổi bài, traffic source hoặc baseline thiếu: “high absolute reach / chưa chuẩn hóa”, không “verified organic viral”.
- Chỉ nâng một style thành “đáng nhân rộng” sau khi có nhiều ví dụ độc lập và thử trên brand.
- Bằng chứng viral không chứng minh quan hệ nhân quả giữa edit và view. Theo dõi nội dung, người nổi tiếng, paid support và mùa vụ là biến nhiễu.

## 12. Kế hoạch thử nghiệm với script đã có

Không viết lại toàn bộ chiến lược nội dung. Lấy 6 script đã duyệt đại diện cho sáu nhóm; chọn hai cách dựng thích hợp mỗi script → 12 bản render. Chỉ đăng theo lịch và quyền của brand.

Giai đoạn A: duyệt offline.
- Kiểm thông điệp, màu sản phẩm, âm thanh, subtitle, ≤60 giây.
- Chọn các bản đủ chất lượng; ghi rõ bản nào thiếu footage hoặc audio review.

Giai đoạn B: thử hook.
- Giữ body/CTA và phần lớn asset ổn định.
- Thay một biến: mở bằng tình huống, kết quả hoặc visual reveal.
- Không đăng nhiều bản gần như giống nhau liên tiếp để tránh nhiễu và nhàm.

Giai đoạn C: thử pacing.
- Sau khi có tín hiệu hook, so nhịp lời hoặc mật độ B-roll.
- Không đồng thời đổi nhạc, script, người mẫu, CTA rồi quy thành công cho edit.

Giai đoạn D: thử âm thanh.
- Cùng cut/story, so nhạc dẫn nhịp với foley/lời ưu tiên khi phù hợp.
- Nếu thay nhạc buộc đổi toàn bộ dựng, ghi đó là thử nghiệm “gói creative”, không phải isolated audio test.

Theo dõi cùng cửa sổ 24 giờ, 72 giờ, 7 ngày; đây là mốc báo cáo sau khi được đăng, không phải automation đã được kích hoạt.

| Mục tiêu | Chỉ số ưu tiên | Cách đọc |
|---|---|---|
| Giữ chú ý đầu | Retention đầu video, swipe/stayed nếu nền tảng cung cấp | Không thay số thiếu bằng like |
| Xem tiếp | Average watch time; tỷ lệ xem hết; retention curve | So trong cùng khoảng duration |
| Hữu ích | Save/view, share/view nếu có | Ghi rõ mẫu số, không so thẳng reach với views |
| Quan tâm sản phẩm | Profile/product clicks, phiên landing có UTM | Tách view vui với ý định mua |
| Bán hàng | Đơn/doanh thu có attribution và cửa sổ rõ | Không coi toàn bộ doanh thu là do clip |

Thiếu lượng phân phối hoặc chênh lệch audience lớn: kết luận “chưa đủ dữ liệu”. Organic không phải randomized A/B test. Không tuyên bố thắng chỉ vì một clip gấp đôi view trong một lần đăng.

## 13. Checklist xuất xưởng

- [ ] Nội dung khớp script/version đã duyệt; hook được đáp lại.
- [ ] ≤60 giây theo file thật; đề xuất master 1080×1920.
- [ ] FPS nhất quán với footage/timeline; không retime gây méo.
- [ ] Không sai màu, số nút, đường may, form hoặc SKU.
- [ ] Phụ đề đúng dấu, không quá dày, không bị UI che; kiểm preview từng nền tảng.
- [ ] Điểm nhấn nhạc/foley khớp hành động; offset có chủ đích được ghi.
- [ ] Không clipping, câu bị cắt cụt, âm thanh lặp gây khó chịu.
- [ ] Xem không tiếng vẫn hiểu; nghe không nhìn vẫn hiểu phần lời.
- [ ] QA thực trên bản export; không dùng điểm mẫu.
- [ ] Quyền tài sản/nhạc được kiểm cho thị trường và từng kênh.
- [ ] Chính sách nhãn nội dung AI được kiểm theo yêu cầu hiện hành của nền tảng; không dựa vào cờ ai_disclosure_required=false chung trong repo.
- [ ] Có master sạch, bản caption, project/EDL, transcript, audio manifest, QA report.
- [ ] Chỉ chuyển hệ thống xuất bản khi có quyền đăng và trạng thái duyệt phù hợp.

## 14. Lệnh bàn giao cho Orchestrator

> Đọc tài liệu này như một brief dự án, không coi phần nghiên cứu còn thiếu là đã hoàn thành. Nhận script từ đội content creator/digital marketing; bảo toàn ý nghĩa đã duyệt. Bắt đầu bằng kiểm asset, thay kết quả render/QA giả bằng kiểm chứng thật, và hoàn thành reference ledger Việt Nam/USA. Chọn S1–S6 theo mục tiêu và chất lượng footage. Tạo storyboard, beat map, render, kiểm nghe/nhìn và báo cáo có timecode. Nếu không truy cập được nguồn hoặc không nghe được audio, ghi pending; không suy đoán số liệu, nhịp cắt hay BPM. Bàn giao file có thể sửa và đề xuất thử nghiệm. Không tự cấp quyền đăng, chi ngân sách hoặc thay brand policy.

## 15. Definition of Done

Bản bàn giao tài liệu hoàn tất khi file Markdown được lưu vào repo và kiểm đọc lại.

**Toàn bộ mục tiêu nghiên cứu và vận hành của công ty AI chỉ hoàn tất khi:**
1. Bộ 24 reference đủ xem/nghe và thông tin còn thiếu được ghi minh bạch.
2. Có mẫu Việt Nam và Mỹ hiện hành, tách rõ organic/paid/unknown.
3. 6 preset được triển khai thật, không chỉ có mô tả.
4. Có ít nhất một render đạt QA cho mỗi loại script có đủ tài nguyên.
5. Bắt beat được kiểm trên audio/video thật, không chỉ marker.
6. Có dữ liệu thử nghiệm trên kênh brand trước khi gọi phong cách riêng là “đã kiểm chứng”.
7. Báo cáo tách “đã nghiên cứu”, “đề xuất”, “đã render”, “đã đăng”, “đã đo”.

Tại thời điểm tạo tài liệu: đã có truy cập trực tiếp bốn nền tảng, nhật ký hạn chế, 6 đặc tả dựng, quy trình beat, mapping repo và backlog. Chưa hoàn thành quota nghiên cứu nghe/xem, chưa tạo video, chưa triển khai subsystem và chưa đăng bài.
