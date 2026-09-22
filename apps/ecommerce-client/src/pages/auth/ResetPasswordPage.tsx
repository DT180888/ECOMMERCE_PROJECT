import { useState, FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useResetPassword } from "@entities/auth/hooks";
import { Input } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { useToast } from "@my-project/ui";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import AuthShell from "./AuthShell";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const resetMut = useResetPassword();
  const toast = useToast();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!userId || !token) {
    return (
      <AuthShell
        title="Liên kết không hợp lệ"
        subtitle="Đường dẫn đặt lại mật khẩu của bạn đã hết hạn hoặc thiếu thông tin cần thiết."
        icon={<XCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Hệ thống bảo mật Minimalism mã hóa đầu cuối"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link to="/auth/login" className="h-10 w-full flex items-center justify-center rounded-button bg-primary text-primary-foreground font-medium text-xs uppercase tracking-widest transition-all active:scale-[0.98]">
              Quay lại đăng nhập
          </Link>
        </div>
      </AuthShell>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await resetMut.mutateAsync({
        userId: userId!,
        token: token!,
        newPassword
      });
      toast.success("Đổi mật khẩu thành công!");
      setIsSuccess(true);
    } catch (error) {
      const err = error as any;
      const msg = err?.message || "Đã có lỗi xảy ra khi đặt lại mật khẩu.";
      toast.error(msg);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        title="Mật khẩu đã đổi"
        subtitle="Từ bây giờ, bạn có thể sử dụng mật khẩu mới để đăng nhập vào tài khoản của mình."
        icon={<CheckCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Thông tin của bạn được bảo mật tuyệt đối"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link to="/auth/login" className="h-10 w-full flex items-center justify-center rounded-button bg-primary text-primary-foreground font-medium text-xs uppercase tracking-widest transition-all active:scale-[0.98]">
              Đăng nhập ngay
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Mật khẩu mới"
      subtitle="Bảo mật tài khoản của bạn bằng mật khẩu mạnh"
      icon={<ShieldCheckIcon className="w-6 h-6 stroke-1" />}
      footerText="Thông tin của bạn được bảo mật tuyệt đối"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "50ms" }}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">Mật khẩu mới</label>
            <div className="relative">
                <Input 
                    className="w-full pr-12" 
                    placeholder="••••••••" 
                    type={showPass ? "text" : "password"}
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    disabled={resetMut.isPending}
                />
                <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {showPass ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
            <Input 
                className="w-full" 
                placeholder="••••••••" 
                type="password"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                disabled={resetMut.isPending}
            />
          </div>
        </div>

        <Button 
          className="w-full font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" 
          style={{ animationDelay: "150ms" }}
          disabled={resetMut.isPending} 
          type="submit"
        >
          {resetMut.isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </form>
    </AuthShell>
  );
}