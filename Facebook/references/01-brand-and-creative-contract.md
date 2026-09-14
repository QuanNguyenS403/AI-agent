# Brand Contract & Creative Contract

Tài liệu này mô tả đầy đủ 4 file cấu hình bắt buộc mà agent phải nạp trước khi sinh bất kỳ nội dung nào, và các "hợp đồng" (contract) về nội dung/creative mà mọi bài đăng phải tuân thủ.

## 1. brand_profile.yaml

Chứa persona, positioning, tone, topic whitelist/blacklist, các claim được phép tuyên bố, và CTA chuẩn của brand. Đây là nguồn sự thật cho mọi bài viết/kịch bản — agent không được tự suy diễn persona hay tone nếu file này chưa có hoặc thiếu trường.

## 2. offer_catalog.json

Danh mục sản phẩm/dịch vụ, giá, và các ưu đãi hợp lệ tại thời điểm hiện tại. Copy/CTA chỉ được nhắc tới giá hoặc ưu đãi có trong file này — không được tự bịa mức giá hay khuyến mãi.

## 3. policy.yaml

Ngưỡng rủi ro (threshold cho `brand_voice_score`, `duplicate_score`...), danh sách hard block, và quy tắc approval routing. Xem chi tiết đầy đủ về QA/policy ở `references/05-qa-policy-compliance.md`.

## 4. brand.json — bộ quy tắc hình ảnh

Agent phải đọc một file `brand.json` cố định trước khi sinh hoặc chỉnh sửa bất kỳ ảnh/video nào. Schema tối thiểu:

```text
Brand_ID
Logo / Badge
Font tiêu đề / font phụ
Màu chính / màu phụ
Vị trí logo
Safe-zone
Phong cách ánh sáng
Phong cách background
Trang phục nhân vật
Tỉ lệ khuôn mặt trong ảnh
Các từ cấm / hình ảnh cấm
Format: 1:1 / 4:5 / 9:16
```

Ví dụ cụ thể hoá (điền theo brand thật, đây chỉ là mẫu minh hoạ cấu trúc):

```json
{
  "brand_id": "REPLACE_ME",
  "logo": {
    "asset_path": "assets/logo.png",
    "position": "bottom_right",
    "min_margin_px": 40
  },
  "badge": {
    "asset_path": "assets/badge_new.png",
    "position": "top_left"
  },
  "fonts": {
    "heading": "REPLACE_ME",
    "body": "REPLACE_ME"
  },
  "colors": {
    "primary": "#000000",
    "secondary": "#000000"
  },
  "safe_zone": {
    "top_pct": 8,
    "bottom_pct": 12,
    "left_pct": 5,
    "right_pct": 5
  },
  "lighting_style": "REPLACE_ME",
  "background_style": "REPLACE_ME",
  "character_wardrobe": "REPLACE_ME",
  "face_ratio_in_frame_pct": "REPLACE_ME",
  "banned_words": [],
  "banned_visuals": [],
  "formats": ["1:1", "4:5", "9:16"]
}
```

**Gate:** thiếu trường bắt buộc trong `brand.json` → dừng lại và hỏi người dùng, không tự chọn font/màu/vị trí logo mặc định.

## 5. Hợp đồng nội dung (content contract)

**Tần suất khởi tạo:** `7 post/tuần = 4 Reel + 2 carousel + 1 image/text`. Từ tuần thứ năm trở đi, scheduler nên chọn slot theo rolling performance của chính Page thay vì giữ lịch cứng.

**Lịch khởi động đề xuất** (baseline để agent bắt đầu chạy — không phải "khung giờ tốt nhất của Facebook", phải thay bằng dữ liệu riêng của Page sau 28 ngày):

| Ngày | Giờ | Format | Vai trò nội dung |
|---|---:|---|---|
| Thứ Hai | 07:30 | Carousel | Education / framework |
| Thứ Ba | 19:30 | Reel | Problem → insight |
| Thứ Tư | 11:45 | Image/text | POV / quan điểm |
| Thứ Năm | 19:30 | Reel | How-to |
| Thứ Sáu | 11:45 | Carousel | Case/proof/checklist |
| Thứ Bảy | 09:00 | Reel | Personal story / BTS |
| Chủ Nhật | 20:00 | Reel | Q&A / synthesis / soft CTA |

**Content mix khởi tạo:** `40% Teach / 20% POV / 15% Proof / 15% Personal story / 10% Offer-CTA`. Đây là tỷ trọng thử nghiệm ban đầu, không phải quy tắc của Meta.

**Voice contract (áp dụng cho mọi caption/script):**

- Chuyên gia nhưng dễ hiểu; câu ngắn.
- Một bài = một luận điểm (`single_message` duy nhất, không nhồi nhiều ý).
- Không "giật tít" sai sự thật.
- Không viết các cụm khẳng định tuyệt đối nếu không có nguồn chứng minh: "chắc chắn 100%", "đảm bảo thành công", "tốt nhất thị trường".
- CTA duy nhất mỗi bài — không nhồi nhiều lời kêu gọi hành động khác nhau.
- Loại bỏ filler, keyword stuffing, engagement bait ("comment số 1 nếu bạn đồng ý", v.v.), và bất kỳ thông tin định lượng nào không có `source_ref` đi kèm.

## 6. Hợp đồng creative (kích thước, định dạng master)

**Reel:** master `1080×1920`, tỉ lệ `9:16`, container MP4/H.264, audio AAC, **luôn có caption/subtitle**. Môi trường Reels có vùng UI có thể che chữ/logo — creative dọc và tránh đặt chữ quan trọng sát viền trên/dưới. Các video do model AI sinh ra ở độ phân giải/tỉ lệ khác phải được resize/pad về đúng master này ở bước hậu kỳ, không xuất thẳng tỉ lệ gốc.

**Feed image/carousel:** master `1080×1350`, tỉ lệ `4:5`, JPG/PNG. Meta có yêu cầu kỹ thuật riêng theo từng placement (ví dụ chiều rộng tối thiểu cho feed image) — vì vậy renderer phải kiểm tra placement trước khi export, không coi một tỉ lệ duy nhất là hợp lệ cho mọi vị trí hiển thị.

**Template Reel 35–50 giây:**

```
0–2s   Hook
2–6s   Problem / Stakes
6–25s  2–3 insight/steps chính
25–38s Proof / example
38–50s CTA
```

**Storyboard JSON cho mỗi Reel** — mỗi scene phải có đủ các trường sau:

```text
scene_id | start_s | end_s | narration | on_screen_text |
visual_prompt | camera_motion | asset_ref | transition
```

**Template carousel:**

```
Slide 1        Hook / claim
Slide 2        Problem
Slide 3–6      Steps / proof
Slide cuối     Summary + CTA
```

## 7. Ví dụ brief.json cho một post

```json
{
  "objective": "qualified_lead",
  "audience": "warm",
  "insight": "REPLACE_ME — một insight cụ thể, không chung chung",
  "single_message": "REPLACE_ME — đúng một luận điểm",
  "hook": "REPLACE_ME",
  "proof_source": "REPLACE_ME hoặc null nếu không có claim định lượng",
  "cta": "REPLACE_ME",
  "format": "reel",
  "duration_seconds": 40,
  "visual_style": "REPLACE_ME — tham chiếu tới brand.json",
  "policy_risk": "LOW"
}
```

Không cho phép copy agent tự "bịa" số liệu hoặc case study để lấp vào `proof_source`. Nếu không có nguồn thật, để `proof_source=null` và bỏ claim định lượng khỏi copy.
