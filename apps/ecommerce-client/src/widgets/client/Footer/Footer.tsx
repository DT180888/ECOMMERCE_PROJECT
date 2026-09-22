import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { Input, Button } from "@my-project/ui";

const NAV_LINKS = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm", to: "/catalog" },
  { label: "Yêu thích", to: "/wishlist" },
  { label: "Đơn hàng", to: "/account/orders" },
];

const SUPPORT_LINKS = [
  { label: "Bảo mật", to: "/privacy" },
  { label: "Điều khoản", to: "/terms" },
  { label: "Liên hệ", to: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Youtube", href: "https://youtube.com", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-foreground/10 pt-24 pb-8 overflow-hidden relative mt-auto">
      <div className="client-page-container flex flex-col items-stretch">
        
        {/* ── Top Statement (Editorial) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-24 border-b border-foreground/10">
          <div className="max-w-2xl flex flex-col gap-6">
            <Link
              to="/"
              aria-label="Trang chủ Minimalism"
              className="inline-flex flex-col items-start gap-1 focus-visible:outline-none group w-fit"
            >
              <span className="text-foreground font-serif text-5xl md:text-7xl font-black italic tracking-tighter leading-none group-hover:opacity-80 transition-opacity duration-500">
                Minimalism.
              </span>
              <span className="text-[10px] md:text-[12px] font-mono tracking-[0.4em] font-bold text-muted uppercase mt-2">
                Quiet Luxury
              </span>
            </Link>
            <p className="text-sm text-foreground/70 leading-relaxed font-sans max-w-md mt-4">
              Nền tảng thương mại điện tử tôn vinh sự tinh giản. Thiết kế chú trọng vào chất liệu số, mang đến trải nghiệm mua sắm mượt mà và trực quan.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end w-full md:w-auto">
            <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] font-bold">
              Đăng ký nhận bản tin
            </p>
            <div className="flex w-full md:w-[320px] gap-3 items-center">
              <Input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                aria-label="Địa chỉ email"
                className="flex-1"
              />
              <Button variant="outline" size="icon" aria-label="Gửi email đăng ký" className="shrink-0 h-[40px] w-[40px]">
                <ArrowUpRight className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Navigation Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 py-20 w-full">
          
          {/* Col 1: Shop */}
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] font-bold">
              Điều hướng
            </span>
            <nav aria-label="Footer navigation" className="flex flex-col gap-5">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-sans font-medium text-foreground/70 hover:text-foreground hover:translate-x-1 focus-visible:outline-none transition-all duration-300 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 2: Support */}
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] font-bold">
              Hỗ trợ
            </span>
            <nav aria-label="Footer support links" className="flex flex-col gap-5">
              {SUPPORT_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-sans font-medium text-foreground/70 hover:text-foreground hover:translate-x-1 focus-visible:outline-none transition-all duration-300 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact Info */}
          <div className="flex flex-col gap-8 md:col-span-2 md:pl-12 border-t md:border-t-0 pt-12 md:pt-0 border-foreground/5">
             <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em] font-bold">
              Liên hệ
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm font-sans text-foreground/70">
              <div className="flex flex-col gap-2">
                <span className="text-foreground font-medium mb-1">Dịch vụ khách hàng</span>
                <a href="tel:19001234" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 w-fit">1900 1234</a>
                <a href="mailto:contact@minimalism.vn" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 w-fit">contact@minimalism.vn</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-foreground font-medium mb-1">Trụ sở chính</span>
                <span className="leading-relaxed">123 Đường Tên Lửa<br/>Quận Bình Tân, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 w-full pt-8 border-t border-foreground/10">
          <p className="text-[10px] font-mono font-medium text-muted/70 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Minimalism. Mọi quyền được bảo lưu.
          </p>

          <div className="flex gap-6" role="list" aria-label="Mạng xã hội">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                role="listitem"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground hover:-translate-y-1 transition-all duration-300 ease-out focus:outline-none p-2 -m-2"
              >
                <Icon className="w-3 h-3 md:w-4 md:h-4 stroke-[1.5]" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
