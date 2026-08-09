import { SiteHeader } from "@/components/home/site-header";
import { HeroSection } from "@/components/home/hero-section";
import { PrinciplesMarquee } from "@/components/home/principles-marquee";
import { StatsSection } from "@/components/home/stats-section";
import { FeatureGrid } from "@/components/home/feature-grid";
import { LibraryMapSection } from "@/components/home/library-map-section";
import { AiLibrarianSection } from "@/components/home/ai-librarian-section";
import { ReadingAnalyticsSection } from "@/components/home/reading-analytics-section";
import { QuoteSection } from "@/components/home/quote-section";
import { CtaSection } from "@/components/home/cta-section";
import { SiteFooter } from "@/components/home/site-footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <PrinciplesMarquee />
        <StatsSection />
        <FeatureGrid />
        <LibraryMapSection />
        <AiLibrarianSection />
        <ReadingAnalyticsSection />
        <QuoteSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
