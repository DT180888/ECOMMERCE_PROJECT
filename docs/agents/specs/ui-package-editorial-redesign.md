# TECHNICAL SPEC: TÁI THIẾT KẾ & ĐƠN GIẢN HÓA `@my-project/ui` (PURE EDITORIAL ULTRA-MINIMALISM)

## 1. TỔNG QUAN & MỤC TIÊU (OVERVIEW & GOALS)
Tái cấu trúc toàn bộ gói thư viện dùng chung `@my-project/ui` (`packages/ui`) theo chuẩn **Pure Editorial Ultra-Minimalism Studio Quality**:
- **Đơn giản hóa API (Props)**: Loại bỏ các prop rườm rà, hardcode styles không cần thiết. Giữ API nhỏ gọn, dự đoán được và tương thích 100% với React 19.
- **Tuân thủ Design Tokens 100%**:
  - **Flat 100%**: Loại bỏ hoàn toàn `shadow-neo`, `shadow-xl`, `shadow-md` $\rightarrow$ Đưa về `shadow-none`.
  - **Hairline Borders**: Dùng viền siêu mỏng 1px (`border-border/60`).
  - **Micro Geometry**: Bo góc vi mô `rounded-[2px]` thống nhất.
  - **Màu sắc**: Milk Warm Light (`#FAF9F6`) / Obsidian Dark (`#121212`), mực đen `text-foreground`, chữ mờ `text-muted-foreground`.

---

## 2. PHẠM VI & PHÂN ĐỢT TRIỂN KHAI (SCOPE & PHASE BREAKDOWN)

### Đợt 1: Atomic Controls & Form UI Components
- **`Button.tsx`**: Phẳng hóa các variant (primary, secondary, outline, ghost, danger). Đưa radius về `rounded-[2px]`.
- **`Input.tsx` / `PasswordInput.tsx` / `TextArea.tsx`**: Viền hairline mỏng, focus ring tối giản `focus:border-foreground`, xóa viền thừa.
- **`Checkbox.tsx` / `Radio.tsx` / `Switch`**: Thiết kế vi mô sắc nét, chuyển động mượt mà.
- **`FormField.tsx` / `Label.tsx`**: Typography phân tầng 10px tracking-widest uppercase.
- **`Select` / `FilterDropdown`**: Phẳng hóa menu dropdown (`shadow-none`, `border-border/60`), hiển thị siêu gọn.

### Đợt 2: Containers, Layout & Feedback UI Components
- **`Card.tsx`**: Phẳng 100% (`shadow-none border border-border/60 bg-card rounded-[2px]`).
- **`Dialog.tsx`**: Modal Studio Hairline, phông nền mờ nhẹ (`bg-background/80 backdrop-blur-sm`), loại bỏ shadow dày.
- **`Toast.tsx`**: Thẻ thông báo phẳng, góc vuông/rounded-[2px], viền hairline.
- **`tabs.tsx`**: Thanh chuyển tab tối giản (`border-b border-border/40`), chỉ báo active dùng gạch chân mỏng `border-foreground`.
- **`Badge.tsx` / `OrderStatusBadge.tsx`**: Badge chữ hoa siêu mỏng `text-[10px] tracking-widest border border-border/60 bg-transparent`.
- **`Skeleton.tsx`**: Skeleton nạp dữ liệu hiệu ứng pulse êm mượt, màu `bg-surface`.
- **`Kbd.tsx`**: Phím tắt vi mô `bg-surface border border-border/60 rounded-[2px]`.

### Đợt 3: Advanced Visual Component
- **`EditorialProductCard.tsx`**: Chuẩn hóa card sản phẩm studio (Tỷ lệ 3:4, Progressive Hover Disclosure, Tim yêu thích & Xem nhanh mờ dần khi hover, 0 CLS).

---

## 3. CHECKLIST NGHIỆM THU KỸ THUẬT (VERIFICATION CHECKLIST)
1. `npm run build` (`turbo build`) thành công **Exit Code 0** cho cả `packages/ui`, `apps/ecommerce-client` và `apps/crm-admin`.
2. Không còn bất kỳ class `shadow-neo` hay hardcode màu hex ngẫu nhiên trong `packages/ui`.
3. 100% component xuất ra đúng export tại `packages/ui/src/index.tsx`.
