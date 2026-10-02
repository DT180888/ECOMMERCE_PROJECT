import { useState, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "@hooks/useAuth";
import { Input, Button, useToast } from "@my-project/ui";
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await login.mutateAsync({ email, password });
      toast.success("Đăng nhập thành công!");
      navigate(redirect, { replace: true });
    } catch (error: any) {
      const msg = error?.message || "Đăng nhập thất bại. Kiểm tra email/mật khẩu.";
      toast.error(msg);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "50ms" }}>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">
            Địa chỉ Email
          </label>
          <Input 
            className="w-full" 
            placeholder="name@example.com" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            autoFocus
            disabled={login.isPending}
            required
          />
        </div>

        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Mật khẩu
            </label>
            <Link 
              to="/auth/forgot-password" 
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input 
              className="w-full pr-12" 
              placeholder="••••••••" 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={login.isPending}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <Button 
        className="w-full font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" 
        style={{ animationDelay: "150ms" }}
        disabled={login.isPending} 
        type="submit"
      >
        {login.isPending ? "Đang xử lý..." : "Đăng nhập"}
        <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4" />
      </Button>

      <div className="text-center pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "200ms" }}>
        <p className="text-xs font-medium text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" className="text-foreground font-medium hover:underline underline-offset-4 decoration-1">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </form>
  );
}
