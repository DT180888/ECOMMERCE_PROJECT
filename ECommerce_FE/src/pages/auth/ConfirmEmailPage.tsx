import { useEffect, useState, FormEvent } from "react";
import { useConfirmEmail } from "@features/auth/api";
import { Button } from "@shared/ui/Button";
import { useLocation } from "react-router-dom";
import { Input } from "@shared/ui/Input";
import { TextArea } from "@shared/ui/TextArea";

export default function ConfirmEmailPage() {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const confirm = useConfirmEmail();
  const locationConfirmEmail = useLocation();
  const stateUser = locationConfirmEmail.state as { userId: string; confirmToken: string } | null;

  // ✅ chỉ chạy 1 lần khi stateUser thay đổi
  useEffect(() => {
    if (stateUser) {
      setUserId(stateUser.userId);
      setToken(stateUser.confirmToken);
    }
  }, [stateUser]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await confirm.mutateAsync({ userId, token });
    alert("Xác nhận email thành công, hãy đăng nhập.");
    window.location.replace("/auth/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        className="w-full"
        placeholder="User Id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <TextArea
        className="w-full border rounded px-3 py-2"
        placeholder="Confirm Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <Button variant="danger" size="lg" disabled={confirm.isPending}>
        {confirm.isPending ? "Đang xác nhận…" : "Xác nhận"}
      </Button>
    </form>
  );
}
