export default function PromoBanner() {
  return (
    <div className="rounded-2xl border bg-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
      <img
        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"
        alt=""
        className="h-28 w-28 rounded-xl object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">Miễn phí giao hàng cho đơn từ 499.000₫</h3>
        <p className="text-sm text-gray-600">Áp dụng toàn quốc. Trả hàng miễn phí trong 7 ngày.</p>
      </div>
      <a href="/catalog" className="text-sm font-medium text-gray-900 underline">Mua sắm ngay</a>
    </div>
  );
}
