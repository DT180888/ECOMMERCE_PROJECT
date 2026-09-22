import { useState, FormEvent } from "react";
import { useConfirmEmailAndSetPassword } from "@entities/auth/hooks";
import { Button } from "@my-project/ui";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@my-project/ui";
import { useToast } from "@my-project/ui";
import { 
  ShieldCheckIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ArrowRightIcon 
} from "@heroicons/react/24/outline";
import AuthShell from "./AuthShell";

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirm = useConfirmEmailAndSetPassword();
  const toast = useToast();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!userId || !token) {
    return (
      <AuthShell
        title="Liên kết không hợp lệ"
        subtitle="Vui lòng kiểm tra lại đường dẫn trong email của bạn. Có thể liên kết đã hết hạn."
        icon={<XCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Bảo mật Minimalism đồng hành cùng bạn"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link to="/" className="h-10 w-full flex items-center justify-center rounded-button bg-primary text-primary-foreground font-medium text-xs uppercase tracking-widest transition-all active:scale-[0.98]">
              Về trang chủ
          </Link>
        </div>
      </AuthShell>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!userId || !token) {
        toast.error("Thiếu thông tin xác thực.");
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu nhập lại không khớp!");
        return;
    }

    if (newPassword.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    try {
      await confirm.mutateAsync({ 
          userId, 
          token, 
          newPassword 
      });
      toast.success("Kích hoạt tài khoản thành công!");
      setIsSuccess(true);
    } catch (error) {
      const err = error as any;
      const msg = err?.message || "Lỗi kích hoạt tài khoản. Link có thể đã hết hạn.";
      toast.error(msg);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        title="Chào mừng bạn!"
        subtitle="Tài khoản của bạn đã được kích hoạt thành công. Hãy bắt đầu trải nghiệm mua sắm tuyệt vời nhất."
        icon={<CheckCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Bảo mật Minimalism đồng hành cùng bạn"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Button 
            onClick={() => navigate("/", { replace: true })}
            className="w-full font-medium text-xs uppercase tracking-widest"
          >
              Khám phá ngay
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Thiết lập mật khẩu"
      subtitle="Hoàn tất quy trình đăng ký bằng mật khẩu mới"
      icon={<ShieldCheckIcon className="w-6 h-6 stroke-1" />}
      footerText="Bảo mật Minimalism đồng hành cùng bạn"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "50ms" }}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">Mật khẩu mới</label>
            <Input 
              className="w-full" 
              placeholder="••••••••" 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              autoFocus
              required
            />
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "100ms" }}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest ml-1">Nhập lại mật khẩu</label>
            <Input 
              className="w-full" 
              placeholder="••••••••" 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
            />
          </div>
        </div>

        <Button 
          className="w-full font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" 
          style={{ animationDelay: "150ms" }}
          disabled={confirm.isPending} 
          type="submit"
        >
          {confirm.isPending ? "Đang xử lý..." : "Hoàn tất đăng ký"}
          <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </form>
    </AuthShell>
  );
}