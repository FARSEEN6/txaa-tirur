
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useHomeContent";
import {
    addCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/homeContentService";
import type { Category, CategoryFormData } from "@/types/home";
import AdminLayout from "@/components/layout/AdminLayout";

export default function CategoriesManagerPage() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const { categories, loading, error } = useCategories();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        imageUrl: "",
        enabled: true,
        order: 0,
        titleColor: "#000000",
        grayscale: false,
        brightness: 100,
        contrast: 100,
    });
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name,
                imageUrl: editingCategory.imageUrl,
                enabled: editingCategory.enabled,
                order: editingCategory.order,
                titleColor: editingCategory.titleColor || "#000000",
                grayscale: editingCategory.grayscale || false,
                brightness: editingCategory.brightness || 100,
                contrast: editingCategory.contrast || 100,
            });
            setImagePreview(editingCategory.imageUrl);
        }
    }, [editingCategory]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Please enter a category name");
            return;
        }

        if (!imagePreview) {
            toast.error("Please upload an image");
            return;
        }

        setUploading(true);

        try {
            let imageUrl = formData.imageUrl;

            // Upload new image if selected
            if (imageFile) {
                const { uploadImage } = await import("@/lib/uploadImage");
                const result = await uploadImage({
                    file: imageFile,
                    folder: "categories",
                });
                imageUrl = result.url;
            }

            const categoryData = { ...formData, imageUrl };

            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryData);
                toast.success("Category updated!");
            } else {
                const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 0;
                await addCategory({ ...categoryData, order: nextOrder });
                toast.success("Category added!");
            }

            resetForm();
        } catch (error: any) {
            console.error("Error saving category:", error);
            toast.error(error.message || "Failed to save category");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            imageUrl: "",
            enabled: true,
            order: 0,
            titleColor: "#000000",
            grayscale: false,
            brightness: 100,
            contrast: 100,
        });
        setImageFile(null);
        setImagePreview("");
        setEditingCategory(null);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await deleteCategory(id);
            toast.success("Category deleted!");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    const toggleEnabled = async (category: Category) => {
        try {
            await updateCategory(category.id, { enabled: !category.enabled });
            toast.success(category.enabled ? "Category hidden" : "Category shown");
        } catch (error) {
            console.error("Error toggling category:", error);
            toast.error("Failed to update category");
        }
    };

    if (authLoading || !user || profile?.role !== "admin") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                            Product Categories
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Manage product categories with images and display order
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                            <h3 className="text-xl font-bold uppercase mb-6">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                        Image *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="mt-4 relative aspect-square w-full max-w-xs">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                        placeholder="Seat Covers"
                                        required
                                    />
                                </div>

                                {/* Enabled */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="enabled"
                                        checked={formData.enabled}
                                        onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                        className="w-5 h-5 accent-black"
                                    />
                                    <label htmlFor="enabled" className="text-sm font-bold uppercase tracking-wider">
                                        Show Category
                                    </label>
                                </div>

                                {/* STYLING CONTROLS */}
                                <div>
                                    <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Styling</h4>

                                    {/* Text Color */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">Text Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={formData.titleColor || "#000000"}
                                                onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={formData.titleColor || "#000000"}
                                                onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Filters */}
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!formData.grayscale}
                                                onChange={(e) => setFormData({ ...formData, grayscale: e.target.checked })}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Black & White Mode</span>
                                        </label>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                    Brightness ({formData.brightness || 100}%)
                                                </label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="150"
                                                    value={formData.brightness || 100}
                                                    onChange={(e) => setFormData({ ...formData, brightness: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                    Contrast ({formData.contrast || 100}%)
                                                </label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="150"
                                                    value={formData.contrast || 100}
                                                    onChange={(e) => setFormData({ ...formData, contrast: parseInt(e.target.value) })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? "UPLOADING..." : editingCategory ? "Update Category" : "Add Category"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={uploading}
                                        className="px-6 py-3 border border-gray-200 text-xs font-bold tracking-wider uppercase hover:border-black transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
                }

                {/* Categories List */}
                {
                    error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )
                }

                {
                    categories.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-200">
                            <p className="text-gray-400 mb-4">No categories yet</p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="text-sm font-bold uppercase tracking-wider text-black underline"
                            >
                                Add your first category
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`border ${category.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square w-full">
                                        <img
                                            src={category.imageUrl}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-4">{category.name}</h3>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleEnabled(category)}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                                title={category.enabled ? "Hide" : "Show"}
                                            >
                                                {category.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div >
        </AdminLayout >
    );
}
