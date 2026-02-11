import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, X, Palette, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useHeroSlides } from "@/hooks/useHomeContent";
import PhotoGallery from "@/components/admin/PhotoGallery";
import {
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
} from "@/lib/homeContentService";
import type { HeroSlide, HeroSlideFormData } from "@/types/home";
import AdminLayout from "@/components/layout/AdminLayout";

export default function HeroManagerPage() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const { slides, loading, error } = useHeroSlides();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [formData, setFormData] = useState<HeroSlideFormData>({
        heading: "",
        subtext: "",
        ctaText: "",
        ctaLink: "",
        imageUrl: "",
        enabled: true,
        order: 0,
        // Text Styling
        titleColor: "#ffffff",
        subtitleColor: "#d1d5db",
        textAlign: "center",
        // Button Styling
        buttonBgColor: "#ffffff",
        buttonTextColor: "#000000",
        // Image Styling
        grayscale: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
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
        if (editingSlide) {
            setFormData({
                heading: editingSlide.heading,
                subtext: editingSlide.subtext,
                ctaText: editingSlide.ctaText,
                ctaLink: editingSlide.ctaLink,
                imageUrl: editingSlide.imageUrl,
                enabled: editingSlide.enabled,
                order: editingSlide.order,
                // Text Styling
                titleColor: editingSlide.titleColor || "#ffffff",
                subtitleColor: editingSlide.subtitleColor || "#d1d5db",
                textAlign: editingSlide.textAlign || "center",
                // Button Styling
                buttonBgColor: editingSlide.buttonBgColor || "#ffffff",
                buttonTextColor: editingSlide.buttonTextColor || "#000000",
                // Image Styling
                grayscale: editingSlide.grayscale || false,
                brightness: editingSlide.brightness || 100,
                contrast: editingSlide.contrast || 100,
                saturation: editingSlide.saturation || 100,
                // Legacy
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

        try {
            let imageUrl = formData.imageUrl;

            // Upload new image if selected
            if (imageFile) {
                const { uploadImage } = await import("@/lib/uploadImage");
                const result = await uploadImage({
                    file: imageFile,
                    folder: "hero-slides",
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
            titleColor: "#ffffff",
            subtitleColor: "#d1d5db",
            textAlign: "center",
            buttonBgColor: "#ffffff",
            buttonTextColor: "#000000",
            grayscale: false,
            brightness: 100,
            contrast: 100,
            saturation: 100,
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

    // Generate CSS filter string from form data
    const getImageFilterStyle = () => {
        const filters = [];
        if (formData.grayscale) filters.push("grayscale(100%)");
        if (formData.brightness !== 100) filters.push(`brightness(${formData.brightness}%)`);
        if (formData.contrast !== 100) filters.push(`contrast(${formData.contrast}%)`);
        if (formData.saturation !== 100) filters.push(`saturate(${formData.saturation}%)`);
        return filters.length > 0 ? filters.join(" ") : "none";
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
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                            Hero Carousel
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Full control over images, text styling, colors & effects
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

                {/* Enhanced Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white max-w-6xl w-full my-8">
                            <div className="max-h-[90vh] overflow-y-auto p-8">
                                <h3 className="text-xl font-bold uppercase mb-6 border-b border-gray-100 pb-4">
                                    {editingSlide ? "Edit Slide" : "Add New Slide"}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Live Preview Section */}
                                    <div className="bg-black p-8 rounded-lg">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                            <Eye size={14} />
                                            Live Preview
                                        </div>
                                        <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                                            {imagePreview && (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    style={{ filter: getImageFilterStyle() }}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div
                                                className={`absolute inset-0 flex flex-col ${formData.textAlign === "left" ? "items-start text-left pl-12" :
                                                        formData.textAlign === "right" ? "items-end text-right pr-12" :
                                                            "items-center text-center"
                                                    } justify-center px-8`}
                                            >
                                                {formData.heading && (
                                                    <h1
                                                        className="text-4xl font-bold mb-3"
                                                        style={{ color: formData.titleColor }}
                                                    >
                                                        {formData.heading}
                                                    </h1>
                                                )}
                                                {formData.subtext && (
                                                    <p
                                                        className="text-lg mb-6"
                                                        style={{ color: formData.subtitleColor }}
                                                    >
                                                        {formData.subtext}
                                                    </p>
                                                )}
                                                {formData.ctaText && (
                                                    <button
                                                        type="button"
                                                        className="px-8 py-3 text-sm font-bold uppercase"
                                                        style={{
                                                            backgroundColor: formData.buttonBgColor,
                                                            color: formData.buttonTextColor,
                                                        }}
                                                    >
                                                        {formData.ctaText}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Column - Content */}
                                        <div className="space-y-6">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                                                <Palette size={16} />
                                                Slide Content
                                            </h4>

                                            {/* Image Upload */}
                                            <div>
                                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                                    Hero Image *
                                                </label>
                                                {imagePreview && (
                                                    <div className="relative aspect-video w-full border border-gray-200 rounded overflow-hidden mb-4">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            style={{ filter: getImageFilterStyle() }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setImagePreview("");
                                                                setImageFile(null);
                                                                setFormData({ ...formData, imageUrl: "" });
                                                            }}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:bg-gray-50 transition-colors relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <ImageIcon size={24} className="text-gray-400 mx-auto mb-2" />
                                                        <span className="text-xs font-bold uppercase text-gray-500">Upload New</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsGalleryOpen(true)}
                                                        className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Eye size={24} className="text-gray-400 mx-auto mb-2" />
                                                        <span className="text-xs font-bold uppercase text-gray-500">From Gallery</span>
                                                    </button>
                                                </div>
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
                                                    placeholder="Premium car accessories for all models..."
                                                    required
                                                />
                                            </div>

                                            {/* CTA Button */}
                                            <div className="grid grid-cols-2 gap-4">
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
                                            </div>
                                        </div>

                                        {/* Right Column - Styling Controls */}
                                        <div className="space-y-6">
                                            {/* Text Styling */}
                                            <div className="bg-gray-50 p-6 rounded">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
                                                    Text Styling
                                                </h4>
                                                <div className="space-y-4">
                                                    {/* Heading Color */}
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                                                            Heading Color
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={formData.titleColor}
                                                                onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                                                                className="h-10 w-16 border-0 cursor-pointer rounded"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.titleColor}
                                                                onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded uppercase text-sm"
                                                                placeholder="#FFFFFF"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Subtext Color */}
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                                                            Subtext Color
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={formData.subtitleColor}
                                                                onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                                                                className="h-10 w-16 border-0 cursor-pointer rounded"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.subtitleColor}
                                                                onChange={(e) => setFormData({ ...formData, subtitleColor: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded uppercase text-sm"
                                                                placeholder="#D1D5DB"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Text Alignment */}
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                                                            Text Alignment
                                                        </label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {["left", "center", "right"].map((align) => (
                                                                <button
                                                                    key={align}
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, textAlign: align as any })}
                                                                    className={`px-3 py-2 text-xs font-bold uppercase border transition-colors ${formData.textAlign === align
                                                                            ? "bg-black text-white border-black"
                                                                            : "bg-white text-black border-gray-200 hover:border-black"
                                                                        }`}
                                                                >
                                                                    {align}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Button Styling */}
                                            <div className="bg-gray-50 p-6 rounded">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
                                                    Button Styling
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                                                            Background Color
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={formData.buttonBgColor}
                                                                onChange={(e) => setFormData({ ...formData, buttonBgColor: e.target.value })}
                                                                className="h-10 w-16 border-0 cursor-pointer rounded"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.buttonBgColor}
                                                                onChange={(e) => setFormData({ ...formData, buttonBgColor: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded uppercase text-sm"
                                                                placeholder="#FFFFFF"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
                                                            Text Color
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                value={formData.buttonTextColor}
                                                                onChange={(e) => setFormData({ ...formData, buttonTextColor: e.target.value })}
                                                                className="h-10 w-16 border-0 cursor-pointer rounded"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={formData.buttonTextColor}
                                                                onChange={(e) => setFormData({ ...formData, buttonTextColor: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded uppercase text-sm"
                                                                placeholder="#000000"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image Effects */}
                                            <div className="bg-gray-50 p-6 rounded">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
                                                    Image Effects
                                                </h4>
                                                <div className="space-y-4">
                                                    {/* Black & White Toggle */}
                                                    <div className="flex items-center gap-3 py-2 border-b border-gray-200">
                                                        <input
                                                            type="checkbox"
                                                            id="grayscale"
                                                            checked={formData.grayscale}
                                                            onChange={(e) => setFormData({ ...formData, grayscale: e.target.checked })}
                                                            className="w-5 h-5 cursor-pointer"
                                                        />
                                                        <label htmlFor="grayscale" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                                                            Black & White Mode
                                                        </label>
                                                    </div>

                                                    {/* Brightness */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                                Brightness
                                                            </label>
                                                            <span className="text-xs font-mono text-gray-500">{formData.brightness}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="200"
                                                            value={formData.brightness}
                                                            onChange={(e) => setFormData({ ...formData, brightness: Number(e.target.value) })}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    {/* Contrast */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                                Contrast
                                                            </label>
                                                            <span className="text-xs font-mono text-gray-500">{formData.contrast}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="200"
                                                            value={formData.contrast}
                                                            onChange={(e) => setFormData({ ...formData, contrast: Number(e.target.value) })}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    {/* Saturation */}
                                                    <div>
                                                        <div className="flex justify-between mb-2">
                                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                                Saturation
                                                            </label>
                                                            <span className="text-xs font-mono text-gray-500">{formData.saturation}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="200"
                                                            value={formData.saturation}
                                                            onChange={(e) => setFormData({ ...formData, saturation: Number(e.target.value) })}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enabled Checkbox */}
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

                                    {/* Action Buttons */}
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
                        </div>
                    </div>
                )}

                {/* Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold uppercase">Select Image</h3>
                                <button onClick={() => setIsGalleryOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[70vh]">
                                <PhotoGallery onSelect={(url: string) => {
                                    setImagePreview(url);
                                    setFormData({ ...formData, imageUrl: url });
                                    setIsGalleryOpen(false);
                                }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Slides List */}
                {slides.length === 0 ? (
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

                                {/* Image Preview */}
                                <div className="relative w-40 h-24 flex-shrink-0">
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.heading}
                                        className="w-full h-full object-cover"
                                        style={{
                                            filter: `${slide.grayscale ? "grayscale(100%)" : ""} brightness(${slide.brightness || 100}%) contrast(${slide.contrast || 100}%) saturate(${slide.saturation || 100}%)`
                                        }}
                                    />
                                    {slide.grayscale && (
                                        <div className="absolute top-1 right-1 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold uppercase">
                                            B&W
                                        </div>
                                    )}
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
                                        className="p-2 hover:bg-gray-100 transition-colors rounded"
                                        title={slide.enabled ? "Disable" : "Enable"}
                                    >
                                        {slide.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingSlide(slide);
                                            setIsFormOpen(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 transition-colors rounded"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(slide.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 transition-colors rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
