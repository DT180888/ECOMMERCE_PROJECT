# 24: Catalog & Orders Editorial Redesign

**What to build:**
Tái thiết kế các module quản lý cốt lõi: Đơn hàng, Sản phẩm và Danh mục:
1. `AdminOrderList.tsx` & `AdminOrderDetail.tsx`: Dọn sạch tàn dư Neumorphism ở chi tiết đơn hàng, timeline giao hàng, thẻ hóa đơn.
2. `ProductList.tsx`, `AdminProductDetail.tsx`, `ProductForm.tsx`: Chuẩn hóa form nhập liệu, tabs sản phẩm, bảng SKU con.
3. `CategoryList.tsx`, `AdminCollections.tsx`: Loại bỏ bo tròn cũ, đồng bộ với `AdminTable` mới.

**Blocked by:** 22: Admin Table & Controls Redesign

**Status:** done

- [x] Đơn hàng và chi tiết đơn hàng chuyển sang chuẩn Editorial Hairline phẳng
- [x] Bảng SKU và form sản phẩm loại bỏ `shadow-neo-inset`, `shadow-neo-sm`, `border-neo-bevel`
- [x] Đồng bộ toàn bộ input và select theo token chuẩn
