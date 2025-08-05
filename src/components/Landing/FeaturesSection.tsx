// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/components/Landing/FeaturesSection.tsx

import { Zap, TrendingUp, Handshake, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link"; // Corrected import for Next.js Link component

export default function FeaturesSection() {
    const features = [
        {
            icon: Zap,
            title: "Automated Data Processing",
            description: "Effortlessly process call data. Get actionable insights in minutes.",
            link: "#", // Placeholder link
        },
        {
            icon: TrendingUp,
            title: "AI-Powered Recommendations",
            description: "Identify high-potential contacts. Optimize outreach for maximum impact.",
            link: "#", // Placeholder link
        },
        {
            icon: Handshake,
            title: "Boost Engagement & Conversion",
            description: "Build strong relationships with confidence. Increase success rates.",
            link: "#", // Placeholder link
        },
        {
            icon: ShieldCheck,
            title: "Secure & Compliant",
            description: "Your data is paramount. Strict security protocols ensure compliance.",
            link: "#", // Placeholder link
        },
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-card dark:bg-card text-foreground relative overflow-hidden">
            {/* Subtle Abstract Background Shapes/Glows */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-autodigPrimary/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob -translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-autodigBlue/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 translate-x-1/4 translate-y-1/4"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-autodigPrimary/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>


            <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
                {/* Section Heading */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 leading-tight">
                    Why Choose <span className="text-autodigPrimary">AutoDig</span>?
                </h2>

                {/* Grid Layout inspired by the image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {features.map((feature, index) => {
                        const FeatureIcon = feature.icon;

                        // Determine card background and text colors based on index for alternation
                        // and highlighting AI-Powered Recommendations with autodigBlue
                        let cardBgClass = "bg-background dark:bg-card"; // Default light background
                        let textColorClass = "text-foreground"; // Default dark text
                        let iconColorClass = "text-autodigPrimary"; // Default icon color
                        let iconBgClass = "bg-autodigPrimary/10"; // Default icon background

                        const isHighlighted = (index === 1); // Check if it's the AI card

                        if (isHighlighted) { // AI-Powered Recommendations - Highlighted with Autodig Blue
                            cardBgClass = "bg-autodigBlue";
                            textColorClass = "text-white";
                            iconColorClass = "text-white"; // White icon on dark blue background
                            iconBgClass = "bg-white/10"; // Subtle white background for icon
                        } else if (index === 3) { // Secure & Compliant - Highlighted with Autodig Primary (Gold)
                            cardBgClass = "bg-autodigPrimary";
                            textColorClass = "text-white";
                            iconColorClass = "text-white"; // White icon on gold background
                            iconBgClass = "bg-white/10"; // Subtle white background for icon
                        }

                        return (
                            <div
                                key={index}
                                className={`
                                    ${cardBgClass} p-8 rounded-xl border border-border shadow-lg
                                    transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl
                                    group relative overflow-hidden flex flex-col justify-between
                                    ${textColorClass} custom-card-glow-shadow
                                `}
                            >
                                {/* Illustration/Icon Area */}
                                <div className="flex justify-between items-start mb-6 w-full">
                                    <h3 className="text-2xl font-bold leading-tight max-w-[70%]">
                                        {feature.title}
                                    </h3>
                                    {/* Large, abstract icon similar to image */}
                                    <div className={`
                                        ${iconBgClass} rounded-full flex items-center justify-center
                                        h-16 w-16 text-opacity-80
                                    `}>
                                        <FeatureIcon className={`h-8 w-8 ${iconColorClass}`} />
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-base mb-6 flex-grow">
                                    {feature.description}
                                </p>

                                {/* "Learn More" Link */}
                                <Link
                                    href={feature.link}
                                    className={`
                                        flex items-center gap-2 text-sm font-semibold
                                        group-hover:translate-x-1 transition-transform duration-200
                                        ${(index === 1 || index === 3) ? 'text-white hover:text-white/80' : 'text-foreground hover:text-autodigPrimary'}
                                    `}
                                >
                                    Learn more <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
