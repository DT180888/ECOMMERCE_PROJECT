# 04: Integrate Client App Verification

**What to build:**
Tích hợp và kiểm thử thực tế trên ứng dụng thương mại điện tử client (`apps/ecommerce-client`):
1. Kết nối [ProductCard.tsx](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/apps/ecommerce-client/src/components/product/ProductCard.tsx) với `EditorialProductCard` mới, truyền đúng props `isOutOfStock`, `onQuickBuy`.
2. Kiểm tra trực quan trên trình duyệt thực tế đảm bảo không có CLS trong grid, ảnh cross-fade mượt mà, dark/light mode hoàn hảo.
3. Chạy toàn bộ build và linter của dự án đảm bảo trạng thái production-ready.

**Blocked by:** 02: Upgrade Generic Container Card Set, 03: Redesign Editorial Product Card

**Status:** done

- [x] [ProductCard.tsx](file:///d:/Hutech/DACS/ECOMMERCE_PROJECT/ECommerce_FE/apps/ecommerce-client/src/components/product/ProductCard.tsx) tích hợp chuẩn props mới của `EditorialProductCard`
- [x] Giao diện danh sách sản phẩm hiển thị chuẩn High-Fashion Editorial, hover mượt mà
- [x] Toàn bộ workspace `npm run build` hoặc typecheck qua thành công không lỗi linter/type
