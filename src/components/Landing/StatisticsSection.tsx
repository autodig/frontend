// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/components/Landing/StatisticsSection.tsx

import { TrendingUp, PhoneCall, Zap } from "lucide-react"; // Updated icons

export default function StatisticsSection() {
    const stats = [
        {
            number: "100%",
            label: "Expected Increase in Call Answer Rate",
            icon: PhoneCall, // Changed icon
        },
        {
            number: "3X",
            label: "Faster Prospect Qualification",
            icon: TrendingUp, // Changed icon
        },
        {
            number: "X100",
            label: "Overall Efficiency Multiplier", // Rephrased label
            icon: Zap,
        },
    ];

    return (
        <section className="w-full py-24 md:py-32 px-6 md:px-12 bg-background dark:bg-background text-foreground relative overflow-hidden">
            {/* Subtle Abstract Background Shapes/Glows - Adjusted Opacity */}
            <div className="absolute inset-0 z-0 opacity-10"
                style={{
                    background: 'radial-gradient(circle at 15% 30%, hsl(var(--autodig-gold)) 0%, transparent 35%), radial-gradient(circle at 85% 70%, hsl(var(--autodig-blue)) 0%, transparent 40%)'
                }}>
            </div>
            {/* Removed the black/20 gradient to allow background color to show better */}

            <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
                {/* Section Heading - Adjusted text color for background */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground text-center mb-16 leading-tight">
                    Your <span className="text-autodigPrimary">Impact</span> with AutoDig
                </h2>

                {/* Creative Statistics Layout */}
                <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-12 md:gap-8 lg:gap-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center text-center p-6 bg-card dark:bg-card rounded-xl shadow-xl transform transition-all duration-500 ease-in-out
                          hover:scale-105 hover:shadow-2xl cursor-pointer
                          ${index === 0 ? "md:-translate-x-8" : ""} {/* Offset first item */}
                          ${index === 2 ? "md:translate-x-8" : ""} {/* Offset last item */}
                          border border-border`}
                        >
                            {stat.icon && (
                                <stat.icon className="h-16 w-16 text-autodigPrimary mb-4" />
                            )}
                            <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-autodigPrimary mb-1 leading-none animate-fade-in-up">
                                {stat.number}
                            </p>
                            <p className="text-lg md:text-xl font-medium text-foreground opacity-90">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}