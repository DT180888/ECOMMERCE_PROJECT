# ADR 0001: Editorial Slide-over Drawer, System Dock & Morphing Action Dock Architecture

- **Status:** Accepted
- **Date:** 2026-10-07
- **Deciders:** Art Director, Tech Lead, CRM Admin Team

---

## 1. Bối cảnh & Vấn đề (Context & Problem Statement)

Trong hệ thống quản trị `apps/crm-admin`:
1. **Đứt gãy luồng công việc (Context Switching)**: Các thực thể ít thông tin như Thương hiệu (`Brand` chỉ có 2 trường `name`, `slug`), Danh mục (`Category`) và Bộ sưu tập (`Collection`) hiện đang điều hướng người dùng sang các trang riêng biệt (`/admin/brand/new`, `/admin/brand/:id`, `/admin/category/*`). Điều này làm người dùng mất hoàn toàn ngữ cảnh danh sách, bộ lọc và vị trí phân trang.
2. **Lãng phí diện tích hiển thị (Vertical Real Estate Waste)**: Trong chế độ layout `sidebar`, hệ thống vừa duy trì thanh `Sidebar` dọc vừa duy trì `AdminTopBar` ngang chỉ để chứa nút Toggle Theme, Toggle Layout và Avatar User. Chiều cao 60px của TopBar làm giảm không gian hiển thị bảng dữ liệu.
3. **Thao tác bảng rời rạc (Fragmented Action Controls)**: Các nút tìm kiếm, bộ lọc, thêm mới và thao tác hàng loạt (batch delete, batch status change) nằm rải rác ở nhiều thanh công cụ tĩnh, thiếu tính năng phản hồi động khi chọn nhiều dòng dữ liệu.

---

## 2. Quyết định Kiến trúc (Decision)

Chúng tôi quyết định áp dụng bộ giải pháp **Editorial Slide-over Drawer + System Dock + Morphing Table Action Dock**:

### 2.1. Unified Slide-over Drawer cho Brand, Category & Collection
- **Component Core**: Sử dụng `Sheet` từ `@my-project/ui` với cạnh trượt bên phải (`side="right"`), độ rộng 480px, viền phẳng hairline 1px (`border-l border-border/60`), bề mặt `bg-card`, micro `rounded-[2px]`.
- **Deep-linking State (URL Query Param)**:
  - Mở tạo mới: Cập nhật URL thành `?action=create`.
  - Mở chỉnh sửa: Cập nhật URL thành `?edit=<id>`.
  - Đóng Drawer: Xóa query params tương ứng mà không kích hoạt tải lại trang.
  - Đảm bảo người dùng có thể Refresh (F5), chia sẻ link hoặc bookmark chính xác form đang mở.
- **Phản hồi tức thì**: Khi submit thành công hoặc xóa, invalidate TanStack Query cache để cập nhật bảng nền ngay lập tức mà không cần reload trang.

### 2.2. Loại bỏ `AdminTopBar` & Triển khai `System Dock` neo chân Sidebar
- **Loại bỏ TopBar trong chế độ Sidebar**: Khi `layoutMode === "sidebar"`, ẩn hoàn toàn `AdminTopBar`. Canvas làm việc mở rộng 100% chiều cao màn hình.
- **Sidebar System Dock**: Tích hợp một thanh dock tinh gọn đặt cố định tại chân Sidebar (`aside` bottom), bao gồm:
  - Toggle Layout Mode: Chuyển đổi linh hoạt `sidebar` $\leftrightarrow$ `topbar`.
  - Theme Toggle: Chuyển đổi `Dark` $\leftrightarrow$ `Light`.
  - User Identity Pill & Dropdown: Avatar, tên, vai trò và nút Đăng xuất.

### 2.3. Morphing Table Action Dock (Đảo Động Thao Tác Bảng)
- Thiết kế thanh công cụ dạng dock nổi trên đỉnh bảng dữ liệu (`bg-card/95 backdrop-blur-md border border-border/60 rounded-[2px]`):
  - **Trạng thái Mặc định (Default)**: Hiển thị thanh tìm kiếm nhanh, badge số lượng bản ghi và nút `+ Thêm mới` (kích hoạt mở Slide-over Drawer).
  - **Trạng thái Chọn hàng (Batch Mode)**: Khi người dùng tick chọn $\ge 1$ hàng trong bảng, thanh tự động biến hình mở rộng hiển thị số hàng đã chọn, nút đổi trạng thái nhanh, nút xoá hàng loạt và nút hủy chọn.

---

## 3. Các Phương án Đã Xem xét & Đánh giá (Alternatives Considered)

- **Phương án 2 (Miller 3-Column Layout cố định)**:
  - *Nhược điểm*: Thực thể `Brand` chỉ có 2 trường (`name`, `slug`), việc dành hẳn một cột cố định 400px bên phải sẽ tạo ra quá nhiều khoảng trống thừa trên Desktop, làm chật chội bảng danh sách ở giữa.
- **Phương án 3 (Pure Headless Canvas với Floating Island Hub trung tâm)**:
  - *Nhược điểm*: Đưa toàn bộ điều hướng lên một floating dock lơ lửng giữa màn hình gây rối mắt, phá vỡ cấu trúc phân cấp thông tin rõ ràng của hệ thống quản trị doanh nghiệp.

---

## 4. Hệ quả & Cam kết (Consequences & Design Guarantees)

- **Tuân thủ Editorial Ultra-Minimalism**: 100% các thành phần Dock và Drawer tuân thủ `DESIGN.md` và `rule.md`: không đổ bóng dày (`shadow-none`), viền hairline 1px `border-border/60`, góc micro `rounded-[2px]`, không dùng đen/trắng thuần.
- **Tối ưu trải nghiệm (UX)**: Người dùng thực hiện toàn bộ quy trình CRUD mà không bị reload hay rời khỏi bảng danh sách.
- **Hiệu năng**: Các Drawer form được lazy load hoặc render có điều kiện, chỉ fetch dữ liệu chi tiết khi query param `?edit=<id>` xuất hiện.
