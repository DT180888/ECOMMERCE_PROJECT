import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@hooks/useAuth";
import { Input, Button, useToast } from "@my-project/ui";
import { Eye, EyeOff, Lock, ChevronDown } from "lucide-react";

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function ChangePasswordSection() {
  const changePwd = useChangePassword();
  const toast = useToast();
  
  const [showPwd, setShowPwd] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<PasswordForm>();
  
  const newPasswordValue = watch("newPassword");

  const onSubmit = async (v: PasswordForm) => {
    try {
      await changePwd.mutateAsync({
        currentPassword: v.currentPassword,
        newPassword: v.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      reset();
      setIsOpen(false);
    } catch (error) {
      const err = error as any;
      const msg = err?.message || "Mật khẩu hiện tại không đúng.";
      toast.error(msg);
    }
  };

  return (
    <section
      className={`bg-background rounded-card transition-all duration-300 ${
        isOpen ? "p-6 shadow-neo-inset" : "p-5 shadow-neo hover:shadow-neo-hover hover:-translate-y-0.5"
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`p-2.5 rounded-inner bg-background transition-all duration-300 shrink-0 ${
              isOpen ? "shadow-neo-inset text-primary" : "shadow-neo text-muted"
            }`}
          >
            <Lock size={20} />
          </div>
          <div className="min-w-0">
            <h2 className={`text-sm font-extrabold font-display uppercase tracking-wider ${isOpen ? "text-primary" : "text-foreground"}`}>
              Đổi mật khẩu
            </h2>
            {!isOpen && <p className="text-xs text-muted mt-0.5 truncate">Bảo mật tài khoản của bạn</p>}
          </div>
        </div>

        {isOpen ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              reset();
            }}
          >
            Hủy bỏ
          </Button>
        ) : (
          <ChevronDown className="text-muted shrink-0" size={20} />
        )}
      </div>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-muted/5 animate-in slide-in-from-top-2 duration-300 space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="text-xs font-bold text-primary flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-inner shadow-neo-sm hover:shadow-neo hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all duration-300"
            >
              {showPwd ? <><EyeOff size={14} /> Ẩn ký tự</> : <><Eye size={14} /> Hiện ký tự</>}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Mật khẩu hiện tại</label>
              <Input 
                type={showPwd ? "text" : "password"} 
                {...register("currentPassword", { required: "Bắt buộc" })} 
                error={!!errors.currentPassword} 
              />
              {errors.currentPassword && <p className="text-xs text-error">Nhập mật khẩu hiện tại</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Mật khẩu mới</label>
              <Input 
                type={showPwd ? "text" : "password"} 
                {...register("newPassword", { required: "Bắt buộc", minLength: { value: 8, message: "Tối thiểu 8 ký tự"} })} 
                error={!!errors.newPassword} 
              />
              {errors.newPassword && <p className="text-xs text-error">{errors.newPassword.message}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Nhập lại mật khẩu</label>
              <Input 
                type={showPwd ? "text" : "password"} 
                {...register("confirmPassword", { required: "Bắt buộc", validate: val => val === newPasswordValue || "Không khớp" })} 
                error={!!errors.confirmPassword} 
              />
              {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <Button
                variant="default"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-button font-bold text-xs uppercase tracking-widest"
              >
                {isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
