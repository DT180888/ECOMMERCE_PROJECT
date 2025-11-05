import { useState, FormEvent } from "react";
import { useResetPassword } from "@features/auth/api";
import { Input } from "@shared/ui/Input";
import { Button } from "@shared/ui/Button";
import { TextArea } from "@shared/ui/TextArea";

export default function ResetPasswordPage() {
  const [userId, setUserId] = useState(""); const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const reset = useResetPassword();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await reset.mutateAsync({ userId, token, newPassword });
    alert("Đổi mật khẩu thành công, hãy đăng nhập.");
    window.location.replace("/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* <h1 className="text-xl font-semibold mb-2">Đặt lại mật khẩu</h1> */}
      <Input className="w-full" placeholder="User Id" value={userId} onChange={e=>setUserId(e.target.value)} />
      <TextArea className="w-full" placeholder="Reset Token" value={token} onChange={e=>setToken(e.target.value)} />
      <Input className="w-full" placeholder="Mật khẩu mới" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
      <Button className="w-full" disabled={reset.isPending}>{reset.isPending?"Đang đặt lại…":"Đặt lại"}</Button>
    </form>
  );
}
