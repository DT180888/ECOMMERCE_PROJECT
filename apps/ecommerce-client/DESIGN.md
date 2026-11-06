---
name: Pure Modern Editorial & Lookbook Studio Design System (Tri-Anchor Architectural Edition)
typography_family: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
tri_anchor_palette:
  canvas_60: "#FFF8E7" # Warm Silk / Cosmic Milk Paper
  craft_30: "#826644"  # Muted Walnut / Artisan Leather
  ink_cta_10: "#1E282D" # Deep Slate Charcoal
target_application: "E-Commerce Client (B2C Storefront, Catalog & Lookbook)"
---

# E-Commerce Client Design System Specification

## 1. Master Semantic Color Tokens (Tri-Anchor Architectural System)

Bắt buộc sử dụng 100% semantic token (CSS variables / Tailwind utility classes). Hệ thống vận hành trên sự cộng hưởng của bộ ba sắc thái:
- **Anchor Canvas (60%):** `#FFF8E7` (Warm Silk / Cosmic Milk Canvas — Lụa vani sữa ấm).
- **Anchor Craft (30%):** `#826644` (Muted Walnut — Gỗ óc chó & Da thuộc thủ công).
- **Anchor Ink & CTA (10%):** `#1E282D` (Deep Slate Charcoal — Mực than đá phiến trầm).

Tuyệt đối không dùng `#FFFFFF`, `#000000`, `bg-white`, `bg-black`, `text-white`, `text-black`.

| Semantic Token | Light Mode (Silk Canvas) | Dark Mode (Obsidian Walnut Canvas) | Vai trò & Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| `background` | **`#FFF8E7`** *(Gốc Canvas)* | `#121618` | **Nền canvas toàn trang 60%** / Khoang đục lỗ recessed |
| `surface` | `#F6EDE0` | `#1A2023` | Bề mặt thẻ Card, modal, drawer, panel nổi nhẹ |
| `surface-hover` | `#EFE3D3` | `#232B2F` | Trạng thái hover tương tác trên bề mặt thẻ |
| `foreground` | **`#1E282D`** *(Gốc Ink)* | **`#FFF8E7`** *(Gốc Canvas)* | **Mực đọc chính & Tiêu đề**: Than đá phiến (Light) / Lụa kem ấm (Dark) |
| `muted-foreground` | `#63574A` | `#A69B8D` | Đoạn văn phụ, nhãn meta, mô tả kỹ thuật, thông số |
| `subtle` | `#BAAF9F` | `#544B41` | Placeholder, đường phân tầng nội bộ rất mờ |
| `border` | `#E8DCCB` | `#2A3337` | Đường viền tóc Hairline 1px kiến trúc |
| **`primary`** | **`#1E282D`** | `#C29F78` | **Nút Primary CTA 10%**: Than đá phiến (Light) / Gỗ óc chó sáng (Dark) |
| **`primary-foreground`** | **`#FFF8E7`** | `#121618` | Màu chữ/icon bên trong nút Primary (Tương phản WCAG AAA 14.2:1) |
| `primary-hover` | `#141C20` | `#BC9B75` | Trạng thái hover của nút Primary |
| **`accent-walnut`** | **`#826644`** *(Gốc Craft)* | `#A88864` | **Cấu trúc thủ công 30%**: Badge signature, tiêu đề H2, chỉ mục, viền nhấn |
| `accent-walnut-foreground` | `#FFF8E7` | `#121618` | Màu chữ khi nằm trên khối nền Walnut |
| `error` | `#8C3829` | `#E07664` | Hết hàng, form validation lỗi *(Đỏ đất nung Terracotta)* |
| `success` | `#2D4F38` | `#6FAF7E` | Đặt hàng thành công, còn hàng *(Xanh lá thông rêu Pine)* |
| `warning` | `#965B20` | `#E5A352` | Cảnh báo tồn kho thấp, đặt trước *(Nâu hổ phách Raw Amber)* |
| `info` | `#334B56` | `#6F97A8` | Thông tin vận chuyển, kích cỡ, bảo quản *(Lam đá phiến Slate)* |

### Quy Tắc Phối Hợp Tam Giác Kiến Trúc (Tri-Anchor Rules 60 – 30 – 10)
1. **60% Nền Canvas Mở (`#FFF8E7`):** Giữ vai trò trang giấy lụa bao bọc toàn bộ bố cục. Mọi khoảng thở giữa các section và margin hai biên đều là màu lụa sữa ấm tự nhiên.
2. **30% Cấu Trúc Thủ Công & Điểm Nhấn Tinh Xảo (`#826644`):** Tiêu đề H2, chỉ mục chương mục (`01 / Craftsmanship`), badge chất liệu (`100% RAW SILK`, `SOLID WALNUT`), đường gạch chân signature và viền nhấn.
3. **10% Lực Nhấn Tương Phản & Chuyển Đổi (`#1E282D`):** Nút bấm Primary CTA, logo nhận diện thương hiệu, và toàn bộ văn bản đọc chính để mắt người tiếp nhận thông tin rõ nét, không bị nhòe.

---

## 2. Thang Khoảng Cách 4pt (Micro-Grid Scale)

| Token | Kích thước | Utility Class | Phạm vi áp dụng |
| :--- | :--- | :--- | :--- |
| `space-2xs` | $2\text{px}$ | `gap-0.5`, `p-0.5` | Đệm viền badge hairline |
| `space-xs` | $4\text{px}$ | `gap-1`, `mt-1` | Tiêu đề xuống giá tiền; nhịp tag micro |
| `space-sm` | $8\text{px}$ | `gap-2`, `mt-2` | Đáy ảnh xuống tiêu đề; khoảng cách icon & text |
| `space-md` | $12\text{px}$ | `gap-3`, `p-3` | Padding nội bộ của input form, dropdown |
| `space-lg` | $16\text{px}$ | `gap-4`, `p-4` | Padding nút bấm CTA, khoảng cách field form |
| `space-xl` | $20\text{px}$ | `gap-5`, `p-5` | Khoảng cách nhóm trong modal, drawer |
| `space-2xl` | $24\text{px}$ | `gap-6`, `py-6` | Tiêu đề trang xuống thanh điều khiển |
| `space-3xl` | $32\text{px}$ | `gap-8`, `py-8` | Khoảng cách giữa Sidebar và Lưới sản phẩm |
| `space-4xl` | $48\text{px}$ | `gap-12`, `py-12`| Khoảng cách dọc desktop giữa các section lớn |

---

## 3. Công Thức & Quy Tắc Tính Spacing

### A. Tỷ Lệ Rãnh Bất Đối Xứng (Asymmetric Gutters)
Khoảng cách dọc giữa các hàng luôn gấp đôi hoặc hơn khoảng cách ngang giữa các cột để tạo nhịp thở thị giác báo chí:
$$\text{Row Gap (Dọc)} \ge 2 \times \text{Col Gap (Ngang)}$$

* **Mobile ($< 640\text{px}$):** `gap-x-3 gap-y-6` ($12\text{px} / 24\text{px}$)
* **Tablet ($640\text{px} - 1023\text{px}$):** `gap-x-4 sm:gap-x-5 gap-y-8` ($16\text{px} - 20\text{px} / 32\text{px}$)
* **Desktop ($1024\text{px} - 1535\text{px}$):** `gap-x-5 lg:gap-x-6 gap-y-10` ($20\text{px} - 24\text{px} / 40\text{px}$)
* **Ultrawide ($\ge 1536\text{px}$):** `gap-x-6 gap-y-12` ($24\text{px} / 48\text{px}$)
* **Sidebar-to-Grid Column Gutter:** `gap-6 lg:gap-8` ($24\text{px} - 32\text{px}$)

### B. Quy Tắc "The Half-Padding Sandwich" (Chống Gấp Đôi Spacing)
Tránh cộng dồn padding đáy của Section trên và padding đỉnh của Section dưới làm loãng bố cục:
* **Chuẩn Section:** Toàn bộ thẻ `<section>` sử dụng `py-6 sm:py-8 lg:py-12`.
* **Hai Section cùng màu nền:** Section trên dùng `pb-6 sm:pb-8 lg:pb-12`, section dưới triệt tiêu padding đỉnh bằng `pt-0`.
* **Ngoại lệ Khung cố định Tỷ lệ (`aspect-*`):** Các container mang tỷ lệ cố định (Hero `16:9`, Card `3:4`) tuyệt đối KHÔNG nhận `py-*` ở thẻ bọc ngoài. Đệm viền chỉ được gán cho layer nội dung tuyệt đối bên trong: `absolute inset-0 p-6 sm:p-8 lg:p-12`.

---

## 4. Giới Hạn Chiều Rộng Vùng Chứa (Layout Bounds & Shells)

* **Biên an toàn hai bên (Safe Edge Padding):** `px-4 sm:px-6 lg:px-10 2xl:px-12`
* **Catalog Shell (Lưới sản phẩm / Danh mục):** `max-w-[1600px] mx-auto`
* **Transactional Checkout (Thanh toán / Giỏ hàng):** `max-w-[960px] mx-auto`
* **Editorial Prose (Bài viết / Chính sách):** `max-w-[680px] mx-auto`
* **Sticky Buy-Box (Khối mua hàng PDP):** `max-w-[440px]`
* **Độ lệch ghim vị trí (Sticky Offsets):**
  * Global Header: `top-0 h-16` ($64\text{px}$)
  * Top Utility / Filter Bar: `sticky top-16` ($64\text{px}$)
  * Desktop PDP Buy-Box / Sidebar: `sticky top-28` ($112\text{px}$)

---

## 5. Quy Luật Quản Trị Thiết Kế Cha - Con (Parent-Child Governance)

1. **Zero Outer Margin của Thẻ Con:**
   * Mọi component con (Card, Button, Form Field, Item, Image) bắt buộc set `m-0` trên thẻ gốc (root tag). Không component nào được tự định đoạt khoảng cách xung quanh chính nó.
2. **Thẻ Cha Toàn Quyền Quản Lý Vị Trí:**
   * Mọi khoảng cách giữa các phần tử anh em phải được xử lý độc quyền bởi thẻ cha thông qua `flex flex-col gap-*` hoặc `grid gap-x-* gap-y-*`.
   * Khối lề cách biên luôn được thẻ cha kiểm soát qua `p-*`, `px-*`, `py-*`.
3. **Phân Tách Bằng Khoảng Trắng (Whitespace Over Lines):**
   * Không kẻ viền đóng hộp các khối text, không kẻ ranh giới chia cắt giữa các card sản phẩm cạnh nhau.
   * Sử dụng thang khoảng cách chuẩn (`gap-*`) để tạo ranh giới thị giác tự nhiên.
   * Đường kẻ tóc `border-border` ($1\text{px}$) chỉ được phép sử dụng ở ranh giới kiến trúc: gạch chân Header dính, viền ô nhập liệu input hoặc viền phân cách Drawer/Modal.

---

## 6. Quy Chuẩn Lồng Ghép Bề Mặt (Surface Nesting Hierarchy)

### Mô Hình A: Cha `background` $\rightarrow$ Con `bg-transparent` $\rightarrow$ Cháu `bg-surface` (Elevated Floating Units)
* **Bản chất thị giác:** Khối `bg-surface` đóng vai trò là thực thể nổi độc lập (Solid Floating Object) trên nền giấy lụa `bg-background` (`#FFF8E7`).
* **Quy tắc Spacing:** Thẻ con `m-0`, điều phối cự ly qua `gap-x-*` và `gap-y-*`. Khối cháu tự quản lý padding nội bộ: `p-4 sm:p-5 lg:p-6` ($16\text{px} - 24\text{px}$).

### Mô Hình B: Cha `bg-surface` $\rightarrow$ Thành Phần Con/Cháu `bg-background` (Inverted Recessed Slots)
* **Bản chất thị giác:** Khối con `bg-background` là khoang đục lỗ lún sâu (Recessed Inset Slot), kéo mắt nhìn xuyên qua lớp surface để thấy tầng canvas lụa bên dưới.
* **Quy tắc Spacing:** Thẻ cha có padding lớn (`p-6 sm:p-8 lg:p-10`). Khoang con có viền tóc `border border-border/60 rounded-[2px]`, khoảng cách giữa các khoang thu gọn `gap-2` đến `gap-4`.

---

## 7. Hệ Thống Phân Tầng Chữ 100% Plus Jakarta Sans (Type Scale Matrix)

Hệ thống tuân thủ **Kỷ luật Đơn Font (Single-Typeface System)**. Toàn bộ phân cấp thị giác dựa trên các nấc tỷ lệ vàng:

| Phân cấp | Kích thước | Weight | Tracking | Leading | Utility Class Tailwind | Ứng dụng cụ thể |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | $48\text{px} - 64\text{px}$ | 500 | `-0.03em` | `1.05` | `text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.03em] leading-none text-foreground` | Hero Banner, Tiêu đề thương hiệu |
| `headline-section` | $24\text{px} - 32\text{px}$ | 500 | `-0.02em` | `1.15` | `text-2xl sm:text-3xl font-medium tracking-[-0.02em] leading-tight text-foreground` | Tiêu đề Section (H2), Tiêu đề chính PDP |
| `title-card` | $14\text{px} - 15\text{px}$ | 400 | `-0.01em` | `1.35` | `text-sm sm:text-[15px] font-normal tracking-[-0.01em] leading-snug text-foreground` | Tên sản phẩm trên card catalog |
| `body-editorial` | $14\text{px} - 15\text{px}$ | 300 | `+0.005em` | `1.65` | `text-sm font-light leading-relaxed text-muted-foreground [text-wrap:pretty]` | Văn bản mô tả sản phẩm, bài viết prose |
| `price-tag` | $13\text{px} - 14\text{px}$ | 500 | `+0.04em` | `1.2` | `text-xs sm:text-sm font-medium tracking-wider tabular-nums text-foreground` | Giá bán tiền tệ |
| `micro-label` | $10\text{px} - 11\text{px}$ | 500 | `+0.2em` | `1.0` | `text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] leading-none text-accent-walnut` | Eyebrow section, mã SKU, nhãn danh mục |

---

## 8. Quy Chuẩn Tỷ Lệ Khung Hình & Xử Lý Ảnh (Aspect Ratio & Media System)

| Loại Khung Hình | Tỷ Lệ | Utility Class | Phạm vi áp dụng | Quy cách hiển thị & Tải |
| :--- | :--- | :--- | :--- | :--- |
| `Product Portrait` | $3:4$ | `aspect-[3/4]` | Toàn bộ ảnh sản phẩm Catalog, Lookbook grid | Phẳng tuyệt đối, nền lót `bg-surface`, `object-cover object-center` |
| `Lookbook / Banner` | $16:9$ / $4:5$ | `aspect-[16/9]` / `aspect-[4/5]` | Hero Banner, Editorial Media Showcase | Bọc layer overlay tuyệt đối (`absolute inset-0 p-6 sm:p-8`), cấm padding ngoài |
| `Square Detail` | $1:1$ | `aspect-square` | Thumbnail giỏ hàng, bảng chọn màu, avatar | Micro-card, viền tóc `border border-border/40` |

---

## 9. Đặc Tả Chuyển Động & Trưng Bày Tăng Tiến (Motion & Progressive Disclosure)

* **Trạng thái nghỉ Desktop:** Chỉ hiển thị Ảnh tỷ lệ $3:4$ + Tên sản phẩm (1 dòng) + Giá tiền.
* **Trạng thái hover Desktop:**
  - Ảnh phụ lookbook: Mờ dần hiện đè lên ảnh chính (`transition-opacity duration-500 ease-out`).
  - Nút Yêu thích (Heart): Hiện ở góc phải trên ảnh (`opacity-0 group-hover:opacity-100 transition-opacity duration-300`).
  - Nút Mua nhanh (Quick Add): Trượt nhẹ từ đáy ảnh lên (`opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300`).
* **Mobile Touch Fallback:** Nút thao tác chuyển thành icon nét mảnh cố định hoặc chạm card để mở chi tiết xem nhanh.

---

## 10. Tra Cứu Quy Chuẩn Nghiêm Ngặt (Strict Spacing Lookup)

- **Giữa Tiêu đề và Giá:** BẮT BUỘC `mt-1` ($4\text{px}$) hoặc `mt-1.5` ($6\text{px}$). CẤM `mt-4`, `mt-6`.
- **Giữa Đáy ảnh card và cụm Text:** BẮT BUỘC `mt-2` ($8\text{px}$) hoặc `mt-2.5` ($10\text{px}$). CẤM `mt-4+`.
- **Khoảng cách giữa các nút/tag nhỏ:** BẮT BUỘC `gap-1.5` đến `gap-2` ($6\text{px} - 8\text{px}$).
- **Giữa các cột sản phẩm (Col gap):** BẮT BUỘC `gap-x-4 lg:gap-x-6` ($16\text{px} - 24\text{px}$). CẤM `gap-8+`.
- **Đệm dọc Section (`<section>`):** BẮT BUỘC `py-6 sm:py-8 lg:py-12`. CẤM `py-16`, `py-20`, `py-24`, `py-32`.
- **Bo góc (Border Radius):** `rounded-none` hoặc `rounded-[2px]`. CẤM bo góc tròn `rounded-xl`, `rounded-2xl`.
