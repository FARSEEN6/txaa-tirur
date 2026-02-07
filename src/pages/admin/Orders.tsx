
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { rtdb } from "@/firebase/config";
import { Search, Package, Loader2, ChevronDown } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

interface Order {
    id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    shippingAddress?: string;
}

const statusConfig: Record<string, { label: string, bg: string, text: string, border: string }> = {
    pending: { label: "Pending", bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" },
    processing: { label: "Processing", bg: "bg-black", text: "text-white", border: "border-black" },
    shipped: { label: "Shipped", bg: "bg-white", text: "text-black", border: "border-black" },
    delivered: { label: "Delivered", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const ordersRef = ref(rtdb, "orders");
        const unsubscribe = onValue(ordersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const ordersList: Order[] = Object.keys(data).map((key) => ({
                    id: key,
                    orderId: data[key].orderId || `ORD-${key.slice(-6).toUpperCase()}`,
                    customerName: data[key].customerName || "Unknown Customer",
                    customerEmail: data[key].customerEmail || "",
                    items: data[key].items || [],
                    total: data[key].total || 0,
                    status: data[key].status || "pending",
                    createdAt: data[key].createdAt || new Date().toISOString(),
                    shippingAddress: data[key].shippingAddress,
                }));
                // Sort by date (newest first)
                ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(ordersList);
            } else {
                setOrders([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const orderRef = ref(rtdb, `orders/${orderId}`);
            await update(orderRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-black" size={40} />
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-black uppercase tracking-tight font-heading mb-2">Orders</h1>
                        <p className="text-gray-500 text-sm">Track and manage customer orders</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black/60">
                        <Package size={16} />
                        <span>{orders.length} Total</span>
                    </div>
                </div>

                {/* Content Frame */}
                <div className="bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    {/* Search Toolbar */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="SEARCH ORDER ID, NAME..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none text-black text-sm font-bold tracking-wider placeholder:text-gray-400 focus:ring-1 focus:ring-black outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-xs font-bold uppercase tracking-widest text-black border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6">Order ID</th>
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6 text-center">Status</th>
                                    <th className="px-8 py-6 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center text-gray-400">
                                            <Package size={32} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium uppercase tracking-widest">No orders found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const status = statusConfig[order.status] || statusConfig.pending;
                                        return (
                                            <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <span className="font-bold text-black text-sm tracking-wider">{order.orderId}</span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-black text-xs uppercase tracking-wide mb-1">{order.customerName}</span>
                                                        <span className="text-xs text-gray-400">{order.customerEmail}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-xs text-gray-400 font-bold uppercase tracking-wider">{formatDate(order.createdAt)}</td>
                                                <td className="px-8 py-4 text-center">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            disabled={updatingId === order.id}
                                                            className={`appearance-none pl-4 pr-10 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${status.border} ${status.bg} ${status.text} cursor-pointer outline-none focus:ring-1 focus:ring-black disabled:opacity-50`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${status.text}`}>
                                                            {updatingId === order.id ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <span className="font-bold text-black text-sm">₹{order.total.toLocaleString("en-IN")}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
