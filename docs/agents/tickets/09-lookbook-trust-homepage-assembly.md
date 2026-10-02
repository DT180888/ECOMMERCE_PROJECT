# 09: Lookbook Navigation, Trust Matrix Repositioning & Homepage Assembly

**What to build:**
Người dùng khi cuộn xuống phần dưới của Homepage sẽ thấy khối "Đề Xuất Phối Đồ" (`LookbookStylingSlider.tsx`) hoạt động trơn tru: nút "Xem Phối Đồ" chuyển hướng chính xác sang bộ sưu tập tương ứng tại catalog, tên bộ lookbook được rút gọn tối đa 1 dòng. Khối Cam Kết Tin Cậy (`TrustBadges.tsx`) được di dời xuống vị trí chiến lược ngay phía trên `Footer`, giúp kết thúc hành trình duyệt trang chủ bằng cảm giác an tâm về chính sách giao hàng và đổi trả. Toàn bộ các mảnh ghép được tích hợp hoàn chỉnh tại `HomePage.tsx`, tuân thủ 100% nhịp điệu *The Half-Padding Sandwich* và quy tắc thiết kế `DESIGN.md`.

**Blocked by:** 05: Top Announcement Bar & Header Semantic Token Alignment, 06: Hero Campaign Hardening & Theme-Aware Fallbacks, 07: Visual Category Quick-Nav Portal, 08: ProductGridShowcase Filter Engine, Single-Line Truncation & CLS Fix

**Status:** done

- [x] Cập nhật `LookbookStylingSlider.tsx`: nút "Xem Phối Đồ" liên kết sang `/catalog?lookbook={id}` (hoặc danh mục đồ phối tương ứng); áp dụng `line-clamp-1` cho tiêu đề và mô tả.
- [x] Di dời `TrustBadges` trong `HomePage.tsx` từ vị trí kẹp giữa xuống sát chân trang (sau `LookbookStylingSlider` và trước `Footer`).
- [x] Lắp ráp toàn bộ các component mới (`AnnouncementBar`, `Hero`, `CategoryQuickNav`, `ProductGridShowcase`, `LookbookStylingSlider`, `TrustBadges`) vào `HomePage.tsx`.
- [x] Kiểm tra nhịp điệu Spacing giữa các section đảm bảo đúng quy tắc *The Half-Padding Sandwich* (`py-8 sm:py-12 lg:py-16`).
- [x] Chạy lệnh `turbo build` xác thực 100% monorepo build thành công không lỗi typecheck, CSS hay runtime warnings.

