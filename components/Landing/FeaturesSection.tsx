// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/components/Landing/FeaturesSection.tsx

import { Zap, TrendingUp, Handshake, ShieldCheck } from "lucide-react"; // Example icons

export default function FeaturesSection() {
    const features = [
        {
            icon: Zap,
            title: "Automated Data Processing",
            description: "Effortlessly process call data. Get actionable insights in minutes.", // Less words, bigger impact
        },
        {
            icon: TrendingUp,
            title: "AI-Powered Recommendations",
            description: "Identify high-potential contacts. Optimize outreach for maximum impact.", // Less words, bigger impact
        },
        {
            icon: Handshake,
            title: "Boost Engagement & Conversion",
            description: "Build strong relationships with confidence. Increase success rates.", // Less words, bigger impact
        },
        {
            icon: ShieldCheck,
            title: "Secure & Compliant",
            description: "Your data is paramount. Strict security protocols ensure compliance.", // Less words, bigger impact
        },
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-card dark:bg-card text-foreground">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* Section Heading */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 leading-tight">
                    Why Choose <span className="text-autodigPrimary">AutoDig</span>?
                </h2>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-background dark:bg-background p-8 rounded-xl shadow-lg flex flex-col items-center text-center
                         border border-border transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <feature.icon className="h-16 w-16 text-autodigPrimary mb-6" />
                            <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed"> {/* Increased font size here */}
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}