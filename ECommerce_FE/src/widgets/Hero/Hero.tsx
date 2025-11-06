import { Button } from "@shared/ui/Button";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden h-full rounded-[16px] flex items-center justify-center p-6 md:p-10 lg:p-16" // Thêm padding tổng thể và flex để căn giữa nội dung
      aria-label="Khám phá Phong Cách Mới"
    >
      {/* ---- Background gradient (phủ toàn màn hình Hero) ---- */}
      <div className="absolute inset-0 z-0">
        {/* Có thể thêm hình ảnh nền mờ ở đây nếu muốn, ví dụ: */}
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1ade89a862?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Abstract fashion background"
          className="absolute inset-0 h-full w-full object-cover opacity-20" // Hình ảnh nền mờ
        />
        {/* Overlay nền kính với ánh sáng mềm */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/30 via-[#0ea5e9]/30 to-[#22d3ee]/20 backdrop-blur-2xl" />
        {/* Ánh sáng NEAT style */}
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-fuchsia-400/25 blur-[160px]" />
        <div className="absolute bottom-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-cyan-400/25 blur-[140px]" />
      </div>

      {/* ---- Content container ---- */}
      {/* Giới hạn chiều rộng nội dung để không bị tràn quá nhiều trên màn hình siêu rộng */}
      <div className="relative z-10 mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 w-full max-w-6xl">
        {/* Text section */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm uppercase">
            <span className="rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-white/90 font-medium tracking-widest">
              Bộ Sưu Tập Mới
            </span>
            <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-1.5 text-white font-bold">
              Tiết Kiệm Đến 30%
            </span>
          </div>

          {/* Title - Đã chỉnh sửa */}
          <h1 className="mt-6 font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight text-white drop-shadow-lg">
            Khám phá
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
              Phong Cách Mới
            </span>
          </h1>

          {/* Subtitle - Đã chỉnh sửa */}
          <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Đắm chìm trong bộ sưu tập độc quyền với chất liệu cao cấp,
            giao hàng siêu tốc và chính sách đổi trả dễ dàng.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <Button asChild className="px-8 py-3 text-lg font-semibold">
              <a href="/catalog" aria-label="Mua sắm ngay">MUA SẮM NGAY</a>
            </Button>
            <Button variant="secondary" asChild className="px-8 py-3 text-lg font-semibold">
              <a href="/collections" aria-label="Xem bộ sưu tập">XEM BỘ SƯU TẬP</a>
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-3 text-base text-white/80">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.817-2.034a1 1 0 00-1.176 0l-2.817 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
              2k+ Đánh giá 5 sao
            </span>
            <span className="hidden sm:inline h-4 w-px bg-white/30" />
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm4 3a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1zm-4 4a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-4 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-4 4a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-4 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm-4-8a1 1 0 00-1 1v1a1 1 0 002 0V7a1 1 0 00-1-1zM5 9a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zM3 11a1 1 0 100 2h1a1 1 0 100-2H3zm13-2a1 1 0 011 1h-2a1 1 0 110-2h2zm-1 2a1 1 0 100 2h1a1 1 0 100-2h-1zM9 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              Giao hàng nhanh 24h
            </span>
            <span className="hidden sm:inline h-4 w-px bg-white/30" />
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
              Đổi trả dễ dàng trong 7 ngày
            </span>
          </div>
        </div>

        {/* Image section - Đã chỉnh sửa */}
        <div className="flex-1 w-full max-w-xl"> {/* Tăng max-w để hình ảnh lớn hơn một chút */}
          <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[9/12] rounded-3xl overflow-hidden border border-white/20 bg-white/15 backdrop-blur-md shadow-[0_15px_60px_rgba(0,0,0,0.3)]">
            <img
              src="https://images.unsplash.com/photo-1594924716162-42173f40d343?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Thay thế bằng hình ảnh lookbook/chất lượng cao hơn
              alt="Bộ sưu tập thời trang mới"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" // Thêm hiệu ứng hover
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/35" /> {/* Tăng độ đậm của overlay để text dễ đọc hơn */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2 rounded-xl border border-white/30 bg-white/20 px-5 py-3 text-sm text-white/95 backdrop-blur-md font-semibold">
              <span>BST Thu/Đông 2025 – ĐỘC QUYỀN</span>
              <span className="hidden sm:inline text-white/70">•</span>
              <span>Giá từ 199.000đ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}