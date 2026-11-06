# Ticket 28: In-Canvas Studio Topbar & Dynamic Route-Based Breadcrumb System

- **Type:** task
- **Status:** done
- **Blocked by:** none

## Mô tả công việc
Thiết kế và triển khai thanh Topbar đỉnh khung làm việc (`AdminWorkspaceTopbar`) và hệ thống Breadcrumb động:
1. Xây dựng component `AdminBreadcrumb` tự động bóc tách phân cấp từ `location.pathname` theo cấu trúc menu chuẩn.
2. Xây dựng component `AdminWorkspaceTopbar` (h-12, border-b hairline, kết hợp Breadcrumb bên trái và System Controls bên phải, kèm nút mở menu mobile).
3. Tích hợp `AdminWorkspaceTopbar` vào đỉnh `main` trong `AdminLayout.tsx` (thay thế mobile `AdminTopBar` cũ).
4. Dọn dẹp `AdminPageShell.tsx` (gỡ bỏ việc nhúng `SystemIsland` ở header trang, trả lại không gian thoáng đãng cho nghiệp vụ).
5. Kiểm tra build và trực quan trên trình duyệt (Sidebar mode + Topbar mode + Mobile view).

## Comments
- Đã được phỏng vấn thiết kế (/grill-with-docs) và thống nhất Hướng A (In-Canvas Topbar cố định đỉnh, Drawer trượt bên dưới).
- ADR tương ứng: `docs/adr/0003-in-canvas-topbar-breadcrumb-architecture.md`.

## Answer
- Đã tạo `apps/crm-admin/src/components/layout/AdminBreadcrumb.tsx` với ánh xạ `ROUTE_MAP` tự động nhận diện phân cấp nhóm và trang con.
- Đã tạo `apps/crm-admin/src/components/layout/AdminWorkspaceTopbar.tsx` (chiều cao h-12 48px, viền đáy hairline).
- Đã gắn `AdminWorkspaceTopbar` vào đỉnh `main` trong `AdminLayout.tsx`.
- Đã dọn dẹp `AdminPageShell.tsx` giải phóng 100% không gian header trang cho nghiệp vụ.
- Build production thành công 100%.
