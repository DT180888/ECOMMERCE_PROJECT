---
name: Pure Modern Editorial & Huashu Studio Design System
description: High-end Scandinavian Minimalist e-commerce design system uniting Pure Modern Editorial aesthetics and Huashu Studio craftsmanship. Off-monochromatic palette (Soft Warm Paper & Deep Obsidian Ink), 100% single-typeface discipline (Plus Jakarta Sans), hairline geometric precision, asymmetric gutters, the half-padding sandwich, progressive hover disclosure, and anti-AI-slop principles. ZERO PURE WHITE (#FFFFFF) AND ZERO PURE BLACK (#000000).
brand:
  name: "MINIMALISM"
  display_signature: "MINIMALISM."
  tagline: "Pure Modern Editorial & Quiet Luxury"
  origin: "Saigon / GMT+7"
  direction: "Direction 1: Pure Modern Editorial (Scandinavian Minimalist · Sans-Only Studio)"

colors:
  # Light Mode (Warm Paper & Rich Charcoal Ink)
  background-light: "#FAF9F6"      # Paper White - Base canvas
  surface-light: "#F3F2EE"         # Soft Card/Elevated surface
  surface-hover-light: "#ECEAE4"   # Interactive surface hover
  text-light: "#161616"            # Rich Charcoal Ink (No pure black)
  muted-light: "#6E6E6E"           # Secondary body & descriptions
  subtle-light: "#A3A199"          # Micro captions & inactive meta
  border-light: "#E2E0D9"          # Hairline 1px border

  # Dark Mode (Deep Obsidian & Cream White)
  background-dark: "#121212"       # Deep Obsidian Ink - Base canvas
  surface-dark: "#1A1A1A"          # Muted Obsidian Card surface
  surface-hover-dark: "#242424"    # Interactive surface hover
  text-dark: "#F3F3F0"             # Soft Cream White (No pure white)
  muted-dark: "#8E8E8E"            # Secondary body & descriptions
  subtle-dark: "#5A5A58"           # Micro captions & inactive meta
  border-dark: "#2A2A2A"           # Dark Hairline 1px border

  # Semantic Feedback (Editorial Muted Tones - Never neon or oversaturated)
  error-light: "#8B2626"
  error-dark: "#E06B6B"
  success-light: "#2E5A36"
  success-dark: "#68A674"
  warning-light: "#94631B"
  warning-dark: "#E5A955"
  info-light: "#2A4B6E"
  info-dark: "#6BA1D6"

typography:
  family: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  rule: "CHỈ SỬ DỤNG DUY NHẤT MỘT HỌ FONT SANS-SERIF (PLUS JAKARTA SANS) CHO TOÀN BỘ DỰ ÁN. KHÔNG DÙNG FONT SERIF HOẶC FONT MONO."
  hierarchy:
    display_hero: "text-4xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[1.05]"
    headline_section: "text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.02em] leading-[1.15]"
    title_card: "text-sm sm:text-base font-normal tracking-[-0.01em] leading-[1.3]"
    body_editorial: "text-sm sm:text-base font-light tracking-[0.005em] leading-[1.6]"
    price_tag: "text-xs sm:text-sm font-medium tracking-[0.04em] tabular-nums"
    micro_label: "text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase leading-none"
    meta_tag: "text-xs font-normal tracking-[0.1em] uppercase text-muted-foreground"

aspect_ratios:
  product_portrait: "3:4"
  lookbook_frame: "3:4"
  hero_cinematic: "16:9"
  panoramic_breakout: "21:9"
  square_detail: "1:1"

rounded:
  base: "0px"
  card: "0px"
  image: "0px"
  button: "2px"
  input: "2px"
  badge: "2px"

z_index:
  base: 0
  card_overlay: 10
  sticky_element: 20
  sticky_header: 40
  modal_backdrop: 50
  flyout_drawer: 60
  notification_toast: 70

motion:
  duration_fast: "150ms"
  duration_hover: "250ms"
  duration_drawer: "350ms"
  duration_fade: "500ms"
  duration_reveal: "700ms"
  ease_editorial: "cubic-bezier(0.16, 1, 0.3, 1)"

spacing:
  space_2xs: "2px"   # gap-0.5, p-0.5 Hairline badge padding
  space_xs: "4px"    # gap-1, mt-1 Title to Price, micro tag gap
  space_sm: "8px"    # gap-2, mt-2 Image bottom to Title, icon-text gap
  space_md: "12px"   # gap-3, p-3 Small input padding
  space_lg: "16px"   # gap-4, p-4 CTA padding, form field gap
  space_xl: "24px"   # gap-6, p-6 Card group gap, popover padding
  space_2xl: "32px"  # gap-8, py-8 Micro-section gap, header to grid
  space_3xl: "48px"  # gap-12, py-12 Medium vertical gutter
  space_4xl: "64px"  # gap-16, py-16 Desktop vertical gutter

  # Asymmetric Macro Gutters (Vertical >= 2x Horizontal)
  gutter_x: "gap-x-3 sm:gap-x-6 lg:gap-x-8"
  gutter_y: "gap-y-8 sm:gap-y-12 lg:gap-y-16 2xl:gap-y-20"
  edge_padding: "px-4 sm:px-8 lg:px-12 2xl:px-16"

  # The Half-Padding Sandwich
  section_home_py: "py-8 sm:py-12 lg:py-16"
  section_catalog_py: "py-6 sm:py-8 lg:py-12"
  section_editorial_py: "py-8 sm:py-10 lg:py-14"

containers:
  fluid: "w-full"
  catalog_shell: "max-w-[1600px] mx-auto"
  transactional_checkout: "max-w-[960px] mx-auto"
  editorial_prose: "max-w-[680px] mx-auto"
  sticky_buybox: "max-w-[440px]"
---

# Design System Specification: Pure Modern Editorial & Huashu Studio

## 1. Overview & Triết Lý Thiết Kế (Scandinavian Minimalist Studio)

**Creative North Star: "Tactile Paper Elegance, Single-Typeface Discipline, Hairline Precision, and Progressive Hover Disclosure."**

Hệ thống thiết kế là sự hòa quyện giữa **Phong cách Tối giản Hiện đại Bắc Âu (Jil Sander, Totême, Lemaire, The Row)** và **Tiêu chuẩn Thủ công Studio Cao cấp từ Huashu-Design**:
- **Không Để Lộ Dấu Vết AI (Anti-AI-Slop)**: Loại bỏ triệt để các vết tích "công nghiệp" của AI (tiêu đề in hoa dày cộm vô cảm, màu tím gradient, đổ bóng xám xịt `shadow-xl`, icon trang trí vô nghĩa ở từng dòng chữ). Mọi khoảng trắng và đường nét đều có chủ đích như được giám sát bởi Art Director quốc tế.
- **Duy Nhất Một Kiểu Chữ (Single-Typeface Discipline)**: Toàn bộ hệ thống giao diện chuẩn hóa về **100% `Plus Jakarta Sans`**. Tính biên tập sang trọng được tạo ra từ sự tương phản khốc liệt của Tỷ lệ (Scale), Độ đậm nhạt (Weight), Khoảng dãn chữ (Letter-spacing/Tracking) và Khoảng cách dòng (Leading), thay vì pha trộn font rườm rà.
- **Bảng Màu Giấy Ấm & Mực Than (Tactile Off-Monochrome)**: Tuyệt đối triệt tiêu `#FFFFFF` và `#000000`. Nền Light dùng Warm Paper `#FAF9F6`, chữ Rich Charcoal `#161616`. Nền Dark dùng Obsidian Ink `#121212`, chữ Cream White `#F3F3F0`.
- **Hình Học Phẳng Nét Tóc (Flat Hairline Geometry)**: Phẳng 100% (`shadow-none`). Phân tách cấu trúc bằng đường kẻ tóc 1px sắc nét (`border-border`), góc bo vuông vức `rounded-none` (hoặc micro `rounded-[2px]` cho phần tử tương tác nhỏ).
- **Trưng Bày Tăng Tiến (Progressive Hover Disclosure)**: Trạng thái tĩnh của sản phẩm đạt độ sạch 100%. Các chi tiết phụ trợ và nút chức năng (Đổi góc ảnh Lookbook, Nút Mua nhanh, Yêu thích) chỉ xuất hiện mượt mà khi người dùng tương tác.
- **Luật Quản Trị Cha - Con (Parent-Child Governance)**: Con luôn giữ `m-0` ở thẻ root. Cha toàn quyền kiểm soát vị trí, lưới `gap-x`, `gap-y` và đệm viền `px-*`, `py-*`.

---

## 2. Nhận Diện Thương Hiệu Độc Nhất (Brand Identity Protocol)

Theo nguyên tắc bất biến của **Huashu-Design**, nhận diện thương hiệu phải đạt tính toàn vẹn 100% xuyên suốt:

| Vị trí Thành phần | Quy cách Hiển thị | Typography & Style |
| :--- | :--- | :--- |
| **Global Header Logo** | `MINIMALISM` | `font-display font-medium text-base sm:text-lg tracking-[0.25em] uppercase text-foreground` |
| **Header Meta Badge** | `STUDIO EDITION` | `text-[10px] font-normal tracking-[0.2em] uppercase text-muted-foreground border-l border-border pl-3 hidden md:inline-block` |
| **Footer Headline** | `MINIMALISM.` | `font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground` |
| **Tab/Page Title** | `Minimalism — Quiet Luxury Store` | Format: `{Page Title} | Minimalism` |
| **Origin Stamp** | `SAIGON / GMT+7` | Con dấu xuất xứ kỹ thuật số tại chân trang: `text-[11px] tracking-[0.2em] uppercase text-muted-foreground` |

> **Nguyên tắc cấm**: Nghiêm cấm dùng các tên giả định, tên thử nghiệm (như `SHOPX`, `Store Demo`, `Brand Name`) làm tổn hại tính thống nhất của thương hiệu.

---

## 3. Hệ Thống Typography Độc Nhất: 100% Plus Jakarta Sans

Hệ thống tuân thủ **Kỷ luật Đơn Font (Single-Typeface System)**. Toàn bộ phân cấp thị giác dựa trên 7 nấc tỷ lệ vàng:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 100% PLUS JAKARTA SANS TYPOGRAPHIC HIERARCHY MATRIX                                    │
├───────────────────┬─────────────┬────────┬───────────┬──────────────┬──────────────────┤
│ Cấp bậc           │ Size (rem)  │ Weight │ Tracking  │ Leading      │ Tailwind Utility │
├───────────────────┼─────────────┼────────┼───────────┼──────────────┼──────────────────┤
│ Display Hero      │ 3.75 - 4.5  │ 500    │ -0.03em   │ 1.05         │ text-5xl lg:text-7xl font-medium tracking-[-0.03em] leading-none │
│ Section Headline  │ 2.0 - 2.25  │ 500    │ -0.02em   │ 1.15         │ text-2xl lg:text-4xl font-medium tracking-[-0.02em] leading-tight │
│ Subsection Title  │ 1.25 - 1.5  │ 500    │ -0.015em  │ 1.25         │ text-xl lg:text-2xl font-medium tracking-[-0.015em] │
│ Card Product Name │ 0.875 - 1.0 │ 400    │ -0.01em   │ 1.35         │ text-sm sm:text-base font-normal tracking-[-0.01em] │
│ Editorial Prose   │ 0.937 - 1.0 │ 300    │ +0.005em  │ 1.65         │ text-[15px] sm:text-base font-light leading-relaxed │
│ Price / Numeral   │ 0.812 - 0.875 500    │ +0.04em   │ 1.2          │ text-xs sm:text-sm font-medium tracking-wider tabular-nums │
│ Micro / Meta Tag  │ 0.625 - 0.687 500    │ +0.2em    │ 1.0          │ text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] │
└───────────────────┴─────────────┴────────┴───────────┴──────────────┴──────────────────┘
```

### Quy tắc ứng dụng Typography:
1. **Không Dùng Font Serif hoặc Mono**: Không import hay gọi class `font-serif`, `font-mono`. Toàn bộ giao diện từ tiêu đề đến bảng số liệu đều hiển thị bằng `Plus Jakarta Sans`.
2. **Kỹ Thuật Đọc Dễ Chịu**: Mọi đoạn văn bản mô tả (Prose) bắt buộc thêm class `text-wrap: pretty` hoặc `[text-wrap:pretty]` để chống từ đơn lẻ rơi xuống dòng cuối (widow word).
3. **Phân Tách Bằng Tracking**: Tiêu đề lớn dùng tracking âm nhẹ (`tracking-[-0.02em]`), nhãn kỹ thuật/menu dùng tracking dương rộng (`tracking-[0.15em]` đến `tracking-[0.25em]`).

---

## 4. Master Color Tokens & Tailwind Binding

### A. Bảng Màu Master HSL & Hex

| Token Semantic | Light Hex | Light HSL | Dark Hex | Dark HSL | Ý nghĩa Sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `background` | `#FAF9F6` | `40 20% 97%` | `#121212` | `0 0% 7%` | Nền canvas toàn trang |
| `surface` / `card` | `#F3F2EE` | `45 12% 94%` | `#1A1A1A` | `0 0% 10%` | Thẻ card, modal, drawer |
| `surface-hover` | `#ECEAE4` | `45 12% 91%` | `#242424` | `0 0% 14%` | Trạng thái hover của bề mặt |
| `foreground` | `#161616` | `0 0% 9%` | `#F3F3F0` | `60 8% 95%` | Chữ chính, tiêu đề, nút Primary |
| `muted-foreground` | `#6E6E6E` | `0 0% 43%` | `#8E8E8E` | `0 0% 56%` | Chữ phụ, mô tả, nhãn meta |
| `subtle` | `#A3A199` | `45 6% 62%` | `#5A5A58` | `60 2% 35%` | Placeholder, viền phụ, micro tag |
| `border` | `#E2E0D9` | `45 12% 87%` | `#2A2A2A` | `0 0% 16.5%` | Đường viền tóc Hairline 1px |
| `error` | `#8B2626` | `359 57% 35%`| `#E06B6B` | `359 66% 65%`| Lỗi validation, hết hàng |
| `success` | `#2E5A36` | `131 32% 27%`| `#68A674` | `131 27% 53%`| Thành công, còn hàng |
| `warning` | `#94631B` | `36 69% 35%` | `#E5A955` | `36 74% 62%` | Lưu ý tồn kho thấp, pre-order |
| `info` | `#2A4B6E` | `211 45% 30%`| `#6BA1D6` | `211 56% 63%`| Thông báo vận chuyển, chính sách |

### B. Quy Tắc Phân Tầng Opacity & Lớp Phủ (Alpha Tiers)
- `border-border/100`: Đường viền cấu trúc chính (phân chia section, bao khung modal).
- `border-border/60`: Đường viền ngăn cách nội bộ các phần tử (giữa các sản phẩm, giữa các dòng menu).
- `bg-background/80 backdrop-blur-md`: Header dính (Sticky Header), thanh Filter bar nổi.
- `bg-foreground/5`: Vùng hover của các item trong menu hoặc dropdown.
- `bg-foreground/40`: Màn phủ làm tối (Backdrop Overlay) khi mở Drawer hoặc Modal.

### C. Lệnh Cấm Tuyệt Đối Cho AI Coding Agents
- **TUYỆT ĐỐI KHÔNG DÙNG**: `#FFFFFF`, `#FFF`, `#000000`, `#000`, `bg-white`, `bg-black`, `text-white`, `text-black`.
- **TUYỆT ĐỐI KHÔNG HARDCODE MÀU HEX**: Phải dùng 100% token semantic của Tailwind (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`).

---

## 5. Master Spacing, Asymmetric Gutter & Layout Architecture

### A. Hệ Thống Lưới Vi Mô 4pt (4pt Micro-Grid)
- `space-2xs` ($2\text{px}$): `gap-0.5, p-0.5` — Hairline badge padding, viền cúc áo.
- `space-xs` ($4\text{px}$): `gap-1, mt-1` — Khoảng cách từ Tiêu đề sản phẩm xuống Giá tiền; nhịp tag.
- `space-sm` ($8\text{px}$): `gap-2, mt-2` — Đáy ảnh sản phẩm (3:4) xuống Tiêu đề; khoảng cách icon & text.
- `space-md` ($12\text{px}$): `gap-3, p-3` — Padding nội bộ của input form, dropdown select.
- `space-lg` ($16\text{px}$): `gap-4, p-4` — Padding nút bấm CTA, khoảng cách giữa các trường dữ liệu.
- `space-xl` ($24\text{px}$): `gap-6, p-6` — Khoảng cách phân đoạn thông tin trong modal, drawer.
- `space-2xl` ($32\text{px}$): `gap-8, py-8` — Khoảng cách giữa tiêu đề trang và lưới sản phẩm.
- `space-3xl` ($48\text{px}$): `gap-12, py-12` — Gutter dọc giữa các nhóm nội dung vừa.
- `space-4xl` ($64\text{px}$): `gap-16, py-16` — Gutter dọc chuẩn desktop giữa các phần tử lớn.

### B. Tỷ Lệ Rãnh Bất Đối Xứng (Asymmetric Editorial Gutter)
Quy tắc rãnh dọc luôn gấp đôi hoặc hơn rãnh ngang để tạo nhịp thở thị giác báo chí:
$$\text{Vertical Gutter (Row Gap)} \ge 2 \times \text{Horizontal Gutter (Col Gap)}$$
- **Mobile ($<640\text{px}$):** `gap-x-3` ($12\text{px}$) đi kèm `gap-y-8` ($32\text{px}$)
- **Tablet ($640\text{px}-1023\text{px}$):** `gap-x-4 sm:gap-x-6` ($16\text{px}-24\text{px}$) đi kèm `gap-y-12` ($48\text{px}$)
- **Desktop ($1024\text{px}-1535\text{px}$):** `gap-x-6 lg:gap-x-8` ($24\text{px}-32\text{px}$) đi kèm `gap-y-16` ($64\text{px}$)
- **Ultrawide ($\ge 1536\text{px}$):** `gap-x-8` ($32\text{px}$) đi kèm `gap-y-20` ($80\text{px}$)

### C. Quy Tắc "The Half-Padding Sandwich" (Chống Nhân Đôi Spacing)
Khi hai section đứng liền kề, padding đáy của Section A gộp với padding đỉnh của Section B sẽ tạo ra một hố sâu khoảng cách nếu dùng số đo thô:
$$\text{Đáy Section A } (64\text{px}) + [\text{Border } 1\text{px}] + \text{Đỉnh Section B } (64\text{px}) = 128\text{px} \text{ (Thô bạo, vỡ nhịp)}$$
- **Giải pháp**: Mọi `<section>` nội dung bắt buộc sử dụng chuẩn `py-8 sm:py-12 lg:py-16`.
- **Ngoại lệ Container Tỷ Lệ Khung Hình Cố Định (Fixed Aspect Ratio)**:
  - Container có class `aspect-[16/9]` hoặc `aspect-[3/4]` (như Hero Banner) **TUYỆT ĐỐI KHÔNG NHỒI `py-*`** vào thẻ cha. Spacing chỉ được cấp cho nội dung overlay bên trong (`absolute inset-0 p-8 sm:p-12 lg:p-16`).
- **Ngoại lệ Liền Nền**: Nếu hai section cùng màu nền và không có đường kẻ tóc phân cách, section trên giữ `pb-8 sm:pb-12 lg:pb-16`, section dưới dùng `pt-0`.

### D. Safe Edge Padding & Container Bounds
- **Biên an toàn toàn cục (Safe Edge Padding):** `px-4 sm:px-8 lg:px-12 2xl:px-16`
- **Catalog Shell Container:** `max-w-[1600px] mx-auto`
- **Transactional Checkout Container:** `max-w-[960px] mx-auto`
- **Editorial Prose Container:** `max-w-[680px] mx-auto`
- **Sticky Buy-Box (PDP):** `max-w-[440px]`

---

## 6. Đặc Tả Trạng Thái Component & Progressive Disclosure

### A. Thẻ Sản Phẩm Tinh Giản (Editorial Product Card)
Áp dụng triệt để nguyên tắc **Progressive Hover Disclosure**:

```
┌─────────────────────────────────────────────────────────────┐
│ TRẠNG THÁI NGHỈ (RESTING STATE - CLEAN 100%)                │
├─────────────────────────────────────────────────────────────┤
│ [ KHUNG ẢNH CHÍNH 3:4 ]                                     │
│ • Góc sắc nét rounded-none, phẳng 100%                      │
│ • Không nhồi badge giảm giá, không icon tim, không rating   │
│                                                             │
│ Tiêu đề sản phẩm 1 dòng (text-sm font-normal)               │
│ 1.250.000₫ (text-xs font-medium tracking-wider mt-1)       │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼ [ Hover chuột vào thẻ ]
┌─────────────────────────────────────────────────────────────┐
│ TRẠNG THÁI HOVER (PROGRESSIVE DISCLOSURE STATE)             │
├─────────────────────────────────────────────────────────────┤
│ [ KHUNG ẢNH CHÍNH 3:4 ]                                     │
│ • ẢNH PHỤ (LOOKBOOK ALTERNATE) hòa tan hiện ra (opacity-100)│
│ • NÚT TIM YÊU THÍCH mờ dần hiện góc trên (transition-opacity│
│ • THANH MUA NHANH (QUICK-ADD PILL) trượt nhẹ từ đáy ảnh lên │
│                                                             │
│ Tiêu đề sản phẩm (gạch chân hairline mảnh hoặc giữ nguyên)  │
│ 1.250.000₫                                                  │
└─────────────────────────────────────────────────────────────┘
```

- **Mobile Touch Fallback**: Trên màn hình cảm ứng không có hover, nút "Mua nhanh" hoặc "Thêm vào giỏ" thu nhỏ thành icon nét mảnh cố định ở góc ảnh, hoặc cho phép tap một chạm để mở Bottom Sheet chi tiết.
- **Trạng thái Hết Hàng (Out of Stock)**: Ảnh giảm độ mờ `opacity-60`, nhãn `HẾT HÀNG` dạng hairline badge thanh mảnh giữa ảnh, giá tiền đổi màu `text-muted-foreground line-through`.

### B. Hệ Thống Nút Bấm (Button System)
- **Primary Button**: Nền đảo màu tương phản cao (`bg-foreground text-background`), góc micro `rounded-[2px]`, font `text-xs font-medium uppercase tracking-[0.15em]`, phẳng tuyệt đối không bóng mờ. Hover: `hover:opacity-90 active:scale-[0.98] transition-all duration-200`.
- **Secondary / Hairline Button**: Nền trong suốt (`bg-transparent`), viền tóc 1px (`border border-border text-foreground`). Hover: `hover:border-foreground transition-colors duration-200`.
- **Ghost / Text Button**: Không viền, không nền. `text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors`.
- **Disabled State**: Thêm `opacity-40 cursor-not-allowed pointer-events-none`.
- **Loading State**: Hiển thị Hairline Spinner siêu mảnh ($1.25\text{px}$) quay đều, chữ chuyển sang mờ nhẹ.

### C. Trường Nhập Liệu & Biểu Mẫu (Form Fields & Inputs)
- **Kiểu Dáng**: Hairline Underline (gạch dưới thanh lịch) hoặc Flat Hairline Box (`border border-border bg-transparent rounded-[2px] p-3`).
- **Default**: `text-xs text-foreground placeholder:text-muted-foreground/60 border-border`.
- **Hover**: `border-foreground/40 transition-colors duration-200`.
- **Focus-Visible**: `border-foreground outline-none ring-0`.
- **Error / Invalid**: `border-error text-error placeholder:text-error/50`. Tin nhắn báo lỗi hiển thị cách đáy input 4px (`text-[11px] text-error tracking-wide`).

### D. Bảng Trạng Thái Skeleton & Loading (Zero AI Gray Slop)
- Tuyệt đối cấm dùng các mảng xám xịt nhạt nhẽo `bg-gray-200`.
- Bắt buộc dùng hiệu ứng thở off-monochrome: `animate-pulse bg-surface/60 border border-border/40`.

---

## 7. Kiến Trúc Blueprint Các Trang Trọng Tâm

### A. Homepage Blueprint (Editorial Curated Journey)
1. **Header Nổi (Floating Header)**: Cố định `fixed top-0`, nền trong suốt khi ở đỉnh hero, chuyển sang kính mờ phẳng `bg-background/85 backdrop-blur-md border-b border-border/60` khi cuộn.
2. **Hero Campaign (Full-Bleed 16:9 Cinematic)**: Ảnh chiến dịch khổ lớn, typography Display kích thước lớn (`MINIMALISM / COLLECTION 2026`), Dual CTA (Khám Phá Tuyển Tập / Xem Lookbook).
3. **Immediate Merchandising Grid (Tuyển Tập Mới)**: Lưới 8 sản phẩm tinh tuyển, bố cục rãnh bất đối xứng, tab phân loại danh mục tinh gọn.
4. **Curated Wardrobe Capsule ("Shop The Look" Slider)**: Bố cục trượt ngang tràn viền giới thiệu set đồ hoàn chỉnh.
5. **Editorial Journal Footer**: Tuyên ngôn thương hiệu, form nhận bản tin một dòng hairline, bản đồ liên kết 5 cột và con dấu địa lý `SAIGON / GMT+7`.

### B. Catalog / Shop Blueprint (Lọc & Khám Phá)
1. **Sticky Filter Bar**: Thanh công cụ lọc dính dưới Header, bao gồm số lượng sản phẩm (`64 SẢN PHẨM`), nút Mở Bộ Lọc Nâng Cao (Drawer), và Bộ Sắp Xếp (Sort Dropdown).
2. **Lưới Sản Phẩm Linh Hoạt**:
   - Mobile: 2 cột (`gap-x-3 gap-y-8`).
   - Tablet: 3 cột (`gap-x-6 gap-y-12`).
   - Desktop: 4 cột (`gap-x-8 gap-y-16`).
3. **Pagination Tinh Gọn**: Hiển thị số trang tối giản hoặc thanh tiến độ cuộn (`ĐÃ XEM 24 TRÊN 64 SẢN PHẨM` kèm nút "TẢI THÊM").

### C. Product Detail Page Blueprint (PDP - Trình Bày Sản Phẩm)
1. **Bố Cục 2 Cột Bất Đối Xứng (Desktop)**:
   - **Cột Trái (60%): Lookbook Gallery**. Cuộn dọc danh sách các góc ảnh 3:4 chụp chi tiết chất liệu và phom dáng người mẫu.
   - **Cột Phải (40%): Sticky Buy-Box (`max-w-[440px] sticky top-28`)**.
2. **Nội Dung Sticky Buy-Box**:
   - Tên sản phẩm (`text-2xl font-medium tracking-tight`).
   - Mã SKU & Trạng thái hàng tồn (`text-[11px] uppercase tracking-widest text-muted-foreground mt-1`).
   - Giá tiền (`text-lg font-medium tracking-wider tabular-nums mt-3`).
   - Bảng chọn Màu sắc & Kích cỡ (Hairline square pills `h-9 min-w-9 flex items-center justify-center border border-border text-xs`).
   - Nút Thêm vào giỏ (`w-full py-4 bg-foreground text-background uppercase tracking-[0.2em] text-xs font-medium`).
   - Accordion thông tin mở rộng (Chất liệu, Hướng dẫn bảo quản, Vận chuyển & Đổi trả) với viền tóc phân tầng.

---

## 8. Mười Điều Răn Dành Cho AI Coding Agents (Anti-AI-Slop Directives)

Tất cả các AI Coding Agent khi thao tác code UI trên dự án **bắt buộc tuân thủ 10 điều sau**:

1. **Tuyệt Đối Không Dùng Font Khác Ngoài Plus Jakarta Sans**: Cấm gọi `font-serif`, `font-mono`. Phân tầng chữ hoàn toàn qua Size, Weight, Tracking.
2. **Không Dùng Tiêu Đề In Hoa Dày Cộm Vô Cảm**: Tiêu đề section dùng `font-medium normal-case tracking-tight`. Không dùng `font-extrabold uppercase` kiểu chợ búa.
3. **Quy Tắc "The Half-Padding Sandwich"**: Mọi thẻ `<section>` dùng `py-8 sm:py-12 lg:py-16`. Cấm dùng padding thô khổng lồ `py-24`, `py-32`.
4. **Không Thêm `py-*` Vào Khung Tỷ Lệ Cố Định**: Khung ảnh hoặc Hero có `aspect-[16/9]`, `aspect-[3/4]` tuyệt đối không nhận padding thô trên thẻ bọc.
5. **Giữ Thẻ Sản Phẩm Trạng Thái Nghỉ Sạch 100%**: Chỉ bao gồm Ảnh 3:4 + Tên 1 dòng + Giá tiền. Không cắm badge giảm giá, mã số `[01]`, rating sao lên ảnh tĩnh.
6. **Zero Outer Margin Của Thẻ Con**: Component con (Card, Item, Button) luôn đặt `m-0` ở thẻ root. Mọi khoảng cách đều do thẻ cha quản lý qua `gap-*` và `p-*`.
7. **Biểu Tượng Nét Mảnh Hairline ($1.25\text{px}$)**: Chỉ dùng icon nét mảnh `stroke-[1.25]`. Tuyệt đối không dùng nét thô $2\text{px}$ hoặc emoji làm icon.
8. **Triệt Tiêu Đổ Bóng Nhân Tạo (Zero Drop-Shadow)**: Dùng `shadow-none`. Phân cách các bề mặt nổi bằng đường kẻ viền 1px `border-border`.
9. **Bảo Toàn Luồng Hành Vi Khách Hàng (CRO Continuity)**: Không tự ý xóa nút điều hướng, phân trang, nút xem tất cả làm người dùng mất phương hướng.
10. **Không Dùng Chữ/Ảnh Giả Rác (No Dummy Slop)**: Dùng dữ liệu sản phẩm thực tế, có tên gọi cụ thể, ảnh mẫu thật; không dùng "Lorem ipsum" hay hình SVG vẽ tay méo mó.

---

## 9. Golden Reference Code Mẫu (Chuẩn Studio Huashu)

### A. Thẻ Sản Phẩm Chuẩn Biên Tập (Editorial Product Card TSX)
```tsx
import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  alternateImage?: string;
  category?: string;
  onQuickAdd?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

export const PureEditorialProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  alternateImage,
  category,
  onQuickAdd,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative flex flex-col m-0 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Khung Ảnh Tỷ Lệ 3:4 Phẳng Hoàn Toàn */}
      <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden">
        {/* Ảnh chính */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
            alternateImage && isHovered ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />

        {/* Ảnh Lookbook phụ (chỉ hiện khi hover) */}
        {alternateImage && (
          <img
            src={alternateImage}
            alt={`${name} Lookbook`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Nút Yêu Thích Mờ Dần Khi Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(id);
          }}
          aria-label="Thêm vào danh sách yêu thích"
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-[2px] text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-error"
        >
          <Heart className={`w-3.5 h-3.5 stroke-[1.25] ${isWishlisted ? 'fill-error text-error' : ''}`} />
        </button>

        {/* Thanh Mua Nhanh Trượt Lên Khi Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd?.(id);
            }}
            className="w-full py-2.5 bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.2em] rounded-[2px] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5 stroke-[1.25]" />
            Mua Nhanh
          </button>
        </div>
      </div>

      {/* Thông Tin Sản Phẩm: 100% Plus Jakarta Sans */}
      <div className="flex flex-col mt-2.5">
        {category && (
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
            {category}
          </span>
        )}
        <h3 className="text-sm font-normal tracking-[-0.01em] text-foreground truncate mt-0.5">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs sm:text-sm font-medium tracking-wider text-foreground tabular-nums">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-[11px] text-muted-foreground line-through tabular-nums">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
```

### B. Tiêu Đề Section Chuẩn Hiện Đại (Modern Editorial Section Header)
```tsx
import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
}

export const ModernEditorialSectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actionText,
  actionHref,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 sm:mb-12 border-b border-border/60 gap-4">
      <div className="flex flex-col">
        {eyebrow && (
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground mb-1.5">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.02em] text-foreground leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm font-light text-muted-foreground mt-1 max-w-[540px] [text-wrap:pretty]">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <a
          href={actionHref || '#'}
          className="inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors group"
        >
          {actionText}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1.5">
            →
          </span>
        </a>
      )}
    </div>
  );
};
```

### C. Trường Nhập Liệu Hairline Liền Mạch (Seamless Hairline Form Input)
```tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SeamlessNewsletterProps {
  onSubscribe: (email: string) => void;
}

export const SeamlessNewsletterInput: React.FC<SeamlessNewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px]">
      <div className="relative flex items-center border-b border-border focus-within:border-foreground transition-colors duration-300 pb-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="NHẬP ĐỊA CHỈ EMAIL CỦA BẠN..."
          className="w-full bg-transparent text-xs font-normal tracking-[0.15em] uppercase text-foreground placeholder:text-muted-foreground/50 outline-none pr-8"
        />
        <button
          type="submit"
          aria-label="Đăng ký nhận bản tin"
          className="absolute right-0 p-1 text-foreground hover:translate-x-1 transition-transform duration-200"
        >
          <ArrowRight className="w-3.5 h-3.5 stroke-[1.25]" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground tracking-wide mt-2">
        Đăng ký để nhận thông tin sớm về các bộ sưu tập giới hạn. Không spam.
      </p>
    </form>
  );
};
```