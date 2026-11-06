# ADR 0002: Global Minimalist Hairline Scrollbar System

- **Status:** Accepted
- **Date:** 2026-10-08
- **Deciders:** Art Director, Tech Lead, Frontend Team

---

## 1. Bối cảnh & Vấn đề (Context & Problem Statement)

1. **Thanh cuộn mặc định của trình duyệt phá vỡ thẩm mỹ Ultra-Minimalism**: Trên Windows và Linux (Chrome/Edge/Firefox), thanh cuộn mặc định có độ rộng 15px–17px, màu xám thô kệch, đè lên các viền hairline 1px và làm mất đi cảm giác phẳng cao cấp (Studio-grade) của `DESIGN.md`.
2. **Thiếu định nghĩa tập trung**: Hiện tại trong codebase có hơn 20 component sử dụng class `.custom-scrollbar` rải rác nhưng class này chưa hề được định nghĩa trong `packages/ui/src/globals.css`. Nhiều nơi phải viết inline các pseudo-classes cồng kềnh `[&-::-webkit-scrollbar]:hidden`.
3. **Không đồng bộ Dark / Light Mode**: Khi đổi giao diện sang Dark Mode (`#121212`), thanh cuộn mặc định của trình duyệt vẫn giữ màu sáng gây chói mắt.
4. **Layout Shift (Jitter)**: Khi nội dung container thay đổi dẫn đến xuất hiện thanh cuộn, giao diện bị giật lề do không có cơ chế `scrollbar-gutter`.

---

## 2. Quyết định Kiến trúc (Decision)

Chúng tôi quyết định thiết kế và tích hợp **Hệ thống Thanh Cuộn Toàn Cục Tối Giản (Global Minimalist Hairline Scrollbar System)** đặt tại `packages/ui/src/globals.css` (được import chung bởi cả `apps/crm-admin` và `apps/ecommerce-client`):

### 2.1. Tự động áp dụng toàn cục (Auto-apply Global Scope)
- Áp dụng trên toàn bộ root (`html`, `body`) và toàn bộ phần tử (`*`) có thuộc tính `overflow: auto` hoặc `overflow: scroll`:
  - **WebKit (Chrome, Safari, Edge)**:
    - Độ rộng thanh cuộn: `5px` (chiều dọc) và `5px` (chiều ngang).
    - Track (đường dẫn): Trong suốt 100% (`background: transparent`).
    - Thumb (thanh kéo): Bo góc micro `rounded-[2px]`, màu `hsl(var(--muted-foreground) / 0.25)`.
    - Thumb Hover: Chuyển sang `hsl(var(--muted-foreground) / 0.5)`.
    - Corner: Trong suốt.
  - **Chuẩn W3C (Firefox)**:
    - `scrollbar-width: thin;`
    - `scrollbar-color: hsl(var(--muted-foreground) / 0.25) transparent;`
- Nhờ kế thừa biến màu CSS `--muted-foreground`, thanh cuộn **tự động biến đổi màu tương ứng khi chuyển giữa Warm Milk Paper (Light) và Deep Obsidian (Dark)** mà không cần viết media query riêng.

### 2.2. Bộ tiện ích mở rộng (Utility Classes)
- **`.custom-scrollbar`**: Được định nghĩa đồng bộ với cấu hình toàn cục, giúp các component đang dùng class này tương thích 100%.
- **`.scrollbar-none`**: Giữ nguyên utility ẩn thanh cuộn cho các slider, carousel (Lookbook, Banner, Tag Chips) nhưng vẫn cuộn được.
- **`.scrollbar-stable`**: Bổ sung `scrollbar-gutter: stable;` để giữ khoảng đệm cố định, triệt tiêu hoàn toàn hiện tượng giật lề (layout shift) cho modal và drawer khi nội dung thay đổi độ dài.

---

## 3. Hệ quả & Đánh giá (Consequences)

- **Ưu điểm**:
  - Không cần sửa đổi hàng loạt file React component; mọi trang, bảng biểu, drawer và modal tự động có thanh cuộn hairline cao cấp.
  - Hiệu năng tối đa, không cần JavaScript listeners hay thư viện thứ 3 (như SimpleBar, PerfectScrollbar).
  - Tương thích 100% cả WebKit lẫn Firefox.
- **Lưu ý**:
  - Đối với các phần tử cần ẩn hoàn toàn thanh cuộn, chỉ cần gán class `scrollbar-none`.
