# 07: Visual Category Quick-Nav Portal

**What to build:**
Người dùng khi cuộn qua Hero sẽ thấy ngay một cổng khám phá danh mục trực quan `CategoryQuickNav` với 6 nhóm mặt hàng thời trang cốt lõi: *Áo (Tops), Quần (Bottoms), Giày & Dép (Footwear), Mũ & Nón (Headwear), Túi & Phụ Kiện (Accessories), Đồ May Đo (Tailored)*. Mỗi ô danh mục có ảnh đại diện thời trang tinh giản, tên danh mục 1 dòng, số lượng mẫu và hiệu ứng viền tóc hairline sắc sảo. Nhấp vào ô danh mục sẽ chuyển hướng lập tức tới `/catalog?category={slug}` để khách hàng tìm và mua món đồ họ muốn trong vài giây (Fast Purchase).

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Tạo mới component `CategoryQuickNav.tsx` tại `apps/ecommerce-client/src/components/home/CategoryQuickNav.tsx`.
- [x] Thiết kế 6 thẻ danh mục trực quan theo chuẩn Studio Editorial (tỷ lệ ảnh 3:4 hoặc 4:5, góc sắc nét, viền hairline `border-border/60`, zoom ảnh nhẹ khi hover).
- [x] Hiển thị tên danh mục chuẩn 1 dòng `font-display` không tràn chữ, hỗ trợ nhãn đếm mẫu ("X mẫu sẵn có").
- [x] Kết nối thẻ với đường link điều hướng URL chuẩn `/catalog?category={slug}`.
- [x] Hỗ trợ responsive mượt mà: cuộn ngang snap trên Mobile và chia lưới đều trên Desktop.

