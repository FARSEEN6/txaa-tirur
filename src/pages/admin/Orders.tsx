
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
    pending: { label: "Pending", bg: "bg-white", text: "text-gray-500", border: "border-gray-200" },
    processing: { label: "Processing", bg: "bg-gray-50", text: "text-black", border: "border-black" },
    shipped: { label: "Shipped", bg: "bg-white", text: "text-black", border: "border-black" },
    delivered: { label: "Delivered", bg: "bg-black", text: "text-white", border: "border-black" },
    cancelled: { label: "Cancelled", bg: "bg-gray-50", text: "text-gray-400", border: "border-gray-200" },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-black" size={40} />
                </div>
            </AdminLayout>
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
                                    <th className="px-8 py-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-gray-400">
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
                                                <td className="px-8 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-xs font-bold uppercase tracking-wider text-black underline hover:text-gray-600"
                                                    >
                                                        View Details
                                                    </button>
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Order Details</h2>
                                <p className="text-gray-500 text-sm font-mono">{selectedOrder.orderId}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Customer Info</h3>
                                <p className="font-bold text-black mb-1">{selectedOrder.customerName}</p>
                                <p className="text-sm text-gray-600 mb-1">{selectedOrder.customerEmail}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Shipping Address</h3>
                                <div className="text-sm text-gray-600 whitespace-pre-line">
                                    {selectedOrder.shippingAddress ? (
                                        typeof selectedOrder.shippingAddress === 'string'
                                            ? selectedOrder.shippingAddress
                                            : Object.values(selectedOrder.shippingAddress).join(', ')
                                    ) : (
                                        "No shipping address provided"
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Order Items</h3>
                            <div className="space-y-4">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">
                                                {item.quantity}x
                                            </div>
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-sm">₹{item.price.toLocaleString("en-IN")}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                                <span className="font-bold uppercase tracking-wider text-sm">Total Amount</span>
                                <span className="text-xl font-bold">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
