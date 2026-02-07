"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import toast from "react-hot-toast";
import { useBrandStory } from "@/hooks/useHomeContent";
import { updateBrandStory } from "@/lib/homeContentService";
import type { BrandStoryFormData } from "@/types/home";

export default function BrandStoryManagerPage() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const router = useRouter();
    const { story, loading, error } = useBrandStory();

    const [formData, setFormData] = useState<BrandStoryFormData>({
        heading: "",
        description: "",
        imageUrl: "",
        ctaText: "",
        ctaLink: "",
    });
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            router.push("/");
        }
    }, [user, profile, authLoading, router]);

    useEffect(() => {
        if (story) {
            setFormData({
                heading: story.heading || "",
                description: story.description || "",
                imageUrl: story.imageUrl || "",
                ctaText: story.ctaText || "",
                ctaLink: story.ctaLink || "",
            });
            setImagePreview(story.imageUrl || "");
        }
    }, [story]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setImageFile(file);
        setHasChanges(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (): Promise<string> => {
        if (!imageFile) return formData.imageUrl;

        setUploading(true);
        try {
            const { uploadImage } = await import("@/lib/uploadImage");

            const result = await uploadImage({
                file: imageFile,
                folder: "brand-story",
                // No progress callback needed for now as we don't show it in UI for this component
            });

            return result.url;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.heading || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!imagePreview) {
            toast.error("Please upload an image");
            return;
        }

        try {
            const imageUrl = await uploadImage();
            const storyData = { ...formData, imageUrl };

            await updateBrandStory(storyData);
            toast.success("Brand story updated!");
            setHasChanges(false);
            setImageFile(null);
        } catch (error) {
            console.error("Error saving brand story:", error);
            toast.error("Failed to save brand story");
        }
    };

    const handleChange = (field: keyof BrandStoryFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        setHasChanges(true);
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
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                    Brand Story Section
                </h2>
                <p className="text-gray-500 text-sm">
                    Update the brand story section with photo and text
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-4">
                            Story Image *
                        </label>

                        {imagePreview && (
                            <div className="relative aspect-square w-full mb-4 overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="Brand Story"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            Recommended: Square image (1:1 ratio) for best display
                        </p>
                    </div>

                    {/* Right Column - Content */}
                    <div className="space-y-6">
                        {/* Heading */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Heading *
                            </label>
                            <input
                                type="text"
                                value={formData.heading}
                                onChange={(e) => handleChange("heading", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                placeholder="Driven by Design."
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
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                rows={8}
                                placeholder="At TXAA, we believe your vehicle is an extension of your identity..."
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
                                onChange={(e) => handleChange("ctaText", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                placeholder="Our Story"
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
                                onChange={(e) => handleChange("ctaLink", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:ring-0 transition-colors"
                                placeholder="/about"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4 pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={uploading || !hasChanges}
                        className="px-8 py-4 bg-black text-white text-xs font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : "Save Changes"}
                    </button>
                    {hasChanges && (
                        <span className="flex items-center text-sm text-gray-500">
                            Unsaved changes
                        </span>
                    )}
                </div>
            </form>

            {/* Live Preview */}
            <div className="mt-16 pt-16 border-t border-gray-100">
                <h3 className="text-lg font-bold uppercase mb-6 text-gray-400">Live Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border border-gray-100 p-8">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {imagePreview ? (
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No image uploaded
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-black">
                            {formData.heading || "Your Heading Here"}
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed mb-6">
                            {formData.description || "Your brand story description will appear here..."}
                        </p>
                        {formData.ctaText && (
                            <div className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase">
                                {formData.ctaText} →
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
