import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, ArrowRight, Check, ShieldCheck, RefreshCw, PackageCheck } from "lucide-react";

const NAV_COLLECTION = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm mới về", to: "/catalog?sort=newest" },
  { label: "Bộ sưu tập S-S 2026", to: "/catalog" },
  { label: "Sản phẩm nổi bật", to: "/catalog?featured=true" },
  { label: "Ưu đãi đặc quyền", to: "/catalog?onSale=true" },
];

const NAV_CARE = [
  { label: "Tra cứu đơn hàng", to: "/account/orders" },
  { label: "Chính sách đổi trả 14 ngày", to: "/terms#returns" },
  { label: "Hướng dẫn chọn Size", to: "/size-guide" },
  { label: "Bảo mật thông tin", to: "/privacy" },
  { label: "Điều khoản dịch vụ", to: "/terms" },
];

const NAV_BRAND = [
  { label: "Triết lý Minimalism", to: "/about" },
  { label: "Chất liệu & Sợi dệt", to: "/craftsmanship" },
  { label: "Bền vững & Môi trường", to: "/sustainability" },
  { label: "Hệ thống Boutique", to: "/stores" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Youtube", href: "https://youtube.com", icon: Youtube },
];

const PAYMENT_METHODS = ["VISA", "MASTERCARD", "MOMO", "VIETQR"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-background border-t border-border/80 pt-4 sm:pt-8 lg:pt-12 2xl:pt-16 pb-10 overflow-hidden relative mt-auto text-foreground selection:bg-accent/20 font-display">
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 flex flex-col items-stretch">
        
        {/* ── Top Statement & Journal Newsletter ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-border/60">
          
          {/* Brand Manifesto (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <Link
              to="/"
              aria-label="Minimalism Home"
              className="inline-flex flex-col items-start group focus:outline-none"
            >
              <span className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-none text-foreground group-hover:opacity-80 transition-opacity duration-300">
                Minimalism.
              </span>
              <span className="text-[10px] sm:text-[11px] font-display tracking-[0.35em] font-medium text-muted-foreground uppercase mt-3">
                Quiet Luxury & Editorial Craftsmanship
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-display max-w-lg mt-2">
              Nền tảng thời trang tối giản tôn vinh vẻ đẹp của sự tinh gọn và chất liệu số. 
              Mỗi sản phẩm được chế tác tỉ mỉ từ các sợi dệt tự nhiên, mang tới trải nghiệm mua sắm sang trọng, mượt mà và bền vững.
            </p>

            {/* Micro Pillars */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-[11px] font-display uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-foreground stroke-[1.25]" />
                Sợi dệt Hữu cơ 100%
              </span>
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-foreground stroke-[1.25]" />
                Đổi trả 14 ngày
              </span>
              <span className="flex items-center gap-2">
                <PackageCheck className="w-3.5 h-3.5 text-foreground stroke-[1.25]" />
                Bao bì Cotton sinh học
              </span>
            </div>
          </div>

          {/* Editorial Newsletter Subscription (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-end lg:pl-8">
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                Đăng ký nhận bản tin độc quyền
              </h3>
              <p className="text-xs font-display text-muted-foreground leading-relaxed">
                Cập nhật sớm nhất về các Bộ sưu tập giới hạn, cái nhìn hậu trường và ưu đãi riêng tư.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 pt-4 text-xs font-display text-foreground border-b border-foreground/40 pb-2 animate-in fade-in duration-300">
                  <Check className="w-4 h-4 text-foreground stroke-[1.5]" />
                  <span>Cảm ơn bạn. Email của bạn đã được ghi nhận vào Private Journal.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="max-w-[400px]">
                  <div className="relative flex items-center border-b border-border focus-within:border-foreground/60 transition-colors duration-300 pb-2">
                    <input
                      type="email"
                      required
                      placeholder="NHẬP EMAIL CỦA BẠN..."
                      aria-label="Địa chỉ email nhận bản tin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs font-display tracking-wider text-foreground placeholder:text-muted-foreground/60 border-none outline-none pr-10"
                    />
                    <button
                      type="submit"
                      aria-label="Gửi nhận tin"
                      className="absolute right-0 p-1 text-foreground hover:translate-x-1 transition-transform duration-200 focus:outline-none"
                    >
                      <ArrowRight className="w-4 h-4 stroke-[1.25]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* ── 5-Column Navigation Matrix ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12 py-16 w-full text-xs font-display">
          
          {/* Col 1: Collection */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.25em] font-medium">
              Tuyển tập
            </span>
            <nav aria-label="Bộ sưu tập" className="flex flex-col gap-3 font-display">
              {NAV_COLLECTION.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 2: Customer Care */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.25em] font-medium">
              Dịch vụ Khách hàng
            </span>
            <nav aria-label="Dịch vụ khách hàng" className="flex flex-col gap-3 font-display">
              {NAV_CARE.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Brand Story */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.25em] font-medium">
              Thương hiệu
            </span>
            <nav aria-label="Về thương hiệu" className="flex flex-col gap-3 font-display">
              {NAV_BRAND.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Flagship Store */}
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.25em] font-medium">
              Flagship Boutique
            </span>
            <div className="flex flex-col gap-2 font-display text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">TP. Hồ Chí Minh</span>
              <span>123 Đường Tên Lửa, Q. Bình Tân</span>
              <a href="tel:19001234" className="hover:text-foreground transition-colors w-fit pt-1">Hotline: 1900 1234</a>
              <a href="mailto:concierge@minimalism.vn" className="hover:text-foreground transition-colors w-fit">concierge@minimalism.vn</a>
              <span className="text-[11px] font-display text-muted-foreground/80 pt-1">Giờ mở cửa: 09:00 — 21:30</span>
            </div>
          </div>

          {/* Col 5: Philosophy Statement */}
          <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
            <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.25em] font-medium">
              Triết lý Thiết kế
            </span>
            <p className="font-display italic text-sm leading-relaxed text-muted-foreground">
              &ldquo;Sự hoàn hảo đạt được không phải khi không còn gì để thêm vào, mà là khi không còn gì để lược bớt.&rdquo;
            </p>
            <span className="text-[10px] font-display text-muted-foreground/80 uppercase tracking-widest">— Antoine de Saint-Exupéry</span>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 w-full pt-8 border-t border-border/60 text-[10px] sm:text-[11px] font-display">
          
          {/* Copyright & Live Time Location */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span>© {new Date().getFullYear()} MINIMALISM INC. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline-block text-border">•</span>
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SAIGON / GMT+7 {currentTime && `• ${currentTime}`}
            </span>
          </div>

          {/* Payment Badges & Social Links */}
          <div className="flex flex-wrap items-center gap-6">
            
            {/* Payment Minimal Badges */}
            <div className="hidden lg:flex items-center gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="px-2 py-0.5 border border-border text-[9px] font-display text-muted-foreground rounded-[2px]"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4" role="list" aria-label="Mạng xã hội">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  role="listitem"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 -m-2 text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
                >
                  <Icon className="w-4 h-4 stroke-[1.25]" />
                </a>
              ))}
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
