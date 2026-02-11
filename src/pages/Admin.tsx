
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Package, ShoppingCart, Users, ArrowRight, Image as ImageIcon, Car } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/firebase/config";

interface Order {
    id: string;
    orderId: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || (profile?.role !== 'admin' && profile?.role !== 'superadmin'))) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    useEffect(() => {
        // Fetch real-time data from Firebase
        const productsRef = ref(rtdb, "products");
        const ordersRef = ref(rtdb, "orders");
        const usersRef = ref(rtdb, "users");

        const unsubscribeProducts = onValue(productsRef, (snapshot) => {
            const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
            setStats(prev => ({ ...prev, products: count }));
        });

        const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const ordersArray = Object.keys(data).map(key => ({
                    id: key,
                    orderId: data[key].orderId || `ORD-${key.slice(-6).toUpperCase()}`,
                    customerName: data[key].customerName || "Unknown",
                    total: data[key].total || 0,
                    status: data[key].status || "pending",
                    createdAt: data[key].createdAt || new Date().toISOString(),
                }));

                // Calculate stats
                const activeOrders = ordersArray.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').length;
                const totalRevenue = ordersArray.reduce((acc, order) => acc + order.total, 0);

                // Sort by date and get recent 5
                const sorted = ordersArray.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setRecentOrders(sorted.slice(0, 5));

                setStats(prev => ({
                    ...prev,
                    orders: activeOrders,
                    revenue: totalRevenue
                }));
            } else {
                setStats(prev => ({ ...prev, orders: 0, revenue: 0 }));
                setRecentOrders([]);
            }
        });

        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
            const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
            setStats(prev => ({ ...prev, users: count }));
        });

        setLoading(false);

        return () => {
            unsubscribeProducts();
            unsubscribeOrders();
            unsubscribeUsers();
        };
    }, []);

    if (authLoading || !user || (profile?.role !== 'admin' && profile?.role !== 'superadmin')) {
        return <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>;
    }

    const quickStats = [
        { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: Plus, color: "text-black" },
        { label: "Active Orders", value: stats.orders, icon: ShoppingCart, color: "text-black" },
        { label: "Products", value: stats.products, icon: Package, color: "text-black" },
        { label: "Customers", value: stats.users, icon: Users, color: "text-black" },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-black text-white";
            case "shipped": return "bg-gray-800 text-white";
            case "processing": return "bg-gray-600 text-white";
            case "cancelled": return "bg-gray-300 text-gray-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-white text-black">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block">
                            Overview
                        </span>
                        <h1 className="text-5xl font-bold tracking-tighter text-black font-heading uppercase">Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/" className="px-8 py-4 border border-gray-200 bg-white text-xs font-bold tracking-[0.2em] uppercase hover:border-black transition-colors">
                            View Site
                        </Link>
                        <Link to="/admin/add-product" className="px-8 py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <Plus size={16} /> Add Product
                        </Link>
                    </div>
                </header>

                {/* Stats Grid - Premium Frames */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    {quickStats.map((stat, i) => (
                        <div key={i} className="group bg-white p-8 border border-gray-100 transition-all duration-300 hover:border-black hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">{stat.label}</span>
                                <stat.icon size={20} className="text-gray-300 group-hover:text-black transition-colors" strokeWidth={1.5} />
                            </div>
                            <p className="text-4xl font-bold text-black tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions & Recent */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-black font-heading">Recent Orders</h2>
                            <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">View All</Link>
                        </div>

                        {loading ? (
                            <div className="bg-gray-50 p-16 text-center border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm tracking-wide uppercase">Loading orders...</p>
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="bg-gray-50 p-16 text-center border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm tracking-wide uppercase">No recent orders found</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-mono font-bold text-black">{order.orderId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                                                <td className="px-6 py-4 text-xs text-gray-400 uppercase">{formatDate(order.createdAt)}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-black text-right">₹{order.total.toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-black font-heading mb-8 border-b border-gray-100 pb-4">Quick Links</h2>
                        <div className="space-y-4">
                            <Link to="/admin/home-manager" className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <ImageIcon size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase tracking-wider transition-colors">Home Content Manager</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            <Link to="/admin/models" className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <Car size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase tracking-wider transition-colors">Manage Car Models</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            <Link to="/admin/products" className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <Package size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase tracking-wider transition-colors">Manage Products</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            <Link to="/admin/photos" className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <ImageIcon size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase tracking-wider transition-colors">Photo Gallery</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                            <Link to="/admin/orders" className="flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <ShoppingCart size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase tracking-wider transition-colors">View Orders</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
