
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getLamborghiniStyleSection, updateLamborghiniStyleSection } from "@/lib/homeContentService";
import type { LamborghiniStyleSection, LamborghiniStyleSectionFormData } from "@/types/home";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { ArrowLeft, Save, Loader2, ImageIcon, LayoutTemplate } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLamborghiniStyle() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState<LamborghiniStyleSectionFormData>({
        heading: "UNLEASH YOUR TRUE STYLE",
        subHeading: "TXAA PREMIUM",
        imageUrl: "",
        ctaText: "Explore The Collection",
        ctaLink: "/shop",
        secondaryCtaText: "Download Brochure",
        // Styling Defaults
        titleColor: "#000000",
        descriptionColor: "#000000", // Using for subheading color
        textAlign: "center",
        fontSize: "large",
        grayscale: true,
        brightness: 100,
        contrast: 125,
        imageHeight: "auto",
        imageWidth: "100%",
        imagePosition: "center"
    });

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const data = await getLamborghiniStyleSection();
                if (data) {
                    setFormData({
                        heading: data.heading || "UNLEASH YOUR TRUE STYLE",
                        subHeading: data.subHeading || "TXAA PREMIUM",
                        imageUrl: data.imageUrl || "",
                        ctaText: data.ctaText || "Explore The Collection",
                        ctaLink: data.ctaLink || "/shop",
                        secondaryCtaText: data.secondaryCtaText || "Download Brochure",
                        titleColor: data.titleColor || "#000000",
                        descriptionColor: data.descriptionColor || "#000000",
                        textAlign: data.textAlign || "center",
                        fontSize: data.fontSize || "large",
                        grayscale: data.grayscale !== undefined ? data.grayscale : true,
                        brightness: data.brightness || 100,
                        contrast: data.contrast || 125,
                        imageHeight: data.imageHeight || "auto",
                        imageWidth: data.imageWidth || "100%",
                        imagePosition: data.imagePosition || "center"
                    });
                    if (data.imageUrl) setImagePreview(data.imageUrl);
                }
            } catch (error) {
                console.error("Error fetching section:", error);
                toast.error("Failed to load section data");
            } finally {
                setLoading(false);
            }
        };

        fetchSection();
    }, []);

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
        setSaving(true);

        try {
            let imageUrl = formData.imageUrl;

            if (imageFile) {
                const { uploadImage } = await import("@/lib/uploadImage");
                const result = await uploadImage({
                    file: imageFile,
                    folder: "home",
                });
                imageUrl = result.url;
            }

            await updateLamborghiniStyleSection({
                ...formData,
                imageUrl
            });

            toast.success("Section updated successfully!");
        } catch (error) {
            console.error("Error updating section:", error);
            toast.error("Failed to update section");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin/home-manager" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight">Style Section Manager</h1>
                        <p className="text-gray-500 text-sm">Customize the Lamborghini-style feature section</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    {/* Content Section */}
                    <div className="mb-10">
                        <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                            <LayoutTemplate size={20} /> Content
                        </h2>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">Main Heading</label>
                                <input
                                    type="text"
                                    value={formData.heading}
                                    onChange={e => setFormData({ ...formData, heading: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50/50 font-heading text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">Background Text (Subheading)</label>
                                <input
                                    type="text"
                                    value={formData.subHeading}
                                    onChange={e => setFormData({ ...formData, subHeading: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50/50"
                                    placeholder="TXAA PREMIUM"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">Primary CTA Text</label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">Primary CTA Link</label>
                                    <input
                                        type="text"
                                        value={formData.ctaLink}
                                        onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider mb-2">Secondary CTA Text</label>
                                <input
                                    type="text"
                                    value={formData.secondaryCtaText}
                                    onChange={e => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="mb-10 pt-10 border-t border-gray-100">
                        <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                            <ImageIcon size={20} /> Feature Image
                        </h2>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-1/3">
                                <label className="block w-full aspect-video md:aspect-[4/3] bg-gray-100 border-2 border-dashed border-gray-200 hover:border-black transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4" />
                                    ) : (
                                        <div className="text-center p-6 text-gray-400">
                                            <span className="text-xs font-bold uppercase">Click to upload</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                                        Change Image
                                    </div>
                                </label>
                            </div>

                            <div className="flex-1 w-full space-y-6">
                                {/* Image Controls */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Height</label>
                                        <select
                                            value={formData.imageHeight}
                                            onChange={e => setFormData({ ...formData, imageHeight: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 text-sm"
                                        >
                                            <option value="auto">Auto</option>
                                            <option value="400px">Small (400px)</option>
                                            <option value="600px">Medium (600px)</option>
                                            <option value="800px">Large (800px)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Position</label>
                                        <select
                                            value={formData.imagePosition}
                                            onChange={e => setFormData({ ...formData, imagePosition: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 text-sm"
                                        >
                                            <option value="center">Center</option>
                                            <option value="left">Left</option>
                                            <option value="right">Right</option>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!formData.grayscale}
                                            onChange={(e) => setFormData({ ...formData, grayscale: e.target.checked })}
                                            className="w-5 h-5 accent-black"
                                        />
                                        <span className="text-sm font-bold uppercase tracking-wider">Black & White Mode</span>
                                    </label>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs font-bold uppercase tracking-wider">Brightness</label>
                                            <span className="text-xs font-mono">{formData.brightness}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50"
                                            max="150"
                                            value={formData.brightness || 100}
                                            onChange={(e) => setFormData({ ...formData, brightness: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs font-bold uppercase tracking-wider">Contrast</label>
                                            <span className="text-xs font-mono">{formData.contrast}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50"
                                            max="150"
                                            value={formData.contrast || 100}
                                            onChange={(e) => setFormData({ ...formData, contrast: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Introduction Styling */}
                    <div className="mb-10 pt-10 border-t border-gray-100">
                        <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                            Styling
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Heading Text Color</label>
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
                                        className="flex-1 px-3 py-2 border border-gray-200 text-xs font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Background Text Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.descriptionColor || "#000000"}
                                        onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={formData.descriptionColor || "#000000"}
                                        onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-gray-200 text-xs font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Text Alignment</label>
                                <select
                                    value={formData.textAlign}
                                    onChange={e => setFormData({ ...formData, textAlign: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-200 text-sm"
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2">Font Size</label>
                                <select
                                    value={formData.fontSize}
                                    onChange={e => setFormData({ ...formData, fontSize: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-200 text-sm"
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
