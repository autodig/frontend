import Hero from "@/components/Landing/Hero";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HowItWorksSection from "@/components/Landing/HowItWorksSection";
import StatisticsSection from "@/components/Landing/StatisticsSection";
import Nav from "@/components/layout/Nav"; // Import Nav
import Footer from "@/components/layout/Footer"; // Import Footer


export default async function Home() {
  return (
    <div className="flex flex-col  w-full items-center">
      <Nav />
      {/* The Hero component */}
      <Hero />

      {/* The Features Section */}
      <FeaturesSection />

      {/* The How It Works Section */}
      <HowItWorksSection />

      {/* The new Statistics Section */}
      <StatisticsSection />

      {/* Optionally, if you want Testimonials after Statistics: */}
      {/* import TestimonialsSection from "@/components/Landing/TestimonialsSection"; */}
      {/* <TestimonialsSection /> */}
      <Footer />
    </div>
  );
}