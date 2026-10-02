# Technical Specification: Card UI/UX Modernization & Editorial Product Card Separation

## Problem Statement

Hiện tại, component `Card` trong `packages/ui/src/Card.tsx` đang đảm nhiệm 2 vai trò song song:
1. Container Card tổng quát (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) phục vụ toàn bộ hệ thống UI.
2. `EditorialProductCard`: Thẻ sản phẩm thời trang chuyên biệt với hiệu ứng morphing 9/16 -> 3/4.

Việc tích hợp chung trong một file dài hơn 300 dòng vi phạm nguyên lý Single Responsibility. Đồng thời, `EditorialProductCard` gặp các hạn chế lớn về UI/UX:
- Rủi ro giật khung hình (CLS - Cumulative Layout Shift) khi rê chuột co giãn tỷ lệ ảnh trên Desktop.
- Chưa có giải pháp xử lý biến thể (Multi-SKU) cho nút Quick Buy (`+`): khách hàng bấm thêm vào giỏ nhưng không được chọn kích thước/màu sắc.
- Trạng thái Out-of-Stock (Hết hàng), Skeleton loading, và Broken Image fallback chưa được chuẩn hóa theo phong cách Pure Editorial Ultra-Minimalism.
- Bộ Container card chung chưa đạt độ sắc sảo theo chuẩn High-Fashion Editorial (viền hairline 1px, `rounded-none`, token màu giấy ấm/mực đen obsidian).

## Solution

Nâng cấp toàn diện bộ card theo **Hướng 3: High-Fashion Editorial (Vogue Runway Minimalist Lookbook)**:
1. **Tách module độc lập:** Di chuyển `EditorialProductCard` ra `packages/ui/src/EditorialProductCard.tsx` độc lập, re-export tại `packages/ui/src/index.tsx`.
2. **Nâng cấp Generic Container Card:** Tinh chỉnh chuẩn Studio Editorial, 100% phẳng, góc vuông `rounded-none`, phân cách bằng hairline 1px (`border-border/60`), hỗ trợ các biến thể `flat`, `raised`, `inset`, `bordered`, và `divider`.
3. **Hoàn thiện EditorialProductCard:**
   - Cơ chế morphing 9/16 $\rightarrow$ 3/4 mượt mà không gây CLS nhờ container cố định và transition GPU-accelerated.
   - Nút Quick Buy (`+`) hỗ trợ callback `onQuickBuy(productId)` kích hoạt Mini Drawer / Quick View Modal chọn Size/Màu.
   - Nút Wishlist nổi ở góc trên ảnh với hiệu ứng fade-in khi hover (`opacity-0 group-hover:opacity-100`).
   - Xử lý Out of Stock: Phủ hiệu ứng `grayscale contrast-90 opacity-60`, vô hiệu hóa nút mua, gắn nhãn hairline `HẾT HÀNG`.
   - Chuẩn hóa token Tailwind (`bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`), tuyệt đối không hardcode `#fff` hay `#000`.

## User Stories

1. As a shopper browsing fashion collections, I want to see clean, high-fashion 9/16 lookbook product cards at rest so that I can focus entirely on photography and garment aesthetics without visual clutter.
2. As a shopper hovering over a product on desktop, I want the image to smoothly transition into a 3/4 frame revealing the alternate angle and action controls so that I can inspect details and make quick purchase decisions.
3. As a shopper clicking the Quick Buy (`+`) button, I want to open a Quick SKU Selector (Size/Color Drawer) without leaving the catalog page so that I can pick my exact variant easily.
4. As a shopper viewing out-of-stock items, I want the card to be clearly subdued (grayscale/opacity) with a refined "HẾT HÀNG" badge and disabled buttons so that I am not frustrated by invalid purchase attempts.
5. As a shopper, I want to save items to my wishlist with a subtle floating heart button so that I can curate my personal fashion collection.
6. As a developer using `@my-project/ui`, I want a clean, decoupled `EditorialProductCard` component with comprehensive TypeScript props so that I can use it in product grids without importing unnecessary container baggage.
7. As a developer using `@my-project/ui`, I want standard `Card` containers that default to ultra-minimalist editorial standards (`rounded-none`, hairline borders, warm paper/obsidian palettes) for dashboards, profiles, and modals.

## Implementation Decisions

### 1. Module Structure & Exports
- `packages/ui/src/Card.tsx`: Chỉ chứa bộ Generic Container (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- `packages/ui/src/EditorialProductCard.tsx`: Module riêng biệt cho thẻ sản phẩm thời trang.
- `packages/ui/src/index.tsx`: Re-export cả hai module để đảm bảo tương thích ngược 100% cho các call site hiện có (ví dụ: `apps/ecommerce-client/src/components/product/ProductCard.tsx`).

### 2. UI Structure & Aesthetics (Direction 3: High-Fashion Editorial)
- **Border & Corner Radius:** `rounded-none` tuyệt đối, hairline `border border-border/60` (hoặc divider không viền ngoài cho container variant `divider`).
- **Color Tokens:**
  - Nền: `bg-card` (Milk White `#FAF9F6` trên light mode, Obsidian `#121212` trên dark mode).
  - Chữ: `text-foreground` (`#161616` / `#F3F3F0`) và `text-muted-foreground`.
- **Morphing Container (Anti-CLS):**
  - Khung bao ngoài có chiều cao cố định hoặc tỷ lệ 9/16 trên desktop (`md:aspect-[9/16]`).
  - Container ảnh dùng `overflow-hidden` với chiều cao thay đổi mượt bằng `transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`.
  - Không thay đổi kích thước tổng thể của card trong lưới grid để triệt tiêu hoàn toàn CLS.
- **Action Buttons & Micro-Interactions:**
  - Nút Wishlist: Vị trí `absolute top-3 right-3`, ẩn ở trạng thái tĩnh (`opacity-0 group-hover:opacity-100 transition-opacity duration-300`).
  - Nút Quick Buy: Nằm cạnh giá tiền ở chân thẻ, hỗ trợ icon `+` xoay nhẹ khi hover và text vi mô tuỳ chọn ("CHỌN SIZE +").
  - Trạng thái Hết hàng: Cờ `isOutOfStock` kích hoạt class `grayscale contrast-90 opacity-60 pointer-events-none select-none`, hiển thị nhãn `HẾT HÀNG` viền hairline thanh lịch.

### 3. API Contract & Props (`EditorialProductCardProps`)
```typescript
export interface EditorialProductCardProps {
  id?: string | number;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  imageUrl: string;
  alternateImageUrl?: string;
  brandName?: string;
  variantsText?: string;
  detailUrl?: string;
  badgeText?: string;
  isOutOfStock?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onQuickBuy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAddToCart?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Fallback backwards-compatibility
  formatPrice?: (price: number | string) => string;
  renderLink?: (props: { to: string; className?: string; children: React.ReactNode }) => React.ReactNode;
  className?: string;
}
```

## Testing Decisions

- **Visual & Layout Shift Verification:** Kiểm tra trong môi trường trình duyệt thực tế, rê chuột qua lại trong grid sản phẩm để đảm bảo không có layout shift (0 CLS) và không tràn thẻ.
- **Type Checking & Build Verification:** Chạy TypeScript typecheck trên package `@my-project/ui` và `@my-project/ecommerce-client` đảm bảo không bị gãy props hay export.
- **State Testing:** Xác minh thẻ hiển thị đúng ở:
  1. Trạng thái bình thường có 2 ảnh (cross-fade khi hover).
  2. Trạng thái chỉ có 1 ảnh (không bị lỗi mờ hay trắng màn hình).
  3. Trạng thái Hết hàng (Out of Stock): mờ grayscale, có badge, nút bị disabled.
  4. Trạng thái bấm nút `+` (gọi hàm `onQuickBuy`).

## Out of Scope

- Xây dựng component Mini Drawer / Quick View Modal ở client app (sẽ được tích hợp trong ticket riêng của client app; thẻ card chỉ phụ trách cung cấp seam trigger `onQuickBuy`).
- Thay đổi schema API dữ liệu sản phẩm ở backend.

## Further Notes

- Đảm bảo tuân thủ nghiêm ngặt quy tắc Spacing Over Clutter và Parent-Child Spacing Governance (thẻ root không có outer margin, `m-0`).
