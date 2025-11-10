"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const cats = [
  { slug: "shoes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  { slug: "apparel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
  { slug: "shoesd", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  { slug: "appareldfsd", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
    { slug: "shosdfes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  { slug: "appsdfsdfarel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
    { slug: "shoádfsdes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  { slug: "appadsfsdfarel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
  //     { slug: "shoes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  // { slug: "apparel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
  //     { slug: "shoes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  // { slug: "apparel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
  //     { slug: "shoes", name: "Giày",    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" },
  // { slug: "apparel", name: "Áo quần", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600" },
];

export default function CategoryGrid() {
  return (
    <section className="relative w-full h-full overflow-hidden py-8 sm:py-10" aria-label="Danh mục nổi bật">
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Khám phá danh mục nổi bật</h2>
        <p className="text-white/70 text-sm mt-1">Danh mục được yêu thích — trung tâm nổi bật, hai bên tinh tế.</p>
      </div>

      <Swiper
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        centeredSlides
        grabCursor
        loop
        slidesPerView="auto"
        // GIÃN KHOẢNG CÁCH & ĐỘ SÂU
        coverflowEffect={{
          rotate: 0,
          stretch: 80,   // ↑ tăng khoảng cách giữa các slide
          depth: 240,     // ↑ chiều sâu 3D
          modifier: 1.4,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        className="!pb-14"
      >
        {cats.map((c) => (
          <SwiperSlide
            key={c.slug}
            // KÍCH THƯỚC LỚN HƠN + RESPONSIVE
            style={{
              width: "clamp(260px, 32vw, 460px)",
              height: "clamp(360px, 48vw, 600px)",
              transition: "transform 0.45s ease",
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.35)] hover:bg-white/10"
          >
            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="rounded-xl bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white shadow-md">
                {c.name}
              </span>
              <span className="text-white/85 text-xs opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Xem ngay →
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
        .swiper { padding-left: min(6vw, 80px); padding-right: min(6vw, 80px); }
        .swiper-slide { opacity: 0.45; transform: scale(0.82); will-change: transform, opacity; }
        .swiper-slide-prev, .swiper-slide-next { opacity: 0.75; transform: scale(0.92); }
        .swiper-slide-active { opacity: 1; transform: scale(1.18); z-index: 2; } /* ↑ trung tâm to hơn */
        .swiper-pagination-bullet { background: rgba(255,255,255,0.4); }
        .swiper-pagination-bullet-active { background: rgb(147 51 234 / var(--tw-bg-opacity, 1)); }
        @media (max-width: 640px) {
          .swiper-slide-active { transform: scale(1.08); } /* mobile bớt to để không tràn */
        }
        `}
      </style>
    </section>
  );
}
