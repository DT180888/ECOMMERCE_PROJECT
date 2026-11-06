# 22: Admin Table & Controls Redesign

**What to build:**
Tái thiết kế hệ thống bảng biểu và điều khiển dùng chung tại `apps/crm-admin/src/components/common/table/` và pagination:
1. `AdminTable.tsx`: Thiết kế lại bảng dữ liệu phẳng chuẩn Studio Editorial, header phân cấp rõ ràng `text-[11px] font-medium tracking-[0.12em] uppercase text-muted-foreground`, đường phân cách 1px `border-border/60`, hàng hover nhẹ nhàng `hover:bg-foreground/[0.02]`.
2. `AdminTableMobileCard.tsx`: Tối ưu hiển thị responsive trên mobile, loại bỏ `shadow-neo-hover` và `border-neo-bevel`.
3. `SortIcon.tsx` & `ActionCell.tsx`: Dùng các nút thao tác siêu mảnh micro `rounded-[2px]`, icon sắc nét.
4. `AdminPagination.tsx`: Thay thế nút bấm cũ bằng `Button` phẳng outline/ghost từ `@my-project/ui`.
5. `OrderStatusBadge.tsx`: Thay thế badge viên thuốc `rounded-full` bằng micro-status badge chuẩn editorial.

**Blocked by:** 21: Admin Layout & Shell Redesign

**Status:** done

- [x] `AdminTable.tsx` sạch hoàn toàn `border-neo-bevel` và `shadow-neo*`, hỗ trợ Dynamic Density (compact/comfortable), Floating Bulk Action Dock không gây layout shift, viền hairline `border-border/60` và `bg-card`
- [x] `AdminTableMobileCard.tsx` hiển thị phẳng, tinh gọn, micro-radius `rounded-[2px]`
- [x] `AdminPagination.tsx` đồng bộ với `Button` của `@my-project/ui`, touch target chuẩn
- [x] `OrderStatusBadge.tsx` dùng dot chỉ thị trạng thái và micro-badge thanh lịch
- [x] TypeScript typecheck đạt chuẩn (Turbo build passed 100%)
