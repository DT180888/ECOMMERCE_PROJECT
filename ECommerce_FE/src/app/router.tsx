// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@app/layouts/MainLayout";
import ProtectedRoute from "@app/ProtectedRoute";
import HomePage from "@pages/HomePage";
import CatalogPage from "@pages/catalog/catalogPage";
import ProductDetailPage from "@pages/product/ProductDetailPage";

import AuthLayout from "@app/layouts/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import ConfirmEmailPage from "@pages/auth/ConfirmEmailPage";
import ForgotPasswordPage from "@pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@pages/auth/ChangePasswordPage";
import RegisterPage from "@pages/auth/RegisterPage";


import AdminLayout from "./layouts/AdminLayout";
import BrandListPage from "@pages/admin/brand/BrandListPage";
import BrandFormPage from "@pages/admin/brand/BrandFormPage";
import CategoryListPage from "@pages/admin/category/CategoryListPage";
import CategoryFormPage from "@pages/admin/category/CategoryFormPage";
import ProductListPage from "@pages/admin/product/ProductListPage";
import ProductFormPage from "@pages/admin/product/ProductFormPage";

const router = createBrowserRouter([
 {  //Main
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
 {  //Auth
  path: "/auth", 
  element: <AuthLayout />,
  children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register", 
        element: <RegisterPage />,
      },
      {
        path: "confirm-email", 
        element: <ConfirmEmailPage />,
      },
      {
        path: "forgot-password", 
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password", 
        element: <ResetPasswordPage />,
      },
  ],
 },
 {
  path: "/admin",
  element: 
  <ProtectedRoute>
    <AdminLayout/>
  </ProtectedRoute>,
  children:[
    { path: "brand", element: <BrandListPage /> },
    { path: "brand/*", element: <BrandFormPage /> }, 
    // // Category
    { path: "category", element: <CategoryListPage /> },
    { path: "category/*", element: <CategoryFormPage /> },
    // // Product
    { path: "product", element: <ProductListPage /> },
    { path: "product/*", element: <ProductFormPage /> },
  ]
 },
]);

export default router;
