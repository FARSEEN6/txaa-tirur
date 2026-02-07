"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Star, Grid3x3, BookOpen } from "lucide-react";

const navItems = [
    { href: "/admin/home-manager", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/home-manager/hero", label: "Hero Carousel", icon: ImageIcon },
    { href: "/admin/home-manager/highlights", label: "Highlights", icon: Star },
    { href: "/admin/home-manager/categories", label: "Categories", icon: Grid3x3 },
    { href: "/admin/home-manager/story", label: "Brand Story", icon: BookOpen },
];

export default function HomeManagerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-100">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href="/admin"
                                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors mb-2 block"
                            >
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-4xl font-bold tracking-tighter text-black uppercase">
                                Home Content Manager
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-1">
                        <nav className="space-y-2 sticky top-8">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 border transition-all ${isActive
                                                ? "border-black bg-black text-white"
                                                : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={1.5} />
                                        <span className="text-sm font-bold uppercase tracking-wider">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">{children}</main>
                </div>
            </div>
        </div>
    );
}
