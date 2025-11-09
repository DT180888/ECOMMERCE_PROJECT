import NeatBackground from "@shared/ui/NeatBackground";
import { Outlet, Link, useLocation } from "react-router-dom";


function getTitleForm() {
  const location = useLocation();
  if (location.pathname === "/auth/login") return "Đăng nhập";
  if (location.pathname === "/auth/register") return "Đăng ký";
  if (location.pathname === "/auth/confirm-email") return "Xác nhận email";
  if (location.pathname === "/auth/forgot-password") return "Quên mật khẩu";
  if (location.pathname === "/auth/ reset-password") return "Đặt lại mật khẩu";
  return "";
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid place-items-center  p-6">
      <NeatBackground />
      <div className="w-full max-w-sm rounded-xl border-spacing-1 bg-white/30 p-6 shadow-sm">
        <div className="mb-3 flex flex-col">
          <Link to="/" className="text-sm text-color hover:text-black">
            ←
          </Link>
          <span className="text-xl font-semibold mb-2 flex justify-center">{getTitleForm()}</span>
        </div>
        <Outlet /> 
      </div>
    </div>
  );
}