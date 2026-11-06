import { lazy, useEffect } from "react";
import { createBrowserRouter, Navigate, useParams, useNavigate } from "react-router-dom";

// Layouts (Static for persistent outer frames)
import AuthLayout from "@app/layouts/AuthLayout";
import AdminLayout from "@app/layouts/AdminLayout";

// Guards
import AuthGate from "./AuthGate";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

// Auth Pages (Lazy)
const LoginPage = lazy(() => import("@pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("@pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@pages/auth/ResetPasswordPage"));

// Admin Pages (Lazy)
const DashboardPage = lazy(() => import("@pages/dashboard/DashboardPage"));
const ReportsPage = lazy(() => import("@pages/reports/ReportsPage"));
const AbandonedCartsPage = lazy(() => import("@pages/cart/AbandonedCartsPage"));
const ReviewListPage = lazy(() => import("@pages/review/ReviewListPage"));
const RfmSegmentsPage = lazy(() => import("@pages/rfm/RfmSegmentsPage"));
const AutomationPage = lazy(() => import("@pages/automation/AutomationPage"));

// Category
const CategoryListPage = lazy(() => import("@pages/category/CategoryListPage"));

// Brand
const BrandListPage = lazy(() => import("@pages/brand/BrandListPage"));

// Attribute
const AttributeListPage = lazy(() => import("@pages/attribute/AttributeListPage"));

// Product
const ProductListPage = lazy(() => import("@pages/product/ProductListPage"));
const ProductFormPage = lazy(() => import("@pages/product/ProductFormPage"));
const ProductDetailPage = lazy(() => import("@pages/product/ProductDetailPage"));
const SkuListPage = lazy(() => import("@pages/product/SkuListPage"));

// Order
const OrderListPage = lazy(() => import("@pages/order/OrderListPage"));
const OrderDetailPage = lazy(() => import("@pages/order/OrderDetailPage"));

// User
const UserListPage = lazy(() => import("@pages/user/UserListPage"));

// Security
const SecurityPage = lazy(() => import("@pages/security/SecurityPage"));

// Promotion
const PromotionListPage = lazy(() => import("@pages/promotion/PromotionListPage"));

// Hero Slide
const HeroSlideListPage = lazy(() => import("@pages/hero-slide/HeroSlideListPage"));
const HeroSlideFormPage = lazy(() => import("@pages/hero-slide/HeroSlideFormPage"));

// Collection
const CollectionListPage = lazy(() => import("@pages/collection/CollectionListPage"));

function LegacyDrawerRedirect({ resource }: { resource: string }) {
  const { "*": rest, id } = useParams();
  const nav = useNavigate();
  useEffect(() => {
    const target = rest || id;
    if (target === "new") {
      nav(`/admin/${resource}?action=create`, { replace: true });
    } else if (target) {
      nav(`/admin/${resource}?edit=${target}`, { replace: true });
    } else {
      nav(`/admin/${resource}`, { replace: true });
    }
  }, [rest, id, nav, resource]);
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // --- ADMIN PANEL ---
  {
    path: "/admin",
    element: (
      <AuthGate>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </AuthGate>
    ),
    children: [
      { index: true, element: <RootRedirect /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "reports", element: <ReportsPage /> },

      // Catalog Settings (Redirect to Category)
      { path: "catalog-settings", element: <Navigate to="/admin/category" replace /> },

      // Category
      { path: "category", element: <CategoryListPage /> },
      { path: "category/*", element: <LegacyDrawerRedirect resource="category" /> },

      // Brand
      { path: "brand", element: <BrandListPage /> },
      { path: "brand/*", element: <LegacyDrawerRedirect resource="brand" /> },

      // Attribute
      { path: "attribute", element: <AttributeListPage /> },
      { path: "attribute/*", element: <LegacyDrawerRedirect resource="attribute" /> },

      // Product
      { path: "product", element: <ProductListPage /> },
      { path: "product/*", element: <ProductFormPage /> },
      { path: "product/:id/detail", element: <ProductDetailPage /> },
      { path: "skus", element: <SkuListPage /> },

      // Orders (Admin View)
      { path: "orders", element: <OrderListPage /> },
      { path: "orders/:id", element: <OrderDetailPage /> },
      { path: "abandoned-carts", element: <AbandonedCartsPage /> },
      { path: "reviews", element: <ReviewListPage /> },

      // CRM Phase 3: RFM & Marketing Automation
      { path: "customers/rfm-segments", element: <RfmSegmentsPage /> },
      { path: "automation/triggers", element: <AutomationPage /> },

      // Users
      { path: "users", element: <UserListPage /> },
      { path: "listUsers", element: <Navigate to="/admin/users" replace /> },
      { path: "security", element: <SecurityPage /> },

      // Promotions
      { path: "promotion", element: <PromotionListPage /> },
      { path: "promotion/new", element: <Navigate to="/admin/promotion?action=create" replace /> },
      { path: "promotion/:id", element: <LegacyDrawerRedirect resource="promotion" /> },

      // Hero Slides
      { path: "hero-slides", element: <HeroSlideListPage /> },
      { path: "hero-slides/new", element: <HeroSlideFormPage /> },
      { path: "hero-slides/:id", element: <HeroSlideFormPage /> },

      // Collection
      { path: "collection", element: <CollectionListPage /> },
    ],
  },

  { path: "*", element: <RootRedirect /> },
]);

export default router;
