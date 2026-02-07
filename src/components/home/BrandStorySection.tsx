import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { BrandStory } from "@/types/home";

interface BrandStoryProps {
    story?: BrandStory | null;
}

export default function BrandStorySection({ story }: BrandStoryProps) {
    // Fallback data if no Firebase data exists
    const fallbackStory: BrandStory = {
        heading: "Driven by Design.",
        description: "At TXAA, we believe your vehicle is an extension of your identity. Our premium collection is curated for those who demand excellence in every detail. From precision-engineered lighting to luxurious interior enhancements, we bring you the finest automotive accessories.",
        imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=1000&fit=crop",
        ctaText: "Our Story",
        ctaLink: "/about",
        updatedAt: Date.now(),
    };

    const displayStory = story || fallbackStory;

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden">
                        <img
                            src={displayStory.imageUrl}
                            alt="Brand Story"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-black">
                            {displayStory.heading}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light whitespace-pre-line">
                            {displayStory.description}
                        </p>
                        {displayStory.ctaText && (
                            <Link
                                to={displayStory.ctaLink || "/about"}
                                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase hover:gap-6 transition-all"
                            >
                                {displayStory.ctaText} <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
