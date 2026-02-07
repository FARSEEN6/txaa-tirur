
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { rtdb } from "@/firebase/config";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCategories } from "@/hooks/useHomeContent";
import AdminLayout from "@/components/layout/AdminLayout";

export default function EditProductPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get("id");

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const { categories: activeCategories, loading: categoriesLoading } = useCategories();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (!productId) {
            toast.error("No product ID specified");
            navigate("/admin/products");
            return;
        }

        const fetchProduct = async () => {
            try {
                const productRef = ref(rtdb, `products/${productId}`);
                const snapshot = await get(productRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                        price: data.price ? String(data.price) : "",
                        category: data.category || "Accessories",
                        stock: data.stock ? String(data.stock) : "0",
                    });
                    setImages(data.images || (data.image ? [data.image] : []));
                } else {
                    toast.error("Product not found");
                    navigate("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProduct();
    }, [productId, navigate]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) return;

        // Validation
        if (!formData.name.trim()) {
            toast.error("Please enter a product name");
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const productUpdates = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                discountPrice: parseFloat(formData.price),
                category: formData.category,
                images,
                image: images[0],
                stock: parseInt(formData.stock) || 0,
                updatedAt: new Date().toISOString(),
            };

            const productRef = ref(rtdb, `products/${productId}`);
            await update(productRef, productUpdates);

            toast.success("Product updated successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin text-black" size={40} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        to="/admin/products"
                        className="p-2.5 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight font-heading">Edit Product</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors text-black placeholder:text-gray-400"
                                placeholder="e.g. Premium Leather Seat Cover"
                            />
                        </div>

                        {/* Category & Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors text-black"
                                >
                                    {categoriesLoading ? (
                                        <option>Loading categories...</option>
                                    ) : (
                                        activeCategories.map((cat) => (
                                            <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                                        ))
                                    )}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                    Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors text-black placeholder:text-gray-400"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors text-black placeholder:text-gray-400"
                                placeholder="10"
                                min="0"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors text-black placeholder:text-gray-400 resize-none"
                                placeholder="Enter detailed product description..."
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-black">
                                Product Images <span className="text-red-500">*</span>
                            </label>
                            <ImageUpload
                                onImagesChange={setImages}
                                maxImages={5}
                                existingImages={images}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                            <Link to="/admin/products" className="w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full px-6 py-3 border border-gray-200 text-black text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
                                >
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
