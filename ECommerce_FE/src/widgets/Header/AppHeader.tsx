import { Link } from "react-router-dom";
import { useMe, useLogout } from "@features/auth/api";
import { getAccessToken } from "@shared/api/axiosClient";
import { Button } from "@shared/ui/Button"; // Import Button component đã sửa đổi

export default function AppHeader() {
  const logout = useLogout();
  const hasToken = !!getAccessToken();
  const { data: me } = useMe({ enabled: hasToken });

  return (
    <header className="sticky top-0 z-40 background-glass"> {/* THÊM BORDER */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg tracking-wide text-white">
            ECommerce
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm text-gray-200">
            <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            <Link to="/orders" className="hover:text-white transition-colors">Orders</Link>
            <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {me?.email ? (
            <>
              <span className="text-sm text-gray-200">{me.email}</span>
              <Button
                variant="glass"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="text-gray-100 hover:text-white"
              >
                {logout.isPending ? "Đang thoát…" : "Đăng xuất"}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login" className="text-gray-200 hover:text-white transition-colors">Đăng nhập</Link>
              <Button
                asChild
                variant="primary"
                size="sm"
              >
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}