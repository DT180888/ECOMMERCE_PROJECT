# 08: ProductGridShowcase Filter Engine, Single-Line Truncation & CLS Fix

**What to build:**
Người dùng khi duyệt danh sách Sản Phẩm Mới (New Arrivals) sẽ có trải nghiệm lọc mượt mà và trực quan: bấm vào các tab danh mục ("Tất Cả", "Áo", "Quần", "Bán Chạy", etc.) thì danh sách sản phẩm lập tức được lọc chính xác theo thể loại được chọn (không còn lỗi tab ảo vô tác dụng). Tên sản phẩm và thương hiệu được cắt gọn gàng trên đúng **1 dòng** (`truncate line-clamp-1`) kèm dấu `...` để bảng giá và ảnh luôn thẳng hàng tăm tắp. Khung Skeleton loading có đúng 4 cột trên desktop khớp 100% với lưới thật, triệt tiêu hoàn toàn hiện tượng giật cục layout (Zero CLS). Khi danh mục trống hoặc có sự cố mạng, giao diện hiển thị Empty State/Error State tinh tế kèm nút thử lại thay vì biến mất trắng.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Sửa dứt điểm logic lọc của thanh tabs trong `ProductGridShowcase.tsx`: ánh xạ `activeTab` thành bộ lọc sản phẩm thực tế theo thuộc tính category/tags.
- [x] Áp dụng quy tắc cắt ngắn tên sản phẩm & thương hiệu đúng 1 dòng: `truncate line-clamp-1 break-all` kèm tooltip `title={name}` để không bao giờ làm xô lệch chiều cao hàng.
- [x] Sửa đổi `ProductCardSkeleton.tsx` và khối skeleton của `ProductGridShowcase.tsx` sang đúng lưới 4 cột trên màn hình lớn (`lg:grid-cols-4`), triệt tiêu 100% hiện tượng CLS.
- [x] Bổ sung Empty State (khi danh mục không có sản phẩm) và Error State (khi API ngắt kết nối) với nút "Tải lại trang" hoặc "Xem tất cả sản phẩm" thay vì lệnh `return null`.
- [x] Xác thực tương thích hoàn toàn với component `EditorialProductCard`.

