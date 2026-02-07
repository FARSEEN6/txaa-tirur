import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const panels = [
    {
        title: "PREMIUM INTERIORS",
        subtitle: "Handcrafted Excellence",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=Seat Covers",
        number: "01"
    },
    {
        title: "AMBIENT LIGHTING",
        subtitle: "Atmosphere Perfected",
        image: "https://images.unsplash.com/photo-1517153673752-6a695394be5f?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=Inside",
        number: "02"
    },
    {
        title: "CARBON FIBER",
        subtitle: "Performance Aesthetic",
        image: "https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?q=80&w=1200&auto=format&fit=crop",
        link: "/shop?category=Performance",
        number: "03"
    }
];

export default function SplitHero() {
    return (
        <section className="relative w-full overflow-hidden bg-white flex flex-col md:flex-row min-h-[60vh] md:min-h-screen">
            {panels.map((panel, idx) => (
                <Link
                    key={idx}
                    to={panel.link}
                    className="group relative flex-1 min-h-[220px] md:min-h-full border-b md:border-b-0 md:border-r border-gray-200 last:border-0 overflow-hidden"
                >
                    {/* Background Image with Hover Zoom */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 brightness-75"
                        style={{ backgroundImage: `url(${panel.image})` }}
                    />

                    {/* Light Overlay - Gets darker on hover for depth */}
                    <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors duration-500" />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            {/* Subtitle */}
                            <span className="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase mb-3 block group-hover:text-white transition-colors duration-500">
                                {panel.subtitle}
                            </span>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-[0.08em] uppercase transition-all duration-500">
                                {panel.title}
                            </h3>

                            {/* Arrow indicator */}
                            <div className="mt-4 w-8 h-[2px] bg-white/40 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
                        </motion.div>
                    </div>

                    {/* Panel Number */}
                    <div className="absolute top-8 right-8 text-[10px] font-bold text-white/40 tracking-widest group-hover:text-white/80 transition-colors duration-500">
                        {panel.number}
                    </div>
                </Link>
            ))}

            {/* Central Overlay for Main Text */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="px-4"
                >
                    {/* Tagline */}
                    <div className="text-[10px] md:text-xs font-bold text-white/80 tracking-[0.5em] uppercase mb-6 backdrop-blur-sm bg-black/20 px-4 py-2 rounded inline-block">
                        EXPLORE PREMIUM
                    </div>

                    {/* Main Title */}
                    <h2
                        className="text-4xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.02em] mb-8 leading-none"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            textShadow: '0 4px 40px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.8)'
                        }}
                    >
                        LUXURY REFINED
                    </h2>

                    {/* CTA */}
                    <div className="pointer-events-auto">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:bg-black hover:text-white border-2 border-white"
                        >
                            View Collection
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-6 left-0 w-full z-20 px-8 flex justify-between items-end text-white/60 pointer-events-none">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    Est. 2024
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    TXAA Automotive
                </div>
            </div>
        </section>
    );
}
