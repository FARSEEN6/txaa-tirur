import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Menu, X, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/firebase/config";
import { useCategories } from "@/hooks/useCategories";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState("models");
    const [mounted, setMounted] = useState(false);
    const { categories } = useCategories();

    // Fix hydration mismatch - wait until mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    const location = useLocation();
    const pathname = location.pathname;
    const isHome = pathname === "/";

    const cartItemCount = useCartStore((state) => state.totalItems());
    const { openCart } = useUIStore();
    const navigate = useNavigate();
    const { user, profile, setUser } = useAuthStore();

    // Handle scroll for transparent -> white transition
    useEffect(() => {
        const handleScroll = () => {
            const scrollValues = window.scrollY;
            setIsScrolled(scrollValues > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Categories", href: "/categories" },
        { name: "Contact", href: "/contact" },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    // Determine Theme: 
    // If Home AND Not Scrolled -> Transparent Background + White Text
    // Else (Other pages OR Scrolled) -> White Background + Black Text
    // const isTransparent = isHome && !isScrolled; // Disabled for new light theme
    const isTransparent = false;
    const textColorClass = isTransparent ? "text-white" : "text-black";
    const hoverColorClass = isTransparent ? "hover:text-gray-300" : "hover:text-gray-500";
    const bgClass = isTransparent ? "bg-transparent" : "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.05)]";
    const borderClass = isTransparent ? "border-transparent" : "border-gray-100";
    // const logoClass = "text-current"; // Inherits current text color

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${bgClass} ${borderClass}`}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Menu Button - Global (Left) */}
                <button
                    className={`flex items-center gap-3 ${textColorClass} ${hoverColorClass} transition-colors group`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu size={20} strokeWidth={1.5} />
                    <span className="text-sm font-medium uppercase tracking-widest hidden md:block">Menu</span>
                </button>

                {/* Logo - Center */}
                <Link to="/" className={`absolute left-1/2 -translate-x-1/2 flex items-center group ${textColorClass}`}>
                    <div className="relative w-14 h-14 transition-transform group-hover:scale-105">
                        {/* Using img tag for simple logo rendering or Next Image if preferred, but img is safer for transparency interactions sometimes in complex headers, keeping Image for optimization though */}
                        <img
                            src="/txaa-logo.png"
                            alt="TXAA Logo"
                            className="w-full h-full object-contain drop-shadow-sm filter brightness-100 dark:invert-0"
                            style={{ filter: isTransparent ? 'brightness(0) invert(1)' : 'none' }}
                        />
                    </div>
                </Link>

                {/* Desktop Nav - Right part & Icons */}
                <div className={`flex items-center gap-8 ${textColorClass}`}>
                    <div className="flex items-center gap-5">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`${hoverColorClass} transition-colors`}
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>

                        {/* Account */}
                        <div className="relative hidden md:block">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                                        className={`${hoverColorClass} transition-colors flex items-center gap-2`}
                                    >
                                        <span className={`w-8 h-8 rounded-full border ${isTransparent ? 'border-white/30' : 'border-gray-200'} flex items-center justify-center text-xs font-semibold`}>
                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isAccountOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 text-black"
                                            >
                                                <div className="px-6 py-4 border-b border-gray-100">
                                                    <p className="text-sm font-semibold">{user.displayName}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                                </div>
                                                {profile?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        className="block w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-sm"
                                                        onClick={() => setIsAccountOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-6 py-3 text-red-600 hover:bg-gray-50 transition-colors text-sm"
                                                >
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`${hoverColorClass} transition-colors`}
                                >
                                    <User size={22} strokeWidth={1.5} />
                                </Link>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className={`relative ${hoverColorClass} transition-colors`}
                        >
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {mounted && cartItemCount > 0 && (
                                <span className={`absolute -top-2 -right-2 h-5 w-5 ${isTransparent ? 'bg-white text-black' : 'bg-black text-white'} text-[10px] font-bold rounded-full flex items-center justify-center`}>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar Overlay - Always White background for overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white border-b border-gray-100 absolute top-full w-full z-40 overflow-hidden text-black"
                    >
                        <form onSubmit={handleSearch} className="container mx-auto px-6 py-8">
                            <div className="flex items-center gap-4 border-b border-black pb-4 max-w-4xl mx-auto">
                                <Search size={24} className="text-black" strokeWidth={1.5} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH PRODUCTS..."
                                    className="flex-1 bg-transparent text-black text-2xl font-light outline-none placeholder-gray-300 uppercase tracking-wider"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Screen Menu Drawer - Porsche Style */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white/95 backdrop-blur-2xl h-full w-full md:w-[85vw] max-w-7xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Left Panel - Navigation Links */}
                            <div className="w-full md:w-1/3 bg-transparent p-8 md:p-16 flex flex-col justify-between border-r border-gray-100 overflow-y-auto">
                                <div>
                                    <div className="flex justify-between items-center mb-12">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold tracking-[0.2em] uppercase font-heading text-black">
                                                TXAA
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Control Center</span>
                                        </div>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <nav className="space-y-2">
                                        {[
                                            { name: "Models", id: "models", href: "/categories" },
                                            { name: "Shop", id: "shop", href: "/shop" },
                                            { name: "Services", id: "services", href: "/contact" },
                                            { name: "Experience", id: "experience", href: "/about" }, // Placeholder
                                        ].map((item) => (
                                            <div
                                                key={item.name}
                                                className="group"
                                                onMouseEnter={() => setActiveMenu(item.id)}
                                            >
                                                <Link
                                                    to={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center justify-between py-4 px-4 text-xl md:text-2xl font-light uppercase tracking-wide transition-all ${activeMenu === item.id
                                                        ? "bg-gray-100 text-black font-medium pl-6"
                                                        : "text-gray-500 hover:text-black hover:bg-gray-50 hover:pl-6"
                                                        }`}
                                                >
                                                    {item.name}
                                                    <ChevronRight
                                                        size={20}
                                                        className={`transition-opacity ${activeMenu === item.id ? "opacity-100" : "opacity-0"}`}
                                                    />
                                                </Link>
                                            </div>
                                        ))}
                                    </nav>
                                </div>

                                <div className="mt-12 space-y-4">
                                    <Link to="/login" className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors">
                                        <User size={18} /> Account
                                    </Link>
                                    <div className="text-xs text-gray-400 max-w-xs leading-relaxed">
                                        © 2026 TXAA Automotive. <br />Designed for excellence.
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Dynamic Content (Desktop Only) */}
                            <div className="hidden md:flex w-2/3 bg-gray-50/50 p-16 flex-col relative overflow-y-auto">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="absolute top-8 right-8 p-2 hover:bg-white rounded-full transition-colors z-10"
                                >
                                    <X size={24} />
                                </button>

                                <div className="h-full">
                                    <AnimatePresence mode="wait">
                                        {activeMenu === "models" && (
                                            <motion.div
                                                key="models"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="h-full"
                                            >
                                                <h3 className="text-4xl font-light text-black mb-12">Select your model</h3>
                                                <div className="grid grid-cols-2 gap-8">
                                                    {categories.slice(0, 4).map((cat) => (
                                                        <Link
                                                            key={cat.id}
                                                            to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="group block relative aspect-[16/9] bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                                                        >
                                                            <div className="absolute inset-0 bg-gray-200">
                                                                <img
                                                                    src={cat.image}
                                                                    alt={cat.name}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                />
                                                            </div>
                                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                                            <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/60 to-transparent w-full">
                                                                <span className="text-white text-lg font-bold uppercase tracking-widest group-hover:pl-2 transition-all">
                                                                    {cat.name}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        to="/categories"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center justify-center aspect-[16/9] bg-white border border-gray-200 hover:border-black transition-colors group"
                                                    >
                                                        <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                                            View All Models <ChevronRight size={16} />
                                                        </span>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeMenu === "shop" && (
                                            <motion.div
                                                key="shop"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="h-full flex flex-col justify-center items-center text-center"
                                            >
                                                <ShoppingBag size={64} strokeWidth={1} className="mb-6 text-gray-300" />
                                                <h3 className="text-4xl font-light text-black mb-4">The TXAA Collection</h3>
                                                <p className="text-gray-500 max-w-md mb-8">Explore our exclusive range of premium automotive accessories, curated for the discerning enthusiast.</p>
                                                <Link
                                                    to="/shop"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="btn-primary"
                                                >
                                                    Start Shopping
                                                </Link>
                                            </motion.div>
                                        )}

                                        {activeMenu === "services" && (
                                            <motion.div
                                                key="services"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="h-full flex flex-col justify-center items-start max-w-xl"
                                            >
                                                <h3 className="text-4xl font-light text-black mb-8">Concierge Services</h3>
                                                <div className="space-y-8 w-full">
                                                    <div className="flex items-start gap-4 p-6 bg-white border border-gray-100">
                                                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Contact</div>
                                                        <div>
                                                            <p className="text-xl font-medium mb-1">+91 98765 43210</p>
                                                            <p className="text-gray-500">Available Mon-Fri, 9am - 6pm</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4 p-6 bg-white border border-gray-100">
                                                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Email</div>
                                                        <div>
                                                            <p className="text-xl font-medium mb-1">concierge@txaa.com</p>
                                                            <p className="text-gray-500">24/7 Priority Support</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeMenu === "experience" && (
                                            <motion.div
                                                key="experience"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="h-full flex flex-col justify-center items-center text-center opacity-50"
                                            >
                                                <span className="text-lg font-medium text-gray-400">Experience features coming soon</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
