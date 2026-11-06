# ADR 0003: In-Canvas Studio Topbar & Dynamic Route-Based Breadcrumb Architecture

- **Status:** Accepted
- **Date:** 2026-10-08
- **Deciders:** Art Director, Tech Lead, Frontend Team

---

## 1. Bối cảnh & Vấn đề (Context & Problem Statement)

1. **Xung đột không gian tại Page Header**: Trước đây, Đảo hệ thống (`SystemIsland`) được gắn vào góc trên bên phải của `AdminPageShell`. Khi trang có nhiều nút hành động (Search, Filter, Export, Create), góc phải bị dồn ép, làm mất đi sự thoáng đãng tối giản của `DESIGN.md`.
2. **Thiếu định vị phân cấp sâu (Missing Breadcrumb Navigation)**: Quản trị viên khi đi sâu vào các trang chi tiết (`/admin/product/:id`, `/admin/order/:id`) không có chỉ dấu trực quan để nhận biết vị trí phân cấp danh mục hoặc quay ngược lại cấp cha chỉ với 1 cú click.
3. **Va chạm cấu trúc với Drawer Cột 3**: Đặt tiện ích hệ thống (Theme, User, Layout) phân tán trong trang con khiến trải nghiệm bị phụ thuộc vào từng shell, thay vì có một khung làm việc (Workspace Frame) cố định chuẩn studio như Linear hoặc Stripe.

---

## 2. Quyết định Kiến trúc (Decision)

Chúng tôi quyết định triển khai **Thanh Công Cụ Đỉnh Khung Làm Việc (In-Canvas Workspace Topbar)** kết hợp **Hệ Thống Breadcrumb Động (Dynamic Breadcrumb)**:

### 2.1. Cấu trúc In-Canvas Workspace Topbar
- **Vị trí**: Đặt cố định tại đỉnh của cột làm việc (`main`), ngay bên phải của Sidebar Cột 1 (trong chế độ `sidebar` layout).
- **Kích thước & Phong cách**: Chiều cao tinh gọn `h-12` (48px), phẳng 100%, viền đáy hairline 1px `border-b border-border/60`, bề mặt `bg-background/95 backdrop-blur-sm z-30`.
- **Phân tách hai cụm chức năng**:
  - **Cụm bên trái**:
    - Nút mở menu mobile (`Bars3Icon`, tự động ẩn trên desktop `md:hidden`).
    - Thanh điều hướng phân cấp **AdminBreadcrumb**.
  - **Cụm bên phải**:
    - Hệ thống điều khiển Workspace: Nút chuyển chế độ layout (`sidebar` $\leftrightarrow$ `topbar`), nút đổi giao diện (`ThemeToggle`), và Avatar người dùng với menu Đăng xuất.

### 2.2. Cơ chế suy luận Breadcrumb động (Dynamic Route-based Breadcrumb)
- Tạo bảng ánh xạ phân cấp các tuyến đường (`ROUTE_HIERARCHY_MAP`) dựa trên cấu trúc menu chuẩn:
  - Cấp 1 (Nhóm danh mục): *Tổng quan*, *Kinh doanh & Marketing*, *Sản phẩm & Danh mục*, *Quản trị hệ thống*.
  - Cấp 2 (Trang thực thể): *Đơn hàng*, *Khuyến mãi*, *Bộ sưu tập*, *Sản phẩm*, *Quản lý SKU*, *Danh mục*, *Thương hiệu*, *Thuộc tính*, *Người dùng*, *Bảo mật & Vai trò*.
  - Cấp 3 (Trang chi tiết / thao tác sâu): Tự động lấy tham số ID hoặc cho phép ghi đè nhãn từ context.
- Dấu phân cách viền mỏng hairline `ChevronRightIcon` siêu nhỏ (12px), màu `text-muted-foreground/40`.

### 2.3. Tương quan với Drawer Cột 3 (SplitPaneInspector)
- **Topbar cố định đỉnh toàn bộ Workspace**: Khi Drawer Cột 3 mở ra, Drawer trượt ra mượt mà **ngay bên dưới thanh Topbar**, tạo cảm giác khung cửa sổ ứng dụng chuyên nghiệp, vững chãi chuẩn macOS.
- **Giải phóng 100% Page Header**: Toàn bộ `AdminPageShell` được dọn dẹp sạch sẽ, không còn gánh các nút Theme / User / Layout, trả lại không gian tối đa cho thanh tìm kiếm và các nút nghiệp vụ.

---

## 3. Hệ quả & Đánh giá (Consequences)

- **Ưu điểm**:
  - Không gian thị giác nhất quán trên toàn bộ các trang quản trị.
  - Người dùng có thể nhảy về bất kỳ cấp danh mục cha nào trong 1 click.
  - Tích hợp liền mạch cả trên Desktop (h-12 siêu mỏng) và Mobile (thay thế hoàn toàn AdminTopBar riêng lẻ trước đây).
- **Lưu ý**:
  - Cần bảo đảm các trang con khi lazy-load hoặc có breadcrumb động dài không làm vỡ lề trên màn hình nhỏ (hỗ trợ truncate mềm dẻo).
