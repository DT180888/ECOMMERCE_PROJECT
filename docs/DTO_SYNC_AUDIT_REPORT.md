# Báo Cáo Kiểm Toán & Đối Chiếu Đồng Bộ DTO Giữa Backend Và Frontend
**Dự Án:** E-Commerce Micro-Monorepo (ECommerce_BE & ECommerce_FE)  
**Ngày Lập:** 06/10/2026  
**Nguyên Tắc Chuẩn (Source of Truth):** Backend (ECommerce_API - .NET Core Minimal API)  
**Tình Trạng Tổng Thể:** ✅ **ĐÃ ĐỒNG BỘ TOÀN DIỆN 100%** (Toàn bộ Phase 1, Phase 2 và Phase 3 đã hoàn thành; `turbo build` và `tsc -b` pass 100% không còn lỗi).

---

## 1. Tóm Tắt Mức Độ Ảnh Hưởng (Executive Summary)

| Mức Độ (Severity) | Số Lượng Đã Khắc Phục | Kết Quả Xử Lý |
| :--- | :---: | :--- |
| 🔴 **CRITICAL (Nghiêm Trọng)** | **14 / 14 Đã Khắc Phục** | Đã chuẩn hoá toàn bộ tên trường (như `imageUrl`, `shipToAddress`, `billToAddress`), cấu trúc nested (như `voucher.promotion.*`), params (`minPrice`, `maxPrice`, `sortBy`), logic gửi kèm `quantity >= 1` cho Cart, payload Stats KPI/Chart/Recent Orders. Không còn nguy cơ TypeError/Crash UI hay 400 Bad Request. |
| 🟡 **WARNING (Cảnh Báo)** | **8 / 8 Đã Khắc Phục** | Chuẩn hoá nullability, tương thích ngược bằng optional/fallback mapping, loại bỏ các payload thừa không cần thiết (như currency, extra attribute fields). |
| 🔵 **MISSING (Thiếu Sót API)** | **6 / 6 Đã Khắc Phục** | Đã bổ sung đầy đủ DTO và API client cho Admin Orders, Admin SKU CRUD, Product Reviews & Moderation, Inventories, Shipments và chuẩn hoá Promotions pagination. |

---

## 2. Bảng Ma Trận Chi Tiết Theo Từng Module (Detailed Audit Matrix)

### 2.1. Module Products (`Features/Products` vs `packages/api/src/product`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **PUT `/api/v1/products/{id}`** (`UpdateProductReq`) | `Name, Slug, Description, Status, BrandId, CategoryIds, CollectionIds, Attributes` | Bóc tách độc lập `skus` và `images` | ✅ **Đã Khắc Phục** | Đã loại bỏ `skus` và `images` khỏi `UpdateProductReq`. Tạo hàm xử lý tự động đồng bộ ảnh (`syncProductImages`) và API quản trị SKU riêng. |
| **GET `/api/v1/products`** (`ProductListParams`) | `[FromQuery] minPrice, maxPrice, sortBy, categorySlug, brandSlug, keyword, attrs, page, size, collectionSlug, promotionId` | Chuẩn hoá `minPrice`, `maxPrice`, `sortBy` | ✅ **Đã Khắc Phục** | Đã map tham số lọc giá và sắp xếp từ FE sang đúng định dạng Minimal API của BE. |
| **GET `/api/v1/products`** (`ProductCard` vs `ProductDto`) | `ProductDto` có `Description, Status` | Đã bổ sung `description`, `status` vào `ProductCard` | ✅ **Đã Khắc Phục** | Hỗ trợ đầy đủ hiển thị mô tả ngắn và trạng thái hoạt động trên UI. |
| **Admin SKU CRUD** (`Admin/Skus/`) | Endpoints: Create, Update, Delete, GetById, ListSkus theo `products/{id}/skus` | Đã bổ sung đầy đủ vào `product/api.ts` | ✅ **Đã Khắc Phục** | Đã tạo các hàm `createProductSku`, `updateProductSku`, `deleteProductSku`, `getProductSkuById`, `listProductSkus`. |

---

### 2.2. Module Categories (`Features/Categories` vs `packages/api/src/category`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **Category Image Naming** (`Category`, `CategoryNode`, `Create/UpdatePayload`) | Dùng **`ImageUrl`** (`imageUrl`) | Dùng `imageUrl` (duy trì `img` làm fallback) | ✅ **Đã Khắc Phục** | Chuẩn hóa `imageUrl` trong type, normalizer API và các component CRM Admin (`CategoryForm`, `CategoryList`, `CategoryFormPage`). |
| **GET `/api/v1/categories`** (`CategoryListParams`) | `sort` (chuỗi: `"name_asc"`, `"name_desc"`, `"id_asc"`, `"id_desc"`, `"featured"`) | Map composite sort string từ `sortBy` và `sortDirection` | ✅ **Đã Khắc Phục** | API client tự động ghép chuỗi `sort` chuẩn gửi lên BE. |

---

### 2.3. Module Attributes (`Features/Attributes` vs `packages/api/src/attribute`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **GET `/api/v1/attributes`** & **GET `/{id}`** (`Attribute`) | `AttributeItem: AttributeId, Name, Slug, DataType, Unit, IsFilterable, IsVariant, CreatedAt` | `options?: Option[]; isRequired?: boolean` | ✅ **Đã Khắc Phục** | Đặt `options?: Option[]` là tùy chọn, UI kiểm tra an toàn `(attr.options ?? [])` trước khi render. |

---

### 2.4. Module Carts (`Features/Carts` vs `packages/api/src/cart`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **PUT `/api/v1/cart/items/{id}`** (`UpdateCartItemReq`) | `Request(int Quantity, bool? IsSelected)` | Đảm bảo `quantity >= 1` luôn được gửi | ✅ **Đã Khắc Phục** | Hàm `apiUpdateCartItem` tự động kiểm tra và gán `quantity: Math.max(1, payload.quantity ?? 1)` khi toggle `isSelected`, loại bỏ triệt để lỗi 400 Bad Request từ FluentValidation của BE. |

---

### 2.5. Module Orders & Checkouts (`Features/Orders`, `Checkouts` vs `packages/api/src/order`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **GET `/api/v1/orders/{id}`** (`OrderDetail`) | `ShipToAddress: AddressDto?`, `BillToAddress: AddressDto?` | Khai báo `shipToAddress`, `billToAddress` (fallback alias `shipTo`, `billTo`) | ✅ **Đã Khắc Phục** | Chuẩn hóa type và normalizer đảm bảo cả 2 cách truy cập đều trả về dữ liệu địa chỉ hợp lệ. |
| **Status Text Mapping** (`OrderDetail`, `OrderStatus`) | Trả về enum số nguyên `byte Status` | Tự động tính toán `statusText` | ✅ **Đã Khắc Phục** | `normalizeOrderDetail` tự động tính chuỗi `statusText` qua helper `getOrderStatusConfig(order.status).label`. |
| **Admin Orders API** (`Features/Orders/Admin/`) | `GET /admin/orders`, `GET /admin/orders/{id}`, `PUT /admin/orders/{id}/status` | Đã bổ sung `apiGetAdminOrders`, `apiGetAdminOrderDetail`, `apiUpdateAdminOrderStatus` | ✅ **Đã Khắc Phục** | Đã tích hợp API thật vào `order/api.ts` và nối trực tiếp vào hook `apps/crm-admin/src/hooks/useOrder.ts`, loại bỏ mock data. |

---

### 2.6. Module Coupons (`Features/Coupons` vs `packages/api/src/coupon`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **GET `/api/v1/coupons/my-vouchers`** (`MyVoucherDto`) | Cấu trúc nested: `{ couponId, code, promotion: { name, type, value, startsAt, endsAt } }` | Khai báo `promotion?: PromotionSummaryDto` và normalizer làm phẳng | ✅ **Đã Khắc Phục** | Trang `MyVouchersPage.tsx` truy cập cả `voucher.promotion?.name` lẫn `voucher.promotionName` đều nhận đúng dữ liệu. |
| **`CouponDto` Properties** | `isRedeemed, redeemedAt` | Thống nhất `isRedeemed, redeemedAt` | ✅ **Đã Khắc Phục** | Khớp 100% schema backend. |

---

### 2.7. Module Stats (`Features/Stats` vs `packages/api/src/stats`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **GET `/api/v1/admin/stats/kpis`** (`AdminKpis`) | `totalOrders, totalRevenueMinor, averageOrderValueMinor, pendingPaymentsCount, totalProducts, totalCustomers` | Đồng bộ 100% với BE và cung cấp alias cho UI | ✅ **Đã Khắc Phục** | Khớp chính xác số liệu thống kê trên Dashboard Admin. |
| **GET `/api/v1/admin/stats/recent-orders`** (`RecentOrder`) | `OrderId, OrderNumber, Email, Status, TotalMinor, CreatedAt` | Map `customerName = order.email` | ✅ **Đã Khắc Phục** | Widget Recent Orders hiển thị thông tin email/khách hàng chính xác. |
| **GET `/api/v1/admin/stats/revenue-chart`** (`RevenueChartData`) | `RevenuePoint: Date, RevenueMinor, OrdersCount` | Map `revenue = point.revenueMinor` | ✅ **Đã Khắc Phục** | Biểu đồ doanh thu render dữ liệu chính xác. |

---

### 2.8. Module Uploads (`Features/Uploads` vs `packages/api/src/upload`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **POST `/api/v1/uploads/tmp`** (`UploadTempRes`) | `ImageStoredResult: url, path, contentType, sizeBytes` | Chuẩn hóa `url, path, contentType, sizeBytes` (fallback `size, originalName`) | ✅ **Đã Khắc Phục** | Đảm bảo tính tương thích tuyệt đối cho cả Cloudinary / Local upload storage. |

---

### 2.9. Module Collections (`Features/Collections` vs `packages/api/src/collection`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **POST `/api/v1/collections`** (`createCollection`) | Trả về `{ id: number }` | Trả về `{ id: number }` | ✅ **Đã Khắc Phục** | Khớp kiểu dữ liệu trả về từ backend endpoint. |

---

### 2.10. Module Users & Security (`Users`, `Security` vs `packages/api/src/auth`, `user`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **Phân Quyền User** (`apiAssignRole`) | `POST /api/v1/admin/users/{userId}/roles` (Body: `{ role: string }`) | Cập nhật hàm gọi đúng route admin với `userId` và `role` | ✅ **Đã Khắc Phục** | Loại bỏ lỗi 404 từ endpoint cũ không tồn tại. |

---

### 2.11. Module Promotions (`Features/Promotions` vs `packages/api/src/promotion`)

| Endpoint / DTO | BE Schema (.NET) | FE Schema (TypeScript) | Tình Trạng | Chi Tiết & Giải Pháp Đã Thực Hiện |
| :--- | :--- | :--- | :---: | :--- |
| **GET `/api/v1/promotions`** (`ListPromotions`) | Param `pageNumber`, `pageSize`, `search` | FE gửi `pageNumber`, `pageSize` thay vì `page`, `size` | ✅ **Đã Khắc Phục** | Khắc phục triệt để lỗi phân trang không nhận số trang trên backend Minimal API. |
| **POST `/api/v1/promotions`** (`CreatePromotion`) | Trả về `{ promotionId: number }` | Trả về `{ promotionId: number }` | ✅ **Đã Khắc Phục** | Đồng bộ chính xác Response type. |

---

### 2.12. Bổ Sung Các Modules Mới (Phase 3 Completed)

1. **Reviews Module (`packages/api/src/review`)**:
   - `createProductReview(productId, payload)` -> `POST /api/v1/products/{id}/reviews`
   - `listProductReviews(productId, params)` -> `GET /api/v1/products/{id}/reviews`
   - `listAdminReviews(params)` -> `GET /api/v1/admin/reviews`
   - `setReviewApproval(reviewId, isApproved)` -> `PATCH /api/v1/admin/reviews/{id}/approve`
   - `deleteAdminReview(reviewId)` -> `DELETE /api/v1/admin/reviews/{id}`
2. **Inventory Module (`packages/api/src/inventory`)**:
   - `getInventoryBySku(skuId)` -> `GET /api/v1/admin/inventory/{skuId}`
   - `updateInventoryBySku(skuId, payload)` -> `PATCH /api/v1/admin/inventory/{skuId}`
3. **Shipments Module (`packages/api/src/shipment`)**:
   - `updateShipmentTracking(shipmentId, payload)` -> `PATCH /api/v1/admin/shipments/{id}/tracking`
   - Khai báo enum `ShipmentStatus` (Pending, Shipped, InTransit, Delivered, Failed).

---

## 3. Checklist Kế Hoạch Khắc Phục (Action Plan Checklist)

- [x] **Phase 1: Sửa các lỗi Critical ảnh hưởng trực tiếp đến UI & Crash**
  - [x] **Categories:** Đổi `img` thành `imageUrl` trong `packages/api/src/category/types.ts` và cập nhật `sort` param composite mapping.
  - [x] **Orders:** Đổi `shipTo`, `billTo` thành `shipToAddress`, `billToAddress` trong `packages/api/src/order/types.ts`.
  - [x] **Coupons:** Cập nhật `MyVoucherDto` khớp cấu trúc lồng nhau (`voucher.promotion.name`, v.v.).
  - [x] **Products:** Cập nhật `ProductListParams` (`minPrice`, `maxPrice`, `sortBy`) và tách `skus`, `images` ra khỏi `UpdateProductReq`.
  - [x] **Stats:** Sửa toàn bộ type của `AdminKpis`, `RecentOrder`, `RevenueChartData` trong `packages/api/src/stats/types.ts`.
  - [x] **Uploads:** Cập nhật `UploadTempRes` sang `{ url, path, contentType, sizeBytes }`.
  - [x] **Carts:** Đảm bảo `apiUpdateCartItem` luôn gửi kèm `quantity >= 1` khi toggle `isSelected`.

- [x] **Phase 2: Sửa các API Routes & Endpoint Mismatch**
  - [x] Cập nhật `apiAssignRole` gọi đúng `POST /api/v1/admin/users/{userId}/roles`.
  - [x] Khai báo Admin Orders API (`apiGetAdminOrders`, `apiGetAdminOrderDetail`, `apiUpdateAdminOrderStatus`) vào `order/api.ts`.
  - [x] Thay thế mock mutation trong `apps/crm-admin/src/hooks/useOrder.ts` bằng API thật vừa khai báo.

- [x] **Phase 3: Bổ sung các DTO & API còn thiếu (New Feature Modules)**
  - [x] Tạo module `review/` trong `packages/api/src/` kết nối với `Features/Reviews` (Customer & Admin Moderation).
  - [x] Tạo module `inventory/` cho CRM Admin (`GET/PATCH /api/v1/admin/inventory/{skuId}`).
  - [x] Tạo module `shipment/` cho CRM Admin (`PATCH /api/v1/admin/shipments/{id}/tracking`).
  - [x] Thêm các hàm CRUD SKU chi tiết trong `product/api.ts`.
  - [x] Chuẩn hóa tham số phân trang `pageNumber`/`pageSize` trong `promotion/api.ts`.
  - [x] Export toàn bộ module mới trong `packages/api/src/index.ts`.
  - [x] Chạy kiểm tra `turbo run build` / `tsc -b`: **Thành công 100% không có lỗi**.
