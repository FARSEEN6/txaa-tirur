import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Maximize2 } from "lucide-react";
import { useCategoryTabs } from "@/hooks/useHomeContent";
import { CATEGORY_TABS } from "@/types/home";
import ImageModal from "@/components/ui/ImageModal";

// Category data structure with real car accessory images (Fallback)
const staticCategoryData: Record<string, any[]> = {
    "INTERIOR": [
        { name: "Car Comfort", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=800&fit=crop", link: "/shop?category=Car Comfort" },
        { name: "Steering Wheel Covers", image: "https://images.unsplash.com/photo-1449130623583-2346e4e4c5b0?w=600&h=800&fit=crop", link: "/shop?category=Steering Wheel Covers" },
        { name: "Car Armrest", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=800&fit=crop", link: "/shop?category=Car Armrest" },
        { name: "Door Scuff Plates", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=800&fit=crop", link: "/shop?category=Door Scuff Plates" },
        { name: "Car Mats", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=800&fit=crop", link: "/shop?category=Car Mats" },
        { name: "Car Parcel Tray", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=800&fit=crop", link: "/shop?category=Car Parcel Tray" },
        { name: "Car Perfume", image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600&h=800&fit=crop", link: "/shop?category=Car Perfume" },
        { name: "Seat Covers", image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=800&fit=crop", link: "/shop?category=Seat Covers" },
        { name: "Sun Shades", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=800&fit=crop", link: "/shop?category=Sun Shades" },
        { name: "Gear Knobs", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=800&fit=crop", link: "/shop?category=Gear Knobs" },
    ],
    "EXTERIOR": [
        { name: "Body Covers", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=800&fit=crop", link: "/shop?category=Body Covers" },
        { name: "Door Visors", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop", link: "/shop?category=Door Visors" },
        { name: "Bumper Protectors", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=800&fit=crop", link: "/shop?category=Bumper Protectors" },
        { name: "Mud Flaps", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=800&fit=crop", link: "/shop?category=Mud Flaps" },
        { name: "Spoilers", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=800&fit=crop", link: "/shop?category=Spoilers" },
        { name: "Chrome Accessories", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=800&fit=crop", link: "/shop?category=Chrome Accessories" },
    ],
    "LIGHTING": [
        { name: "LED Headlights", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=800&fit=crop", link: "/shop?category=LED Headlights" },
        { name: "Ambient Lights", image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&h=800&fit=crop", link: "/shop?category=Ambient Lights" },
        { name: "Fog Lights", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=800&fit=crop", link: "/shop?category=Fog Lights" },
        { name: "Tail Lights", image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&h=800&fit=crop", link: "/shop?category=Tail Lights" },
        { name: "DRL Lights", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=800&fit=crop", link: "/shop?category=DRL Lights" },
    ],
    "CAR UTILITY": [
        { name: "Vacuum Cleaner", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop", link: "/shop?category=Vacuum Cleaner" },
        { name: "Car Chargers", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=800&fit=crop", link: "/shop?category=Car Chargers" },
        { name: "Phone Holders", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&fit=crop", link: "/shop?category=Phone Holders" },
        { name: "Car Organizers", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=800&fit=crop", link: "/shop?category=Car Organizers" },
        { name: "First Aid Kit", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=800&fit=crop", link: "/shop?category=First Aid Kit" },
    ],
    "CAR ELECTRONICS": [
        { name: "Dash Cameras", image: "https://images.unsplash.com/photo-1558618047-f4b511d0397e?w=600&h=800&fit=crop", link: "/shop?category=Dash Cameras" },
        { name: "Car Stereos", image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=800&fit=crop", link: "/shop?category=Car Stereos" },
        { name: "Speakers", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=800&fit=crop", link: "/shop?category=Speakers" },
        { name: "GPS Trackers", image: "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=600&h=800&fit=crop", link: "/shop?category=GPS Trackers" },
    ],
    "CAR CARE & STYLING": [
        { name: "Car Polish", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=800&fit=crop", link: "/shop?category=Car Polish" },
        { name: "Cleaning Kits", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&h=800&fit=crop", link: "/shop?category=Cleaning Kits" },
        { name: "Microfiber Cloths", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop", link: "/shop?category=Microfiber Cloths" },
        { name: "Wax & Sealants", image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&h=800&fit=crop", link: "/shop?category=Wax Sealants" },
    ],
};

const categories = Object.keys(staticCategoryData);

export default function CategoryNav() {
    const { items, getItemsByTab, loading } = useCategoryTabs();
    // Use dynamic categories list to include newly added groups if any
    const displayCategories = CATEGORY_TABS;
    const [activeCategory, setActiveCategory] = useState<string>(displayCategories[0]);
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

    const dynamicItems = getItemsByTab(activeCategory);
    const hasDynamicForThisTab = dynamicItems.length > 0;

    const currentItems = hasDynamicForThisTab && dynamicItems
        ? dynamicItems
        : staticCategoryData[activeCategory];

    return (
        <section className="py-24 bg-white relative border-t border-gray-100">
            <div className="container mx-auto px-4">

                {/* Floating Pill Tabs */}
                <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
                    <div className="bg-gray-50 p-1.5 rounded-full inline-flex gap-2 border border-gray-200">
                        {displayCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 z-10 ${activeCategory === category
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                                    }`}
                            >
                                {activeCategory === category && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-black rounded-full z-[-1]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Premium Portrait Grid */}
                {/* Only verify loading if we have zero items globally, otherwise assume cached/static is fine */}
                {loading && items.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        >
                            {currentItems && currentItems.map((item: any, idx: number) => {
                                const isLegacy = item.grayscale === undefined && item.brightness === undefined;
                                const hasCustomColor = !!item.titleColor;

                                const getFilterStyle = () => {
                                    if (isLegacy) return undefined;
                                    const filters = [];
                                    if (item.grayscale) filters.push("grayscale(100%)");
                                    if (item.brightness && item.brightness !== 100) filters.push(`brightness(${item.brightness}%)`);
                                    if (item.contrast && item.contrast !== 100) filters.push(`contrast(${item.contrast}%)`);
                                    return filters.length > 0 ? filters.join(" ") : "none";
                                };

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage({ url: item.image, alt: item.name })}
                                        className="group relative block aspect-[3/4] rounded-sm overflow-hidden bg-gray-100 cursor-zoom-in border border-gray-100"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLegacy ? "grayscale group-hover:grayscale-0" : ""}`}
                                            style={{ filter: getFilterStyle() }}
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-left">
                                            <span className={`inline-block w-8 h-0.5 mb-3 origin-left group-hover:w-12 transition-all duration-300 ${hasCustomColor ? "" : "bg-white"}`}
                                                style={{ backgroundColor: hasCustomColor ? item.titleColor : undefined }}></span>
                                            <h3 className={`text-lg font-bold tracking-wide leading-tight group-hover:-translate-y-1 transition-transform duration-300 ${hasCustomColor ? "" : "text-white"}`}
                                                style={{ color: item.titleColor }}>
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                                <span className={`text-xs font-bold uppercase tracking-widest ${hasCustomColor ? "" : "text-white"}`}
                                                    style={{ color: item.titleColor }}>View Image</span>
                                                <Maximize2 size={14} className={`${hasCustomColor ? "" : "text-white"}`} style={{ color: item.titleColor }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Lightbox Modal */}
            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                imageUrl={selectedImage?.url || ""}
                altText={selectedImage?.alt}
            />
        </section>
    );
}
