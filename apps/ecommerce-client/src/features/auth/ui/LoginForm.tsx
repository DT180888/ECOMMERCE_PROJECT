import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Hooks
import { useLogin } from "@entities/auth/hooks";
import { useMergeCart } from "@entities/cart/hooks";
import { setAccessToken } from "@my-project/shared-utils";

// UI Components
import { Input } from "@my-project/ui";
import { PasswordInput } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const ACCESS_TOKEN_KEY = "access_token";

interface DecodedToken {
  sub: string;
  email: string;
  roles?: string | string[];
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  exp: number;
}

export default function LoginForm() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const login = useLogin();
  const mergeCart = useMergeCart();

  useEffect(() => {
    const remembered = localStorage.getItem("remember_email");
    if (remembered) setEmail(remembered);
  }, []);

  const serverError =
    (login.error as { response?: { data?: { message?: string } } })?.message ||
    (login.error as Error)?.message ||
    "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (login.isPending) return;

    login.mutate(
      { email, password, remember },
      {
        onSuccess: async (response: { access_token?: string }) => {
          const accessToken = response?.access_token;
          if (accessToken) {
            setAccessToken(accessToken);
          }

          if (remember) localStorage.setItem("remember_email", email);
          else localStorage.removeItem("remember_email");

          try {
            const localCartStr = localStorage.getItem("CART_V1");
            if (localCartStr) {
              const localCartData = JSON.parse(localCartStr);
              const realItems = localCartData?.items;
              if (Array.isArray(realItems) && realItems.length > 0) {
                const itemsToMerge = realItems.map((item: { skuId: string | number; quantity: number | string }) => ({
                  skuId: Number(item.skuId),
                  quantity: Number(item.quantity)
                }));
                await mergeCart.mutateAsync({ items: itemsToMerge });
                localStorage.removeItem("CART_V1");
              }
            }
          } catch (error) {
            console.error("Merge cart failed:", error);
          }

          if (accessToken) {
            try {
              const decoded = jwtDecode<DecodedToken>(accessToken);
              let userRoles = decoded.roles || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
              if (typeof userRoles === "string") userRoles = [userRoles];

              if (Array.isArray(userRoles) && (userRoles.includes("Admin") || userRoles.includes("Staff"))) {
                 navigate("/admin/dashboard", { replace: true });
              } else {
                 navigate("/", { replace: true });
              }
            } catch {
              navigate("/", { replace: true });
            }
          } else {
             navigate("/", { replace: true });
          }
        },
      }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "50ms" }}>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">
          Email
        </label>
        <Input
          className="w-full"
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!serverError}
        />
      </div>

      <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Mật khẩu
          </label>
          <Link to="/auth/forgot-password" className="text-xs font-medium text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors">
            Quên mật khẩu?
          </Link>
        </div>
        <PasswordInput
          className="w-full"
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!serverError}
        />
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-4 rounded-button bg-red-50/50 backdrop-blur-[2px] border border-red-100/50 dark:bg-red-950/20 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
          <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="flex items-center gap-3 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "150ms" }}>
        <input
          type="checkbox"
          id="remember"
          className="w-3 h-3 md:w-4 md:h-4 rounded-gallery border-border text-foreground focus:ring-foreground transition-all cursor-pointer"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Ghi nhớ phiên đăng nhập
        </label>
      </div>

      <Button 
        type="submit" 
        isLoading={login.isPending || mergeCart.isPending} 
        className="w-full font-medium text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
        style={{ animationDelay: "200ms" }}
      >
        {mergeCart.isPending ? "Đang đồng bộ..." : "Đăng nhập"}
      </Button>

      <div className="text-center pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "250ms" }}>
        <p className="text-xs font-medium text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" className="text-foreground font-medium hover:underline underline-offset-4 decoration-1">
            Tham gia ngay
          </Link>
        </p>
      </div>
    </form>
  );
}