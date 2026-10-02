import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PageLoader from "@components/common/PageLoader";

// Layouts
import MainLayout from "@app/layouts/MainLayout";
import AuthLayout from "@app/layouts/AuthLayout";
import AccountLayout from "@app/layouts/AccountLayout";

// Client Pages (Lazy Loaded)
const HomePage = lazy(() => import("@pages/HomePage"));
const CatalogPage = lazy(() => import("@pages/catalog/CatalogPage"));
const ProductDetailPage = lazy(() => import("@pages/product/ProductDetailPage"));
const CartPage = lazy(() => import("@pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("@pages/checkout/CheckoutPage"));
const PaymentResultPage = lazy(() => import("@pages/checkout/PaymentResultPage"));

// Auth Pages (Lazy Loaded)
const LoginPage = lazy(() => import("@pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@pages/auth/RegisterPage"));
const ConfirmEmailPage = lazy(() => import("@pages/auth/ConfirmEmailPage"));
const ForgotPasswordPage = lazy(() => import("@pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@pages/auth/ResetPasswordPage"));

// Account Pages (Lazy Loaded)
const UserProfilePage = lazy(() => import("@pages/account/user/UserProfilePage"));
const OrderHistoryPage = lazy(() => import("@pages/account/order/OrderHistoryPage"));
const OrderConfirmationPage = lazy(() => import("@pages/account/order/OrderConfirmationPage"));
const MyVouchersPage = lazy(() => import("@pages/account/vouchers/MyVouchersPage"));
const AccountDashboardPage = lazy(() => import("@pages/account/AccountDashboardPage"));

// Guards
import AuthGate from "./AuthGate";
import ProtectedRoute from "./ProtectedRoute";

// Helper to wrap lazy components with Suspense fallback
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    // --- MAIN CLIENT APP ---
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: "catalog", element: withSuspense(CatalogPage) },
      { path: "product/:slug", element: withSuspense(ProductDetailPage) },
      { path: "cart", element: withSuspense(CartPage) },

      // Account Section
      {
        path: "account",
        element: (
          <ProtectedRoute roles={["Admin", "Staff", "Customer"]}>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: withSuspense(AccountDashboardPage) },
          { path: "profile", element: withSuspense(UserProfilePage) },
          { path: "orders", element: withSuspense(OrderHistoryPage) },
          { path: "orders/:id", element: withSuspense(OrderConfirmationPage) },
          { path: "vouchers", element: withSuspense(MyVouchersPage) },
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
      { path: "login", element: withSuspense(LoginPage) },
      { path: "register", element: withSuspense(RegisterPage) },
      { path: "confirm-email", element: withSuspense(ConfirmEmailPage) },
      { path: "setup-password", element: withSuspense(ConfirmEmailPage) },
      { path: "forgot-password", element: withSuspense(ForgotPasswordPage) },
      { path: "reset-password", element: withSuspense(ResetPasswordPage) },
    ],
  },

  // --- CHECKOUT (Minimal Layout) ---
  {
    path: "/checkout",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute roles={["Admin", "Staff", "Customer"]}>
            {withSuspense(CheckoutPage)}
          </ProtectedRoute>
        ),
      },
      { path: "result", element: withSuspense(PaymentResultPage) },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;