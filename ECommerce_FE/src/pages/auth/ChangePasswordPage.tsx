import { useState, FormEvent } from "react";
import { useChangePassword } from "@features/auth/api";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";

export default function ChangePasswordPage() {
  const [currentPassword, setCur] = useState(""); const [newPassword, setNew] = useState("");
  const change = useChangePassword();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await change.mutateAsync({ currentPassword: currentPassword, newPassword: newPassword });
    alert("Đổi mật khẩu thành công");
    setCur(""); setNew("");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* <h1 className="text-xl font-semibold mb-2">Đổi mật khẩu</h1> */}
      <Input className="w-full" placeholder="Mật khẩu hiện tại" type="password" value={currentPassword} onChange={e=>setCur(e.target.value)} />
      <Input className="w-full" placeholder="Mật khẩu mới" type="password" value={newPassword} onChange={e=>setNew(e.target.value)} />
      <Button variant="secondary"  disabled={change.isPending}>{change.isPending?"Đang đổi…":"Đổi mật khẩu"}</Button>
    </form>
  );
}
