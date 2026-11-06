# 21: Admin Layout & Shell Redesign

**What to build:**
Tái cấu trúc bộ khung quản trị trung tâm của `crm-admin`:
1. `AdminLayout.tsx`: Thay thế drawer mobile thủ công bằng component `Sheet` (`SheetContent`, `SheetTrigger`) từ `@my-project/ui`, dọn dẹp các class `rounded-card`, `rounded-button`, `shadow-neo-sm`.
2. `Sidebar.tsx`: Thiết kế lại thanh điều hướng Monolith phẳng 100%, viền hairline 1px `border-r border-border/60`, font `Plus Jakarta Sans`, các mục menu sử dụng viền góc micro `rounded-[2px]`, thay thế badge `rounded-full` bằng micro-badge phẳng.
3. `AdminPageShell.tsx`: Chuẩn hóa thanh tiêu đề trang, loại bỏ lớp viền kép `border-neo-bevel`, loại bỏ hiệu ứng glassmorphism thừa, dùng typography phân tầng sắc nét `font-medium tracking-tight`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `AdminLayout.tsx` chuyển sang dùng Radix `Sheet` từ `@my-project/ui` cho menu mobile
- [x] Xóa sạch các class Neumorphism (`shadow-neo*`, `border-neo-bevel`, `rounded-card`, `rounded-button`, `rounded-inner`) trong `AdminLayout.tsx`, `Sidebar.tsx`, `AdminPageShell.tsx`
- [x] Sidebar hỗ trợ thu gọn/mở rộng mượt mà trên desktop, hiển thị hoàn hảo ở cả Light Mode và Dark Mode
- [x] `AdminPageShell.tsx` đồng bộ token `bg-background`, `border-border/60`, `text-foreground`, `text-muted-foreground`
- [x] TypeScript typecheck và build ứng dụng `@my-project/crm-admin` thành công 100%
