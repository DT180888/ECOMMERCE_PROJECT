import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "@app/layouts/AuthLayout";
import AdminLayout from "@app/layouts/AdminLayout";

// Auth Pages
import LoginPage from "@pages/auth/LoginPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";

// Admin Pages
import DashboardPage from "@pages/admin/dashboard/DashboardPage";
import { CatalogSettingsPage } from "@pages/admin/catalog/CatalogSettingsPage";

// Admin - Category
import CategoryListPage from "@pages/admin/category/CategoryListPage";
import CategoryFormPage from "@pages/admin/category/CategoryFormPage";

// Admin - Brand
import BrandListPage from "@pages/admin/brand/BrandListPage";
import BrandFormPage from "@pages/admin/brand/BrandFormPage";

// Admin - Attribute
import AttributeListPage from "@pages/admin/attribute/AttributeListPage";
import AttributeFormPage from "@pages/admin/attribute/AttributeFormPage";

// Admin - Product
import ProductListPage from "@pages/admin/product/ProductListPage";
import ProductFormPage from "@pages/admin/product/ProductFormPage";
import AdminProductDetailPage from "@pages/admin/product/AdminProductDetailPage";
import SkuListPage from "@pages/admin/product/SkuListPage";

// Admin - Order
import { AdminOrderListPage } from "@pages/admin/order/AdminOrderListPage";
import { AdminOrderDetailPage } from "@pages/admin/order/AdminOrderDetailPage";

// Admin - User
import { AdminUserListPage } from "@pages/admin/user/AdminUserListPage";

// Admin - Security
import { AdminSecurityPage } from "@pages/admin/security/AdminSecurityPage";

// Admin - Promotion
import { PromotionListPage } from "@pages/admin/promotion/PromotionListPage";
import { PromotionFormPage } from "@pages/admin/promotion/PromotionFormPage";
import { PromotionDetailPage } from "@pages/admin/promotion/PromotionDetailPage";

// Admin - Hero Slide
import HeroSlideListPage from "@pages/admin/hero-slide/HeroSlideListPage";
import HeroSlideFormPage from "@pages/admin/hero-slide/HeroSlideFormPage";

// Admin - Collection
import { AdminCollectionsPage } from "@pages/admin/collection/AdminCollectionsPage";

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

      // Categoryư
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

  // Fallback 404 (Optional)
  { path: "*", element: <RootRedirect /> },
]);

export default router;