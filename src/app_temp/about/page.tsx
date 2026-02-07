"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Users, Globe, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')",
                    }}
                />
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-white/70 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 block">
                            About TXAA
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Driven by Design.
                        </h1>
                        <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                            We don't just sell car accessories — we craft experiences that transform your drive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">
                                Our Story
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                Redefining Automotive Excellence
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Founded in 2024, TXAA was born from a simple belief: your vehicle is an extension of
                                your identity. We saw a gap in the market for premium, meticulously curated car
                                accessories that blend form and function seamlessly.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                From LED lighting systems to handcrafted interiors, every product in our catalog is
                                selected with precision. We partner with the world's finest manufacturers to bring you
                                accessories that don't just fit — they elevate.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
                            >
                                Explore Collection
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative h-[500px]"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop"
                                alt="Premium Car Interior"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">
                            What Drives Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold">Our Core Values</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Award,
                                title: "Premium Quality",
                                description: "Only the finest materials and craftsmanship make it to our catalog.",
                            },
                            {
                                icon: Users,
                                title: "Customer First",
                                description: "Your satisfaction is our top priority, from browsing to delivery.",
                            },
                            {
                                icon: Globe,
                                title: "Global Standards",
                                description: "We source from manufacturers who meet international quality benchmarks.",
                            },
                            {
                                icon: Zap,
                                title: "Innovation",
                                description: "Constantly evolving our range with the latest automotive tech.",
                            },
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 text-center hover:shadow-lg transition-shadow duration-300"
                            >
                                <value.icon className="w-12 h-12 mx-auto mb-4 text-black" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-black text-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {[
                            { number: "10K+", label: "Happy Customers" },
                            { number: "500+", label: "Premium Products" },
                            { number: "50+", label: "Brands Partnered" },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">{stat.number}</h3>
                                <p className="text-gray-400 text-sm tracking-[0.2em] uppercase">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Ride?</h2>
                        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                            Browse our curated collection of premium car accessories designed to elevate your driving
                            experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-gray-800 transition-all duration-300"
                            >
                                Shop Now
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-black text-black text-sm font-bold tracking-[0.15em] uppercase hover:bg-black hover:text-white transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
