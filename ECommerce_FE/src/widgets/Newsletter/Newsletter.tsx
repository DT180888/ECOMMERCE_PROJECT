import { Button } from "@shared/ui/Button";

export default function Newsletter() {
  return (
    <div className="rounded-xl border bg-white p-6 md:p-8">
      <div className="md:flex md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold">Nhận ưu đãi độc quyền</h3>
          <p className="text-sm text-gray-600">Đăng ký newsletter để nhận voucher & tin khuyến mãi mới nhất.</p>
        </div>
        <form className="mt-4 md:mt-0 flex w-full max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
          />
          <Button type="submit">Đăng ký</Button>
        </form>
      </div>
    </div>
  );
}
