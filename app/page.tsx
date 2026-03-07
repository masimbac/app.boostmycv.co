import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products";
import { ServicesSection } from "@/components/sections/services";
import { PricingSection } from "@/components/sections/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <ServicesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
