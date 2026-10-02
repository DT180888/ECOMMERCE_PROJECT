# 05: Top Announcement Bar & Header Semantic Token Alignment

**What to build:**
Người dùng khi truy cập trang web sẽ thấy một thanh thông báo vi mô `AnnouncementBar` trên cùng với thông điệp vận hành ("MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 1.000.000₫ · ĐỔI HÀNG TẬN NƠI 14 NGÀY") theo phong cách hairline tối giản. Đồng thời, thanh Header (`AppHeader.tsx`) được quét sạch toàn bộ các mã hex hardcode (`#161616`, `text-white`, `border-white/20`, `from-black/80`, `shadow-sm`), chuyển sang sử dụng 100% Tailwind Semantic Tokens (`bg-background`, `text-foreground`, `border-border`, `bg-surface`) và hiệu ứng kính mờ phẳng, triệt tiêu đổ bóng theo chuẩn `DESIGN.md`.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Tạo mới component `AnnouncementBar.tsx` tại `apps/ecommerce-client/src/components/home/AnnouncementBar.tsx` với typography `text-[11px] font-display uppercase tracking-[0.2em]`, viền `border-b border-border/60` và hỗ trợ đóng/mở nhẹ nhàng.
- [x] Thay thế toàn bộ mã hex hardcode và màu `white/black` thuần trong `AppHeader.tsx` bằng Tailwind semantic tokens (`bg-background/80`, `text-foreground`, `border-border`, `bg-foreground/5`).
- [x] Loại bỏ hoàn toàn `shadow-sm` trong `AppHeader.tsx`, thay bằng đường kẻ tóc hairline `border-b border-border/60`.
- [x] Đảm bảo hiển thị hoàn hảo ở cả Light Mode (Warm Paper) lẫn Dark Mode (Obsidian Ink).
- [x] Chạy kiểm thử TypeScript và build của `@my-project/ecommerce-client` thành công không phát sinh lỗi.

