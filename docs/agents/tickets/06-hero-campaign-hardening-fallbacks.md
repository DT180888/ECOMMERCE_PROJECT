# 06: Hero Campaign Hardening & Theme-Aware Fallbacks

**What to build:**
Người dùng khi xem phần Hero Campaign sẽ luôn nhận được trải nghiệm mượt mà, sang trọng chuẩn Studio. Khi API gặp sự cố hoặc trả về danh sách rỗng, trang web sẽ không bị sập hay co giật về 0px mà hiển thị `HeroFallbackSlide` mặc định với thông điệp bộ sưu tập và nút CTA dẫn tới Catalog. Trạng thái tải (Skeleton Loading) sẽ tự thích ứng màu sắc theo Light/Dark theme thay vì chớp đen `#121212` cố định. Toàn bộ mã màu trong `Hero.tsx` được chuyển sang Tailwind Semantic Tokens và các thanh điều khiển (Indicators, Controls) được tối ưu diện tích chạm cho cảm ứng Mobile.

**Blocked by:** 05: Top Announcement Bar & Header Semantic Token Alignment

**Status:** done

- [x] Loại bỏ 100% mã hex hardcode (`#161616`, `#F3F3F0`, `#FAF9F6`, `border-white/20`, etc.) trong `apps/ecommerce-client/src/components/home/Hero.tsx`, thay bằng semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.).
- [x] Bổ sung khối Fallback tĩnh chuẩn Editorial khi `slides.length === 0` thay vì `return null`.
- [x] Thiết kế lại Skeleton loading của Hero hỗ trợ cả Light Mode (`bg-surface animate-pulse`) và Dark Mode mà không hardcode `#121212`.
- [x] Tối ưu vùng chạm cảm ứng cho các thanh slide indicator ở đáy hero (chiều cao touch target tối thiểu 28px trên mobile).
- [x] Xác thực không có lỗi TypeScript và transition animation chạy ổn định.

