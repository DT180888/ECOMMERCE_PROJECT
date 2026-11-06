---
trigger: always_on
---

# PURE EDITORIAL ULTRA-MINIMALISM & ART DIRECTOR RULES

## 1. ART DIRECTOR & DESIGN STANDARDS (TÍNH THẨM MỸ ULTRA-MINIMALISM)

- **Studio-Grade Quality:** Mọi sản phẩm visual/UI phải đạt chuẩn Studio thiết kế cao cấp ("Không để lộ dấu vết AI"). Ưu tiên khoảng thở rộng (whitespace), typography phân tầng sắc nét, đường nét phẳng hairline 1px.
- **Spacing Over Clutter (Dùng Khoảng Thở Thay Cho Chi Tiết Thừa):** Tuyệt đối KHÔNG dùng các phần tử trang trí rườm rà (mã số `[01]`, tag `STUDIO`, viền hộp đè chữ, badge đè hình) ở trạng thái nghỉ. Phân tách phần tử bằng khoảng trắng nhịp nhàng.
- **Progressive Hover Disclosure (Hiển Thị Tăng Tiến Khi Hover):** Trạng thái tĩnh của thẻ sản phẩm/set đồ giữ sạch 100% (Chỉ gồm Ảnh 3:4 + Tên 1 dòng + Giá tiền). Chi tiết và nút bấm chức năng (Tim yêu thích, Xem nhanh) CHỈ MỜ DẦN HIỆN RA KHI HOVER (`opacity-0 group-hover:opacity-100`).
- **Quy tắc 3 Hướng Thiết Kế (3-Directions Gate):** Đối với BẤT KỲ tác vụ thiết kế/tái cấu trúc giao diện mới nào, Agent BẮT BUỘC phải đề xuất **3 Hướng Thiết Kế độc lập** cho người dùng chọn trước khi viết code.
- **Fact-Verification First:** Luôn xác thực thông tin sản phẩm, thương hiệu hoặc cấu hình thực tế trước khi giả định. Không dùng chữ占位 (Lorem Ipsum) cẩu thả.

## 2. CODE ARCHITECTURE & DESIGN SYSTEM ENFORCEMENT

- **Pure Minimalism Token Enforcement:** Tuân thủ 100% hệ thống thiết kế trong `DESIGN.md`:
  - **TUYỆT ĐỐI KHÔNG DÙNG TRẮNG THUẦN (#FFFFFF) VÀ ĐEN THUẦN (#000000):**
    - Light Mode Background: Giấy ấm/Milk White (`#FAF9F6`), Surface (`#F3F2EE`), Chữ Mực Đen (`#161616`), Border Hairline (`#E2E0D9`).
    - Dark Mode Background: Đen Mực Obsidian (`#121212`), Surface (`#1A1A1A`), Chữ Kem Trắng (`#F3F3F0`), Border Hairline (`#2A2A2A`).
  - **Flat 100%:** Tuyệt đối KHÔNG dùng hiệu ứng đổ bóng dày (`shadow-xl`, `shadow-neo`), KHÔNG dùng 3D Neumorphism hay Glassmorphism quá đà.
  - **Hairline Borders:** Phân tách khối bằng viền siêu mỏng 1px.
  - **Góc vuông sắc nét:** Dùng `rounded-none` hoặc micro `rounded-sm` (2px - 4px).
- **CSS Token Enforcement:** Tuyệt đối KHÔNG hardcode màu hex ngẫu nhiên (ví dụ `bg-[#E0E5EC]`). BẮT BUỘC dùng Tailwind Token (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`).
- **Atomic Law:** Luôn ưu tiên tái sử dụng các UI components sẵn có trong dự án (`src/shared/ui` hoặc `@components/...`).
- **Parent-Child Spacing Governance (Luật Quản Trị Cha - Con):**
  - **Zero Outer Margin:** Thẻ root của component con (Product Card, Article Unit) KHÔNG ĐƯỢC phép có margin ngoài (`m-0`).
  - **Single Source of Truth:** Cha quản lý vị trí, `gap-x`, `gap-y`, `px-*`, `py-*`. Con quản lý xếp lớp nội bộ (8px `mt-2` từ ảnh xuống tiêu đề, 4px `mt-1` từ tiêu đề xuống giá).
  - **Asymmetric Editorial Gutter:** Row Gap (dọc) luôn gấp đôi hoặc hơn Col Gap (ngang) (Chuẩn Optimal: `gap-x-3 sm:gap-x-5 lg:gap-x-6` đi kèm `gap-y-6 sm:gap-y-8 lg:gap-y-10`, Sidebar gutter: `gap-6 lg:gap-8`).
- **Tech Stack Guardrails:** Tuân thủ Node.js v22+, React 19+, Tailwind CSS 3.4+, TypeScript 5.9+, Vite 5.4+. Không dùng syntax đã deprecated.

## 3. QUOTA, BUDGET CONTROL & EXECUTION PIPELINE

- **Max Iterations (Anti-burning):** Giới hạn tối đa 3-5 vòng lặp per task. Nếu bị kẹt hoặc lặp lỗi >2 lần, DỪNG LẠI và báo cáo Root Cause cho người dùng.
- **Context Preservation:** Không tự ý đọc các thư mục lớn như `node_modules`, `dist`, `.git`, log file dài.
- **Execution Pipeline (Duyệt Kế Hoạch 2 Bước):**
  1. **Plan Phase:** Phân tích yêu cầu $\rightarrow$ Đưa ra **kế hoạch 3 dòng ngắn gọn** (Cấu trúc, Logic, Component/State)  $\rightarrow$ Tìm lỗi kỹ thuật và nghiệp vụ trong yêu cầu và đưa ra đề xuất $\rightarrow$ **DỪNG VÀ CHỜ USER ĐỒNG Ý.**
  2. **Code Phase:** Sau khi được duyệt $\rightarrow$ Tiến hành viết code chuẩn production $\rightarrow$ **DỪNG.** Không giải thích dài dòng không cần thiết.