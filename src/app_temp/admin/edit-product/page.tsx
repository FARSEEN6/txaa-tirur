"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { rtdb } from "@/firebase/config";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { useCategories } from "@/hooks/useCategories";

function EditProductForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { categories: activeCategories, loading: categoriesLoading } = useCategories();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Accessories",
        stock: "10",
    });
    const [images, setImages] = useState<string[]>([]);

    // Fetch existing product data
    useEffect(() => {
        if (!productId) {
            setFetching(false);
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
                        price: data.price?.toString() || "",
                        category: data.category || "Accessories",
                        stock: data.stock?.toString() || "0",
                    });
                    setImages(data.images || (data.image ? [data.image] : []));
                } else {
                    toast.error("Product not found");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [productId, router]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            toast.error("Invalid product ID");
            return;
        }

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
                updatedAt: new Date().toISOString(),
            };

            await update(ref(rtdb, `products/${productId}`), productData);

            toast.success("Product updated successfully!");
            router.push("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#d4a017]" size={40} />
            </div>
        );
    }

    if (!productId) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-bold dark:text-white">Product ID missing</h2>
                <Link
                    href="/admin/products"
                    className="px-6 py-2 bg-[#d4a017] rounded-lg text-black font-semibold hover:bg-[#b88b14]"
                >
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
            <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/admin/products"
                        className="p-2.5 bg-white dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold dark:text-white">Edit Product</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Premium Leather Seat Cover"
                            />
                        </div>

                        {/* Category & Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all"
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
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all"
                                placeholder="10"
                                min="0"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-[#d4a017] focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Enter detailed product description..."
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Product Images <span className="text-red-500">*</span>
                            </label>
                            <ImageUpload onImagesChange={setImages} maxImages={5} existingImages={images} />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                            <Link href="/admin/products" className="w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#d4a017] hover:bg-[#b88b14] text-black font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Update Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#d4a017]" size={40} />
            </div>
        }>
            <EditProductForm />
        </Suspense>
    );
}
