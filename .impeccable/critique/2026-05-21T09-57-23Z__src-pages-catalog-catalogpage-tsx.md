---
target: src/pages/catalog/catalogPage.tsx & src/widgets/CatalogFilters/CatalogFilters.tsx
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-05-21T09-57-23Z
slug: src-pages-catalog-catalogpage-tsx
---

### Điểm số Sức khỏe Thiết kế

| #             | Nguyên tắc Heuristic                       | Điểm số   | Vấn đề chính                                                                                                                                                |
| ------------- | ------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | Khả năng hiển thị trạng thái hệ thống      | 3/4       | Skeletons hoạt động tốt, nhưng thao tác lọc thiếu phản hồi trạng thái chờ chuyển tiếp.                                                                      |
| 2             | Sự tương thích giữa hệ thống và thực tế    | 3/4       | Nhãn tiếng Việt rõ ràng, nhưng các key sắp xếp nội bộ map trực tiếp vào URL query.                                                                          |
| 3             | Quyền kiểm soát và tự do của người dùng    | 4/4       | Nút "Xóa lọc" reset toàn bộ URL; nút đóng bộ lọc trên mobile trực quan.                                                                                     |
| 4             | Sự nhất quán và tiêu chuẩn                 | 1/4       | Bỏ qua các token thiết kế CSS chuẩn của dự án. Sử dụng nền glass tùy tiện, bo góc không chuẩn (`rounded-[32px]`), style ReactSelect cố định cho Light mode. |
| 5             | Phòng ngừa lỗi                             | 2/4       | Thiếu validation kiểm tra giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa.                                                                                  |
| 6             | Nhận biết thay vì nhớ lại                  | 3/4       | Các ô nhập bộ lọc hiển thị rõ ràng, nhưng nút đóng trên mobile và các nút phân trang chevron thiếu text label hỗ trợ.                                       |
| 7             | Sự linh hoạt và hiệu quả sử dụng           | 2/4       | Debounce chỉ hoạt động cho từ khóa. Các dropdown/khoảng giá yêu cầu bấm nút "Áp dụng". Nhấn Enter trong ô giá không tự submit.                              |
| 8             | Thẩm mỹ và thiết kế tối giản               | 2/4       | Card dạng kính vi phạm quy định tối giản của `DESIGN.md`. Typography sử dụng quá nhiều `font-black` và nhãn phụ viết hoa quá nhỏ `text-[10px]`.             |
| 9             | Giúp nhận biết, chẩn đoán và khắc phục lỗi | 2/4       | Không có màn hình lỗi cho khoảng giá không hợp lệ hoặc lỗi kết nối API.                                                                                     |
| 10            | Trợ giúp và tài liệu hướng dẫn             | 2/4       | Thiếu hướng dẫn gợi ý tại chỗ hoặc ví dụ định dạng khoảng giá.                                                                                              |
| **Tổng điểm** |                                            | **24/40** | **Chấp nhận được**                                                                                                                                          |

---

### Kết luận về Anti-Patterns (Thiết kế phản khuôn mẫu)

- **LLM đánh giá**:
  - Giao diện phụ thuộc quá nhiều vào phong cách kính (`glass bg-white/40 border-white/40 shadow-neu-soft backdrop-blur-3xl`) cho các container chính (sidebar Bộ lọc và khung chứa Product Grid). Điều này vi phạm trực tiếp hướng dẫn trong [DESIGN.md](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/DESIGN.md) (chỉ được dùng hiệu ứng kính cho header khi scroll, modal backdrop, hoặc floating badge; cấm dùng cho card/list thông thường).
  - Bo góc `rounded-[32px]` là quá lớn và không nằm trong các token tiêu chuẩn của dự án (tối đa là `rounded-2xl` - 12px).
  - Các giá trị màu trung tính bị hardcode với opacity tùy tiện (`bg-white/40`, `border-black/5`) thay vì sử dụng semantic color tokens của theme.
  - Phân cấp typography bị rối do dùng `font-black` (weight 900) quá nhiều cho các tiêu đề thông thường, cạnh tranh độ nổi bật với nhãn phụ nhỏ `text-[10px]` viết hoa.
- **Quét tự động**:
  - Không khả dụng (không tìm thấy công cụ quét tích hợp).
- **Overlay trực quan**:
  - Không khả dụng do thiếu môi trường browser tự động.

---

### Đánh giá chung

Bố cục trang catalog có cấu trúc hợp lý và responsive tốt. Tuy nhiên, phần styling đang bị tách rời khỏi hệ thống token Tailwind chuẩn và các nguyên tắc thiết kế của dự án, lạm dụng glassmorphism và bo góc tùy ý, gây giảm độ tương phản và không tương thích tốt với dark mode.

---

### Điểm tốt đã làm được

- **Đồng bộ URL SearchParams**: Lưu trữ bộ lọc trên URL giúp dễ dàng chia sẻ liên kết, tạo bookmark, hoặc refresh trang mà không bị mất các bộ lọc đã chọn.
- **Trạng thái tải dữ liệu mượt mà**: Việc sử dụng các skeleton loader trong component `ProductGrid` giúp giảm thiểu tình trạng giật lag khung hình (layout shifts) và mang lại phản hồi tải dữ liệu tự nhiên.

---

### Các vấn đề ưu tiên hàng đầu

- **[P1] Vi phạm quy tắc sử dụng Glassmorphism**
  - **Tại sao quan trọng**: Làm giảm độ tương phản của chữ, gây nhiễu thị giác và khiến giao diện không hiển thị tốt khi chuyển sang chế độ Dark Mode.
  - **Cách sửa**: Thay thế các class glass bằng màu nền chuẩn trong hệ thống token: `bg-card  shadow-soft`.
  - **Lệnh gợi ý**: `/impeccable layout`

- **[P1] Không tương thích Dark Mode ở ô Select**
  - **Tại sao quan trọng**: Khi kích hoạt dark mode, các dropdown ReactSelect vẫn giữ nguyên giao diện light-glass, khiến chữ bị nhạt màu và không đọc được.
  - **Cách sửa**: Chuyển đổi linh hoạt giữa `reactSelectLightStyles` và `reactSelectDarkStyles` trong component [CatalogFilters.tsx](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/src/widgets/CatalogFilters/CatalogFilters.tsx) dựa trên trạng thái Dark Mode của hệ thống.
  - **Lệnh gợi ý**: `/impeccable colorize`

- **[P1] Sử dụng Border Radius và Spacing tùy ý**
  - **Tại sao quan trọng**: Bỏ qua các design token tiêu chuẩn của dự án, làm mất tính đồng nhất của toàn bộ ứng dụng.
  - **Cách sửa**: Chuẩn hóa bo góc về `rounded-2xl` (12px) hoặc `rounded-card` (8px).
  - **Lệnh gợi ý**: `/impeccable layout`

- **[P2] Lỗ hổng kiểm soát khoảng giá**
  - **Tại sao quan trọng**: Người dùng có thể nhập giá tối thiểu lớn hơn giá tối đa, dẫn đến kết quả tìm kiếm trống rỗng mà không biết nguyên nhân.
  - **Cách sửa**: Thực hiện kiểm tra khoảng giá khi áp dụng; đảo vị trí tối thiểu/tối đa hoặc hiển thị cảnh báo lỗi trực quan cho người dùng.
  - **Lệnh gợi ý**: `/impeccable harden`

- **[P2] Lạm dụng Font Weight quá đậm (Typographic Shouting)**
  - **Tại sao quan trọng**: Dùng font chữ siêu đậm (`font-black`) một cách bừa bãi kết hợp với nhãn viết hoa quá nhỏ (`text-[10px]`) khiến người dùng bị mỏi mắt khi đọc lâu.
  - **Cách sửa**: Sử dụng font weight chuẩn như `font-semibold` hoặc `font-medium` cho tiêu đề phụ, nâng kích thước nhãn lên `text-xs` hoặc `text-sm` với kiểu viết thường tự nhiên.
  - **Lệnh gợi ý**: `/impeccable typeset`

---

### Cảnh báo theo Persona (Hình mẫu người dùng)

- **Alex (Người dùng chuyên nghiệp)**
  - Việc áp dụng bộ lọc thiếu tính đồng nhất: bộ lọc từ khóa tự động debounce rất nhanh, trong khi bộ lọc dropdown và khoảng giá lại bắt buộc phải dùng chuột bấm nút "Áp dụng". Hơn nữa, phím "Enter" trong ô nhập giá không thể dùng để submit nhanh.

- **Jordan (Người dùng mới)**
  - Nút chuyển trang ở footer chỉ sử dụng icon chevron mà không có chữ chỉ dẫn. Trên mobile, nút đóng bộ lọc là một biểu tượng "✕" lơ lửng, không có chú thích ý nghĩa trực quan.

- **Cô Lan (Project-Specific: Người mua sắm trung niên)**
  - Nhãn bộ lọc có kích thước cực kỳ nhỏ (`text-[10px]`), màu chữ xám nhạt `text-muted` nằm trên nền kính mờ có độ tương phản cực kỳ thấp. Điều này khiến những người mắt kém hoặc khi sử dụng thiết bị dưới ánh sáng ngoài trời không thể nhìn thấy chữ.

---

### Quan sát nhỏ

- Việc tự động lọc bỏ các tham số rỗng khỏi URL giúp giữ liên kết sạch sẽ và chuyên nghiệp.

---

### Câu hỏi cân nhắc cho bước tiếp theo

1. **Hướng đi ưu tiên**: Chúng ta nên bắt đầu xử lý phần nào trước?
   - **Lựa chọn A**: Chuẩn hóa cấu trúc trực quan và loại bỏ glassmorphism (Tập trung vào `/impeccable layout`)
   - **Option B**: Sửa lỗi hiển thị Dark Mode và dropdown ReactSelect (Tập trung vào `/impeccable colorize`)
   - **Lựa chọn C**: Ràng buộc logic khoảng giá và xử lý lỗi (Tập trung vào `/impeccable harden`)

2. **Cách thức áp dụng bộ lọc**:
   - **Lựa chọn A**: Tự động áp dụng ngay khi người dùng thay đổi dropdown/ô nhập giá (instant update)
   - **Lựa chọn B**: Giữ nút "Áp dụng" thủ công nhưng hỗ trợ phím "Enter" để submit nhanh trong ô nhập giá

3. **Phạm vi tinh chỉnh**:
   - **Lựa chọn A**: Tinh chỉnh toàn diện cả 2 file theo đúng mọi nguyên lý của `DESIGN.md`
   - **Lựa chọn B**: Chỉ sửa các lỗi nghiêm trọng nhất (giao diện glassmorphism và tương thích dark mode)
