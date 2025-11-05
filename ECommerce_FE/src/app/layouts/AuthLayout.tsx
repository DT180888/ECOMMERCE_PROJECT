import NeatBackground from "@shared/ui/NeatBackground";
import { Outlet, Link, useLocation } from "react-router-dom";


function getTitleForm() {
  const location = useLocation();
  if (location.pathname === "/login") return "Đăng nhập";
  if (location.pathname === "/register") return "Đăng ký";
  if (location.pathname === "/confirm-email") return "Xác nhận email";
  if (location.pathname === "/forgot-password") return "Quên mật khẩu";
  if (location.pathname === "/reset-password") return "Đặt lại mật khẩu";
  return "";
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid place-items-center  p-6">
      <NeatBackground />
      <div className="w-full max-w-sm rounded-2xl border-spacing-1 bg-white/30 p-6 shadow-sm">
        <div className="mb-3 flex flex-col">
          <Link to="/" className="text-sm text-gray-500 hover:text-black">
            ←
          </Link>
          <span className="text-xl font-semibold mb-2 flex justify-center">{getTitleForm()}</span>
        </div>
        <Outlet /> 
      </div>
    </div>
  );
}