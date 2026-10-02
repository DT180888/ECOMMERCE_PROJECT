# 02: Upgrade Generic Container Card Set

**What to build:**
Hiện đại hóa toàn diện bộ Container Card (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) theo chuẩn High-Fashion Editorial (Hướng 3): 100% phẳng, góc cạnh `rounded-none`, hairline border 1px siêu mỏng (`border-border/60`), hỗ trợ các biến thể `flat`, `raised`, `inset`, `divider` (chia cắt nội dung bằng đường kẻ hairline thay vì hộp viền bao quanh), tuân thủ nghiêm ngặt token CSS và quy tắc zero outer margin.

**Blocked by:** 01: Prefactor & Module Separation

**Status:** done

- [x] `Card` hỗ trợ các variants: `flat`, `raised`, `inset`, `divider` với `rounded-none` chuẩn Editorial
- [x] `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` có nhịp điệu padding (`p-6 sm:p-8`) và typographic hierarchy sắc sảo
- [x] Tuân thủ 100% Tailwind tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`), không hardcode màu
- [x] Build & TypeScript compile không phát sinh lỗi
