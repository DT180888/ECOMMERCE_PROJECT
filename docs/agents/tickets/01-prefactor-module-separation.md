# 01: Prefactor & Module Separation

**What to build:**
Tách riêng `EditorialProductCard` ra khỏi `Card.tsx` thành một module độc lập `packages/ui/src/EditorialProductCard.tsx` trong package `@my-project/ui`, giữ `Card.tsx` tinh gọn cho bộ container card dùng chung, đồng thời re-export tại `packages/ui/src/index.tsx` để bảo đảm tính tương thích ngược hoàn toàn cho các ứng dụng client.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] File `packages/ui/src/EditorialProductCard.tsx` được khởi tạo chứa toàn bộ logic và props của `EditorialProductCard`
- [x] File `packages/ui/src/Card.tsx` chỉ giữ lại các Generic Container components (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`)
- [x] `packages/ui/src/index.tsx` xuất bản đầy đủ cả Generic Card lẫn `EditorialProductCard`
- [x] Kiểm tra TypeScript typecheck và build của package `@my-project/ui` thành công 100%, không phát sinh lỗi tham chiếu gãy
