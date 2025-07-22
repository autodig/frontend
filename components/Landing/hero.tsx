import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] py-20 px-6 md:px-12 bg-background text-foreground relative overflow-hidden">
      {/* Remove specific background effects from previous screenshot, use main background */}
      {/* If you want a subtle, clean pattern, you could add one here, e.g.: */}
      {/* <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("/subtle-pattern.png")', backgroundSize: 'cover' }}></div> */}
      {/* Or a very faint gradient: */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-background to-autodigBlue/5"></div>


      {/* Main Content Area - Centralized and Prominent */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        {/* Main Heading - combined and styled for prominence */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-tight mb-4 tracking-wide drop-shadow-sm">
          Multiply Your <span className="text-autodigPrimary">TIME</span>,<br className="sm:hidden" /> Maximize Your <span className="text-autodigPrimary">MONEY</span>.
        </h1>
        <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-autodigPrimary animate-pulse drop-shadow-md mb-8">
          X100
        </h2>

        {/* Descriptive Paragraph */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed opacity-90">
          AutoDig provides cutting-edge tools to streamline your fundraising efforts,
          transforming raw data into actionable insights and significantly boosting your outreach efficiency.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <Link href="/dashboard" passHref>
            <Button
              variant="default"
              size="lg"
              className="bg-autodigPrimary text-autodigPrimary-foreground hover:bg-autodigPrimary/90
                         px-8 py-4 text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105"
            >
              BEGIN YOUR JOURNEY
            </Button>
          </Link>
          <Link href="/features" passHref> {/* Assuming a features page exists */}
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-autodigBlue text-autodigBlue hover:bg-autodigBlue hover:text-white
                         px-8 py-4 text-lg rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}