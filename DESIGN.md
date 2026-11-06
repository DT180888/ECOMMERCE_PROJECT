---
name: Modern Slate & Tech Cobalt CRM Admin Design System
style_philosophy: Modern Architectural Minimalism & High-Density Operations
typography_family: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
layout_architecture: Dynamic Inset Fluid Shell
---

# Enterprise CRM Design System Specification

## 1. Master Semantic Color Tokens (Modern Slate & Tech Cobalt)

Tất cả bảng điều khiển, lưới số liệu và luồng quản trị dữ liệu bắt buộc sử dụng 100% semantic token (CSS variables / Tailwind utility classes). Không sử dụng mã màu hex cố định hoặc màu thuần (`#000`, `#FFF`, `bg-black`, `text-black`).

| Semantic Token | Light Mode | Dark Mode | Vai trò & Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| `background` | `#F8F9FA` | `#0B0F17` | **Canvas toàn trang**: Nền bao bọc App Shell, vùng lề ngoài Inset Panel |
| `card` | `#FFFFFF` | `#151B26` | **Bề mặt Inset Panel**: Bảng dữ liệu, hàng chẵn (`even`), Modal, Drawer |
| `surface-subtle` | `#F1F3F5` | `#1F2736` | **Bề mặt phụ**: Sidebar, Inset Sub-header, hàng lẻ Zebra (`odd`), Toolbars |
| `surface-hover` | `#E9ECEF` | `#2A3547` | Trạng thái hover tương tác trên hàng của Data Table, item danh sách |
| `foreground` | `#0F172A` | `#F8FAFC` | **Mực đọc chính (WCAG AAA 16.8:1)**: Tiêu đề báo cáo, số liệu KPI, tên Lead |
| `muted-foreground` | `#475569` | `#94A3B8` | Nhãn phụ, mã định danh Lead ID, timestamp, metadata giao dịch |
| `subtle` | `#94A3B8` | `#64748B` | Placeholder form, icon vô hiệu hóa, chỉ mục thứ cấp |
| `border` | `#E2E8F0` | `#263042` | Hairline border 1px kiến trúc cho Table cell, Input, Sidebar divider |
| `border-muted` | `#EDF2F7` | `#1A2230` | Phân cách hairline siêu mỏng giữa các cụm metadata con |
| `primary` | `#2563EB` | `#3B82F6` | **Action CTA chính (10% Focus)**: Xuất dữ liệu, tạo Lead, Checkbox active |
| `primary-hover` | `#1D4ED8` | `#60A5FA` | Trạng thái hover nút Primary CTA |
| `primary-foreground`| `#FFFFFF` | `#FFFFFF` | Chữ/icon trong nút Primary (Tương phản tuyệt đối) |
| `status-lead-new` | `#0284C7` | `#38BDF8` | Badge Lead mới tiếp nhận (Sky Blue) |
| `status-in-progress`| `#D97706` | `#FBBF24` | Đang thương thảo, chờ phản hồi (Amber) |
| `status-won` | `#16A34A` | `#4ADE80` | Chốt Deal thành công, hợp đồng đã ký (Emerald) |
| `status-lost` | `#DC2626` | `#F87171` | Thất bại, hủy hợp đồng, nợ xấu (Ruby Red) |

---

## 2. Thang Khoảng Cách 4pt & Bảng Tra Cứu Nghiêm Ngặt

| Token | Kích thước | Utility Class | Phạm vi áp dụng |
| :--- | :--- | :--- | :--- |
| `space-3xs` | $2\text{px}$ | `gap-0.5`, `p-0.5` | Đệm badge hairline, icon chỉ báo xu hướng micro |
| `space-2xs` | $4\text{px}$ | `gap-1`, `mt-1` | Nhãn KPI xuống số liệu; khoảng cách tag micro |
| `space-xs` | $6\text{px}$ | `gap-1.5`, `py-1.5`| Đệm ô nhập liệu compact, đệm cell table mật độ cao |
| `space-sm` | $8\text{px}$ | `gap-2`, `p-2` | Khoảng cách icon & text; đệm cell table chuẩn |
| `space-md` | $12\text{px}$ | `gap-3`, `p-3` | Padding thanh Filter Bar; khoảng cách giữa các cột trong Form |
| `space-lg` | $16\text{px}$ | `gap-4`, `p-4` | Padding nội bộ Card KPI; padding Header bảng dữ liệu |
| `space-xl` | $20\text{px}$ | `gap-5`, `p-5` | Khoảng cách nhóm trong modal, drawer chi tiết |
| `space-2xl` | $24\text{px}$ | `gap-6`, `p-6` | Lớp đệm an toàn Inset Page Canvas (`p-4 sm:p-6`) |
| `space-3xl` | $32\text{px}$ | `gap-8`, `p-8` | Khoảng cách phân đoạn khối thống kê chính |

---

## 3. Toán Học Spacing & Hệ Tiên Đề Gestalt

Mọi cự ly trong hệ thống vận hành theo chuỗi phụ thuộc số học, ngăn chặn việc đặt giá trị ngẫu nhiên.

### A. Hệ Tiên Đề Bất Đẳng Thức Phân Cấp (Hierarchical Inequality)
Càng lồng sâu vào trong, cự ly càng phải thu hẹp lại:
$$\mathbf{P_{\text{Page}}} \ge \mathbf{P_{\text{Container}}} > \mathbf{G_{\text{Section}}} > \mathbf{G_{\text{Group}}} > \mathbf{G_{\text{Item}}} \ge \mathbf{P_{\text{Item}}}$$

* $\mathbf{P_{\text{Page}}}$ (Lề lọt lòng Inset): $16\text{px} - 24\text{px}$ (`p-4` đến `p-6`).
* $\mathbf{P_{\text{Container}}}$ (Card/Inset Panel Padding): $16\text{px} - 24\text{px}$ (`p-4` đến `p-6`).
* $\mathbf{G_{\text{Section}}}$ (Khoảng cách giữa các Block): $24\text{px} - 32\text{px}$ (`gap-6` đến `gap-8`).
* $\mathbf{G_{\text{Group}}}$ (Cự ly giữa các Input/Filters): $12\text{px}$ (`gap-3`).
* $\mathbf{G_{\text{Item}}}$ (Cự ly Icon + Label, Dot + Text): $6\text{px} - 8\text{px}$ (`gap-1.5` đến `gap-2`).
* $\mathbf{P_{\text{Item}}}$ (Đệm Badge vi mô): $2\text{px} - 4\text{px}$ (`p-0.5` đến `p-1`).

### B. Tỷ Lệ Đệm Bề Mặt Ngăn Tràn Vực (The 1.5× Inset Ratio)
Khi đặt khoang đục lỗ recessed (`bg-background` hoặc input form) vào trong bề mặt `bg-card`:
$$\mathbf{P_{\text{Parent}}} \ge 1.5 \times \mathbf{P_{\text{Child}}}$$
*(Ví dụ: Thẻ con có $\mathbf{P}=12\text{px}$ (`p-3`) $\rightarrow$ Thẻ cha bắt buộc có $\mathbf{P} \ge 18\text{px}$, chuẩn hóa lên `p-6` ($24\text{px}$)).*

### C. Nhịp Thở Bất Đối Xứng (Asymmetric Scanning Rhythm)
Để duy trì luồng quét ngang của mắt trên bảng số liệu mà không bị đứt đoạn giữa các cột:
$$\mathbf{G_{\text{Row}}} \ge 2 \times \mathbf{G_{\text{Col}}}$$
* Trên bảng lưới Desktop: `gap-x-4 lg:gap-x-6` ($16\text{px} - 24\text{px}$) đi kèm `gap-y-8 lg:gap-y-12` ($32\text{px} - 48\text{px}$).

### D. Định Lý Triệt Tiêu Xung Đột Biên (The Half-Padding Sandwich)
Hai section cùng nền đặt kề nhau theo trục dọc bắt buộc triệt tiêu padding đỉnh của phần tử dưới để tránh dồn ứ khoảng trống:
$$\mathbf{P_{\text{Bottom}}}(C_1) = \texttt{pb-6}\ \text{hoặc}\ \texttt{pb-8}, \quad \mathbf{P_{\text{Top}}}(C_2) = \texttt{pt-0}$$

---

## 4. Kiến Trúc Inset Page Layout & Dynamic Co Giãn Theo Sidebar

Hệ thống kết hợp giữa **Mô hình Hòn đảo Thụ Lề (Inset Island)** và **Full-Bleed Fluid 100%** nhằm tối đa hóa diện tích hiển thị dữ liệu nhiều cột.

```
[Window Viewport: 100vw x 100vh overflow-hidden flex bg-background]
 ├── [Dynamic Sidebar (w-60 hoặc w-16 transition-[width])]
 └── [Main Content Shell (flex-1 min-w-0 flex flex-col)]
      ├── [Global App Header: h-14 bg-card border-b]
      └── [Inset Page Canvas: flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden]
           └── [Inner Inset Island: w-full flex-1 bg-card border rounded-lg flex flex-col overflow-hidden]
                ├── [Sticky Inset Toolbar: h-14 border-b px-6 bg-card shrink-0]
                ├── [Secondary Filter Strip: py-2.5 px-6 border-b bg-surface-subtle/50 shrink-0]
                ├── [Scrollable Data Grid View: flex-1 min-h-0 overflow-auto]
                └── [Sticky Inset Pagination: h-11 border-t px-6 bg-card shrink-0]
```

### Quy Chuẩn Kích Thước Khung Vùng Chứa:
* **Sidebar mở rộng (Expanded):** Cố định `w-60` ($240\text{px}$).
* **Sidebar thu gọn (Collapsed):** Cố định `w-16` ($64\text{px}$).
* **Workspace Width:** Tự thích ứng: $\text{Width} = 100\text{vw} - \text{Sidebar Width}$. Bắt buộc gán `flex-1 min-w-0` để chống phình layout do bảng dữ liệu rộng.
* **Data Grid Shell (Bảng dữ liệu):** **100% Full-Bleed** (`w-full`), loại bỏ toàn bộ `max-w-*`.
* **Record Detail / Prose Form (Chi tiết Lead / Điền biểu mẫu):** Giới hạn nội bộ `max-w-4xl mx-auto w-full` để chống mỏi mắt khi đọc chuỗi văn bản dài trên màn hình Ultrawide.
* **Mobile Viewport ($<640\text{px}$):** Chuyển lớp đệm ngoài thành `p-0` và `rounded-none` để tối ưu 100% không gian cảm ứng.

---

## 5. Phân Tầng Typography Đơn Font (100% Plus Jakarta Sans)

Tuyệt đối không dùng font thứ hai. Toàn bộ số liệu tài chính, thời gian và KPI bắt buộc dùng `tabular-nums`.

| Phân cấp | Size | Weight | Tracking | Leading | Utility Class Tailwind | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `metric-hero` | $28\text{px} - 32\text{px}$ | 600 | `-0.02em` | `1.1` | `text-2xl sm:text-3xl font-semibold tracking-tight text-foreground tabular-nums` | Tổng doanh thu, tổng số Lead |
| `heading-section`| $18\text{px} - 20\text{px}$ | 600 | `-0.01em` | `1.25`| `text-lg sm:text-xl font-semibold text-foreground` | Tiêu đề bảng biểu, tên Inset View |
| `label-th` | $11\text{px} - 12\text{px}$ | 600 | `+0.05em` | `1.0` | `text-xs font-semibold uppercase tracking-wider text-muted-foreground` | Header cột Data Table |
| `cell-primary` | $13\text{px} - 14\text{px}$ | 500 | `normal` | `1.35`| `text-sm font-medium text-foreground` | Tên công ty, tên liên hệ chính |
| `cell-secondary`| $12\text{px} - 13\text{px}$ | 400 | `normal` | `1.35`| `text-xs sm:text-[13px] font-normal text-muted-foreground` | Email, mã SKU, ghi chú meta |
| `metric-tabular` | $13\text{px} - 14\text{px}$ | 600 | `normal` | `1.2` | `text-sm font-semibold tabular-nums text-foreground` | Giá trị hợp đồng, tỷ lệ hoàn thành |
| `micro-badge` | $10\text{px} - 11\text{px}$ | 600 | `+0.02em` | `1.0` | `text-[11px] font-semibold tracking-wide uppercase` | Badge trạng thái Deal/Lead |

---

## 6. Quy Chuẩn Bảng Dữ Liệu & Mật Độ Hiển Thị (Data Grid)

### A. Chiều Cao Hàng Dữ Liệu (Density Modes)
* **Compact Row (Mật độ cao):** Chiều cao `h-9` ($36\text{px}$), `px-3 py-1.5`. Dành cho logs, lịch sử thao tác.
* **Standard Row (Tiêu chuẩn CRM):** Chiều cao `h-11` ($44\text{px}$), `px-3 py-2.5`. Dành cho danh sách Khách hàng, Lead, Deal.
* **Expanded Row (Kèm avatar/meta hai dòng):** Chiều cao `h-14` ($56\text{px}$), `px-4 py-3`.

### B. Căn Chỉnh Cột Chuẩn Hóa
* Cột văn bản (Tên, Email, Ghi chú): Căn lề trái (`text-left`).
* Cột số liệu, Tiền tệ, Ngày tháng: Bắt buộc căn lề phải (`text-right tabular-nums`).
* Cột Trạng thái, Checkbox: Bắt buộc căn giữa (`text-center`).

### C. Đường Phân Cách & Tương Tác
* Chỉ sử dụng đường kẻ ngang (`border-b border-border`). Cấm tuyệt đối đường kẻ dọc giữa các cột.
* Áp dụng `hover:bg-surface-hover` trên từng hàng để dẫn mắt chính xác khi rà chuột.

---

## 7. Quy Luật Quản Trị Component Con (Parent-Child Governance)

1. **Zero Outer Margin:** Mọi component con (Button, Input, Form Field, Badge, Tag) bắt buộc đặt `m-0` trên thẻ gốc. Thẻ cha toàn quyền quyết định cự ly thông qua `gap-*` hoặc `p-*`.
2. **Khoảng Trắng Thay Vì Đóng Hộp:** Không dùng border đóng hộp riêng lẻ từng cụm text nhỏ. Nhóm thông tin được định hình bằng khoảng cách `gap-1` hoặc `gap-2`.
3. **Nét Vẽ Icon:** Bắt buộc sử dụng nét mảnh đồng nhất `stroke-[1.5]`. Cấm dùng icon tô mảng (solid fill) cho các thao tác hàng ngày trừ khi ở trạng thái đang được chọn (active).