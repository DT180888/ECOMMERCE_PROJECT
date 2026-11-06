# 23: Dashboard Widgets Redesign

**What to build:**
Tái thiết kế toàn bộ Dashboard trung tâm của `crm-admin`:
1. `Dashboard.tsx`: Bố cục lưới cân xứng, asymmetric vertical spacing, loại bỏ container div thừa.
2. `StatsGrid.tsx`: Thẻ KPI phẳng hoàn toàn, loại bỏ `hover:shadow-neo-hover` và `border-neo-bevel`, hiển thị các chỉ số doanh thu và đơn hàng dạng `tabular-nums` nổi bật.
3. `RevenueChart.tsx`: Trục biểu đồ và bộ lọc khoảng thời gian (tabs/buttons) chuyển sang chuẩn hairline phẳng.
4. `RecentOrdersWidget.tsx`, `TopSellingProductsWidget.tsx`, `LowStockAlertsWidget.tsx`: Thẻ danh sách widget phẳng 100%, đường phân cách 1px, typography sắc nét.

**Blocked by:** 22: Admin Table & Controls Redesign

**Status:** done

- [x] Toàn bộ các widget trong Dashboard loại bỏ 100% `shadow-neo*`, `border-neo-bevel`, `rounded-card`, `rounded-button`
- [x] Stats KPI cards dùng nền `bg-card`, viền `border-border/60`, micro-radius `rounded-[2px]`, hover nhẹ nhàng
- [x] Số liệu tài chính và số lượng định dạng chuẩn `tabular-nums font-semibold tracking-tight`
- [x] Đã đồng bộ [Button](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/packages/ui/src/Button.tsx) trong bộ lọc khoảng thời gian của [RevenueChart.tsx](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/apps/crm-admin/src/components/dashboard/RevenueChart.tsx)
- [x] Test hiển thị trơn tru ở cả Light Mode và Dark Mode (Turbo build passed 100%)
