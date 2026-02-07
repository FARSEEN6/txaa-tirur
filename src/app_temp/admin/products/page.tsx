"use client";

import { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { rtdb } from "@/firebase/config";
import { Search, Loader2, Plus, Edit2, Trash2, Package, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images?: string[];
    category?: string;
    stock?: number;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const productsRef = ref(rtdb, "products");
        const unsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const productsList: Product[] = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key]
                }));
                // Sort by name
                productsList.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(productsList);
            } else {
                setProducts([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (productId: string) => {
        if (confirmDeleteId === productId) {
            setDeletingId(productId);
            try {
                const productRef = ref(rtdb, `products/${productId}`);
                await remove(productRef);
                toast.success("Product deleted successfully");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            } finally {
                setDeletingId(null);
                setConfirmDeleteId(null);
            }
        } else {
            setConfirmDeleteId(productId);
            // Reset confirmation after 3 seconds
            setTimeout(() => setConfirmDeleteId((prev) => (prev === productId ? null : prev)), 3000);
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-black" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-black uppercase tracking-tight font-heading mb-2">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your inventory and catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {/* Content Frame */}
            <div className="bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                {/* Search Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="SEARCH PRODUCTS..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none text-black text-sm font-bold tracking-wider placeholder:text-gray-400 focus:ring-1 focus:ring-black outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {filteredProducts.length} Items Found
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-xs font-bold uppercase tracking-widest text-black border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6">Product</th>
                                <th className="px-8 py-6">Price</th>
                                <th className="px-8 py-6">Stock</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-gray-400">
                                        <Package size={32} className="mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-medium uppercase tracking-widest">No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 relative bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-black text-sm uppercase tracking-wide mb-1">{product.name}</h3>
                                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category || "Uncategorized"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-black">₹{product.price?.toLocaleString('en-IN')}</span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${(product.stock || 0) > 0
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-700"
                                                }`}>
                                                {(product.stock || 0) > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/shop/product/${product.id}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/edit-product?id=${product.id}`}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-200 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className={`p-2 transition-all flex items-center gap-1 font-bold text-xs uppercase tracking-wider ${confirmDeleteId === product.id
                                                        ? "bg-red-600 text-white px-3 py-2 hover:bg-red-700"
                                                        : "text-gray-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-100"
                                                        } disabled:opacity-50`}
                                                    title="Delete"
                                                >
                                                    {deletingId === product.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : confirmDeleteId === product.id ? (
                                                        <>CONFIRM?</>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
