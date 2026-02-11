import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLamborghiniStyleSection } from "@/lib/homeContentService";
import type { LamborghiniStyleSection } from "@/types/home";

export default function LamborghiniStyleSection() {
    const [sectionData, setSectionData] = useState<LamborghiniStyleSection | null>(null);

    useEffect(() => {
        getLamborghiniStyleSection().then(setSectionData);
    }, []);

    // Defaults if no data
    const data = sectionData || {
        heading: "UNLEASH YOUR TRUE STYLE",
        subHeading: "TXAA PREMIUM",
        imageUrl: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2574&auto=format&fit=crop",
        ctaText: "Explore The Collection",
        ctaLink: "/shop",
        secondaryCtaText: "Download Brochure",
        titleColor: "#000000",
        descriptionColor: "#000000",
        textAlign: "center",
        fontSize: "large",
        grayscale: true,
        brightness: 100,
        contrast: 125,
        imageHeight: "auto",
        imageWidth: "100%",
        imagePosition: "center"
    };

    const getImageFilter = () => {
        const filters = [];
        if (data.grayscale) filters.push("grayscale(100%)");
        if (data.brightness && data.brightness !== 100) filters.push(`brightness(${data.brightness}%)`);
        if (data.contrast && data.contrast !== 100) filters.push(`contrast(${data.contrast}%)`);
        return filters.join(" ");
    };

    const getHeadingSize = () => {
        switch (data.fontSize) {
            case 'small': return "text-2xl md:text-4xl";
            case 'medium': return "text-3xl md:text-5xl";
            case 'large': default: return "text-4xl md:text-7xl";
        }
    };

    return (
        <section className="relative w-full bg-white text-black py-24 md:py-32 overflow-hidden border-t border-gray-100">
            {/* Background Text - Subtle & Clean */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <span
                    className="text-[12rem] md:text-[20rem] font-black uppercase tracking-tighter whitespace-nowrap"
                    style={{ color: data.descriptionColor }}
                >
                    {data.subHeading}
                </span>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div
                    className="flex flex-col items-center"
                    style={{ textAlign: data.textAlign || 'center' as any }}
                >

                    {/* Main Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`${getHeadingSize()} font-bold font-heading uppercase tracking-tight mb-8`}
                        style={{ color: data.titleColor }}
                    >
                        {data.heading}
                    </motion.h2>

                    {/* Car Image (Side Profile) */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative w-full max-w-5xl mb-12"
                    >
                        {/* Shadow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-black/5 blur-[100px] rounded-full"></div>

                        <img
                            src={data.imageUrl}
                            alt="Premium Feature"
                            className="relative drop-shadow-2xl z-10 block mx-auto"
                            style={{
                                filter: getImageFilter(),
                                height: data.imageHeight !== 'auto' ? data.imageHeight : undefined,
                                width: data.imageWidth,
                                objectFit: 'contain',
                                objectPosition: data.imagePosition
                            }}
                        />
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link
                            to={data.ctaLink}
                            className="btn-primary"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {data.ctaText} <ArrowRight size={16} />
                            </span>
                        </Link>

                        {data.secondaryCtaText && (
                            <button
                                className="btn-outline border-black text-black hover:bg-black hover:text-white"
                            >
                                <span className="flex items-center gap-2">
                                    {data.secondaryCtaText} <Download size={16} />
                                </span>
                            </button>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
