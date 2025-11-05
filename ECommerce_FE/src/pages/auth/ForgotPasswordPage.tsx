import { useState, FormEvent } from "react";
import { useForgotPassword } from "@features/auth/api";
import { Input } from "@shared/ui/Input";
import { Button } from "@shared/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const forgot = useForgotPassword();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await forgot.mutateAsync({ email });
    alert(`Đã gửi token reset (dev):\nUserId: ${res.userId}\nResetToken: ${res.resetToken}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* <h1 className="text-xl font-semibold mb-2">Quên mật khẩu</h1> */}
      <Input className="w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <Button className="w-full" disabled={forgot.isPending}>{forgot.isPending?"Đang gửi…":"Gửi liên kết"}</Button>
    </form>
  );
}
