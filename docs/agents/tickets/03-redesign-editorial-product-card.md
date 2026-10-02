# 03: Redesign Editorial Product Card

**What to build:**
Tái thiết kế `EditorialProductCard` theo Hướng 3 (High-Fashion Editorial):
1. Khung ảnh morphing mượt mà từ 9/16 sang 3/4 khi hover trên Desktop bằng GPU-accelerated transition, loại bỏ hoàn toàn giật layout (0 CLS).
2. Action Bar chuẩn High-Fashion: Nút Wishlist nổi góc trên bên phải ảnh khi hover (`opacity-0 group-hover:opacity-100`); nút Quick Buy (`+` hoặc kèm text vi mô) đặt tại chân thẻ kết nối callback `onQuickBuy(productId)` cho SKU Selector.
3. Hỗ trợ đầy đủ trạng thái Hết hàng (`isOutOfStock`): phủ `grayscale contrast-90 opacity-60`, vô hiệu hóa action, nhãn hairline `HẾT HÀNG`.
4. Responsive Mobile hoàn thiện: hiển thị tĩnh trực quan, không phụ thuộc vào hover.

**Blocked by:** 01: Prefactor & Module Separation

**Status:** done

- [x] Morphing 9/16 -> 3/4 mượt mà 500ms cubic-bezier không gây giật layout CLS
- [x] Nút Wishlist nổi ở góc trên ảnh với hiệu ứng fade-in khi hover
- [x] Nút Quick Buy (+) kích hoạt `onQuickBuy` (hoặc fallback `onAddToCart`) hỗ trợ mở SKU Drawer
- [x] Cờ `isOutOfStock` áp dụng filter `grayscale opacity-60` và badge hairline `HẾT HÀNG`
- [x] Tuân thủ chuẩn `rounded-none`, zero outer margin (`m-0`), hairline 1px
- [x] Build & Typecheck pass
