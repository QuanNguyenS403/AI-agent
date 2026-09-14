# Image & Video Production Pipeline

Tài liệu này mô tả chi tiết dây chuyền sản xuất ảnh/video cho AI Content Agent, tách biệt hoàn toàn khỏi phần publish/growth (xem `04-meta-graph-api.md` và `06-ads-and-growth-loop.md`).

## 1. Kiến trúc engine

Nên dùng **ComfyUI làm engine trung tâm**: hỗ trợ workflow dạng node, workflow tái sử dụng, có API để gọi từ agent, và phù hợp tự động hoá ảnh/video hàng loạt. Nếu muốn người dùng cuối **không phải cài đặt gì**, có thể đóng gói workflow thành Gradio/Docker và host trên Hugging Face Spaces, gọi như một API endpoint từ agent.

## 2. Pipeline bắt buộc (không được đảo thứ tự hoặc bỏ bước)

```
Ảnh gốc → Brand Rules → Tách nền/clean → Chỉnh ảnh → Tạo biến thể →
Giữ identity → Upscale → Text/Badge → QA → Export
```

Lý do thứ tự này quan trọng: nếu chèn text/badge trước khi upscale, chữ sẽ bị méo/vỡ nét khi phóng to; nếu QA identity chạy sau khi đã export thay vì trước, ảnh sai người có thể lọt ra ngoài trước khi bị phát hiện.

## 3. Nguyên tắc bắt buộc: không sinh chữ bằng diffusion

Chữ, giá, CTA, badge và logo **không bao giờ được sinh cùng ảnh bằng diffusion model**. Lý do: diffusion không đảm bảo chính tả/kerning/vị trí chính xác, và không thể đảm bảo đồng nhất qua hàng trăm ảnh.

Quy trình đúng: Agent tạo ảnh sạch (không chữ) trước → dùng **ImageMagick** để chèn typography/vector theo toạ độ cố định lấy từ `brand.json`. ImageMagick hỗ trợ compose, transparency, geometry và positioning chính xác theo pixel, nên phù hợp để tạo dây chuyền thiết kế đồng nhất qua số lượng lớn ảnh.

Ví dụ lệnh ImageMagick chèn logo + text theo toạ độ cố định (minh hoạ cấu trúc lệnh, cần điều chỉnh theo `brand.json` thật):

```bash
magick clean_image.png \
  \( logo.png -resize 180x180 \) -gravity SouthEast -geometry +40+40 -composite \
  -gravity North -fill "#FFFFFF" -font "Brand-Heading-Bold" -pointsize 64 \
  -annotate +0+120 "HEADLINE TEXT" \
  output_with_overlay.png
```

## 4. Bảng dây chuyền công việc theo tác vụ

| Công việc | Quy trình Agent | Công cụ khuyến nghị |
|---|---|---|
| Thương hiệu & Text Overlay | Ảnh → resize/crop → headline → subtitle → CTA → badge → logo → export | ImageMagick + ComfyUI |
| Một sản phẩm → nhiều poster | Tách sản phẩm → tạo background từ template → đặt sản phẩm → shadow → text → badge → QA | rembg + ComfyUI + ImageMagick (rembg chạy được dạng CLI, Python, HTTP server, hỗ trợ mask/alpha) |
| Xoá nền | Detect foreground → mask → alpha-matting → PNG trong suốt | rembg (MIT license) |
| Xoá vật thể/chữ thừa | Segment vùng cần xoá → mask → inpainting → kiểm tra texture | LaMa (Apache 2.0) — thiết kế cho image inpainting, xử lý tốt cả ảnh độ phân giải cao hơn dữ liệu huấn luyện |
| Chỉnh ảnh chân dung | Exposure → white balance → denoise → da → phục hồi mặt nhẹ → sharpen | CodeFormer (có tham số fidelity) + Real-ESRGAN |
| Tăng chất lượng / 4K | Restore → x2/x4 → sharpen nhẹ → resize đúng kích thước xuất | Real-ESRGAN (BSD-3-Clause) |
| Multishot sản phẩm | 1 ảnh → nhiều góc camera → chọn view hợp lệ → dùng làm storyboard/keyframe | Zero123++ (Apache 2.0) — mặc định sinh sáu camera views nhất quán từ một ảnh |
| Nhân vật cố định (identity) | Reference face → identity embedding → pose/background mới → identity QA | PuLID / IP-Adapter (đều Apache-2.0, thiết kế cho image/identity conditioning) |

## 5. Quy trình chân dung sáu bước

Mục tiêu: **"đẹp hơn nhưng vẫn đúng người thật"**. Trình tự bắt buộc:

```
Cân sáng → Cân màu → Denoise → Làm da nhẹ → CodeFormer fidelity cao → Real-ESRGAN
```

CodeFormer cho phép điều chỉnh trực tiếp trade-off giữa chất lượng phục hồi và fidelity (giá trị fidelity cao hơn ưu tiên giữ gần ảnh gốc hơn — luôn dùng fidelity cao cho chân dung thương hiệu để tránh "biến dạng" nhận diện). Real-ESRGAN đảm nhiệm restoration/upscale phần ảnh tổng thể sau đó.

**Reject rule (không thể tắt):** nếu mắt, mũi, miệng, tuổi, kiểu tóc, hoặc bất kỳ đặc điểm nhận diện nào của người thật thay đổi quá mức so với ảnh gốc → **reject và chạy lại toàn bộ bước chân dung**, tuyệt đối không tự động publish ảnh đã bị biến dạng nhận diện.

## 6. Chuẩn cuối cùng cho AI Agent (pipeline tổng thể)

```
INPUT
  ↓
Validate quyền sử dụng ảnh
  ↓
Load brand.json
  ↓
Background Removal / Cleanup
  ↓
Portrait or Product Enhancement
  ↓
Generate 10 visual variants
  ↓
Identity / Product Consistency check
  ↓
4K Upscale
  ↓
Apply deterministic Text + Badge + Logo (ImageMagick, toạ độ cố định)
  ↓
QA:
  - đúng người
  - đúng sản phẩm
  - đúng logo
  - đúng font
  - đúng màu
  - không lỗi tay/mặt
  - không text sai chính tả
  ↓
Export:
  1080×1080  (1:1)
  1080×1350  (4:5 — feed/carousel)
  1080×1920  (9:16 — Reel/Story)
  ↓
READY_TO_POST
```

## 7. Stack production gọn nhất

```
ComfyUI → rembg → LaMa → CodeFormer/Real-ESRGAN → PuLID/IP-Adapter/Zero123++ → ImageMagick
```

Toàn bộ được Agent gọi qua API/workflow. ComfyUI hỗ trợ workflow tái sử dụng và API; Hugging Face Spaces có thể biến một workflow Gradio thành endpoint để vận hành trên trình duyệt mà máy người dùng không cần cài toàn bộ AI stack cục bộ.

## 8. Giọng nói (voice) cho Reel

**TTS:** dùng API text-to-speech có hỗ trợ timing để đồng bộ audio/phụ đề (ví dụ ElevenLabs TTS API kèm timing endpoint). Đầu ra: TXT (script) → MP3/WAV + timing JSON.

**Video AI:** dùng API video generation hỗ trợ text-to-video và image-to-video (ví dụ Runway API). Không phụ thuộc vào một provider duy nhất — luôn có fallback về static/carousel nếu video generation fail (xem `07-error-fallback-and-slo.md`).

**Hậu kỳ video:** FFmpeg đảm nhiệm assemble, resize, mix audio, chèn subtitle, và encode/loudness normalization về đúng master `reel_9x16.mp4`.

## 9. Cảnh báo license — bắt buộc kiểm tra trước khi dùng thương mại

Với **mục đích thương mại**, phải kiểm tra **license của cả code, checkpoint, và base model** — không chỉ license của repository chứa code. Một số dự án có code mở (ví dụ Apache-2.0) nhưng chính dự án lại ghi rõ một số face model/checkpoint đi kèm chỉ dành cho nghiên cứu (research-only). Vì vậy **không mặc định** rằng một repo "có license mở" nghĩa là mọi checkpoint đi kèm cũng được phép dùng cho quảng cáo thương mại — luôn đọc kỹ license file/README của từng checkpoint cụ thể trước khi đưa vào pipeline production.

## 10. Ranh giới xử lý logo/watermark bên thứ ba

Agent chỉ được xoá logo/watermark trên: (a) tài sản của chính brand, hoặc (b) tài sản đã được cấp quyền chỉnh sửa rõ ràng bằng văn bản/hợp đồng. Với bất kỳ ảnh nào có nguồn gốc bên thứ ba mà chưa xác nhận quyền chỉnh sửa, workflow phải **dừng lại** và yêu cầu người dùng cung cấp ảnh nguồn hợp pháp — tuyệt đối không tự động xoá dấu bản quyền để "cho xong việc".
