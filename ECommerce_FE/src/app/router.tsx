// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@app/layouts/MainLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import LoginPage from "@pages/LoginPage";
import ProtectedRoute from "@app/ProtectedRoute";
import HomePage from "@pages/HomePage";


import ConfirmEmailPage from "@pages/auth/ConfirmEmailPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@pages/auth/ChangePasswordPage";
import RegisterPage from "@pages/auth/RegisterPage";


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
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: "/confirm-email",
    element: <AuthLayout />,
    children: [{ index: true, element: <ConfirmEmailPage /> }],
  },
  {
    path: "/forgot-password",
    element: <AuthLayout />,
    children: [{ index: true, element: <ForgotPasswordPage /> }],
  },
  {
    path: "/reset-password",
    element: <AuthLayout />,
    children: [{ index: true, element: <ResetPasswordPage /> }],
  },
]);

export default router;   // <-- quan trọng
