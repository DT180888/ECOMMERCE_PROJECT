import { useState, FormEvent } from "react";
import { useRegister } from "@features/auth/api";
import { useNavigate } from "react-router-dom";
import { Input } from "@shared/ui/Input";
import { Button } from "@shared/ui/Button";

export default function RegisterPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const reg = useRegister();
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await reg.mutateAsync({ email, password });
    if (res.userId) {
      // localStorage.setItem("reg_userId", res.userId);
      // localStorage.setItem("reg_confirmToken", res.confirmToken);
      navigate("/confirm-email", { state: { userId: res.userId, confirmToken: res.confirmToken } });
    } // Dùng tạm trong localStorage để điền nhanh ở trang Confirm Email, sau này tích hợp email service thì xóa đi

  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* <h1 className="text-xl font-semibold mb-2">Đăng ký</h1> */}
      <Input className="w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <Input className="w-full" placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <Button className="w-full" disabled={reg.isPending}>{reg.isPending?"Đang xử lý…":"Tạo tài khoản"}</Button>
    </form>
  );
}
