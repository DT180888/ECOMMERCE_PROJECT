import Hero from "@widgets/Hero/Hero";
import CategoryGrid from "@widgets/CategoryGrid/CategoryGrid";
// import ProductGrid from "@widgets/Product/ProductGrid";
import PromoBanner from "@widgets/Promo/PromoBanner";
import Newsletter from "@widgets/Newsletter/Newsletter";
import FullscreenSection from "@shared/ui/FullscreenSection";
import SnapDots from "@widgets/SnapDots/SnapDots";

const featured = [
  { id: "p1", name: "Air Max 270", price: 3599000, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200" },
  { id: "p2", name: "Classic Tee", price: 299000, image: "https://images.unsplash.com/photo-1520975922284-5f573da5f1e3?q=80&w=1200" },
  { id: "p3", name: "Everyday Backpack", price: 1299000, image: "https://images.unsplash.com/photo-1514477917009-389c76a86b68?q=80&w=1200" },
  { id: "p4", name: "Wireless Buds", price: 1599000, image: "https://images.unsplash.com/photo-1518440983570-06c3b9a0282a?q=80&w=1200" },
];

export default function HomePage() {
  return (
    <div
      className="mx-auto w-full max-w-[1600px] px-3 md:px-6 overflow-y-auto snap-y snap-mandatory scroll-smooth 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
    >
      <FullscreenSection id="hero" center className="bg-transparent">
        <Hero />
      </FullscreenSection>

      <FullscreenSection id="categories" center className="bg-transparent">
        <CategoryGrid />
      </FullscreenSection>

      <FullscreenSection id="featured" className="bg-transparent">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <a href="/catalog" className="text-sm text-gray-600 hover:underline">Xem tất cả →</a>
          </div>
          {/* <ProductGrid products={featured} /> */}
        </div>
      </FullscreenSection>

      <FullscreenSection id="promo" center className="bg-transparent">
        <PromoBanner />
      </FullscreenSection>

      <FullscreenSection id="newsletter" center className="bg-transparent">
        <Newsletter />
      </FullscreenSection>

      {/* Dot navigation nổi bên phải */}
      <SnapDots ids={["hero", "categories", "featured", "promo", "newsletter"]} />
    </div>
  );
}
