import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useHeroSlides } from "@/hooks/useHomeContent";
import type { HeroSlide } from "@/types/home";

// Fallback data (Monochrome)
const STATIC_SLIDES: HeroSlide[] = [
    {
        id: "slide1",
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228d948f?q=80&w=2000&auto=format&fit=crop", // Monochrome Car
        heading: "PRECISION ENGINEERING",
        subtitle: "ELEVATE YOUR DRIVE",
        subtext: "Experience the pinnacle of automotive excellence with our curated collection.",
        ctaText: "EXPLORE COLLECTION",
        ctaLink: "/shop",
        position: "left",
        enabled: true,
        order: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "slide2",
        imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop", // Dark Car
        heading: "DEFINITIVE STYLE",
        subtitle: "CARBON FIBER SERIES",
        subtext: "Lightweight, durable, and unmistakably premium. Upgrade your aesthetic.",
        ctaText: "VIEW SERIES",
        ctaLink: "/shop?category=carbon",
        position: "center",
        enabled: true,
        order: 2,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "slide3",
        imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2000&auto=format&fit=crop", // Night Car
        heading: "PERFORMANCE REDEFINED",
        subtitle: "ADVANCED AERODYNAMICS",
        subtext: "Optimized for speed and stability. Discover our aero components.",
        ctaText: "DISCOVER MORE",
        ctaLink: "/shop?category=performance",
        position: "right",
        enabled: true,
        order: 3,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

export default function PromotionalCarousel() {
    const { slides, loading, error } = useHeroSlides();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const activeSlides = slides.length > 0 ? slides : STATIC_SLIDES;

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [activeSlides.length, isAutoPlaying]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
        setIsAutoPlaying(false);
    };

    // Generate CSS filter string for image effects
    const getImageFilter = (slide: HeroSlide) => {
        const filters = [];
        if (slide.grayscale) filters.push("grayscale(100%)");
        if (slide.brightness && slide.brightness !== 100) filters.push(`brightness(${slide.brightness}%)`);
        if (slide.contrast && slide.contrast !== 100) filters.push(`contrast(${slide.contrast}%)`);
        if (slide.saturation && slide.saturation !== 100) filters.push(`saturate(${slide.saturation}%)`);
        return filters.length > 0 ? filters.join(" ") : "none";
    };

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-black text-white">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image - Dynamic Filters Applied */}
                    <div className="absolute inset-0">
                        <img
                            src={activeSlides[currentSlide].imageUrl}
                            alt={activeSlides[currentSlide].heading}
                            className="w-full h-full object-cover opacity-60"
                            style={{ filter: getImageFilter(activeSlides[currentSlide]) }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className={`max-w-2xl ${activeSlides[currentSlide].position === "center" ? "mx-auto text-center" :
                                activeSlides[currentSlide].position === "right" ? "ml-auto text-right" : "mr-auto text-left"
                                }`}
                        >
                            <h2
                                className="text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4"
                                style={{ color: activeSlides[currentSlide].subtitleColor || "#d1d5db" }}
                            >
                                {activeSlides[currentSlide].subtitle}
                            </h2>
                            <h1
                                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-6 leading-[0.9]"
                                style={{ color: activeSlides[currentSlide].titleColor || "#ffffff" }}
                            >
                                {activeSlides[currentSlide].heading}
                            </h1>
                            <p
                                className="text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
                                style={{ color: activeSlides[currentSlide].subtitleColor || "#d1d5db" }}
                            >
                                {activeSlides[currentSlide].subtext}
                            </p>

                            <Link
                                to={activeSlides[currentSlide].ctaLink}
                                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all group"
                                style={{
                                    backgroundColor: activeSlides[currentSlide].buttonBgColor || "#ffffff",
                                    color: activeSlides[currentSlide].buttonTextColor || "#000000"
                                }}
                            >
                                {activeSlides[currentSlide].ctaText}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {activeSlides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setCurrentSlide(idx);
                            setIsAutoPlaying(false);
                        }}
                        className={`w-12 h-1 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white" : "bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:flex"
            >
                <ChevronRight size={32} className="rotate-180" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:flex"
            >
                <ChevronRight size={32} />
            </button>
        </section>
    );
}
