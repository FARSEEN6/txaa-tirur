"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/firebase/config";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const cartItemCount = useCartStore((state) => state.totalItems());
    const { openCart } = useUIStore();
    const { user, profile, setUser } = useAuthStore();

    // Check if we're on the homepage for transparent effect
    const isHomePage = location.pathname === "/";

    // Fix hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle scroll for transparent to solid transition
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 80);
        };

        window.addEventListener("scroll", handleScroll);
        // Check initial scroll position
        handleScroll();

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleNavigation = (path: string) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    // Menu items with dropdown configuration
    const menuItems = [
        {
            label: "All Categories",
            hasDropdown: true,
            dropdownId: "categories",
            items: [
                { label: "Seat Covers", href: "/shop?category=Seat Covers" },
                { label: "Floor Mats", href: "/shop?category=Floor Mats" },
                { label: "LED Lights", href: "/shop?category=LED Lights" },
                { label: "Number Plate Frames", href: "/shop?category=Number Plate Frames" },
                { label: "Stickers & Decals", href: "/shop?category=Stickers" },
                { label: "Door Sill Plates", href: "/shop?category=Door Sill Plates" },
            ],
        },
        { label: "Combos", href: "/shop?filter=combos" },
        { label: "Bestsellers", href: "/shop?filter=bestsellers" },
        { label: "New Launches", href: "/shop?filter=new" },
        {
            label: "Shop By Usecase",
            hasDropdown: true,
            dropdownId: "usecase",
            items: [
                { label: "Interior Upgrades", href: "/shop?usecase=interior" },
                { label: "Exterior Styling", href: "/shop?usecase=exterior" },
                { label: "Performance", href: "/shop?usecase=performance" },
                { label: "Protection", href: "/shop?usecase=protection" },
            ],
        },
        {
            label: "More",
            hasDropdown: true,
            dropdownId: "more",
            items: [
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
            ],
        },
        { label: "Help", href: "/contact" },
    ];

    // Dynamic styling based on scroll state and page
    const getNavbarStyles = () => {
        if (!isHomePage) {
            // Non-homepage: always solid white
            return {
                bg: "bg-white",
                text: "text-gray-700",
                hoverText: "hover:text-black",
                border: "border-gray-200",
                shadow: "shadow-md",
            };
        }

        if (isScrolled) {
            // Homepage scrolled: solid dark background
            return {
                bg: "bg-black/95 backdrop-blur-md",
                text: "text-white",
                hoverText: "hover:text-gray-300",
                border: "border-gray-800",
                shadow: "shadow-2xl shadow-black/20",
            };
        }

        // Homepage top: transparent
        return {
            bg: "bg-transparent",
            text: "text-white",
            hoverText: "hover:text-gray-200",
            border: "border-transparent",
            shadow: "",
        };
    };

    const navStyles = getNavbarStyles();

    return (
        <>
            {/* Top Announcement Bar */}
            <div
                className={`fixed top-0 left-0 right-0 z-50 w-full text-white py-2.5 overflow-hidden transition-all duration-500 ease-in-out ${isHomePage && !isScrolled
                    ? "bg-transparent"
                    : "bg-gradient-to-r from-orange-500 via-orange-600 to-red-500"
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                <div className="container mx-auto px-6 flex items-center justify-center gap-3 relative z-10">
                    <span className="text-sm md:text-base font-bold tracking-wide uppercase drop-shadow-lg">
                        GRAND PERFORMANCE SALE • LIVE
                    </span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-lg shadow-white/50"></span>
                    </span>
                </div>
            </div>

            {/* Main Navbar */}
            <header
                className={`fixed left-0 right-0 z-40 w-full border-b transition-all duration-500 ease-in-out ${navStyles.bg} ${navStyles.border} ${navStyles.shadow}`}
                style={{ top: '40px' }}
            >
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center group">
                        <span className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${navStyles.text} drop-shadow-lg`}>
                            TXAA
                        </span>
                    </Link>

                    {/* Center: Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {menuItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative group"
                                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.dropdownId || null)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {item.href ? (
                                    <Link
                                        to={item.href}
                                        className={`text-sm font-medium transition-all duration-300 relative pb-1 ${navStyles.text} ${navStyles.hoverText} navbar-link`}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <button className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 relative pb-1 ${navStyles.text} ${navStyles.hoverText} navbar-link`}>
                                        {item.label}
                                        {item.hasDropdown && <ChevronDown size={14} className="mt-0.5" />}
                                    </button>
                                )}

                                {/* Dropdown Menu */}
                                {item.hasDropdown && item.items && (
                                    <AnimatePresence>
                                        {activeDropdown === item.dropdownId && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
                                            >
                                                {item.items.map((subItem, subIdx) => (
                                                    <Link
                                                        key={subIdx}
                                                        to={subItem.href}
                                                        className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-5">
                        {/* Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`transition-all duration-300 ${navStyles.text} ${navStyles.hoverText} hover:scale-110`}
                            aria-label="Search"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>

                        {/* User Account Icon */}
                        <div className="relative hidden md:block">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                                        className={`transition-all duration-300 flex items-center gap-2 ${navStyles.text} ${navStyles.hoverText} hover:scale-110`}
                                        aria-label="Account"
                                    >
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${isHomePage && !isScrolled
                                            ? "bg-white/20 border border-white/40 text-white"
                                            : "bg-gray-200 border border-gray-300 text-gray-700"
                                            }`}>
                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isAccountOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-4 w-56 bg-white border border-gray-200 shadow-xl rounded-lg py-2 z-50"
                                            >
                                                <div className="px-6 py-4 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                                </div>
                                                {profile?.role === "admin" && (
                                                    <Link
                                                        to="/admin"
                                                        className="block w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                                        onClick={() => setIsAccountOpen(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700"
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
                                    className={`transition-all duration-300 ${navStyles.text} ${navStyles.hoverText} hover:scale-110`}
                                    aria-label="Login"
                                >
                                    <User size={22} strokeWidth={1.5} />
                                </Link>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <button
                            onClick={openCart}
                            className={`relative transition-all duration-300 ${navStyles.text} ${navStyles.hoverText} hover:scale-110`}
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 h-5 w-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden transition-all duration-300 ${navStyles.text} ${navStyles.hoverText} hover:scale-110`}
                            aria-label="Menu"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Search Bar Overlay */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 border-t border-gray-200 absolute top-full w-full z-40 overflow-hidden backdrop-blur-lg"
                        >
                            <form onSubmit={handleSearch} className="container mx-auto px-6 py-6">
                                <div className="flex items-center gap-4 max-w-2xl mx-auto">
                                    <Search size={20} className="text-gray-400" strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 bg-transparent text-gray-900 text-lg outline-none placeholder-gray-400"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="text-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white h-full w-[85vw] max-w-sm shadow-2xl overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <span className="text-2xl font-bold text-black">TXAA</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Menu Items */}
                            <nav className="p-6 space-y-1">
                                {menuItems.map((item, idx) => (
                                    <div key={idx}>
                                        {item.href ? (
                                            <Link
                                                to={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block py-3 text-base font-medium text-gray-700 hover:text-black transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        setActiveDropdown(activeDropdown === item.dropdownId ? null : item.dropdownId || null)
                                                    }
                                                    className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-700 hover:text-black transition-colors"
                                                >
                                                    {item.label}
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${activeDropdown === item.dropdownId ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === item.dropdownId && item.items && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="pl-4 space-y-1 overflow-hidden"
                                                        >
                                                            {item.items.map((subItem, subIdx) => (
                                                                <Link
                                                                    key={subIdx}
                                                                    to={subItem.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                                                                >
                                                                    {subItem.label}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Menu Footer */}
                            <div className="p-6 border-t border-gray-200 space-y-4">
                                {user ? (
                                    <>
                                        <div className="pb-4 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                                            <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                        </div>
                                        {profile?.role === "admin" && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Styles */}
            <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        /* Center-growing underline effect */
        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: currentColor;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .navbar-link:hover::after {
          width: 100%;
        }

        /* Subtle glow on hover */
        .navbar-link:hover {
          text-shadow: 0 0 8px currentColor;
        }
      `}</style>
        </>
    );
}
