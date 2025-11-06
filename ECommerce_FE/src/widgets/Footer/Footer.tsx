import { useEffect, useState } from "react";

const MIN_H = 48;             // thanh bar mảnh luôn hiển thị
const PANEL_MAX = 360;        // tối đa phần nội dung mở rộng
const LS_KEY = "footerExpanded"; // lưu trạng thái mở/thu

export default function Footer() {
  const [expanded, setExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY) === "1";
    } catch {
      return false;
    }
  });

  // tránh nhấp nháy do hydrate: đồng bộ lại sau mount (nếu cần)
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, expanded ? "1" : "0");
    } catch {}
  }, [expanded]);

  const toggle = () => setExpanded((v) => !v);

  return (
    <footer
      className="sticky bottom-0 z-40 background-glass"
      style={{
        // footer cao theo nội dung, không animate height để tránh jank
        // phần panel bên dưới tự lo animate bằng max-height + opacity
        willChange: "transform",
      }}
      aria-expanded={expanded}
    >
      {/* Thanh top (mảnh) luôn cao MIN_H */}
      <div
        className="mx-auto max-w-[1600px] px-4 md:px-6 flex items-center justify-between text-xs text-gray-100/90"
        style={{ height: MIN_H }}
      >
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} ECommerce</span>
          <span className="opacity-70">v0.1.0</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-md px-2 py-1 text-[11px] border border-white/30 bg-white/10 hover:bg-white/15 transition-colors"
            aria-controls="footer-panel"
            aria-expanded={expanded}
          >
            {expanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </div>
      </div>

      {/* Panel mở rộng: animate mượt bằng max-height + opacity (không đổi height của footer) */}
      <div
        id="footer-panel"
        className="mx-auto max-w-[1458px] px-4 md:px-6 text-sm text-white/90 overflow-hidden"
        style={{
          maxHeight: expanded ? PANEL_MAX : 0,
          opacity: expanded ? 1 : 0,
          transition: "max-height 300ms ease, opacity 220ms ease",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
          <section>
            <h4 className="mb-2 font-semibold">Về chúng tôi</h4>
            <p className="text-white/80 text-[13px] leading-relaxed">
              ECommerce là nền tảng mua sắm đáng tin cậy, giao hàng nhanh, đổi trả dễ dàng.
            </p>
          </section>

          <section>
            <h4 className="mb-2 font-semibold">Hỗ trợ</h4>
            <ul className="space-y-1 text-[13px]">
              <li>Trung tâm trợ giúp</li>
              <li>Chính sách đổi trả</li>
              <li>Vận chuyển &amp; giao hàng</li>
              <li>Liên hệ: support@shop.local</li>
            </ul>
          </section>

          <section>
            <h4 className="mb-2 font-semibold">Tài khoản</h4>
            <ul className="space-y-1 text-[13px]">
              <li>Đơn hàng của tôi</li>
              <li>Địa chỉ giao hàng</li>
              <li>Phương thức thanh toán</li>
            </ul>
          </section>

          <section>
            <h4 className="mb-2 font-semibold">Kết nối</h4>
            <ul className="space-y-1 text-[13px]">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Zalo OA</li>
              <li className="opacity-80">Hotline: 1900 1234</li>
            </ul>
          </section>
        </div>

        <div className="border-t border-white/15 py-3 text-[12px] text-white/70">
          <span>© {new Date().getFullYear()} ECommerce — All rights reserved.</span>
        </div>
      </div>

      {/* Tối ưu “giảm chuyển động” cho người dùng cài đặt reduce motion */}
      <style>
        {`
        @media (prefers-reduced-motion: reduce) {
          #footer-panel { transition: none !important; }
        }
        `}
      </style>
    </footer>
  );
}
