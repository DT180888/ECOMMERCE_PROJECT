# Technical Specification: Homepage Modernization & High-Efficiency Studio Architecture

## 1. Problem Statement & Context

Sau cuộc audit toàn diện theo thẩm mỹ Studio của `/huashu-design` và tư duy phản biện của `/grill-me`, trang chủ (`HomePage.tsx`) hiện tại bộc lộ nhiều điểm nghẽn nghiêm trọng cản trở mục tiêu mua sắm nhanh (**Fast Purchase**):

1. **Lỗi logic lọc danh mục (Functional Bug):** Thanh Tabs thể loại trong `ProductGridShowcase` (`Tất Cả`, `Mới Về`, `Bán Chạy`, `Áo`, `Quần`) chỉ thay đổi trạng thái giao diện nhưng **không hề lọc danh sách sản phẩm thật**, gây ức chế hành vi duyệt đồ của người dùng.
2. **Thiếu khối Điều Hướng Danh Mục Trực Quan (Missing Visual Category Discovery):** Khách hàng mục tiêu tìm kiếm đa dạng các mặt hàng thời trang (Áo, Quần, Giày, Dép, Mũ, Phụ kiện), nhưng trang chủ hoàn toàn thiếu một cổng điều hướng nhanh (Category Navigation Portal), buộc người dùng phải mở menu phụ.
3. **Hiện tượng giật cục Layout (CLS - Cumulative Layout Shift):** Skeleton loading của `ProductGridShowcase` dựng 5 cột (`lg:grid-cols-5`), nhưng khi nạp xong dữ liệu thật lại hiển thị 4 cột (`lg:grid-cols-4`).
4. **Vi phạm quy chuẩn Token & Đơn Font (`DESIGN.md`):** Các component `Hero.tsx` và `AppHeader.tsx` đang lạm dụng mã hex hardcode (`#161616`, `#F3F3F0`, `#FAF9F6`, `text-white`, `border-white/20`, `from-black/80`). Skeleton Hero bị khóa cứng màu đen `#121212`, gây chớp đen giật cục khi người dùng ở Light Mode.
5. **Nuốt chửng lỗi (Silent Error & Empty State Collapse):** Cả Hero và Showcase đều dùng `if (isError || length === 0) return null;`, khiến các section biến mất hoàn toàn khi API mất kết nối thay vì có UI thông báo và nút thử lại (Retry).
6. **Xếp lớp nhịp điệu Spacing sai lệch:** Khối `TrustBadges` đặt kẹp giữa 2 section sản phẩm, ngắt vụn luồng hưng phấn mua sắm.

---

## 2. Solution: Phương Án B - "High-Efficiency Studio Store"

Hiện thực hóa kiến trúc **High-Efficiency Studio Store** phục vụ tối đa mục tiêu **Fast Purchase** trên tinh thần **Pure Modern Editorial** (100% `Plus Jakarta Sans`, viền hairline 1px, phẳng 100% không bóng mờ):

1. **Top Micro-Announcement Bar:** Bổ sung thanh thông tin siêu mảnh trên đỉnh trang hỗ trợ thông điệp vận hành ("MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 1.000.000₫ · ĐỔI HÀNG TẬN NƠI 14 NGÀY").
2. **Hero Campaign Drop Hoàn Chỉnh:** 
   - Thay thế toàn bộ mã hex hardcode bằng Tailwind Semantic Tokens.
   - Thêm trạng thái Fallback Hero tĩnh cao cấp khi API không trả về slides (tránh collapse về 0px).
   - Chuẩn hóa Skeleton loading tự thích ứng theo Light/Dark theme.
3. **Cổng Danh Mục Nhanh (Visual Category Portal):** 
   - Tạo mới component `CategoryQuickNav` đặt ngay dưới Hero với các phân loại cốt lõi: *Áo (Tops), Quần (Bottoms), Mũ & Nón (Headwear), Giày & Dép (Footwear), Túi & Phụ Kiện (Accessories), Đồ May Đo (Tailored)*.
   - Hỗ trợ click điều hướng trực tiếp sang `/catalog?category={slug}`.
4. **Tối Ưu ProductGridShowcase (Fast Purchase Engine):**
   - Sửa triệt để bug lọc Category: Kết nối `activeTab` với logic filter dữ liệu (hoặc query params gửi tới API `useProductList`).
   - Cắt cụt tiêu đề & thương hiệu đúng 1 dòng (`truncate` / `line-clamp-1`) với `...` theo đúng yêu cầu nghiệp vụ.
   - Đồng bộ Skeleton lưới 4 cột khớp 100% với grid thực tế, triệt tiêu CLS.
   - Bổ sung Empty State & Error Fallback có nút "Tải Lại".
5. **Lookbook Styling Slider (Đề Xuất Phối Đồ):**
   - Giữ giao diện snap slider ngang siêu mượt.
   - Ràng buộc nút "Xem Phối Đồ" chuyển hướng sang trang Catalog/Lookbook tương ứng (`/catalog?lookbook={id}`).
   - Cắt ngắn tiêu đề và mô tả 1 dòng.
6. **Tái Định Vị Trust Matrix:**
   - Di dời `TrustBadges` xuống chân trang (ngay trước `Footer`) để kết thúc trang bằng sự an tâm về thanh toán và hậu mãi.

---

## 3. User Stories

1. **Khách hàng tìm kiếm sản phẩm nhanh:** Là một người mua sắm thời trang, tôi muốn nhìn thấy ngay các danh mục phổ biến (Áo, Quần, Giày, Dép, Mũ) ngay dưới Hero để có thể bấm và xem đúng nhóm đồ mình cần chỉ sau 1 cú click.
2. **Khách hàng lọc hàng mới về:** Là một khách hàng muốn xem đồ mới, tôi muốn khi bấm vào các tab "Áo", "Quần", "Bán Chạy" trong phần Sản Phẩm Mới, danh sách hiển thị phải lập tức được lọc chính xác theo danh mục tương ứng.
3. **Khách hàng lướt web trên điện thoại:** Là một người dùng smartphone (màn hình 360px - 390px), tôi muốn tên sản phẩm và thương hiệu được rút gọn gọn gàng trên 1 dòng duy nhất, không bị nhảy dòng làm lệch hàng giá tiền, giúp tôi so sánh giá nhanh chóng.
4. **Khách hàng gặp sự cố mạng:** Là một người mua sắm có đường truyền chập chờn, tôi muốn thấy giao diện thông báo lỗi tinh tế kèm nút "Thử lại" thay vì màn hình trắng xóa hoặc section biến mất bí ẩn.
5. **Khách hàng thích phối đồ:** Là một người yêu thời trang, tôi muốn xem các bộ lookbook gợi ý phối sẵn và có thể bấm "Xem Phối Đồ" để chuyển sang bộ sưu tập tương ứng.
6. **Khách hàng thanh toán & bảo hành:** Trước khi rời trang chủ, tôi muốn thấy rõ các cam kết giao hàng và đổi trả 14 ngày ngay cạnh chân trang để yên tâm mua sắm.

---

## 4. Technical & Architectural Decisions

### 4.1 Cấu Trúc File & Phân Tách Component
```
apps/ecommerce-client/src/
├── components/
│   ├── home/
│   │   ├── AnnouncementBar.tsx       # MỚI: Thanh thông báo vi mô trên cùng
│   │   ├── CategoryQuickNav.tsx      # MỚI: Cổng điều hướng 6 danh mục cốt lõi
│   │   ├── Hero.tsx                  # REFACTOR: Chuẩn hóa token, fallback hero, theme-aware
│   │   ├── LookbookStylingSlider.tsx # REFACTOR: Cắt 1 dòng, chuyển hướng lookbook catalog
│   │   ├── TrustBadges.tsx           # REFACTOR: Hairline 1px, dời xuống đáy
│   │   └── index.ts                  # Re-export các component home
│   └── product/
│       ├── ProductGridShowcase.tsx   # REFACTOR: Sửa bug lọc tabs, empty/error state, sync CLS
│       └── ProductCardSkeleton.tsx   # SYNC: Khớp lưới 4 cột với ProductGridShowcase
├── pages/
│   └── HomePage.tsx                  # RE-ORDER: Sắp xếp lại thứ tự section chuẩn CRO
```

### 4.2 Thứ Tự Bố Cục Homepage Mới (High-Efficiency Sequence)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. [ANNOUNCEMENT BAR] Viền hairline, thông điệp freeship    │
├─────────────────────────────────────────────────────────────┤
│ 2. [HEADER] Kính mờ phẳng, logo MINIMALISM, giỏ hàng        │
├─────────────────────────────────────────────────────────────┤
│ 3. [HERO CAMPAIGN] 16:9 Cinematic, Dual CTA Khám Phá        │
├─────────────────────────────────────────────────────────────┤
│ 4. [CATEGORY QUICK-NAV] 6 ô phân loại trực quan (Áo/Quần...)│
├─────────────────────────────────────────────────────────────┤
│ 5. [NEW ARRIVALS SHOWCASE] Tabs LỌC THẬT, lưới 4 cột, 1 dòng│
├─────────────────────────────────────────────────────────────┤
│ 6. [LOOKBOOK SLIDER] Trượt ngang các set đồ phối sẵn        │
├─────────────────────────────────────────────────────────────┤
│ 7. [TRUST MATRIX] 4 cam kết chất lượng & đổi trả            │
├─────────────────────────────────────────────────────────────┤
│ 8. [FOOTER] Tuyên ngôn thương hiệu, Newsletter, Múi giờ VN │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Quy Tắc Xử Lý Dữ Liệu & Edge Cases

| Tình huống (Edge Case) | Cách Xử Lý Kỹ Thuật |
| :--- | :--- |
| **Tên sản phẩm dài** | Bắt buộc dùng `truncate line-clamp-1 break-all` kết hợp `title={product.name}` để hover chuột xem đầy đủ nếu muốn. |
| **API Hero Slide rỗng hoặc lỗi** | Hiển thị `HeroFallbackSlide` mặc định với hình ảnh Editorial sẵn có và link tới `/catalog`, không bao giờ return `null`. |
| **API Sản phẩm lỗi / Danh mục trống** | Hiển thị khối `EmptyState` hairline tối giản: icon nét mảnh, dòng chữ "Hiện chưa có sản phẩm trong danh mục này", nút "Xem Tất Cả Sản Phẩm". |
| **Tabs lọc trong Showcase** | Duy trì state `activeCategory`. Khi chọn tab: lọc cục bộ nếu dữ liệu đã tải, hoặc kích hoạt API fetch với param `categoryId`/`tag` tương ứng. |
| **Mobile 360px (Màn hình hẹp)** | Lưới sản phẩm 2 cột có `gap-x-3 gap-y-6`. Nút Mua Nhanh hiển thị biểu tượng `+` tinh gọn tại góc ảnh thay vì thanh bar chiếm diện tích. |

---

## 5. API Contracts & Data Schemas

### 5.1 Category Item Schema (Phục vụ CategoryQuickNav)
```typescript
export interface QuickCategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCountText?: string;
  imageUrl: string;
  targetUrl: string;
}
```

### 5.2 Category Filter Logic trong `ProductGridShowcase`
```typescript
interface ProductGridShowcaseProps {
  limit?: number;
  initialCategory?: string;
}

// Logic ánh xạ Category Tab sang truy vấn sản phẩm
export const SHOWCASE_TABS = [
  { id: "all", label: "Tất Cả", filterFn: (p: Product) => true },
  { id: "tops", label: "Áo", categoryKeywords: ["áo", "shirt", "blazer", "tee", "jacket"] },
  { id: "bottoms", label: "Quần", categoryKeywords: ["quần", "pant", "short", "jean", "trouser"] },
  { id: "footwear", label: "Giày & Dép", categoryKeywords: ["giày", "dép", "loafer", "sneaker"] },
  { id: "accessories", label: "Mũ & Phụ Kiện", categoryKeywords: ["mũ", "nón", "kính", "túi", "belt"] },
] as const;
```

---

## 6. Acceptance Criteria (Tiêu Chuẩn Nghiệm Thu)

- [ ] **Tab Filter Hoạt Động 100%:** Bấm vào bất kỳ tab nào trong `ProductGridShowcase` thì danh sách sản phẩm lập tức cập nhật theo đúng thể loại tương ứng, không còn tình trạng "tab ma".
- [ ] **Cổng Danh Mục Trực Quan Xuất Hiện:** Người dùng nhìn thấy ngay 6 nhóm hàng thời trang chính (Áo, Quần, Giày/Dép, Mũ/Nón, Phụ Kiện, Bộ Sưu Tập) và click chuyển hướng chính xác vào Catalog kèm filter.
- [ ] **Tên Sản Phẩm Không Quá 1 Dòng:** Toàn bộ tên sản phẩm trên thẻ card đều được hiển thị tối đa 1 dòng kèm dấu `...` khi quá dài trên cả desktop và mobile.
- [ ] **Zero Cumulative Layout Shift (CLS):** Skeleton loading của Showcase có đúng 4 cột trên màn hình desktop, khi dữ liệu nạp xong không xảy ra hiện tượng co giãn hay nhảy layout.
- [ ] **Không Có Mã Hex Hardcode:** Mọi class CSS trong `Hero.tsx`, `HomePage.tsx`, và layout components đều dùng 100% token semantic của Tailwind (`bg-background`, `text-foreground`, `border-border`, etc.).
- [ ] **Xử Lý Lỗi & Trạng Thái Rỗng Lịch Sự:** Tắt kết nối mạng hoặc danh mục không có sản phẩm đều xuất hiện giao diện thông báo và nút thử lại, không làm co thụt giao diện trang chủ.
- [ ] **Build Thành Công 100%:** Chạy `turbo build` vượt qua tất cả các bài test TypeScript và bundler không có lỗi.
