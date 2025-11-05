// src/features/auth/ui/LoginForm.tsx
import { FormEvent, useEffect, useState } from "react";
import { useLogin } from "@features/auth/api";
import { FormField } from "@shared/ui/FormField";
import { Input } from "@shared/ui/Input";
import { PasswordInput } from "@shared/ui/PasswordInput";
import { Button } from "@shared/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const login = useLogin();

  useEffect(() => {
    const remembered = localStorage.getItem("remember_email");
    if (remembered) setEmail(remembered);
  }, []);

  const serverError =
    (login.error as any)?.response?.data?.message ||
    (login.error as Error)?.message ||
    "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (login.isPending) return;
    login.mutate(
      { email, password, remember },
      {
        onSuccess: () => {
          if (remember) localStorage.setItem("remember_email", email);
          else localStorage.removeItem("remember_email");
          window.location.replace("/");
        },
      }
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Email" htmlFor="email" required error={serverError ? "" : undefined}>
        <Input
          className="w-full"
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!serverError}
        />
      </FormField>

      <FormField label="Mật khẩu" htmlFor="password" required>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!serverError}
        />
      </FormField>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Ghi nhớ tôi
        </label>
        <a href="/forgot-password" className="text-sm text-gray-300 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      <Button type="submit" isLoading={login.isPending} className="w-full">
        Đăng nhập
      </Button>
    </form>
  );
}
