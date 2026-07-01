import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import PromoBanner from "@/components/home/promo-banner";
import FeaturedProducts from "@/components/home/featured-products";
import Categories from "@/components/home/categories";
import AboutSection from "@/components/home/about-section";
import Testimonials from "@/components/home/testimonials";
import SocialPreview from "@/components/home/social-preview";
import Faq from "@/components/home/faq";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PromoBanner />
        <FeaturedProducts />
        <Categories />
        <AboutSection />
        <Testimonials />
        <SocialPreview />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
