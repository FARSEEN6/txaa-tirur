import { useRef } from "react";
import { motion } from "framer-motion";

// Full list of popular car brands with their logos
const carBrands = [
    { name: "Maruti Suzuki", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Maruti_Suzuki_Logo.svg" },
    { name: "Hyundai", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Hyundai_Motor_Company_logo.svg" },
    { name: "Tata", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg" },
    { name: "Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mahindra_Rise_logo.svg" },
    { name: "Toyota", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carance_logo.svg" },
    { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/7/76/Honda_logo.svg" },
    { name: "Kia", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Kia-logo.svg" },
    { name: "MG", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/MG_Motor_logo.svg" },
    { name: "Skoda", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Skoda_Auto_logo_%282016%29.svg" },
    { name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg" },
    { name: "Mercedes-Benz", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Mercedes-Benz_Logo_2010.svg" },
    { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Audi", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" },
    { name: "Ford", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
    { name: "Renault", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2021_Text.svg" },
    { name: "Nissan", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nissan_logo.svg" },
    { name: "Jeep", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Jeep_logo.svg" },
    { name: "Citroen", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Citro%C3%ABn_2022_logo.svg" },
    { name: "Lexus", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Lexus_logo.svg" },
    { name: "Porsche", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Porsche_logo.svg" },
];

interface CarBrandsSliderProps {
    variant?: "compact" | "full";
    showTitle?: boolean;
    title?: string;
    backgroundColor?: string;
}

export default function CarBrandsSlider({
    variant = "compact",
    showTitle = true,
    title = "Shop Accessories By Car Brand",
    backgroundColor = "bg-gray-900",
}: CarBrandsSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Double the brands array for infinite scroll effect
    const displayBrands = [...carBrands, ...carBrands];

    const isCompact = variant === "compact";

    return (
        <section
            className={`${backgroundColor} ${isCompact ? "py-6" : "py-12"} overflow-hidden`}
        >
            <div className="container mx-auto px-4">
                {showTitle && (
                    <div className={`text-center ${isCompact ? "mb-4" : "mb-8"}`}>
                        <h2
                            className={`font-bold text-white tracking-tight ${isCompact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
                                }`}
                        >
                            {title}
                        </h2>
                        {!isCompact && (
                            <p className="text-gray-400 mt-2 text-sm">
                                Find the perfect accessories for your vehicle
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Auto-scrolling container */}
            <div className="relative w-full overflow-hidden">
                {/* Gradient overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

                {/* Scrolling track */}
                <motion.div
                    className="flex gap-4 md:gap-8"
                    animate={{
                        x: [0, -50 * carBrands.length * (isCompact ? 1 : 1.5)],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: isCompact ? 25 : 35,
                            ease: "linear",
                        },
                    }}
                    style={{ width: "fit-content" }}
                >
                    {displayBrands.map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}`}
                            className={`flex-shrink-0 ${isCompact
                                ? "w-24 h-16 md:w-32 md:h-20"
                                : "w-32 h-24 md:w-44 md:h-32"
                                } bg-white rounded-lg shadow-lg flex items-center justify-center p-3 md:p-4 hover:scale-105 transition-transform duration-300 cursor-pointer group`}
                        >
                            <div className="relative w-full h-full flex flex-col items-center justify-center">
                                {/* Brand Logo */}
                                <div
                                    className={`relative ${isCompact ? "w-12 h-8 md:w-16 md:h-10" : "w-16 h-12 md:w-24 md:h-16"
                                        }`}
                                >
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="absolute inset-0 w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                                {/* Brand Name */}
                                {!isCompact && (
                                    <span className="text-gray-600 text-xs mt-2 font-medium text-center truncate w-full">
                                        {brand.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
