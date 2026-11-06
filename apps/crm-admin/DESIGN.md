# Editorial Minimalist Design System Specification
## CRM Admin — E-Commerce Enterprise Platform

> Tài liệu đặc tả kỹ thuật và hệ thống thiết kế (Design System) chuẩn hóa cho **CRM Admin Web Application**, được xây dựng trên nền tảng **React 19 + Tailwind CSS 3.4 + TypeScript 5.9 + Vite**.

---

## 1. Triết lý & Nguyên tắc Thiết kế (Design Principles)

Hệ thống thiết kế CRM Admin tuân thủ triệt để triết lý **Pure Editorial Ultra-Minimalism (Tối giản Biên tập Đỉnh cao)**, đạt chuẩn Studio thiết kế quốc tế và loại bỏ hoàn toàn các dấu vết rập khuôn ("AI Slop" & "Generic Corporate Template"):

1. **Studio-Grade Quality (Chuẩn mực Studio Thiết kế):**
   - Khoảng thở rộng rãi (generous whitespace), cấu trúc typography phân tầng sắc nét, đường nét phẳng hairline 1px tinh xảo.
   - Không dùng các phần tử trang trí rườm rà (mã số giả lập, tag trang trí thừa, viền hộp đè chữ, badge đè hình).
2. **Spacing Over Clutter (Khoảng thở thay cho Chi tiết thừa):**
   - Phân tách các khối thông tin bằng nhịp điệu khoảng trắng có chủ đích thay vì dùng card đóng khung dày đặc.
   - Áp dụng nguyên tắc **Asymmetric Editorial Gutter**: Khoảng cách dòng (Row Gap) luôn gấp đôi hoặc hơn khoảng cách cột (Col Gap) để tạo dòng chảy thị giác tự nhiên khi đọc dữ liệu bảng biểu.
3. **Progressive Hover Disclosure (Hiển thị tăng tiến khi tương tác):**
   - Trạng thái tĩnh của bảng biểu, thẻ dữ liệu, danh sách khách hàng luôn giữ sạch sẽ tối đa (chỉ hiển thị thông tin cốt lõi).
   - Các nút thao tác phụ (sao chép, chỉnh sửa nhanh, menu hành động, nút xóa) chỉ mờ dần hiện ra khi rê chuột (`opacity-0 group-hover:opacity-100 transition-opacity duration-150`).
4. **Flat 100% & Hairline Precision (Phẳng 100% & Viền siêu mỏng):**
   - Tuyệt đối không dùng đổ bóng dày (`shadow-lg`, `shadow-xl`, `shadow-neo`), không Neumorphism hay Glassmorphism bóng bẩy.
   - Phân định không gian bằng viền hairline siêu mỏng 1px và tương phản nền tinh tế.
5. **Accessible by Measurement (Đạt chuẩn đo lường WCAG AA):**
   - Mọi cặp màu văn bản / nền đều đạt tỷ lệ tương phản tối thiểu **4.5:1** (WCAG AA). Chế độ tương phản cao đạt tối thiểu **7:1**.
   - Trạng thái focus outline bằng bàn phím rõ ràng, sắc nét với `ring-1 ring-ring ring-offset-1`.

---

## 2. Design Tokens: Màu sắc (Color Tokens)

Hệ thống màu sắc tuân thủ triệt để nguyên lý **Cinematic Neutral Tonal Depth** (chuẩn mực YouTube Dark Mode với độ sâu sắc tố than đá tự nhiên, không ám xanh tím) kết hợp kỹ thuật **Light-Catching Alpha Borders** và Inverted Neutral Studio Light Mode. Tỷ lệ tương phản quang học giữa Card (`#212121`) và Canvas (`#0F0F0F`) đạt mức dứt khoát **$1.38 : 1$**, giúp khối dữ liệu tách biệt hoàn hảo mà không cần viền đóng hộp.

### 2.1. Bảng màu Nền & Phân tầng Quang học (Surface & Canvas Tokens)

| Token Ngữ nghĩa | Dark Mode (YouTube Pure Charcoal) | Light Mode (Inverted Neutral Studio) | Mô tả & Vị trí Áp dụng |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#0F0F0F` (Đen than điện ảnh sâu thẳm) | `#F1F1F1` (Xám trung tính êm mắt) | Nền đáy toàn bộ màn hình ứng dụng |
| `bg-surface` | `#161616` (Nền Header, Sidebar) | `#E5E5E5` | Nền thanh Sidebar, Header, panel phân cấp |
| `bg-surface-elevated` | `#212121` (Thẻ Card nổi bật 1.38:1) | `#FFFFFF` | Thẻ Card con, Table row, khối dữ liệu nổi |
| `bg-surface-modal` | `#282828` | `#FFFFFF` | Cửa sổ hội thoại nổi, Command Menu (⌘K), Popover |
| `bg-surface-hover` | `#2F2F2F` | `#D8D8D8` | Trạng thái hover của các hàng, danh sách item |

### 2.2. Hệ thống Kiểu chữ & Độ tương phản (Typography Tokens)

| Token Ngữ nghĩa | Dark Mode Token | Light Mode Token | Tương phản WCAG | Mô tả & Vị trí Áp dụng |
| :--- | :--- | :--- | :---: | :--- |
| `text-primary` | `#F1F1F1` (~95% white) | `#0F0F0F` (Mực than Ink) | **16 : 1** (AAA) | Tiêu đề Issue/Đơn hàng, số liệu KPI quan trọng |
| `text-secondary`| `#AAAAAA` | `#606060` | **9.5 : 1** (AAA) | Nhãn phụ, tiêu đề bảng, thuộc tính quan trọng |
| `text-tertiary` | `#717171` (Muted) | `#909090` | **5.0 : 1** (AA) | Mã SKU (`ORD-123`), timestamp, placeholder |
| `text-disabled` | `#4A4A4A` | `#B0B0B0` | **2.6 : 1** | Trạng thái vô hiệu hóa |

### 2.3. Hệ thống Viền Bắt sáng Alpha (Light-Catching Borders)

| Token Ngữ nghĩa | Giá trị Dark Mode | Giá trị Light Mode | Ứng dụng & Ngữ cảnh |
| :--- | :--- | :--- | :--- |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` | Viền chia các hàng trong bảng (`border-b`), divider nội bộ |
| `border-default`| `rgba(255, 255, 255, 0.10)` | `rgba(0, 0, 0, 0.10)` | Viền ngoài của Card, Sidebar divider (`border-r`) |
| `border-strong` | `rgba(255, 255, 255, 0.20)` | `rgba(0, 0, 0, 0.20)` | Viền ô Input, viền Modal khi nhận tương tác |
| `border-focus`  | `#3EA6FF` (YouTube Blue)    | `#065FD4` | Vòng outline khi đối tượng nhận tiêu điểm bàn phím |

### 2.4. Màu Thương hiệu & Trạng thái (Brand & Semantic Roles)

| Nhóm Role | Dark Mode Token | Light Mode Token | Ứng dụng trong CRM |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#3EA6FF` (Hover `#65B8FF`) | `#065FD4` (Hover `#044BB0`) | Nút bấm chính (CTA), tab active, thanh tiến trình |
| **Success** | `#4ADE80` | `#2E7D32` | Đơn hàng hoàn tất, thanh toán thành công, stock dồi dào |
| **Warning** | `#FBBF24` | `#B45309` | Cảnh báo sắp hết hàng, đơn chờ xử lý lâu |
| **Destructive / Error** | `#F87171` | `#C5221F` | Hủy đơn, xóa dữ liệu, khiếu nại khách hàng |
| **Info** | `#3EA6FF` | `#065FD4` | Thông báo hệ thống, ghi chú vận chuyển |

> [!IMPORTANT]
> **CSS Token Enforcement:** Tuyệt đối không hardcode mã màu hex trực tiếp trong JSX/TSX. Toàn bộ giao diện bắt buộc dùng Tailwind Tokens: `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`.

---

## 3. Typography: Hệ thống Kiểu chữ

### 3.1. Font Stacks
- **Tiêu đề & Trưng bày (Display & Editorial Headers):**
  - Font gia đình: `Newsreader`, `Playfair Display`, `Inter`, `-apple-system`, `sans-serif`
  - Mang lại hơi thở biên tập (editorial craft), sang trọng và tách biệt khỏi các dashboard thông thường.
- **Văn bản Thao tác & Giao diện (UI Body & Controls):**
  - Font gia đình: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
  - Đảm bảo độ rõ nét tối đa ở kích thước nhỏ (12px – 14px) với thuộc tính `text-wrap: pretty`.
- **Dữ liệu Kỹ thuật, SKU & Tiền tệ (Monospace & Metrics):**
  - Font gia đình: `JetBrains Mono`, `Cascadia Code`, `SF Mono`, `monospace`
  - Áp dụng `font-variant-numeric: tabular-nums` cho toàn bộ số tiền, mã SKU và tỷ lệ phần trăm.

### 3.2. Bảng phân cấp Typography (Type Scale)

| Role | Kích thước | Line Height | Weight | Tracking | Mục đích sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | 36px (2.25rem) | 44px (1.2) | Bold (700) | -0.025em | Banner báo cáo quý, tiêu đề trang Overview |
| `heading-1` | 28px (1.75rem) | 36px (1.3) | SemiBold (600)| -0.02em | Tiêu đề chính màn hình (Order Details, RFM) |
| `heading-2` | 22px (1.375rem)| 28px (1.3) | SemiBold (600)| -0.015em| Tiêu đề nhóm chức năng, Sheet Header |
| `heading-3` | 18px (1.125rem)| 24px (1.35)| Medium (500) | -0.01em | Tiêu đề Card dữ liệu, Drawer Inspector |
| `body-large` | 15px (0.9375rem)| 22px (1.45)| Regular (400) | 0.0em | Đoạn tóm tắt khách hàng, ghi chú CSKH |
| `body` | 14px (0.875rem) | 20px (1.45)| Regular (400) | 0.0em | **Cỡ chữ tiêu chuẩn toàn bộ hệ thống CRM** |
| `body-small` | 12px (0.75rem)  | 16px (1.35)| Regular (400) | 0.0em | Dữ liệu hàng trong bảng, thông tin phụ |
| `caption / label` | 11px (0.6875rem)| 14px (1.3) | Medium (500) | +0.05em | Header cột bảng, Badge (Uppercase) |
| `monospace` | 12px (0.75rem)  | 16px (1.35)| Regular (400) | 0.0em | Mã đơn hàng, Mã SKU, Tracking code |

---

## 4. Spacing, Geometry & Bố cục (Layout Governance)

### 4.1. Parent-Child Spacing Governance (Luật Quản trị Cha - Con)
- **Zero Outer Margin:** Thẻ root của component con (`ProductCard`, `OrderRow`, `MetricTile`) **tuyệt đối không mang margin ngoài (`m-0`)**.
- **Single Source of Truth:** Vị trí, `gap-x`, `gap-y`, `p-*` do component Cha quyết định hoàn toàn. Con chỉ quản lý cấu trúc nội bộ:
  - 8px (`mt-2`) từ ảnh/icon xuống tiêu đề.
  - 4px (`mt-1`) từ tiêu đề xuống mô tả/giá tiền.
- **Asymmetric Editorial Gutter:** Row Gap (dọc) luôn gấp đôi hoặc lớn hơn Col Gap (ngang):
  - Chuẩn Grid: `gap-x-4 sm:gap-x-6` đi kèm `gap-y-8 sm:gap-y-10`.
  - Layout chia cột Sidebar / Workspace: `gap-6 lg:gap-8`.

### 4.2. Thang đo khoảng cách (4px Grid Spacing)
- `step-1`: `4px` (Khoảng cách icon và text trong badge/button)
- `step-2`: `8px` (Khoảng cách giữa các chip bộ lọc)
- `step-3`: `12px` (Padding trong input compact, table cell ngang)
- `step-4`: `16px` (Padding tiêu chuẩn bên trong Card và Panel)
- `step-6`: `24px` (Khoảng cách giữa các phân khu chức năng)
- `step-8`: `32px` (Padding ngoài trang làm việc chính)
- `step-12`: `48px` | `step-16`: `64px` (Khoảng thở giữa các block báo cáo)

### 4.3. Bán kính bo góc (Corner Radius)
Thiết kế hướng tới sự sắc sảo, dứt khoát của kiến trúc hiện đại:
- `rounded-none`: `0px` (Mặc định cho Data Table, SplitPane, Tabs line)
- `rounded-sm`: `2px – 4px` (Button, Input, Badge, Tag, Dropdown Menu)
- `rounded-md`: `6px` (Modal Dialog, Drawer Panel)
- Tuyệt đối không dùng `rounded-2xl`, `rounded-3xl` hoặc bo tròn bóng nước quá đà trên giao diện quản trị.

### 4.4. Chiều cao Tiêu chuẩn Controls (Control Standard Heights)
Mọi control nhập liệu và thao tác (`Button`, `Input`, `Select`, `DateRangePicker`) chuẩn hóa theo 3 kích thước:
- **`small`**: Chiều cao `28px` (Dùng cho Toolbar, bảng mật độ cao, filter strip).
- **`medium`**: Chiều cao `34px` (**Mặc định toàn hệ thống** cho hầu hết các trang quản trị).
- **`large`**: Chiều cao `40px` (Dùng cho ô tìm kiếm chính, form luồng tạo mới đơn/sản phẩm).

### 4.5. Quy chuẩn Tiết kiệm Viền & Tương phản Sắc độ (Tonal Boundaries vs Borders)
Nhằm giảm thiểu tối đa sự ngột ngạt của viền đóng hộp ("Box Clutter"), hệ thống ưu tiên phân định không gian bằng **Tonal Shift (chênh lệch sắc độ nền)** và **Whitespace** thay vì viền 4 cạnh:

1. **Thành phần KHÔNG TƯƠNG TÁC (Non-Interactive): Tuyệt đối CẤM đóng hộp 4 cạnh (`border` bao quanh):**
   - **Thẻ KPI / MetricTile / Khối thông tin tĩnh:** Không dùng viền 4 cạnh (`border-0`). Phân tách hoàn toàn bằng độ chênh màu nền `bg-surface` nổi trên `bg-background` kết hợp khoảng thở (`gap-4` đến `gap-6`).
   - **Panel / Section lớn:** Tránh đóng khung hộp trong hộp ("nested borders").
2. **Ngoại lệ DUY NHẤT cho Thành phần Tĩnh: Viền Trục Đơn 1 Cạnh (Single-Edge Axis):**
   - **Hàng trong Bảng dữ liệu (`AdminTable` row):** Bắt buộc dùng `border-b border-border` giữa các dòng để chống trượt mắt khi quét số liệu hàng ngang. **Tuyệt đối cấm kẻ viền dọc (`border-r`)** chia từng ô như bảng tính Excel.
   - **Trục phân vùng cấu trúc (Structural Spine):** Sidebar dùng `border-r border-border`; Header dùng `border-b border-border`.
3. **Thành phần TƯƠNG TÁC (Interactive): Mang viền 1px để tạo Affordance:**
   - **Form Controls (`Input`, `Select`, `Textarea`):** Dùng `border border-border` (hoặc nền `bg-surface-tertiary` kèm `border-strong` khi focus) để biểu thị rõ ràng vùng có thể nhập liệu.
   - **Nút bấm dạng Outline / Secondary:** Viền 1px để phân biệt với nút phẳng (Ghost/Text).
   - **Focus & Validation:** Giữ nguyên `1px` viền, cấm nâng lên `border-2` (tránh layout shift); chỉ đổi màu (`border-destructive`) hoặc dùng `ring-1 ring-ring`.

---

## 5. Elevation & Phẳng 100% (Flat & Hairline System)

Hệ thống loại bỏ hoàn toàn các lớp đổ bóng dày nhiều tầng, ứng dụng phân tầng phẳng thông qua độ tương phản nền và viền hairline:

| Cấp độ | Giá trị Border / Shadow | Vị trí Áp dụng & Phân định Ngữ cảnh |
| :---: | :--- | :--- |
| **0 (Flat Tonal)** | `border-0 bg-surface shadow-none` | Thẻ MetricTile, Khối tóm tắt tĩnh, KPI Cards (Tonal contrast) |
| **0 (Flat Axis)** | `border-b` hoặc `border-r border-border shadow-none` | Hàng Data Table (`border-b`), Vách Sidebar (`border-r`), Header (`border-b`) |
| **0 (Interactive Flat)** | `border border-border shadow-none` | Ô nhập liệu (`Input`, `Select`), Nút Outline |
| **1 (Hairline Focus)** | `border-foreground/30 ring-1 ring-ring/20 shadow-none` | Input đang active, Thẻ click được khi hover |
| **2 (Float Micro)** | `border border-border shadow-sm` *(0 1px 2px rgba(0,0,0,0.05))* | Dropdown Menu, Tooltip, Popover trôi nổi |
| **3 (Elevated Sheet)**| `border border-border shadow-md` *(0 4px 12px rgba(0,0,0,0.08))* | Modal Confirm Dialog, Drawer Inspector |

---

## 6. Chuyển động & Hiệu ứng (Motion & Animation)

- **Nguyên tắc:** Chuyển động cực ngắn, tinh tế, đóng vai trò phản hồi trạng thái tương tác chứ không mang tính trình diễn.
- **Thời lượng chuẩn:**
  - `duration-fast`: `100ms` (Hover button, checkbox check, active tab)
  - `duration-normal`: `150ms` (Mở dropdown, hiển thị tooltip, đổi pageview)
  - `duration-drawer`: `200ms – 250ms` (Drawer trượt vào từ mép phải với easing `ease-out`)
- **Tối ưu hiệu năng:** Toàn bộ hiệu ứng hover sử dụng `opacity` và `transform` với phần cứng gia tốc (`will-change: opacity`).

---

## 7. Hệ thống Biểu tượng (Iconography Engine)

- **Thư viện chuẩn:** `lucide-react`.
- **Quy cách đồ họa:** Kích thước `16px` (tiêu chuẩn cạnh text 14px) và `18px – 20px` (header, navigation).
- **Độ dày nét (Stroke Width):** Hairline `1.5px` đến `1.75px` để giữ vẻ thanh thoát, không dùng nét dày `2.5px+`.
- **Màu sắc icon:** Kế thừa màu chữ `currentColor`, hỗ trợ biến đổi màu tự động theo theme và trạng thái.

---

## 8. Danh mục 109 Web UI Components (Taxonomy)

Phân loại 109 thành phần giao diện xây dựng trên hệ sinh thái React 19:

```
CRM Admin Component Library (109 components)
│
├── 1. Actions & Buttons
│   ├── Button (variants: primary, secondary, outline, ghost, destructive, link)
│   ├── IconButton, SplitActionButton, LoadingButton, CopyButton, ButtonGroup
│
├── 2. Form & Data Entry
│   ├── Input, ClearableInput, PasswordInput, NumberInput, SearchInput
│   ├── Textarea, TagInput, CurrencyInput, PercentageInput, FormField, FormLabel, FormMessage
│
├── 3. Selection & Toggles
│   ├── Checkbox, RadioGroup, RadioGroupItem, Switch
│   ├── Select, SelectTrigger, SelectContent, SelectItem, MultiSelectCombobox
│   ├── Slider, SegmentedControl, DatePicker, DateRangePicker
│
├── 4. Navigation & Wayfinding
│   ├── AdminHeader, AdminBreadcrumb, Sidebar, SidebarNav, SidebarItem, SidebarActiveAdmins
│   ├── TabList, TabTrigger, TabContent, Pagination, ViewSwitcher (Table vs Cards)
│   ├── DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, CommandPalette
│
├── 5. Data Display & Typography
│   ├── MetricTile, MetricTrendBadge, AdminStatusBadge, Avatar, AvatarGroup, Tag, Badge
│   ├── EmptyState, ResultMessage, Separator, Kbd, Tooltip, TooltipContent
│   ├── Timeline, TimelineItem, ProgressBar, CircularProgress, Skeleton, SkeletonRow
│
├── 6. Data Tables & Grids (High-Density)
│   ├── AdminDataView, AdminTable, TableHeader, TableRow, TableHead, TableCell
│   ├── TableSortIndicator, TableColumnFilter, TableRowSelection, TablePaginationStrip
│   ├── AdminHorizontalCard, ActionCell, EditableCell
│
├── 7. Feedback & Overlays
│   ├── Alert, AlertTitle, AlertDescription, Toast, ToastAction
│   ├── ModalDialog, ConfirmDialog, DrawerSheet, SplitPaneInspector, LoadingOverlay
│
├── 8. Layout Shells
│   ├── AdminLayout, AdminPageShell, AdminMobileHeader, AdminMobileBottomBar
│   ├── Container, Stack, Grid, SplitterPanel, ScrollArea, SystemIsland
│
└── 9. E-Commerce Domain Modules
    ├── Customer360Sheet, RfmMatrixGrid, OrderTimelineCard, OrderShipmentCard
    ├── ProductVariantMatrix, StockThresholdBadge, PromotionRuleBuilder, ReviewSentimentTag
    ├── AbandonedCartRecoveryPanel, AutomationWorkflowNode
```

---

## 9. Cơ chế Áp dụng Theme & Kiến trúc Mã nguồn (Web Architecture)

1. **Kiến trúc Token hai tầng (CSS Variables + Tailwind):**
   - Tầng 1: Định nghĩa các CSS Custom Properties dạng HSL hoặc HEX trong `@packages/ui/src/themes/admin.css`.
   - Tầng 2: Ánh xạ vào `tailwind.config.js` của ứng dụng qua các utility classes: `bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-primary`.
2. **Cơ chế Đổi Theme (Light / Dark Mode):**
   - Chuyển đổi thông qua class `.dark` gắn tại thẻ `<html>` gốc.
   - Thời gian chuyển đổi tức thì (<16ms, 60fps), không gây layout shift hay giật lag.
3. **Mẫu Cấu hình Tailwind Theme Extension:**
   ```javascript
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           background: "hsl(var(--background) / <alpha-value>)",
           foreground: "hsl(var(--foreground) / <alpha-value>)",
           surface: "hsl(var(--surface) / <alpha-value>)",
           border: "hsl(var(--border) / <alpha-value>)",
           primary: {
             DEFAULT: "hsl(var(--primary) / <alpha-value>)",
             foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
           },
         },
         borderRadius: {
           sm: "2px",
           DEFAULT: "4px",
           md: "6px",
           none: "0px",
         },
       },
     },
   };
   ```
