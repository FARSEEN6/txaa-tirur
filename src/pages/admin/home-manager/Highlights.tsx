
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";
import { useHighlights } from "@/hooks/useHomeContent";
import {
    addHighlight,
    updateHighlight,
    deleteHighlight,
} from "@/lib/homeContentService";
import type { Highlight, HighlightFormData } from "@/types/home";
import { AVAILABLE_ICONS } from "@/types/home";
import AdminLayout from "@/components/layout/AdminLayout";

export default function HighlightsManagerPage() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const { highlights, loading, error } = useHighlights();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
    const [formData, setFormData] = useState<HighlightFormData>({
        title: "",
        description: "",
        iconName: "Truck",
        enabled: true,
        order: 0,
    });

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    useEffect(() => {
        if (editingHighlight) {
            setFormData({
                title: editingHighlight.title,
                description: editingHighlight.description,
                iconName: editingHighlight.iconName,
                enabled: editingHighlight.enabled,
                order: editingHighlight.order,
            });
        }
    }, [editingHighlight]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingHighlight) {
                await updateHighlight(editingHighlight.id, formData);
                toast.success("Highlight updated!");
            } else {
                const nextOrder = highlights.length > 0 ? Math.max(...highlights.map(h => h.order)) + 1 : 0;
                await addHighlight({ ...formData, order: nextOrder });
                toast.success("Highlight added!");
            }

            resetForm();
        } catch (error) {
            console.error("Error saving highlight:", error);
            toast.error("Failed to save highlight");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            iconName: "Truck",
            enabled: true,
            order: 0,
        });
        setEditingHighlight(null);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this highlight?")) return;

        try {
            await deleteHighlight(id);
            toast.success("Highlight deleted!");
        } catch (error) {
            console.error("Error deleting highlight:", error);
            toast.error("Failed to delete highlight");
        }
    };

    const toggleEnabled = async (highlight: Highlight) => {
        try {
            await updateHighlight(highlight.id, { enabled: !highlight.enabled });
            toast.success(highlight.enabled ? "Highlight disabled" : "Highlight enabled");
        } catch (error) {
            console.error("Error toggling highlight:", error);
            toast.error("Failed to update highlight");
        }
    };

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName];
        return IconComponent || Icons.Star;
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
                            Highlights / Features
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Manage feature cards displayed below the hero section
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Highlight
                    </button>
                </div>

                {/* Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
                            <h3 className="text-xl font-bold uppercase mb-6">
                                {editingHighlight ? "Edit Highlight" : "Add New Highlight"}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Icon Selection */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                        Icon *
                                    </label>
                                    <select
                                        value={formData.iconName}
                                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    >
                                        {AVAILABLE_ICONS.map((iconName) => (
                                            <option key={iconName} value={iconName}>
                                                {iconName}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Icon Preview */}
                                    <div className="mt-3 flex items-center gap-3 p-4 border border-gray-100 bg-gray-50">
                                        {(() => {
                                            const IconPreview = getIcon(formData.iconName);
                                            return <IconPreview size={32} />;
                                        })()}
                                        <span className="text-sm text-gray-600">Preview</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                        placeholder="Free Shipping"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                        rows={2}
                                        placeholder="On all orders above ₹999"
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
                                        className="w-5 h-5"
                                    />
                                    <label htmlFor="enabled" className="text-sm font-bold uppercase tracking-wider">
                                        Enable Highlight
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors"
                                    >
                                        {editingHighlight ? "Update Highlight" : "Add Highlight"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 border border-gray-200 text-xs font-bold tracking-wider uppercase hover:border-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Highlights Grid */}
                {highlights.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200">
                        <p className="text-gray-400 mb-4">No highlights yet</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="text-sm font-bold uppercase tracking-wider text-black underline"
                        >
                            Add your first highlight
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highlights.map((highlight) => {
                            const IconComponent = getIcon(highlight.iconName);
                            return (
                                <div
                                    key={highlight.id}
                                    className={`border p-6 ${highlight.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <IconComponent size={32} strokeWidth={1.5} className="text-black" />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleEnabled(highlight)}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                                title={highlight.enabled ? "Disable" : "Enable"}
                                            >
                                                {highlight.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingHighlight(highlight);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-2 hover:bg-gray-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(highlight.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{highlight.title}</h3>
                                    <p className="text-sm text-gray-600">{highlight.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
