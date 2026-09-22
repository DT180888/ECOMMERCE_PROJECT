---
target: catalog page
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-05-23T18-01-45Z
slug: src-pages-client-catalog-catalogpage-tsx
---
# Báo cáo Đánh giá UI/UX - Catalog Page

Báo cáo chi tiết đánh giá chất lượng thiết kế giao diện (UI) và trải nghiệm người dùng (UX) của trang Danh mục sản phẩm (Catalog Page), đối chiếu với Hệ thống Thiết kế Neumorphism (Soft UI) trong [DESIGN.md](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/DESIGN.md) và các quy chuẩn thiết kế đi kèm.

---

### 1. Điểm số Sức khỏe Thiết kế (Design Health Score)

Dưới đây là đánh giá dựa trên 10 nguyên lý tương tác (Heuristics) của Jakob Nielsen (thang điểm từ 0 đến 4 cho mỗi tiêu chí):

| # | Tiêu chí Heuristic | Điểm | Vấn đề chính phát hiện |
|---|-----------|-------|-----------|
| 1 | **Trạng thái hệ thống (Visibility of System Status)** | 3/4 | Tiêu đề chính "Tất cả sản phẩm" là tĩnh, không thay đổi linh hoạt theo từ khóa tìm kiếm hoặc danh mục đang lọc. |
| 2 | **Sự tương thích với thực tế (Match System / Real World)** | 4/4 | Thuật ngữ rõ ràng, thân thiện với người dùng Việt Nam. |
| 3 | **Quyền kiểm soát của người dùng (User Control & Freedom)** | 3/4 | Bộ lọc giá tự động hoán đổi giá trị tối thiểu và tối đa khi người dùng đang nhập gây mất kiểm soát tạm thời. |
| 4 | **Sự nhất quán & Tiêu chuẩn (Consistency & Standards)** | 2/4 | Trộn lẫn tiếng Anh và tiếng Việt ("Quick Add", "You've reached the end"); Lớp phủ mobile drawer dùng border cứng vi phạm nguyên lý Neumorphism. |
| 5 | **Phòng tránh lỗi (Error Prevention)** | 3/4 | Hoán đổi giá trị để tránh khoảng giá âm/sai lệch nhưng thiếu cảnh báo tường minh cho người dùng. |
| 6 | **Nhận diện thay vì nhớ lại (Recognition Rather Than Recall)** | 4/4 | Các filter chips hiển thị trực quan và dễ dàng xóa bỏ. |
| 7 | **Sự linh hoạt & Hiệu quả (Flexibility & Efficiency)** | 3/4 | Nút phân trang bị vô hiệu hóa (disabled) vẫn giữ bóng đổ nổi 3D, khiến người dùng lầm tưởng vẫn click được. |
| 8 | **Thẩm mỹ & Tối giản (Aesthetic & Minimalist Design)** | 2/4 | Skeletons tải trang dùng màu xám đậm (`bg-muted`) gây nhấp nháy thị giác mạnh; Nút "Quick Add" quá to và thô gây rối mắt. |
| 9 | **Nhận biết, chẩn đoán & Khắc phục lỗi (Error Recovery)** | 4/4 | Giao diện lỗi kết nối và trang rỗng (empty state) được thiết kế chỉn chu, có tính thẩm mỹ tốt. |
| 10| **Trợ giúp & Tài liệu (Help & Documentation)** | 3/4 | Các nhãn nhập và placeholder của bộ lọc tương đối đầy đủ và rõ ràng. |
| **Tổng** | | **31/40** | **Khá (Good - Cần tối ưu hóa các điểm yếu cấu trúc)** |

---

### 2. Đánh giá Anti-Patterns (Anti-Patterns Verdict)

*   **Đánh giá tổng quan (Aesthetic & AI Slop Check)**: **ĐẠT (PASS)**. Giao diện trang không mang cảm giác "AI Slop" rẻ tiền nhờ việc tuân thủ cấu trúc Soft UI/Neumorphism đồng nhất trên nền clay `#E0E5EC`. Tuy nhiên, trang vẫn vướng phải một số lỗi thiết kế lai căng (hybrid) làm giảm độ cao cấp.
*   **Phát hiện cụ thể**:
    1.  *Sử dụng đường viền (Border Line)*: Mobile drawer header sử dụng `border-b border-border/50` phá vỡ nguyên lý cốt lõi của Neumorphism: *"Neumorphism never uses borders; shadows define all edges"*.
    2.  *Sự nhấp nháy thị giác (Visual Shimmering/Flashing)*: Các thanh skeleton trong `ProductCardSkeleton.tsx` sử dụng màu `bg-muted` (`#6B7280`). Màu này quá tối so với nền clay `#E0E5EC`, tạo ra các khối xám đen nhấp nháy rất mạnh khi tải sản phẩm.
    3.  *Nút hành động tĩnh*: Nút "Quick Add" hiện diện thô ráp trên mọi card sản phẩm thay vì ẩn đi và chỉ hiện khi hover/tương tác, làm mất đi sự tinh tế và tối giản của Soft UI.

---

### 3. Ấn tượng Chung (Overall Impression)

Trang catalog có nền tảng cấu trúc rất vững chãi với hiệu ứng đổ bóng Neumorphic mượt mà trên nền clay đặc trưng. Tuy nhiên, trải nghiệm bị giảm bớt sự cao cấp bởi việc lạm dụng quá nhiều nút bấm thô kệch (như nút Quick Add luôn hiển thị), sự không đồng nhất về mặt ngôn ngữ (Anh/Việt trộn lẫn), và hiệu ứng nhấp nháy từ skeleton loader quá tối màu. Điểm cần tối ưu hóa lớn nhất là **làm sạch sự lộn xộn thị giác** và **đồng bộ hóa các tiêu chuẩn kỹ thuật thiết kế**.

---

### 4. Những Điểm Tốt Đang Có (What's Working)

1.  **Hệ thống Phản hồi Đổ bóng Chuẩn**: Các inputs và ReactSelect dropdowns sử dụng bóng đổ `shadow-neo-inset` và chuyển đổi sang `shadow-neo-inset-deep` khi focus rất mượt mà và trực quan.
2.  **Bộ lọc Đa năng Debounce Tốt**: Việc sử dụng debounce cho keyword và giá giúp tránh tải lại trang liên tục, tăng hiệu suất hoạt động mà vẫn cập nhật URL đồng bộ.
3.  **Empty & Error States Đẹp mắt**: Các màn hình trống và lỗi kết nối sử dụng các icon tròn có hiệu ứng Inset sâu (`shadow-neo-inset-sm`) tạo cảm giác 3D rất tốt.

---

### 5. Các Vấn đề Ưu tiên (Priority Issues)

#### [P1] Thanh Skeleton Quá Tối Gây Nhấp Nháy Thị Giác Mạnh
*   **Ảnh hưởng**: Khi người dùng chuyển trang hoặc tải danh sách sản phẩm, các khối skeleton màu xám đậm (`bg-muted` - `#6B7280`) xuất hiện đột ngột, gây kích thích thị giác không dễ chịu trên nền clay sáng.
*   **Giải pháp**: Thay thế `bg-muted` trong [ProductCardSkeleton.tsx](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/src/widgets/client/Product/ProductCardSkeleton.tsx) thành màu xám cực nhẹ hoặc sử dụng opacity thấp hơn (ví dụ: `bg-muted/10` hoặc `bg-surface/50`) kết hợp với hiệu ứng chuyển động mờ nhạt dần.

#### [P1] Nút Phân Trang Disabled Vẫn Hiển Thị Trạng Thái Click Được
*   **Ảnh hưởng**: Nút Trước/Sau khi bị `disabled` (ở trang đầu hoặc trang cuối) vẫn giữ nguyên bóng đổ nổi 3D (`shadow-neo-sm`). Người dùng vẫn nghĩ nút này có thể nhấn được, vi phạm nguyên lý phản hồi trạng thái giao diện.
*   **Giải pháp**: Loại bỏ bóng đổ nổi 3D khi nút bị disabled, biến nó thành trạng thái phẳng (flat) hoặc hơi lún (`shadow-neo-inset-sm` hoặc `shadow-none`).

#### [P2] Nút Quick Add Thô và Trộn Lẫn Tiếng Anh
*   **Ảnh hưởng**: Cụm từ tiếng Anh "Quick Add" lạc lõng giữa giao diện hoàn toàn tiếng Việt. Ngoài ra, việc luôn hiện nút này dưới mỗi card sản phẩm làm giao diện bị rối mắt và phân tán sự chú ý khỏi hình ảnh sản phẩm.
*   **Giải pháp**: Đổi tên thành "Thêm nhanh". Đồng thời, có thể chuyển nút này thành dạng hover-overlay (chỉ xuất hiện hoặc trượt lên khi hover vào card sản phẩm trên desktop) để trả lại không gian tối giản cho lưới sản phẩm.

#### [P2] Drawer Bộ Lọc Mobile Thiếu Cuộn và Vướng Border Cứng
*   **Ảnh hưởng**: Drawer chứa bộ lọc trên mobile không có thuộc tính cuộn dọc (`overflow-y-auto`). Nếu người dùng dùng điện thoại có màn hình ngắn hoặc xoay ngang, họ sẽ không thể chạm tới các bộ lọc phía dưới. Hơn nữa, dòng kẻ border vi phạm thiết kế borderless của Neumorphism.
*   **Giải pháp**: Thêm `overflow-y-auto` vào container chính của bộ lọc trong drawer và thay thế đường viền `border-b` bằng khoảng cách hoặc đổ bóng chìm tinh tế.

#### [P3] Tiêu Đề Trang Tĩnh Không Phản Ánh Trạng Thái Bộ Lọc
*   **Ảnh hưởng**: Khi người dùng đang xem danh mục "Điện thoại" hoặc tìm kiếm từ khóa "iPhone", tiêu đề trang vẫn hiển thị cứng nhắc là "Tất cả sản phẩm".
*   **Giải pháp**: Cập nhật tiêu đề trang động dựa trên các bộ lọc/từ khóa đang active (ví dụ: "Kết quả tìm kiếm cho: '[Keyword]'" hoặc tên danh mục tương ứng).

---

### 6. Điểm Đỏ Persona (Persona Red Flags)

*   **Alex (Người dùng chuyên nghiệp / Power User)**: Cảm thấy khó chịu khi đang gõ bộ lọc khoảng giá từ 100k đến 50k, hệ thống tự động hoán đổi giá trị trong ô input khiến con trỏ bị nhảy hoặc số liệu bị đảo lộn ngay lập tức mà không đợi gõ xong.
*   **Jordan (Người dùng mới / First-Timer)**: Hoang mang khi thấy các từ tiếng Anh xen kẽ như "Quick Add" hay "You've reached the end", cảm giác trang web chưa được dịch thuật hoàn chỉnh và thiếu chuyên nghiệp. Đồng thời, sự giật cục của skeleton tối màu lúc tải trang tạo cảm giác trang web nặng nề.

---

### 7. Quan sát Nhỏ (Minor Observations)

*   Cần thêm thuộc tính `aria-label` cho nút xóa filter chips để người dùng sử dụng trình đọc màn hình dễ dàng nhận biết tính năng nút "✕".
*   Kích thước chữ của Breadcrumbs (`text-xs font-bold text-muted`) và nhãn filter nhỏ (`text-[11px]`) hơi khó đọc trong điều kiện ánh sáng mạnh trên thiết bị di động.

---

### 8. Câu hỏi Cần Cân nhắc (Questions to Consider)

*   *Chúng ta có nên ẩn hoàn toàn nút "Quick Add" trên thiết bị di động và chỉ cho phép người dùng click vào chi tiết sản phẩm để chọn SKU hay không? (Vì trên mobile không có sự kiện hover và nút chiếm nhiều không gian dọc).*
*   *Liệu có nên thêm một thông báo lỗi nhẹ ở dưới ô nhập giá thay vì tự động hoán đổi giá trị nhập của người dùng khi khoảng giá bị đảo ngược?*
