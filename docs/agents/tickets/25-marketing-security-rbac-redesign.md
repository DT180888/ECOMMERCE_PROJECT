# 25: Marketing & Security RBAC Redesign

**What to build:**
Tái thiết kế các module Marketing (Khuyến mãi, Banner Hero Slide) và Hệ thống bảo mật RBAC:
1. `AdminSecurity.tsx`: Tái cấu trúc ma trận phân quyền RBAC thành bảng lưới phẳng hairline, thẻ vai trò và checkbox phẳng chuẩn `@my-project/ui`.
2. `PromotionList.tsx`, `PromotionDetail.tsx`, `PromotionSharedForm.tsx`: Xóa sạch `shadow-neo-inset`, chuẩn hóa các tabs và input giảm giá.
3. `HeroSlideList.tsx` & `HeroSlideForm.tsx`: Đồng bộ giao diện quản lý slide với phong cách Scandinavian Monolith.

**Blocked by:** 24: Catalog & Orders Editorial Redesign

**Status:** ready-for-agent

- [ ] Ma trận phân quyền `AdminSecurity.tsx` phẳng 100%, không đổ bóng, phân khu chức năng bằng viền 1px
- [ ] Module Khuyến mãi và Hero Slide không còn class cấm
- [ ] Toàn bộ hệ thống CRM Admin hoàn toàn đồng bộ thị giác với Web Client
