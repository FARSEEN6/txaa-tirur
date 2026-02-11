
import { useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Users, Menu, X, Settings, Shield, Image as ImageIcon, Car } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const pathname = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { profile } = useAuthStore();

    const isSuperAdmin = profile?.role === 'superadmin';

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard, adminOnly: false },
        { name: "Products", href: "/admin/products", icon: Package, adminOnly: false },
        { name: "Car Models", href: "/admin/models", icon: Car, adminOnly: false },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag, adminOnly: false },
        { name: "Users", href: "/admin/users", icon: Users, adminOnly: false },
        { name: "Home Manager", href: "/admin/home-manager", icon: ImageIcon, adminOnly: false },
        { name: "Photos", href: "/admin/photos", icon: ImageIcon, adminOnly: false },
        // Super Admin only items
        { name: "Manage Admins", href: "/admin/manage-admins", icon: Shield, adminOnly: true },
        { name: "Settings", href: "/admin/settings", icon: Settings, adminOnly: true },
    ];

    const visibleNavItems = navItems.filter(item => !item.adminOnly || isSuperAdmin);

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="min-h-screen bg-gray-50 text-black flex flex-col md:flex-row pt-0 md:pt-0">

                {/* Mobile Header - White & Black */}
                <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-20 z-30">
                    <h2 className="text-sm font-bold text-black uppercase tracking-widest flex items-center gap-2 font-heading">
                        TXAA Admin
                    </h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1 text-black hover:bg-gray-100 rounded-md transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 fixed top-[100px] left-0 right-0 z-20 shadow-xl">
                        <nav className="space-y-1">
                            {visibleNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${isActive
                                            ? "bg-black text-white"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-black"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}

                {/* Desktop Sidebar - Premium Frame */}
                <aside className="w-72 bg-white border-r border-gray-100 fixed top-24 h-[calc(100vh-6rem)] hidden md:flex flex-col z-40 overflow-y-auto">
                    <div className="p-8">
                        {/* Brand */}
                        <div className="mb-10 text-center border-b border-gray-100 pb-8">
                            <div className="text-2xl font-bold tracking-[0.2em] font-heading mb-1">TXAA</div>
                            <div className="text-[10px] text-gray-400 tracking-[0.4em] uppercase">Control Center</div>
                        </div>

                        <nav className="space-y-2">
                            {visibleNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all group ${isActive
                                            ? "bg-black text-white shadow-lg shadow-black/10"
                                            : "text-gray-400 hover:text-black hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon size={18} strokeWidth={1.5} className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-black"}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer User Info */}
                    <div className="mt-auto p-8 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full text-sm font-bold text-black border border-gray-200">
                                {profile?.displayName?.charAt(0) || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-black truncate">{profile?.displayName || 'Admin User'}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{profile?.role}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 md:ml-72 min-h-screen bg-white pt-24">
                    <div className="p-6 md:p-10 w-full max-w-[1600px]">
                        {/* Top Bar for Desktop - showing Breadcrumb/Title usually, but here just content spacer */}
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
