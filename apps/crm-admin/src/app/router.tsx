import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "@app/layouts/AuthLayout";
import AdminLayout from "@app/layouts/AdminLayout";

// Auth Pages
import LoginPage from "@pages/auth/LoginPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";

// Admin Pages
import DashboardPage from "@pages/dashboard/DashboardPage";
import { CatalogSettingsPage } from "@pages/catalog/CatalogSettingsPage";

// Category
import CategoryListPage from "@pages/category/CategoryListPage";
import CategoryFormPage from "@pages/category/CategoryFormPage";

// Brand
import BrandListPage from "@pages/brand/BrandListPage";
import BrandFormPage from "@pages/brand/BrandFormPage";

// Attribute
import AttributeListPage from "@pages/attribute/AttributeListPage";
import AttributeFormPage from "@pages/attribute/AttributeFormPage";

// Product
import ProductListPage from "@pages/product/ProductListPage";
import ProductFormPage from "@pages/product/ProductFormPage";
import AdminProductDetailPage from "@pages/product/AdminProductDetailPage";
import SkuListPage from "@pages/product/SkuListPage";

// Order
import { AdminOrderListPage } from "@pages/order/AdminOrderListPage";
import { AdminOrderDetailPage } from "@pages/order/AdminOrderDetailPage";

// User
import { AdminUserListPage } from "@pages/user/AdminUserListPage";

// Security
import { AdminSecurityPage } from "@pages/security/AdminSecurityPage";

// Promotion
import { PromotionListPage } from "@pages/promotion/PromotionListPage";
import { PromotionFormPage } from "@pages/promotion/PromotionFormPage";
import { PromotionDetailPage } from "@pages/promotion/PromotionDetailPage";

// Hero Slide
import HeroSlideListPage from "@pages/hero-slide/HeroSlideListPage";
import HeroSlideFormPage from "@pages/hero-slide/HeroSlideFormPage";

// Collection
import { AdminCollectionsPage } from "@pages/collection/AdminCollectionsPage";

// Guards
import AuthGate from "./AuthGate";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

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

      // Catalog Settings
      { path: "catalog-settings", element: <CatalogSettingsPage /> },
      
      // Brand
      { path: "brand", element: <BrandListPage /> },
      { path: "brand/*", element: <BrandFormPage /> },

      // Category
      { path: "category", element: <CategoryListPage /> },
      { path: "category/*", element: <CategoryFormPage /> },

      // Attribute
      { path: "attribute", element: <AttributeListPage /> },
      { path: "attribute/*", element: <AttributeFormPage /> },

      // Product
      { path: "product", element: <ProductListPage /> },
      { path: "product/*", element: <ProductFormPage /> },
      { path: "product/:id/detail", element: <AdminProductDetailPage /> },
      { path: "skus", element: <SkuListPage /> },

      // Orders (Admin View)
      { path: "orders", element: <AdminOrderListPage /> },
      { path: "orders/:id", element: <AdminOrderDetailPage /> },

      // Users (Admin View)
      { path: "listUsers", element: <AdminUserListPage /> },
      { path: "security", element: <AdminSecurityPage /> },

      // Promotions
      { path: "promotion", element: <PromotionListPage /> },
      { path: "promotion/new", element: <PromotionFormPage /> },
      { path: "promotion/:id", element: <PromotionDetailPage /> },

      // Hero Slides
      { path: "hero-slides", element: <HeroSlideListPage /> },
      { path: "hero-slides/new", element: <HeroSlideFormPage /> },
      { path: "hero-slides/:id", element: <HeroSlideFormPage /> },

      // Collection
      { path: "collection", element: <AdminCollectionsPage /> },
    ],
  },

  { path: "*", element: <RootRedirect /> },
]);

export default router;