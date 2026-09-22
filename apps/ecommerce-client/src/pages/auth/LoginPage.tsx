import LoginForm from "@features/auth/ui/LoginForm";
import { UserIcon } from "@heroicons/react/24/outline";
import AuthShell from "./AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Chào trở lại"
      subtitle="Đăng nhập để tiếp tục hành trình của bạn"
      icon={<UserIcon className="w-6 h-6 stroke-1" />}
      footerText="Vui lòng bảo mật thông tin đăng nhập"
    >
      <LoginForm />
    </AuthShell>
  );
}
