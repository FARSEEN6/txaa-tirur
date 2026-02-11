import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getProducts, deleteProduct } from "@/lib/productService";
import type { Product } from "@/types/product";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                        Products
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your product inventory ({products.length})
                    </p>
                </div>
                <Link
                    to="/admin/add-product"
                    className="px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                />
            </div>

            {/* Product List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-400 mb-4">No products found</p>
                    <Link
                        to="/admin/add-product"
                        className="text-sm font-bold uppercase tracking-wider text-black underline"
                    >
                        Add your first product
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                    {product.images?.[0] && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-black">{product.name}</h3>
                                                    {product.isNew && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${product.stock > 0 ? "bg-white text-black border-black" : "bg-black text-white border-black"
                                                }`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-black"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black hover:text-gray-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
