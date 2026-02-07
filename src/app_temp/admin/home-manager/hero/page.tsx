"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useHeroSlides } from "@/hooks/useHomeContent";
import {
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
} from "@/lib/homeContentService";
import type { HeroSlide, HeroSlideFormData } from "@/types/home";

export default function HeroManagerPage() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const router = useRouter();
    const { slides, loading, error } = useHeroSlides();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [formData, setFormData] = useState<HeroSlideFormData>({
        heading: "",
        subtext: "",
        ctaText: "",
        ctaLink: "",
        imageUrl: "",
        enabled: true,
        order: 0,
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            router.push("/");
        }
    }, [user, profile, authLoading, router]);

    useEffect(() => {
        if (editingSlide) {
            setFormData({
                heading: editingSlide.heading,
                subtext: editingSlide.subtext,
                ctaText: editingSlide.ctaText,
                ctaLink: editingSlide.ctaLink,
                imageUrl: editingSlide.imageUrl,
                enabled: editingSlide.enabled,
                order: editingSlide.order,
                tag: editingSlide.tag || "",
                subtitle: editingSlide.subtitle || "",
                discount: editingSlide.discount || "",
                bgColor: editingSlide.bgColor || "#ffffff",
                textColor: editingSlide.textColor || "text-black",
            });
            setImagePreview(editingSlide.imageUrl);
        }
    }, [editingSlide]);

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

        if (!formData.heading || !formData.subtext) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!imagePreview) {
            toast.error("Please upload an image");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            let imageUrl = formData.imageUrl;

            // Upload new image if selected
            if (imageFile) {
                const { uploadImage } = await import("@/lib/uploadImage");
                const result = await uploadImage({
                    file: imageFile,
                    folder: "hero-slides",
                    onProgress: (progress) => setUploadProgress(progress),
                });
                imageUrl = result.url;
            }

            const slideData = { ...formData, imageUrl };

            if (editingSlide) {
                await updateHeroSlide(editingSlide.id, slideData);
                toast.success("Hero slide updated!");
            } else {
                const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) + 1 : 0;
                await addHeroSlide({ ...slideData, order: nextOrder });
                toast.success("Hero slide added!");
            }

            resetForm();
        } catch (error: any) {
            console.error("Error saving slide:", error);
            toast.error(error.message || "Failed to save slide");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFormData({
            heading: "",
            subtext: "",
            ctaText: "",
            ctaLink: "",
            imageUrl: "",
            enabled: true,
            order: 0,
            tag: "",
            subtitle: "",
            discount: "",
            bgColor: "#ffffff",
            textColor: "text-black",
        });
        setImageFile(null);
        setImagePreview("");
        setEditingSlide(null);
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            await deleteHeroSlide(id);
            toast.success("Slide deleted!");
        } catch (error) {
            console.error("Error deleting slide:", error);
            toast.error("Failed to delete slide");
        }
    };

    const toggleEnabled = async (slide: HeroSlide) => {
        try {
            await updateHeroSlide(slide.id, { enabled: !slide.enabled });
            toast.success(slide.enabled ? "Slide disabled" : "Slide enabled");
        } catch (error) {
            console.error("Error toggling slide:", error);
            toast.error("Failed to update slide");
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
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                        Hero Carousel
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Manage hero slides with images, headings, and CTA buttons
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Slide
                </button>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                        <h3 className="text-xl font-bold uppercase mb-6">
                            {editingSlide ? "Edit Slide" : "Add New Slide"}
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
                                    <div className="mt-4 relative aspect-video w-full">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Heading */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Heading *
                                </label>
                                <input
                                    type="text"
                                    value={formData.heading}
                                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    placeholder="Drive in Style"
                                    required
                                />
                            </div>

                            {/* Subtext */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Subtext *
                                </label>
                                <textarea
                                    value={formData.subtext}
                                    onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    rows={3}
                                    placeholder="From performance parts to sleek upgrades..."
                                    required
                                />
                            </div>

                            {/* CTA Text */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaText}
                                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    placeholder="Shop Now"
                                />
                            </div>

                            {/* CTA Link */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                    Button Link
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaLink}
                                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    placeholder="/shop"
                                />
                            </div>



                            {/* --- New Promotional Fields --- */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Promotional Styling</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Tag */}
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Tag</label>
                                        <input
                                            type="text"
                                            value={formData.tag || ""}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                            placeholder="NEW ARRIVAL"
                                        />
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Subtitle</label>
                                        <input
                                            type="text"
                                            value={formData.subtitle || ""}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                            placeholder="COLLECTION"
                                        />
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Discount Badge</label>
                                        <input
                                            type="text"
                                            value={formData.discount || ""}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                            placeholder="30% OFF"
                                        />
                                    </div>

                                    {/* Text Color */}
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Text Color</label>
                                        <select
                                            value={formData.textColor || "text-black"}
                                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value as "text-white" | "text-black" })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                        >
                                            <option value="text-black">Dark Text</option>
                                            <option value="text-white">Light Text</option>
                                        </select>
                                    </div>

                                    {/* Background Color */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold uppercase tracking-wider mb-2">Background Color (Hex)</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="color"
                                                value={formData.bgColor || "#ffffff"}
                                                onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                                                className="h-12 w-12 p-0 border-0 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.bgColor || ""}
                                                onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                                                className="flex-1 px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors uppercase"
                                                placeholder="#FF7F50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* --------------------------- */}

                            {/* Enabled */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={formData.enabled}
                                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <label htmlFor="enabled" className="text-sm font-bold uppercase tracking-wider">
                                    Enable Slide
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-6 py-3 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? "Uploading..." : editingSlide ? "Update Slide" : "Add Slide"}
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
                </div >
            )
            }

            {/* Slides List */}
            {
                error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )
            }

            {
                slides.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200">
                        <p className="text-gray-400 mb-4">No hero slides yet</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="text-sm font-bold uppercase tracking-wider text-black underline"
                        >
                            Add your first slide
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                className={`border p-6 flex gap-6 ${slide.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                                    }`}
                            >
                                {/* Drag Handle */}
                                <div className="flex items-center">
                                    <GripVertical size={20} className="text-gray-300 cursor-move" />
                                </div>

                                {/* Image */}
                                <div className="relative w-40 h-24 flex-shrink-0">
                                    <Image
                                        src={slide.imageUrl}
                                        alt={slide.heading}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{slide.heading}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{slide.subtext}</p>
                                    {slide.ctaText && (
                                        <p className="text-xs text-gray-400">
                                            Button: {slide.ctaText} → {slide.ctaLink}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleEnabled(slide)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                        title={slide.enabled ? "Disable" : "Enable"}
                                    >
                                        {slide.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingSlide(slide);
                                            setIsFormOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
