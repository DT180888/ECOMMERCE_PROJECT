# 26: Editorial Three-column Inspector, Dual-mode System Island & Action Dock

**What to build:**
Tái thiết kế trải nghiệm UI/UX cho các trang thực thể danh mục (Brand, Category, Collection) và tối ưu hóa hệ thống layout theo chuẩn Art Director:
1. **Three-column Split-pane Inspector Layout:** Loại bỏ hoàn toàn modal backdrop overlay làm mờ trên Desktop ($\ge 1024px$), triển khai Cột thứ 3 (`SplitPaneInspector`) mở song song bên phải bảng danh mục. Bảng ở Cột 2 co giãn tự nhiên, dữ liệu nhìn thấy 100% và tương tác được đồng thời. Trên màn hình nhỏ ($< 1024px$), panel tự động chuyển sang slide-over đè lên phần main với nút đóng rõ ràng.
2. **Dual-mode System Island (`SystemIsland`):**
   - Khi ở `layoutMode === "topbar"`: Nằm inline bên phải thanh Topbar (`AdminHorizontalNavbar`).
   - Khi ở `layoutMode === "sidebar"`: Nằm ở dạng capsule đảo nổi tại góc trên bên phải màn hình (`fixed top-3 right-4 z-30`), tự động trượt chuyển vị trí tinh tế khi Cột 3 mở ra. Tích hợp Toggle layout, Theme toggle, User avatar & Dropdown logout.
3. **Deep-linking URL params:** Đồng bộ `?action=create` và `?edit=:id` qua `useDrawerSearchParams`.
4. **Tối ưu & Dọn dẹp thư mục:** Xóa bỏ các modal và page thừa (`BrandFormPage`, `CategoryFormPage`, `CollectionFormModal`, `AssignProductsModal`), chuyển hướng tương thích ngược nhẹ nhàng trong `router.tsx`.
5. **TableActionDock:** Thanh đảo động biến hình (morphing action dock) cho tìm kiếm, thêm mới và batch actions.

**Spec:** `docs/agents/specs/editorial-drawer-system-action-dock.md`
**ADR:** `docs/adr/0001-editorial-drawer-and-action-dock-architecture.md`
**Glossary:** `GLOSSARY.md`

**Blocked by:** 24: Catalog & Orders Editorial Redesign

**Status:** done

- [x] Triển khai `SystemIsland`: inline trên Topbar, floating góc trên bên phải (`fixed top-3 right-4`) khi ở Sidebar mode
- [x] Xây dựng component `SplitPaneInspector`: Three-column layout song song trên desktop không làm mờ, slide-over trên mobile
- [x] Chuyển đổi `BrandList` và `BrandDrawerForm` sang Three-column Split-pane layout
- [x] Chuyển đổi `CategoryList` và `CategoryDrawerForm` sang Three-column Split-pane layout
- [x] Chuyển đổi `AdminCollections` và `CollectionDrawerForm` sang Three-column Split-pane layout
- [x] Tối ưu và dọn dẹp thư mục: xóa các file modal/page rác, chuẩn hóa router redirect tương thích ngược
- [x] Triển khai `TableActionDock` biến hình cho batch actions
- [x] Verify build pass 100% (`npm --prefix apps/crm-admin run build`)
