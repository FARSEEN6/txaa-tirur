"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CategoriesPage() {
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-black" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Discover</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tighter uppercase font-heading">
                        Our Collections
                    </h1>
                </div>

                {/* Grid - Framed Template */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="group"
                        >
                            <Link
                                href={`/shop?category=${encodeURIComponent(category.name)}`}
                                className="block"
                            >
                                {/* Frame Container */}
                                <div className="bg-white p-4 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">

                                    {/* Image Container with Inner Border/Matte Effect */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 mb-6 border border-gray-100">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105"
                                        />

                                        {/* Overlay (Subtle) */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>

                                    {/* Content - Clean & Minimal */}
                                    <div className="flex justify-between items-end px-2 pb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-black tracking-widest uppercase mb-1 font-heading group-hover:opacity-70 transition-opacity">
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase line-clamp-1">
                                                Premium Accessories
                                            </p>
                                        </div>

                                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300">
                                            <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
