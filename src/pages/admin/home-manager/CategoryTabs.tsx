
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit2, Trash2, Layers, ExternalLink, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useCategoryTabs } from "@/hooks/useHomeContent";
import {
    addCategoryTabItem,
    updateCategoryTabItem,
    deleteCategoryTabItem,
} from "@/lib/homeContentService";
import { CATEGORY_TABS, type CategoryTabItem, type CategoryTabItemFormData } from "@/types/home";
import AdminLayout from "@/components/layout/AdminLayout";

export default function CategoryTabsManager() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const { items, getItemsByTab, loading, error } = useCategoryTabs();

    const [activeTab, setActiveTab] = useState<string>(CATEGORY_TABS[0]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CategoryTabItem | null>(null);
    const [formData, setFormData] = useState<CategoryTabItemFormData>({
        group: CATEGORY_TABS[0],
        name: "",
        image: "",
        link: "",
        titleColor: "#ffffff",
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
        setFormData(prev => ({ ...prev, group: activeTab }));
    }, [activeTab]);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                group: editingItem.group,
                name: editingItem.name,
                image: editingItem.image,
                link: editingItem.link,
                titleColor: editingItem.titleColor || "#ffffff",
                grayscale: editingItem.grayscale || false,
                brightness: editingItem.brightness || 100,
                contrast: editingItem.contrast || 100,
            });
            setImagePreview(editingItem.image);
            setActiveTab(editingItem.group);
        }
    }, [editingItem]);

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
            toast.error("Please enter a name");
            return;
        }

        if (!imagePreview && !formData.image) {
            toast.error("Please provide an image");
            return;
        }

        setUploading(true);

        try {
            let imageUrl = formData.image;

            // Upload new image if selected
            if (imageFile) {
                const { uploadImage } = await import("@/lib/uploadImage");
                const result = await uploadImage({
                    file: imageFile,
                    folder: "category-tabs",
                });
                imageUrl = result.url;
            }

            const itemData: CategoryTabItemFormData = {
                ...formData,
                image: imageUrl,
            };

            if (editingItem) {
                await updateCategoryTabItem(editingItem.id, itemData);
                toast.success("Item updated!");
            } else {
                await addCategoryTabItem(itemData);
                toast.success("Item added!");
            }

            resetForm();
        } catch (error: any) {
            console.error("Error saving item:", error);
            toast.error(error.message || "Failed to save item");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            group: activeTab,
            name: "",
            image: "",
            link: "",
            titleColor: "#ffffff",
            grayscale: false,
            brightness: 100,
            contrast: 100,
        });
        setImageFile(null);
        setImagePreview("");
        setEditingItem(null);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteCategoryTabItem(id);
            toast.success("Item deleted!");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
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

    const currentItems = getItemsByTab(activeTab);

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                            Category Tabs Content
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Manage items displayed in the "Shop By Category" tabbed section
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                        className="px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Item
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="overflow-x-auto pb-4 mb-8 no-scrollbar">
                    <div className="flex gap-2">
                        {CATEGORY_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${activeTab === tab
                                    ? "bg-black text-white"
                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content For Active Tab */}
                <div className="bg-white">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Layers size={20} />
                        {activeTab} Items
                    </h3>

                    {currentItems.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <p className="text-gray-400 mb-4">No items for {activeTab}</p>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsFormOpen(true);
                                }}
                                className="text-sm font-bold uppercase tracking-wider text-black underline"
                            >
                                Add first item to {activeTab}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="group relative border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="relative aspect-[3/4] bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-black"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm mb-1 truncate">{item.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 truncate">
                                            <ExternalLink size={12} />
                                            {item.link}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold uppercase mb-6 border-b border-gray-100 pb-4">
                                {editingItem ? "Edit Item" : "Add New Item"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tab Selection (Read-only mostly, but shown) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                        Tab Group
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                                        {formData.group}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                                        Image *
                                    </label>
                                    <div className="flex gap-4 items-start">
                                        <div className={`relative w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 ${!imagePreview ? 'flex items-center justify-center' : ''}`}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={24} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer mb-2"
                                            />
                                            <p className="text-xs text-gray-400">
                                                Ideally 600x800px or 3:4 aspect ratio. Max 5MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                                        placeholder="e.g. Steering Wheel Cover"
                                        required
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                                        Link URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                                        placeholder="e.g. /shop?category=Steering"
                                    />
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
                                                value={formData.titleColor || "#ffffff"}
                                                onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                                                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                            />
                                            <input
                                                type="text"
                                                value={formData.titleColor || "#ffffff"}
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
                                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-8">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={uploading}
                                        className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>Processing...</>
                                        ) : (
                                            <>{editingItem ? "Save Changes" : "Add Item"}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
