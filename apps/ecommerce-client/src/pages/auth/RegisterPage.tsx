import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "@entities/auth/hooks";
import { Input } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { useToast } from "@my-project/ui";
import { CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import AuthShell from "./AuthShell";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const reg = useRegister();
  const toast = useToast();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!email) {
        toast.error("Vui lòng nhập email");
        return;
    }

    if (!isValidEmail(email)) {
        toast.error("Định dạng email không hợp lệ");
        return;
    }

    try {
      await reg.mutateAsync({ email });
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email.");
      setIsSuccess(true);
    } catch (error) {
      const err = error as any;
      const msg = err?.message || 
                  "Đăng ký thất bại. Thử lại sau.";
      toast.error(msg);
    }
  }

  if (isSuccess) {
    return (
      <AuthShell
        title="Kiểm tra hộp thư"
        subtitle={`Chúng tôi đã gửi một liên kết kích hoạt đến ${email}`}
        icon={<CheckCircleIcon className="w-6 h-6 stroke-1 text-foreground" />}
        footerText="Hệ thống bảo mật Minimalism đồng hành cùng bạn"
      >
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 rounded-button border border-border/60 bg-background/30 backdrop-blur-[2px] text-xs font-medium text-muted-foreground leading-relaxed">
             Vui lòng nhấn vào liên kết trong email để đặt mật khẩu và hoàn tất việc tạo tài khoản của bạn.
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
      title="Bắt đầu ngay"
      subtitle="Nhập email để khám phá thế giới Minimalism"
      icon={<EnvelopeIcon className="w-6 h-6 stroke-1" />}
      footerText="Bằng việc tiếp tục, bạn đồng ý với Điều khoản của chúng tôi"
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
            disabled={reg.isPending}
          />
        </div>

        <Button 
          className="w-full font-medium text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" 
          style={{ animationDelay: "100ms" }}
          disabled={reg.isPending} 
          type="submit"
        >
          {reg.isPending ? "Đang gửi..." : "Tiếp tục"}
        </Button>

        <div className="text-center pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both" style={{ animationDelay: "150ms" }}>
          <p className="text-xs font-medium text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/auth/login" className="text-foreground font-medium hover:underline underline-offset-4 decoration-1">
              Đăng nhập
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}