# Ads & Growth Loop có kiểm soát

## 1. Nguyên tắc bất biến về ngân sách

**Không bao giờ tạo campaign khi `daily_budget` hoặc `max_monthly_spend` là `null`.** Mặc định `ads.enabled = false` cho tới khi chủ tài khoản cung cấp trần ngân sách rõ ràng. Agent **không được** tự tăng tổng ngân sách account — chỉ được tái phân bổ ngân sách bên trong ceiling mà chủ tài khoản đã phê duyệt trước.

## 2. Baseline phân bổ ngân sách đề xuất

```
70% prospecting
20% retargeting
10% creative experiments
```

Đây là **quy tắc ngân sách nội bộ đề xuất**, không phải tỷ lệ do Meta quy định. Khi warm audience còn quá nhỏ, phần retargeting nên được chuyển tạm sang prospecting.

## 3. Objective mapping

| Mục tiêu kinh doanh | Meta objective |
|---|---|
| Phủ thương hiệu | `OUTCOME_AWARENESS` |
| Tạo tương tác/video signals | `OUTCOME_ENGAGEMENT` |
| Form/booking/qualified lead | `OUTCOME_LEADS` |
| Purchase có tracking tốt | `OUTCOME_SALES` |
| Chỉ cần website visit | `OUTCOME_TRAFFIC` |

Objective phải được chọn theo **kết quả kinh doanh thực tế**, không đơn giản là "boost mọi bài". Tập objective này thuộc taxonomy hiện hành của Marketing API — kiểm tra lại tài liệu Marketing API khi triển khai thật vì taxonomy có thể được Meta cập nhật.

## 4. Bidding

Khởi đầu bằng chiến lược automated/lowest-cost **không cap** nếu chưa có CPA đáng tin cậy. Chỉ chuyển sang `COST_CAP` (hoặc ràng buộc cost khác) khi đã có đủ economics và volume ổn định để đặt cap hợp lý. Đây là chiến lược vận hành đề xuất — các tham số bidding cụ thể luôn phải được validate với phiên bản Marketing API đang dùng trước khi deploy.

## 5. Creative testing

Cấu trúc test chuẩn: `3 concepts × 2 hooks = 6 variants`. Giữ audience/offer tương đối ổn định và chỉ thay **một biến chính** trong mỗi vòng A/B test để kết quả có thể diễn giải được.

**Guardrail bắt buộc:** creative có `spend >= 1.5 × target_CPA` nhưng `0 primary conversion` → pause candidate + đưa vào review, không để chạy tiếp "chờ xem sao". Agent không được tự tăng tổng account budget để "cứu" một creative đang lỗ — chỉ tái phân bổ trong ceiling đã duyệt.

## 6. Audience — bốn lớp segment

| Segment | Tiêu chí | Nguồn |
|---|---|---|
| `cold` | Chưa tương tác/chưa có first-party signal | Broad/allowed targeting |
| `warm` | Page/video/content engagers | Meta Engagement Custom Audience |
| `intent` | Website visitors, leads, booking initiators | Pixel/Conversions API/lead data |
| `value` | Qualified lead/customer/high-LTV | CRM first-party |

Dữ liệu khách hàng đưa lên Customer File Custom Audience phải được **hash đúng chuẩn** của Meta trước khi upload — không upload dữ liệu định danh dạng thô (plaintext).

## 7. Lookalike audience

Thứ tự ưu tiên chọn seed:

```
high_ltv_customers > qualified_leads > converters > high_intent_visitors > high_quality_engagers
```

Không dùng "mọi follower" làm seed mặc định — seed sai mục tiêu sẽ khiến lookalike không phản ánh đúng khách hàng giá trị cao. Bắt đầu test ở nhóm tương đồng cao nhất (ví dụ 1% — mức được Meta mô tả là có độ tương đồng cao nhất trong vùng địa lý được chọn), chỉ mở rộng dần nếu cần thêm reach và đã đánh giá hiệu quả ở nhóm hẹp trước.

**Gate:** không tạo Lookalike chỉ vì "đủ số lượng dữ liệu" — seed phải phản ánh đúng business outcome mong muốn. Với Special Ad Categories, các tuỳ chọn nhắm mục tiêu (bao gồm Lookalike) có thể bị hạn chế trong một số nhóm quảng cáo — kiểm tra category của brand trước khi cấu hình audience.

## 8. Ads Insights & Conversions API

Ads Insights API là nguồn dữ liệu chính cho thống kê hiệu quả quảng cáo (spend, reach, impressions, CPM, CTR, CPC, CPL/CPA...). Conversions API (CAPI) được thiết kế để kết nối dữ liệu marketing từ hệ thống doanh nghiệp/website với Meta, bổ sung cho pixel-based tracking khi cần độ tin cậy attribution cao hơn.

## 9. Config mẫu cho phần ads (trích từ agent_config.template.json)

```json
{
  "ads": {
    "enabled": false,
    "deployment_requires_budget": true,
    "objective": "OUTCOME_LEADS",
    "budget": {
      "currency": "VND",
      "daily_budget": null,
      "max_monthly_spend": null,
      "allow_agent_to_increase_total_budget": false,
      "allocation_pct": { "prospecting": 70, "retargeting": 20, "experiments": 10 }
    },
    "bidding": {
      "initial_strategy": "LOWEST_COST_WITHOUT_CAP",
      "target_cpa": null,
      "allow_cost_cap_after_stable_data": true
    },
    "creative_testing": {
      "concepts": 3,
      "hooks_per_concept": 2,
      "change_one_primary_variable": true,
      "equal_initial_allocation": true,
      "primary_metric": "qualified_lead",
      "pause_zero_conversion_after_target_cpa_multiple": 1.5,
      "require_minimum_evidence_before_winner": true
    }
  }
}
```
