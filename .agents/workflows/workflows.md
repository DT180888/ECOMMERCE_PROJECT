---
description: ## Agent Workflow & Skill Guidelines  Khi nhận yêu cầu về tính năng mới hoặc refactor lớn, TUYỆT ĐỐI KHÔNG nhảy vào code ngay. Bắt buộc tuân thủ quy trình 5 giai đoạn sau:
---

### Giai đoạn 1: Phản biện & Bóc tách (Challenge Phase)
- Kích hoạt: `/grill-me` (hoặc `/grill-me-docs` nếu có dùng thư viện/tài liệu bên ngoài).
- Agent chất vấn về: Edge cases, API contract, State management, Data models, và tác động tới kiến trúc hiện tại.
- Chỉ chuyển sang bước tiếp theo khi người dùng đã trả lời và chốt phương án rõ ràng.

### Giai đoạn 2: Thiết kế giao diện (Design Phase - Dành riêng cho FE/UI)
- Kích hoạt: `/huashu-design` (bỏ qua nếu là task thuần Backend/API/Database).
- Đề xuất hoặc dựng bản nháp về layout, bảng màu, typography, responsive và micro-interactions.
- Chốt cấu trúc component và trải nghiệm người dùng trước khi viết tài liệu kỹ thuật.

### Giai đoạn 3: Đặc tả & Bẻ nhỏ công việc (Spec & Ticket Breakdown)
1. **Lập Spec kỹ thuật:** Kích hoạt `/to-spec`.
   - Sinh file tại: `docs/agents/specs/[tính-năng].md`.
   - Bắt buộc làm rõ: User Stories, Scope, Technical Decisions, UI Structure (nếu có FE) và API Contract/Schema chi tiết (nếu có BE).
2. **Chia nhỏ Tickets:** Kích hoạt `/to-tickets`.
   - Chuyển Spec thành các ticket độc lập theo chiều dọc (Vertical Slices: Schema/Types -> Logic/API -> UI -> Test).
   - Lưu danh sách ticket vào hệ thống issue tracker hoặc thư mục `docs/agents/tickets/`.

### Giai đoạn 4: Thực thi có kiểm soát (Execution & Debugging)
- Kích hoạt: `/implement` cho từng ticket một.
- Mỗi ticket phải chạy kiểm tra type, linter và build/test thành công trước khi chuyển sang ticket tiếp theo.
- **Xử lý sự cố (Nếu gặp bug/fail test):** 
  - KHÔNG sửa bừa. Kích hoạt ngay `/diagnosing-bugs`.
  - Phân tích nguyên nhân gốc rễ (root cause) dựa trên giả thuyết và log kiểm chứng trước khi đưa ra bản fix.

### Giai đoạn 5: Nghiệm thu & Chuyển giao (Delivery Phase)
- Kích hoạt: `/pr`.
- Tự động kiểm tra `git diff`, tóm tắt các thay đổi kỹ thuật, liệt kê checklist kiểm thử và sinh mô tả Pull Request chuẩn chỉ để người dùng review.