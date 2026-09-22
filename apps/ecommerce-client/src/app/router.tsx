import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "@app/layouts/MainLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import AccountLayout from "@app/layouts/AccountLayout";

// Client Pages
import HomePage from "@pages/client/HomePage";
import CatalogPage from "@pages/client/catalog/catalogPage";
import ProductDetailPage from "@pages/client/product/ProductDetailPage";
import CartPage from "@pages/client/cart/CartPage";
import CheckoutPage from "@pages/client/checkout/CheckoutPage";
import PaymentResultPage from "@pages/client/checkout/PaymentResultPage";

// Auth Pages
import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ConfirmEmailPage from "@pages/auth/ConfirmEmailPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";

// Account Pages
import UserProfilePage from "@pages/client/account/user/UserProfilePage";
import OrderHistoryPage from "@pages/client/account/order/OrderHistoryPage";
import OrderConfirmationPage from "@pages/client/account/order/OrderConfirmationPage";
import MyVouchersPage from "@pages/client/account/vouchers/MyVouchersPage";
import AccountDashboardPage from "@pages/client/account/AccountDashboardPage";

// Guards
import AuthGate from "./AuthGate";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    // --- MAIN CLIENT APP ---
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "product/:slug", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },

      // Account Section
      {
        path: "account",
        element: (
          <ProtectedRoute roles={["Admin", "Staff", "Customer"]}>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AccountDashboardPage /> },
          { path: "profile", element: <UserProfilePage /> },
          { path: "orders", element: <OrderHistoryPage /> },
          { path: "orders/:id", element: <OrderConfirmationPage /> },
          { path: "vouchers", element: <MyVouchersPage /> },
        ],
      },
    ],
  },

  // --- AUTHENTICATION ---
  {
    path: "/auth",
    element: (
      <AuthGate>
        <AuthLayout />
      </AuthGate>
    ),
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "confirm-email", element: <ConfirmEmailPage /> },
      { path: "setup-password", element: <ConfirmEmailPage /> }, // Alias cho confirm-email
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // --- CHECKOUT (Minimal Layout) ---
  {
    path: "/checkout",
    element: <MainLayout />, // Hoặc Layout riêng nếu muốn ẩn Header/Footer
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute roles={["Admin", "Staff", "Customer"]}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      { path: "result", element: <PaymentResultPage /> },
    ],
  },

  // Fallback 404 (Optional)
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;