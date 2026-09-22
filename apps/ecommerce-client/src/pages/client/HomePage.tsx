import { lazy, Suspense } from "react";
import Hero from "@widgets/client/Hero/Hero";

// Lazy load below-the-fold components to improve initial load time and LCP
const EditorialCuration = lazy(() => import("@widgets/client/EditorialCuration/EditorialCuration"));
const ProductGridShowcase = lazy(() => import("@widgets/client/Product/ProductGridShowcase"));
const VirtualStylingLounge = lazy(() => import("@widgets/client/Product/VirtualStylingLounge"));
const CampaignJournal = lazy(() => import("@widgets/client/Journal/CampaignJournal"));

// Minimal fallback skeleton to prevent Cumulative Layout Shift (CLS)
const SectionFallback = () => (
  <div className="w-full min-h-[50vh] bg-background animate-pulse" />
);

const PromotionsBanner = lazy(() => import("@widgets/client/Promotions/PromotionsBanner"));

export default function HomePage() {
  return (
    <div className="w-full bg-background flex flex-col items-center space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-28 xl:space-y-32">
      
      {/* 1. HERO SECTION (Eagerly loaded for LCP) */}
      <section id="hero" className="w-full h-[100dvh] relative overflow-hidden">
        <Hero />
      </section>

      <Suspense fallback={<SectionFallback />}>
        {/* PROMOTIONS BANNER */}
        <section id="promotions" className="w-full">
          <PromotionsBanner />
        </section>

        {/* 2. EDITORIAL CURATION */}
        <section id="curation" className="w-full">
          <EditorialCuration />
        </section>

        {/* 3. PRODUCT GRID SHOWCASE */}
        <section id="featured" className="w-full">
          <ProductGridShowcase limit={8} />
        </section>

        {/* 4. VIRTUAL STYLING LOUNGE */}
        <section id="styling-lounge" className="w-full">
          <VirtualStylingLounge />
        </section>

        {/* 5. CAMPAIGN JOURNAL & NEWSLETTER */}
        <section id="journal" className="w-full">
          <CampaignJournal />
        </section>
      </Suspense>

    </div>
  );
}
