# TICKET 20: CHUẨN HÓA EDITORIAL PRODUCT CARD COMPONENT (`packages/ui`)

## 1. MỤC TIÊU
Tái cấu trúc `EditorialProductCard.tsx` trong `packages/ui` theo đúng quy tắc **Pure Editorial Ultra-Minimalism**:
- **Progressive Hover Disclosure**: Ở trạng thái tĩnh chỉ hiện Ảnh (tỷ lệ 3:4) + Tên sản phẩm (1 dòng) + Giá tiền.
- **Nút bấm chức năng (Tim yêu thích & Xem nhanh)**: CHỈ hiện khi hover (`opacity-0 group-hover:opacity-100 transition-opacity duration-300`).
- **Phẳng 100%**: Zero drop shadows (`shadow-none`), viền hairline mỏng `border-border/60`.
- **Badge**: Hiển thị nhãn Sale/New nhỏ ở góc mỏng nhẹ, không đè lấn hình ảnh.

## 2. DANH SÁCH FILE CẦN THỰC THI
- `packages/ui/src/EditorialProductCard.tsx`

## 3. CHECKLIST KIỂM THỬ
- Chạy `npm run build` không lỗi TypeScript hay Tailwind.
