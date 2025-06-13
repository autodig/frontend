// autodig/frontend/autodig-frontend-470702cf2794d95bdc7a69cd570de108566511ec/components/Landing/HowItWorksSection.tsx

import { UploadCloud, Lightbulb, PhoneCall, Rocket } from "lucide-react"; // Icons for steps
import { ArrowRight } from "lucide-react"; // Icon for progression

export default function HowItWorksSection() {
    const steps = [
        {
            icon: UploadCloud,
            title: "Upload Data",
            description: "Securely import your call records. Effortless processing.",
        },
        {
            icon: Lightbulb,
            title: "Generate Insights",
            description: "AI analyzes data, uncovering hidden patterns and actionable recommendations.",
        },
        {
            icon: PhoneCall,
            title: "Action & Connect",
            description: "Utilize precise insights to prioritize outreach and engage high-potential contacts.",
        },
        {
            icon: Rocket,
            title: "Optimize Growth",
            description: "Track performance, refine strategies, and continuously boost efficiency.",
        },
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-card dark:bg-card text-foreground">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* Section Heading */}
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 leading-tight">
                    The <span className="text-autodigPrimary">AutoDig</span> Process
                </h2>

                {/* Centralized, Elegant Container for Steps */}
                <div className="bg-card dark:bg-card p-8 lg:p-12 rounded-2xl shadow-2xl border border-border relative overflow-hidden w-full">
                    {/* Subtle background glow/effect */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-autodigPrimary/10 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-autodigBlue/10 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2"></div>

                    {/* Steps Flex Container - Changed from grid to flex for better arrow control */}
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-center text-center max-w-xs p-4 flex-grow" // flex-grow to distribute space
                            >
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center h-20 w-20 rounded-xl bg-autodigPrimary/10 dark:bg-autodigPrimary/20 text-autodigPrimary mb-6 flex-shrink-0">
                                        <step.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
                                </div>

                                {/* Arrow - only show if it's not the last step and on large screens */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex items-center justify-center ml-4 mr-0 flex-shrink-0"> {/* Adjusted margin for arrow */}
                                        <ArrowRight className="h-8 w-8 text-muted-foreground opacity-50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}