# TICKET 19: TÁI THIẾT KẾ & ĐƠN GIẢN HÓA CONTAINERS, LAYOUT & FEEDBACK COMPONENTS (`packages/ui`)

## 1. MỤC TIÊU
Tái cấu trúc nhóm Containers, Layout & Feedback trong `packages/ui` theo chuẩn **Pure Editorial Ultra-Minimalism**:
- `Card.tsx`: Phẳng 100% (`shadow-none border border-border/60 bg-card rounded-[2px]`).
- `Dialog.tsx`: Modal Studio Hairline, phông nền mờ nhẹ (`bg-background/80 backdrop-blur-sm`), loại bỏ shadow-neo.
- `Toast.tsx`: Thẻ thông báo phẳng, góc `rounded-[2px]`, viền `border-border/60`.
- `tabs.tsx`: Tab chuyển đổi tối giản, đường chỉ báo mỏng `border-foreground`.
- `Badge.tsx`, `OrderStatusBadge.tsx`: Badge chữ hoa mỏng `text-[10px] tracking-widest border border-border/60`.
- `Skeleton.tsx`: Nạp dữ liệu hiệu ứng pulse nhẹ `bg-surface`.
- `Kbd.tsx`: Phím tắt vi mô `bg-surface border border-border/60 rounded-[2px]`.

## 2. DANH SÁCH FILE CẦN THỰC THI
- `packages/ui/src/Card.tsx`
- `packages/ui/src/Dialog.tsx`
- `packages/ui/src/Toast.tsx`
- `packages/ui/src/tabs.tsx`
- `packages/ui/src/Badge.tsx`
- `packages/ui/src/OrderStatusBadge.tsx`
- `packages/ui/src/Skeleton.tsx`
- `packages/ui/src/Kbd.tsx`

## 3. CHECKLIST KIỂM THỬ
- Chạy `npm run build` không lỗi TypeScript hay Tailwind.
