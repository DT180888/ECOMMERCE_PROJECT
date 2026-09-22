import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeaturedCategories } from "@entities/category/hooks";
import { Tabs, TabsList, TabsTrigger } from "@my-project/ui";

interface LookbookItem {
  id: string;
  name: string;
  slug: string;
  manifesto: string;
  frame1: {
    main: string;
    alt: string;
  };
  frame2: {
    main: string;
    alt: string;
  };
}

const STATIC_LOOKBOOKS: LookbookItem[] = [
  {
    id: "women",
    name: "Women",
    slug: "women",
    manifesto: "Tôn vinh vẻ đẹp tối giản đương đại của phụ nữ thông qua những thiết kế phom dáng thanh thoát, chất liệu vải tự nhiên cao cấp và những đường cắt may phóng khoáng.",
    frame1: {
      main: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop"
    },
    frame2: {
      main: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"
    }
  },
  {
    id: "men",
    name: "Men",
    slug: "men",
    manifesto: "Tập trung vào sự nam tính, lịch lãm và tối giản. Những sản phẩm may đo cấu trúc nhẹ nhàng và trang phục thường ngày cao cấp mang lại sự thoải mái tuyệt đối.",
    frame1: {
      main: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
    },
    frame2: {
      main: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    }
  },
  {
    id: "essentials",
    name: "Essentials",
    slug: "essentials",
    manifesto: "Dòng sản phẩm thiết yếu không thể thiếu cho tủ đồ hàng ngày. Thiết kế unisex tối giản, tối ưu hóa công năng và tôn thờ tính bền vững của thời trang.",
    frame1: {
      main: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=800&auto=format&fit=crop"
    },
    frame2: {
      main: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop",
      alt: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
    }
  }
];

export default function EditorialCuration() {
  const [activeTab, setActiveTab] = useState<string>("women");
  const { data: featuredCats } = useFeaturedCategories();

  // Find lookbook config for active tab
  const activeLookbook = STATIC_LOOKBOOKS.find((l) => l.id === activeTab) || STATIC_LOOKBOOKS[0];

  // Try to find matching dynamic category slug to link to catalog
  const getDynamicSlug = (tabId: string) => {
    if (!featuredCats) return tabId;
    const matched = featuredCats.find(
      (c: { slug: string; name: string }) =>
        c.slug.toLowerCase().includes(tabId) ||
        c.name.toLowerCase().includes(tabId)
    );
    return matched ? matched.slug : tabId;
  };

  const activeSlug = getDynamicSlug(activeTab);

  return (
    <div className="w-full bg-background shadow-none border-none overflow-hidden">
      {/* Scope Lookbook Entry Transitions */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes lookbookFadeInUp {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-lookbook-fade-1 {
          animation: lookbookFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-lookbook-fade-2 {
          animation: lookbookFadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}} />

      <div className="client-page-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
          
          {/* Left Column: Curation & Router Controls */}
          <div className="md:col-span-5 flex flex-col items-start space-y-4 md:space-y-8">
            
            {/* Editorial Typography Header */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase block font-medium">
                01 / THE MANIFESTO
              </span>
              <h2 className="responsive-h2 text-foreground uppercase shadow-none font-serif tracking-[-0.02em] leading-[1.1]">
                THE <span className="italic font-light text-muted">EDITORIAL</span>
              </h2>
            </div>

            {/* Manifesto Description */}
            <p className="font-body text-base text-muted/80 leading-relaxed max-w-md shadow-none">
              {activeLookbook.manifesto}
            </p>

            {/* Curation Selector Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-3">
              <TabsList className="bg-transparent border-none p-0 flex flex-nowrap gap-4 overflow-x-auto">
                {STATIC_LOOKBOOKS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="px-6 py-3 rounded-button text-xs font-bold uppercase tracking-widest bg-background text-foreground border border-foreground/5 shadow-neo-sm hover:translate-y-[-1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm transition-all duration-300 ease-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-neo-inset-sm data-[state=active]:scale-[0.98] data-[state=active]:translate-y-[0.5px] data-[state=active]:border-foreground/10"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Call-to-action Link */}
            <div className="pt-3 md:pt-6">
              <Link
                to={`/catalog?categorySlug=${activeSlug}`}
                className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-300"
              >
                <span>Xem toàn bộ dòng sản phẩm</span>
                <svg 
                  className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

          </div>

          {/* Right Column: Overlapping Architectural Lookbook Gallery */}
          <div className="md:col-span-7 relative w-full h-[400px] sm:h-[500px] md:h-[650px] flex items-center justify-start group/gallery">
            
            {/* Frame 1: Large Vertical Shot */}
            <div 
              key={`frame1-${activeTab}`} 
              className="group relative w-2/3 aspect-[3/4] rounded-gallery overflow-hidden shadow-none transition-all duration-700 ease-out animate-lookbook-fade-1 z-10 self-start mt-6 group-hover/gallery:translate-x-2 group-hover/gallery:translate-y-1"
            >
              {/* Main Angle */}
              <img
                src={activeLookbook.frame1.main}
                alt={`${activeLookbook.name} lookbook main`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover rounded-gallery transition-all duration-700 ease-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.03]"
              />
              {/* Alternate Detail Angle */}
              <img
                src={activeLookbook.frame1.alt}
                alt={`${activeLookbook.name} lookbook detail`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover rounded-gallery transition-all duration-700 ease-out opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-[1.03]"
              />
            </div>

            {/* Frame 2: Smaller Close-up Macro Shot (Overlapping) */}
            <div 
              key={`frame2-${activeTab}`} 
              className="group absolute w-[46%] aspect-square rounded-gallery overflow-hidden shadow-neo transition-all duration-700 ease-out animate-lookbook-fade-2 z-20 bottom-4 right-0 sm:bottom-8 md:bottom-12 md:right-4 group-hover/gallery:-translate-x-2 group-hover/gallery:-translate-y-2"
            >
              {/* Main Angle */}
              <img
                src={activeLookbook.frame2.main}
                alt={`${activeLookbook.name} macro main`}
                loading="lazy"
                decoding="async"
                className="absolute bg-background p-1 inset-0 w-full h-full object-cover rounded-gallery transition-all duration-700 ease-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-[1.03]"
              />
              {/* Alternate Detail Angle */}
              <img
                src={activeLookbook.frame2.alt}
                alt={`${activeLookbook.name} macro detail`}
                loading="lazy"
                decoding="async"
                className="absolute bg-background p-1 inset-0 w-full h-full object-cover rounded-gallery transition-all duration-700 ease-out opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-[1.03]"
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
