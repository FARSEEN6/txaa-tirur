import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/txaa-logo.png"
                            alt="TXAA Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-lg font-bold tracking-[0.15em] text-black uppercase">
                            TXAA
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link to="/shop" className="text-gray-500 hover:text-black transition-colors">Shop</Link>
                        <Link to="/about" className="text-gray-500 hover:text-black transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-500 hover:text-black transition-colors">Contact</Link>
                        <Link to="/privacy" className="text-gray-500 hover:text-black transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-gray-500 hover:text-black transition-colors">Terms</Link>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                        {[Instagram, Facebook, Twitter].map((Icon, i) => (
                            <a key={i} href="#" className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all duration-300 rounded-full">
                                <Icon size={16} strokeWidth={1.5} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} TXAA Automotive. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
