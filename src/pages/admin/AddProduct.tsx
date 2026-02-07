
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { rtdb } from "@/firebase/config";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCategories } from "@/hooks/useHomeContent"; // Changed hook based on what I saw in previous steps for categories
import AdminLayout from "@/components/layout/AdminLayout";

export default function AddProductPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { categories: activeCategories, loading: categoriesLoading } = useCategories();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Accessories", // Default will be updated in effect if needed, or user selects
        stock: "10",
    });
    const [images, setImages] = useState<string[]>([]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                discountPrice: parseFloat(formData.price),
                category: formData.category,
                images,
                image: images[0],
                stock: parseInt(formData.stock) || 0,
                rating: 0,
                reviews: 0,
                createdAt: new Date().toISOString(),
                isNew: true,
            };

            const newProductRef = push(ref(rtdb, "products"));
            await set(newProductRef, productData);

            toast.success("Product added successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight font-heading">Add New Product</h1>
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
                            <ImageUpload onImagesChange={setImages} maxImages={5} />
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
                                        Save Product
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
