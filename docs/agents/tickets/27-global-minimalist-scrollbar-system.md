# Ticket 27: Global Minimalist Hairline Scrollbar System

- **Type:** task
- **Status:** done
- **Blocked by:** none

## Mô tả công việc
Thiết kế và triển khai hệ thống thanh cuộn (scrollbar) toàn cục cho monorepo tại `packages/ui/src/globals.css`:
1. Tự động áp dụng thanh cuộn siêu mỏng hairline (5px), track trong suốt, thumb màu muted bo góc micro 2px, tự đổi màu theo Light/Dark Mode.
2. Hỗ trợ chuẩn WebKit (`::-webkit-scrollbar*`) và chuẩn W3C (`scrollbar-width`, `scrollbar-color`).
3. Chuẩn hóa các class tiện ích: `.custom-scrollbar` (cho các component cũ), `.scrollbar-none` (ẩn thanh cuộn slider), `.scrollbar-stable` (chống layout shift).
4. Kiểm tra trên cả ứng dụng `apps/crm-admin` và `apps/ecommerce-client`.

## Comments
- Đã được phỏng vấn thiết kế (/grill-with-docs) và thống nhất hướng tiếp cận tự động toàn cục (Auto-apply Global) + Hairline 5px.
- ADR tương ứng: `docs/adr/0002-global-minimalist-scrollbar-system.md`.

## Answer
Đã cập nhật `packages/ui/src/globals.css`:
- `@layer base`: Cấu hình toàn cục tự động cho `html, body, *` (WebKit 5px hairline + W3C `scrollbar-width: thin` / `scrollbar-color`).
- `@layer utilities`: Khai báo `.custom-scrollbar`, `.scrollbar-none`, `.scrollbar-stable`.
- Build và kiểm tra thành công trên toàn bộ monorepo.
