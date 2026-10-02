import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

/**
 * Định nghĩa cấu trúc dữ liệu cho từng bộ trang phục phối sẵn (Lookbook Outfit)
 */
export interface LookbookOutfit {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  itemsCount: number;
  totalPrice: number;
}

/**
 * Danh sách gợi ý phối đồ mẫu theo phong cách Quiet Luxury
 */
const MOCK_LOOKBOOKS: LookbookOutfit[] = [
  {
    id: "look-01",
    title: "Monochrome Minimalist Set",
    subtitle: "Áo Blazer Oversized + Quần Tây Ống Rộng + Sneaker",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    itemsCount: 3,
    totalPrice: 2450000,
  },
  {
    id: "look-02",
    title: "Urban Casual Layering",
    subtitle: "Áo Khoác Denim + T-Shirt Cotton + Quần Jeans Straight",
    imageUrl: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop",
    itemsCount: 3,
    totalPrice: 1890000,
  },
  {
    id: "look-03",
    title: "Quiet Luxury Evening Look",
    subtitle: "Đầm Lụa Dáng Rủ + Áo Khoác Dạ Dáng Dài + Phụ Kiện",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    itemsCount: 3,
    totalPrice: 3200000,
  },
  {
    id: "look-04",
    title: "Contemporary Tailored Suit",
    subtitle: "Bộ Suit May Đo Tối Giản + Áo Sơ Mi Poplin + Loafer",
    imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    itemsCount: 3,
    totalPrice: 2950000,
  },
  {
    id: "look-05",
    title: "Summer Resort Essence",
    subtitle: "Áo Sơ Mi Linen + Quần Short Be + Mũ Cót Rộng Vành",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    itemsCount: 3,
    totalPrice: 1550000,
  }
];

const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

/**
 * LookbookStylingSlider Component
 * 
 * Mục tiêu: Trưng bày các set đồ phối sẵn (Shop The Look) giúp người dùng hình dung phong cách hoàn chỉnh.
 * 
 * Quy tắc thiết kế:
 * - Slider cuộn ngang mượt mà với hiệu ứng snap-to-card.
 * - Trạng thái nghỉ sạch 100%: chỉ hiển thị ảnh 3:4, nhãn tên và giá trọn bộ.
 * - Progressive Hover Disclosure: Badge số món đồ và nút CTA "Xem Phối Đồ" chỉ xuất hiện khi hover.
 * - Nút "Xem Phối Đồ" điều hướng sang catalog bộ sưu tập tương ứng.
 * - Tên và mô tả rút gọn đúng 1 dòng (truncate line-clamp-1).
 */
export default function LookbookStylingSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cuộn sang trái
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  // Cuộn sang phải
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section 
      aria-label="Đề xuất phối đồ thời trang"
      className="w-full py-8 sm:py-12 lg:py-16 bg-background border-b border-border/60"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        
        {/* =========================================================
            1. SECTION HEADER (Thanh điều hướng tối giản hai bên)
           ========================================================= */}
        <div className="flex items-end justify-between mb-8 sm:mb-12 gap-6 pb-4 border-b border-border/40">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-display font-medium tracking-[0.25em] uppercase text-muted-foreground mb-1">
              Gợi Ý Phong Cách / Shop The Look
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground">
              Đề Xuất Phối Đồ
            </h2>
          </div>

          {/* Nút điều khiển cuộn thủ công */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={scrollLeft}
              className="p-2 border border-border/80 bg-background text-foreground hover:border-foreground transition-colors duration-200 rounded-[2px]"
              aria-label="Xem bộ phối trước"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.25]" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="p-2 border border-border/80 bg-background text-foreground hover:border-foreground transition-colors duration-200 rounded-[2px]"
              aria-label="Xem bộ phối tiếp theo"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.25]" />
            </button>
          </div>
        </div>

        {/* =========================================================
            2. HORIZONTAL SNAP SLIDER (Thẻ tỷ lệ 3:4)
           ========================================================= */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 lg:gap-8 pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {MOCK_LOOKBOOKS.map((lookbook) => (
            <div
              key={lookbook.id}
              className="m-0 p-0 flex-shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] snap-start group flex flex-col justify-between"
            >
              {/* Khung ảnh chính (Tỷ lệ 3:4, góc phẳng, zero shadow) */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface border border-border/60 group-hover:border-foreground/40 transition-colors duration-300">
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Progressive Hover: Huy hiệu số món trong set đồ */}
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md border border-border/80 px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2px]">
                  <span className="text-[9px] font-display font-medium tracking-widest text-foreground uppercase">
                    {lookbook.itemsCount} MÓN TRONG SET
                  </span>
                </div>

                {/* Progressive Hover: Nút hành động xem phối đồ */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Link
                    to={`/catalog?lookbook=${lookbook.id}`}
                    className="w-full py-2.5 bg-foreground text-background text-[11px] font-display font-medium uppercase tracking-[0.2em] text-center flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity duration-200 rounded-[2px]"
                  >
                    <span>Xem Phối Đồ</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.25]" />
                  </Link>
                </div>
              </div>

              {/* Thông tin mô tả set đồ: 1 dòng truncate */}
              <div className="mt-2.5 flex flex-col select-none gap-y-1">
                <Link 
                  to={`/catalog?lookbook=${lookbook.id}`}
                  className="block group-hover:text-muted-foreground transition-colors duration-200"
                  title={lookbook.title}
                >
                  <h3 className="text-sm font-medium text-foreground tracking-tight truncate">
                    {lookbook.title}
                  </h3>
                </Link>

                <p className="text-[11px] font-display text-muted-foreground truncate" title={lookbook.subtitle}>
                  {lookbook.subtitle}
                </p>

                <div className="flex justify-between items-center text-xs font-display text-muted-foreground pt-1 border-t border-border/40 mt-1">
                  <span className="text-[11px] uppercase tracking-wider">Trọn bộ gợi ý</span>
                  <span className="font-medium text-foreground tabular-nums">{formatVND(lookbook.totalPrice)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
