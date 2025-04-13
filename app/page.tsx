// @/app/page.tsx
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingBooks } from "@/components/home/trending-books"
import { Categories } from "@/components/home/categories"
import { AppFeatures } from "@/components/home/app-features"
import { DownloadApp } from "@/components/home/download-app"
import { Testimonials } from "@/components/home/testimonials"
import { HowItWorks } from "@/components/home/how-it-works"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main hero section */}
        <section className="animate-fade-in">
          <HeroSection />
        </section>
        
        {/* How the platform works */}
        <section className="animate-fade-in mt-24">
          <HowItWorks />
        </section>
        
        {/* Popular books section */}
        <section className="animate-fade-in mt-24">
          <TrendingBooks />
        </section>
        
        {/* Book categories */}
        <section className="animate-fade-in mt-24">
          <Categories />
        </section>
        
        {/* App features and benefits */}
        <section className="animate-fade-in mt-24">
          <AppFeatures />
        </section>
        
        {/* User testimonials */}
        <section className="animate-fade-in mt-24">
          <Testimonials />
        </section>
        
        {/* Mobile app download section */}
        <section className="animate-fade-in mt-24">
          <DownloadApp />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}