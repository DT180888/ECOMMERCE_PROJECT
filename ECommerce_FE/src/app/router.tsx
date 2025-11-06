// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@app/layouts/MainLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import ProtectedRoute from "@app/ProtectedRoute";
import HomePage from "@pages/HomePage";


import ConfirmEmailPage from "@pages/auth/ConfirmEmailPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@pages/auth/ChangePasswordPage";
import RegisterPage from "@pages/auth/RegisterPage";
import CatalogPage from "@pages/catalog/catalogPage";
import ProductDetailPage from "@pages/product/ProductDetailPage";


const router = createBrowserRouter([
 {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
       {
        path: "catalog", // Path: /catalog
        element: <CatalogPage />,
      },
      { 
        path: "/product/:slug",
        element: <ProductDetailPage />,
      }
    ],
  },
    {
    path: "/auth", // Đây là path gốc chung cho tất cả các route xác thực
    element: <AuthLayout />, // AuthLayout sẽ bao bọc tất cả các trang con
    children: [
      {
        path: "login", // Sẽ là /auth/login
        element: <LoginPage />,
      },
      {
        path: "register", // Sẽ là /auth/register
        element: <RegisterPage />,
      },
      {
        path: "confirm-email", // Sẽ là /auth/confirm-email
        element: <ConfirmEmailPage />,
      },
      {
        path: "forgot-password", // Sẽ là /auth/forgot-password
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password", // Sẽ là /auth/reset-password
        element: <ResetPasswordPage />,
      },
    ],
  },
 
]);

export default router;   // <-- quan trọng
