# TICKET 18: TÁI THIẾT KẾ & ĐƠN GIẢN HÓA ATOMIC CONTROLS & FORM COMPONENTS (`packages/ui`)

## 1. MỤC TIÊU
Tái cấu trúc nhóm Component Atomic Controls & Form trong `packages/ui` theo chuẩn **Pure Editorial Ultra-Minimalism**:
- `Button.tsx`: Phẳng 100% (`shadow-none`), góc `rounded-[2px]`, viền `border-border/60`.
- `Input.tsx`, `PasswordInput.tsx`, `TextArea.tsx`: Viền hairline `border-border/60`, focus ring `focus:border-foreground`.
- `Checkbox.tsx`, `Radio.tsx`, `Switch/`: Icon hairline, tương tác mượt mà.
- `FormField.tsx`, `Label.tsx`: Typography font-display 10px uppercase tracking-widest.
- `Select/`, `FilterDropdown/`: Menu phẳng `shadow-none border border-border/60 bg-card rounded-[2px]`.

## 2. DÁNH SÁCH FILE CẦN THỰC THI
- `packages/ui/src/Button.tsx`
- `packages/ui/src/Input.tsx`
- `packages/ui/src/PasswordInput.tsx`
- `packages/ui/src/TextArea.tsx`
- `packages/ui/src/Checkbox.tsx`
- `packages/ui/src/Radio.tsx`
- `packages/ui/src/Switch/Switch.tsx`
- `packages/ui/src/FormField.tsx`
- `packages/ui/src/Label.tsx`
- `packages/ui/src/Select/Select.tsx`
- `packages/ui/src/Select/styles.ts`
- `packages/ui/src/FilterDropdown/FilterDropdown.tsx`

## 3. CHECKLIST KIỂM THỬ
- Chạy `npm run build` không lỗi TypeScript hay Tailwind.
