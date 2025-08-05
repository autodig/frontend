import Hero from "@/src/components/Landing/Hero";
import FeaturesSection from "@/src/components/Landing/FeaturesSection";
import HowItWorksSection from "@/src/components/Landing/HowItWorksSection";
import StatisticsSection from "@/src/components/Landing/StatisticsSection";
import Nav from "@/src/components/layout/Nav"; // Import Nav
import Footer from "@/src/components/layout/Footer"; // Import Footer
import LandingPage from "@/src/components/LandingPage";

export default function Home() {
  return (
    <LandingPage>
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
    </LandingPage>
  );
}