import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { HeroSlide } from "@/types/home";

interface HeroCarouselProps {
    slides?: HeroSlide[];
}

export default function HeroCarousel({ slides = [] }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fallback slides if no data from Firebase
    const fallbackSlides: HeroSlide[] = [
        {
            id: "fallback-1",
            heading: "",
            subtext: "",
            ctaText: "",
            ctaLink: "/shop",
            imageUrl: "/assets/hero-bmw.jpg",
            enabled: true,
            order: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ];

    const displaySlides = slides.length > 0 ? slides : fallbackSlides;
    const enabledSlides = displaySlides.filter(slide => slide.enabled);

    // Auto-advance slides
    useEffect(() => {
        if (enabledSlides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % enabledSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [enabledSlides.length]);

    if (enabledSlides.length === 0) {
        return null; // Don't render if no enabled slides
    }

    const currentSlideData = enabledSlides[currentSlide];

    // Generate CSS filter string
    const getImageFilter = (slide: HeroSlide) => {
        const filters = [];
        if (slide.grayscale) filters.push("grayscale(100%)");
        if (slide.brightness && slide.brightness !== 100) filters.push(`brightness(${slide.brightness}%)`);
        if (slide.contrast && slide.contrast !== 100) filters.push(`contrast(${slide.contrast}%)`);
        if (slide.saturation && slide.saturation !== 100) filters.push(`saturate(${slide.saturation}%)`);
        return filters.length > 0 ? filters.join(" ") : "none";
    };

    // Get alignment classes
    const getAlignmentClasses = (align?: string) => {
        switch (align) {
            case "left":
                return "items-start text-left pl-8 md:pl-16";
            case "right":
                return "items-end text-right pr-8 md:pr-16";
            default:
                return "items-center text-center";
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image with Ken Burns Effect */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${currentSlideData.imageUrl})`,
                            filter: getImageFilter(currentSlideData)
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Semi-transparent Dark Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content - Positioned based on textAlign */}
            {(currentSlideData.heading || currentSlideData.subtext || currentSlideData.ctaText) && (
                <div className={`absolute inset-0 z-20 flex flex-col ${getAlignmentClasses(currentSlideData.textAlign)} justify-center px-6`}>
                    <motion.div
                        key={`content-${currentSlide}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={currentSlideData.textAlign === "center" ? "max-w-4xl" : "max-w-2xl"}
                    >
                        {/* Main Headline */}
                        {currentSlideData.heading && (
                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight"
                                style={{ color: currentSlideData.titleColor || "#ffffff" }}
                            >
                                {currentSlideData.heading}
                            </h1>
                        )}

                        {/* Tagline */}
                        {currentSlideData.subtext && (
                            <p
                                className="text-lg md:text-xl font-light max-w-2xl mb-12 leading-relaxed"
                                style={{ color: currentSlideData.subtitleColor || "#d1d5db" }}
                            >
                                {currentSlideData.subtext}
                            </p>
                        )}

                        {/* CTA Button */}
                        {currentSlideData.ctaText && (
                            <div className={`flex ${currentSlideData.textAlign === "left" ? "justify-start" :
                                    currentSlideData.textAlign === "right" ? "justify-end" :
                                        "justify-center"
                                }`}>
                                <Link
                                    to={currentSlideData.ctaLink || "/shop"}
                                    className="group inline-flex items-center gap-3 px-10 py-5 text-sm font-bold tracking-[0.15em] uppercase hover:opacity-90 transition-all duration-300"
                                    style={{
                                        backgroundColor: currentSlideData.buttonBgColor || "#ffffff",
                                        color: currentSlideData.buttonTextColor || "#000000",
                                    }}
                                >
                                    {currentSlideData.ctaText}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-white/50 animate-bounce">
                <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll</span>
                <ChevronDown size={20} />
            </div>

            {/* Slide Progress Indicators */}
            {enabledSlides.length > 1 && (
                <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                    {enabledSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`transition-all duration-500 h-1 ${idx === currentSlide
                                ? "w-10 bg-white"
                                : "w-6 bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
