import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useCategories } from "@/hooks/useHomeContent";
import { useCarModels } from "@/hooks/useCarModels";
import type { ProductFormData } from "@/types/product";
import { addProduct } from "@/lib/productService";
import PhotoGallery from "@/components/admin/PhotoGallery";

export default function AddProductPage() {
    const navigate = useNavigate();
    const { categories, loading: categoriesLoading } = useCategories();
    const { models, loading: modelsLoading } = useCarModels();
    const [loading, setLoading] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        stock: 0,
        category: "",
        model: "",
        images: [],
        isNew: false,
        isFeatured: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || formData.price <= 0) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.images.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        setLoading(true);

        try {
            await addProduct(formData);
            toast.success("Product added successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
                        <p className="text-gray-500 text-sm">Create a new product listing</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold uppercase tracking-wide border-b border-gray-100 pb-4">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    placeholder="e.g. Premium Leather Seat Covers"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors h-32"
                                    placeholder="Detailed product description..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.filter(c => c.enabled).map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Car Model <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                                </label>
                                <select
                                    value={formData.model || ""}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value || undefined })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    disabled={modelsLoading}
                                >
                                    <option value="">All Models (Universal)</option>
                                    {models.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select if this product is compatible with a specific car model
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold uppercase tracking-wide border-b border-gray-100 pb-4">
                            Pricing
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Regular Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Discount Price (₹) <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.discountPrice}
                                    onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-bold uppercase tracking-wide">
                                Product Images
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsGalleryOpen(true)}
                                className="text-sm font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Select Images
                            </button>
                        </div>

                        {formData.images.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                                <p className="text-gray-500 mb-4">No images selected</p>
                                <button
                                    type="button"
                                    onClick={() => setIsGalleryOpen(true)}
                                    className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
                                >
                                    Open Gallery
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Flags */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold uppercase tracking-wide border-b border-gray-100 pb-4">
                            Settings
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm uppercase">New Arrival</h3>
                                    <p className="text-xs text-gray-500">Mark this product as new</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isNew}
                                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-sm uppercase">Featured Product</h3>
                                    <p className="text-xs text-gray-500">Show on homepage featured section</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 pt-4 pb-20">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="px-8 py-3 border border-gray-200 text-sm font-bold uppercase tracking-wider hover:border-black transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Product
                        </button>
                    </div>
                </form>

                {/* Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold uppercase">Select Images</h3>
                                <button onClick={() => setIsGalleryOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[70vh]">
                                <PhotoGallery onSelect={(url) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...prev.images, url]
                                    }));
                                    setIsGalleryOpen(false);
                                    toast.success("Image selected");
                                }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
