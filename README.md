# E-Commerce Monorepo (Web Apps & Mobile App) 🚀

Hệ thống Frontend Web và Mobile Application cho dự án thương mại điện tử E-Commerce. Dự án được tổ chức dạng **Monorepo** quản lý bởi [Turborepo](https://turbo.build/) và `npm workspaces`, giúp tối ưu hóa việc chia sẻ code, types, helpers và UI components giữa Web và App Mobile.

---

## 📁 Cấu trúc Thư mục Monorepo

```text
ECommerce_FE/
├── apps/
│   ├── ecommerce-client/     # Storefront Bán hàng cho Khách hàng (Vite + React + Tailwind)
│   ├── crm-admin/            # Trang Quản trị Admin / CRM (Vite + React + FireCMS / UI)
│   └── E-mobile-app/         # Khách hàng & Quản lý trên Mobile App (React Native + Expo Router)
├── packages/
│   ├── ui/                   # Các UI Components dùng chung
│   └── shared-utils/         # Hàm Helper, Types, Formatters, Validators (Zod/Yup) dùng chung
├── package.json              # Monorepo root config & npm workspaces
├── turbo.json                # Cấu hình Turborepo pipeline (build, dev, lint)
└── README.md
```

---

## 🛠 Thư viện & Công nghệ Sử dụng

* **Nền tảng Monorepo**: Node.js (`>=18`), npm Workspaces, Turborepo 2.x
* **Web Client & Admin**: React 19, TypeScript 5.x, Vite, TailwindCSS, Zustand / React Query
* **Mobile App**: React Native (v0.81), Expo (v54), Expo Router, NativeWind / TailwindCSS
* **Shared Packages**: `@my-project/shared-utils`, `@my-project/ui`

---

## 💻 Hướng dẫn Khởi chạy Cục bộ (Local Development)

### 1. Yêu cầu Tiên quyết
* **Node.js**: phiên bản `>=18.x`
* **npm**: phiên bản `>=9.x`
* **Expo Go** trên điện thoại (hoặc Android Emulator / iOS Simulator) nếu muốn chạy Mobile App.

### 2. Cài đặt Dependencies
Tại thư mục gốc `ECommerce_FE`:
```bash
npm install
```

### 3. Lệnh Khởi chạy (Development Scripts)

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy **TẤT CẢ** ứng dụng (`web-client`, `crm-admin`, `E-mobile-app`) cùng lúc |
| `npm run dev:web` | Khởi chạy riêng trang **Storefront Khách hàng** (`ecommerce-client`) |
| `npm run dev:admin` | Khởi chạy riêng trang **Admin CRM** (`crm-admin`) |
| `npm run dev:mobile` | Khởi chạy server **Expo Mobile App** (`E-mobile-app`) |
| `npm run build` | Build tất cả ứng dụng Web để chuẩn bị deploy |
| `npm run lint` | Chuyển qua toàn bộ codebase để kiểm tra lỗi Linting |

---

## 📦 Sử dụng Shared Packages

### Thêm Helper / Utility / Type dùng chung
Tất cả các định nghĩa TypeScript Interfaces, hàm format tiền tệ, hàm gọi API hoặc validator có thể đặt tại `packages/shared-utils/src`.

### Import trong Web & Mobile:
```typescript
// Trong apps/ecommerce-client hoặc apps/E-mobile-app
import { formatCurrency, ProductType } from '@my-project/shared-utils';
```

---

## 🚢 Hướng dẫn Triển khai (Deployment Guide)

### 1. Triển khai Web Apps (`ecommerce-client` & `crm-admin`)
Các ứng dụng Web được đóng gói thành các file tĩnh (Static SPA) thông qua Vite:

* **Build ứng dụng**:
  ```bash
  # Build Web Client
  npx turbo run build --filter=@my-project/ecommerce-client
  
  # Build CRM Admin
  npx turbo run build --filter=@my-project/crm-admin
  ```
* **Deploy lên Vercel / Netlify**:
  - Root Directory: `ECommerce_FE`
  - Build Command: `npx turbo run build --filter=@my-project/ecommerce-client` (hoặc crm-admin)
  - Output Directory: `apps/ecommerce-client/dist` (hoặc `apps/crm-admin/dist`)

* **Deploy bằng Docker Container / Nginx**:
  Sử dụng Nginx container để phục vụ thư mục `dist/` sau khi build.

---

### 2. Triển khai Mobile App (`E-mobile-app`)
Ứng dụng Mobile được xây dựng và đóng gói bằng **Expo Application Services (EAS Build)**:

* **Cài đặt EAS CLI**:
  ```bash
  npm install -g eas-cli
  eas login
  ```

* **Build file APK Android (Thử nghiệm / Sắp phát hành)**:
  ```bash
  cd apps/E-mobile-app
  eas build -p android --profile preview
  ```

* **Build cho Google Play / App Store (Production)**:
  ```bash
  cd apps/E-mobile-app
  eas build -p android --profile production
  eas build -p ios --profile production
  ```

---

## ⚙️ Cấu hình Môi trường (Environment Variables)

Tạo file `.env` tại từng thư mục `apps/*`:

* **`apps/ecommerce-client/.env`**:
  ```env
  VITE_API_BASE_URL=https://api.yourdomain.com/api
  ```
* **`apps/crm-admin/.env`**:
  ```env
  VITE_API_BASE_URL=https://api.yourdomain.com/api
  ```
* **`apps/E-mobile-app/.env`**:
  ```env
  EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
  ```
