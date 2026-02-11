import { useState, useCallback, useEffect } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    maxImages?: number;
    existingImages?: string[];
}

export default function ImageUpload({ onImagesChange, maxImages = 5, existingImages = [] }: ImageUploadProps) {
    const [images, setImages] = useState<string[]>(existingImages);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize with existing images when prop changes
    useEffect(() => {
        if (existingImages.length > 0 && images.length === 0) {
            setImages(existingImages);
        }
    }, [existingImages]);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check max images limit
        if (images.length >= maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        const remainingSlots = maxImages - images.length;
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        setUploading(true);
        setError(null);

        const newImages: string[] = [];
        let successCount = 0;

        try {
            // Import the shared utility dynamically
            const { uploadImage } = await import("@/lib/uploadImage");

            for (const file of filesToUpload) {
                try {
                    const result = await uploadImage({
                        file,
                        folder: "products",
                    });

                    newImages.push(result.url);
                    successCount++;
                } catch (err: any) {
                    console.error("Failed to upload file:", file.name, err);
                    toast.error(`Failed: ${file.name}`);
                }
            }

            if (newImages.length > 0) {
                const updatedImages = [...images, ...newImages];
                setImages(updatedImages);
                onImagesChange(updatedImages);
                toast.success(`${successCount} image(s) added!`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError("Failed to upload images. Please try again.");
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = "";
        }
    }, [images, maxImages, onImagesChange]);

    const removeImage = useCallback((index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
        toast.success("Image removed");
    }, [images, onImagesChange]);

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <label
                className={`
                    flex flex-col items-center justify-center w-full h-36 
                    border-2 border-dashed rounded-xl cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${uploading
                        ? "border-gray-400 bg-gray-100 dark:bg-slate-800 cursor-not-allowed opacity-60"
                        : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:border-[#d4a017] hover:bg-gray-100 dark:hover:bg-slate-700"
                    }
                    ${images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <div className="flex flex-col items-center justify-center py-4">
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin text-black mb-2" size={36} />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Uploading to Cloud...
                            </p>
                        </>
                    ) : (
                        <>
                            <Upload className="text-gray-400 dark:text-gray-500 mb-2" size={36} />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Click or drag to upload images
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages})
                            </p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleUpload}
                    disabled={uploading || images.length >= maxImages}
                />
            </label>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 text-black text-sm bg-gray-50 border border-black p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-slate-700 group bg-gray-100 dark:bg-slate-800"
                        >
                            <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Primary badge */}
                            {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                    Primary
                                </span>
                            )}
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                                title="Remove image"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Help Text */}
            {images.length === 0 && (
                <p className="text-xs text-gray-400 text-center">
                    The first image will be used as the main product image
                </p>
            )}
        </div>
    );
}
