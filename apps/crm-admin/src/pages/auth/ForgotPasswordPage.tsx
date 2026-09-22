import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@entities/auth/hooks";
import { Input } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { useToast } from "@my-project/ui";
import { KeyIcon, CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import AuthShell from "./AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const forgot = useForgotPassword();
  const toast = useToast();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!email) {
        toast.error("Vui lòng nhập email");
        return;
    }

    if (!isValidEmail(email)) {
        toast.error("Email không hợp lệ");
        return;
    }

    try {
      await forgot.mutateAsync({ email });
      toast.success("Đã gửi hướng dẫn đặt lại mật khẩu.");
      setIsSuccess(true);
    } catch (error) {
      const err = error as any;
      const msg = err?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(msg);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        title="Hộp thư đã gửi"
        subtitle={`Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến ${email}`}
        icon={<CheckCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Hệ thống bảo mật Minimalism mã hóa đầu cuối"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 rounded-button border border-border/60 bg-background/30 backdrop-blur-[2px] text-xs font-medium text-muted-foreground leading-relaxed">
             Vui lòng kiểm tra hộp thư của bạn (bao gồm cả thư rác) để tiếp tục quy trình.
          </div>
          <div className="pt-2">
            <Link 
              to="/auth/login" 
              className="inline-block text-xs font-medium text-foreground hover:opacity-70 transition-opacity uppercase tracking-widest hover:underline underline-offset-4 decoration-1"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Quên mật khẩu?"
      subtitle="Nhập email để khôi phục quyền truy cập của bạn"
      icon={<KeyIcon className="w-6 h-6 stroke-1" />}
      footerText="Hệ thống bảo mật Minimalism mã hóa đầu cuối"
    >
      <form onSubmit={onSubmit} className="space-y-6">
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
            disabled={forgot.isPending}
          />
        </div>

        <Button 
          className="w-full font-medium text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" 
          style={{ animationDelay: "100ms" }}
          disabled={forgot.isPending} 
          type="submit"
        >
          {forgot.isPending ? "Đang xử lý..." : "Gửi liên kết"}
        </Button>

        <div className="text-center pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "150ms" }}>
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all group">
            <ArrowLeftIcon className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}