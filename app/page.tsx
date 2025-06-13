// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/app/page.tsx
import Hero from "@/components/Landing/hero";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HowItWorksSection from "@/components/Landing/HowItWorksSection";
import StatisticsSection from "@/components/Landing/StatisticsSection"; // Import the new component

export default async function Home() {
  return (
    <div className="flex flex-col  w-full items-center">
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
    </div>
  );
}