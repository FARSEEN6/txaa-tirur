import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useHeroSlides } from "@/hooks/useHomeContent";

const staticSlides = [
    {
        id: "static-1",
        bgColor: "bg-[#FF7F50]", // Coral
        tag: "NEW ARRIVAL",
        title: "SUMMER",
        subtitle: "COLLECTION",
        discount: "30% OFF",
        description: "Upgrade your drive with our latest premium accessories.",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop", // Car lifestyle
        ctaText: "SHOP NOW",
        ctaLink: "/shop",
        textColor: "text-white"
    },
    {
        id: "static-2",
        bgColor: "bg-[#FFB347]", // Pastel Orange
        tag: "LIMITED OFFER",
        title: "PREMIUM",
        subtitle: "INTERIORS",
        discount: "FLAT 50%",
        description: "Luxury seat covers and mats at unbeatable prices.",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop",
        ctaText: "GRAB DEAL",
        ctaLink: "/shop?category=Seat%20Covers",
        textColor: "text-gray-900"
    },
    {
        id: "static-3",
        bgColor: "bg-[#FF6B6B]", // Light Red
        tag: "TRENDING",
        title: "SPORT",
        subtitle: "EDITION",
        discount: "HOT DEAL",
        description: "Transform your vehicle with our sport edition kit.",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2eb059?q=80&w=1000&auto=format&fit=crop",
        ctaText: "EXPLORE",
        ctaLink: "/shop",
        textColor: "text-white"
    }
];

export default function PromotionalCarousel() {
    const { enabledSlides, loading } = useHeroSlides();
    const [current, setCurrent] = useState(0);

    // Map backend data to carousel format or use static fallback
    const slides = enabledSlides.length > 0 ? enabledSlides.map(slide => ({
        id: slide.id,
        bgColor: slide.bgColor || "#ffffff",
        tag: slide.tag || "",
        title: slide.heading,
        subtitle: slide.subtitle || "",
        discount: slide.discount || "",
        description: slide.subtext,
        image: slide.imageUrl,
        ctaText: slide.ctaText || "Shop Now",
        ctaLink: slide.ctaLink || "/shop",
        textColor: slide.textColor || "text-black"
    })) : staticSlides;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="w-full bg-white py-8 md:py-12 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative w-full h-[500px] md:h-[600px] mx-auto overflow-hidden rounded-[2rem] shadow-2xl">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={current}
                            initial={{ x: 1000, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -1000, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className={`absolute inset-0 w-full h-full flex items-center ${slides[current].bgColor.startsWith('#') ? '' : slides[current].bgColor}`}
                            style={{ backgroundColor: slides[current].bgColor.startsWith('#') ? slides[current].bgColor : undefined }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                                {/* Left Content */}
                                <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 text-left z-10">
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className={`inline-block text-sm font-bold tracking-[0.3em] mb-4 ${slides[current].textColor} opacity-80`}
                                    >
                                        {slides[current].tag}
                                    </motion.span>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className={`text-6xl md:text-8xl font-black tracking-tighter leading-none mb-2 ${slides[current].textColor}`}
                                    >
                                        {slides[current].title}
                                    </motion.h2>

                                    <motion.h3
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className={`text-4xl md:text-6xl font-bold tracking-tight mb-6 opacity-90 ${slides[current].textColor}`}
                                    >
                                        {slides[current].subtitle}
                                    </motion.h3>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mb-8"
                                    >
                                        <span className={`inline-block px-6 py-2 rounded-full border-2 ${slides[current].textColor === 'text-white' ? 'border-white text-white' : 'border-gray-900 text-gray-900'} font-bold text-xl`}>
                                            {slides[current].discount}
                                        </span>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className={`text-lg mb-8 max-w-md ${slides[current].textColor} opacity-80`}
                                    >
                                        {slides[current].description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <Link
                                            to={slides[current].ctaLink}
                                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-transform hover:scale-105 ${slides[current].textColor === 'text-white'
                                                ? 'bg-white text-black hover:bg-gray-100'
                                                : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {slides[current].ctaText}
                                            <ArrowRight size={18} />
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Right Image (Cutout effect) */}
                                <div className="relative hidden md:block h-full">
                                    <motion.div
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="absolute inset-0 flex items-center justify-center p-12"
                                    >
                                        {/* Circular/Organic shape background behind image for depth */}
                                        <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>

                                        <div className="relative w-full h-full max-h-[500px] max-w-[500px]">
                                            <img
                                                src={slides[current].image}
                                                alt={slides[current].title}
                                                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-700"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${current === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
