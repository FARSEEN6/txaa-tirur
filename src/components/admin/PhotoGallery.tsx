import { useState, useEffect } from "react";
import { ref, push, set, onValue, remove } from "firebase/database";
import { rtdb } from "@/firebase/config";
import toast from "react-hot-toast";
import { Loader2, Trash2, Copy, Image as ImageIcon, Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Photo {
    id: string;
    url: string;
    createdAt: string;
}

interface PhotoGalleryProps {
    onSelect?: (url: string) => void;
}

export default function PhotoGallery({ onSelect }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch photos from Firebase Realtime Database
    useEffect(() => {
        const photosRef = ref(rtdb, "photos");
        const unsubscribe = onValue(photosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const photoList = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    url: value.url,
                    createdAt: value.createdAt,
                }));
                // Sort by newest first
                setPhotos(photoList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } else {
                setPhotos([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching photos:", error);
            toast.error("Failed to load photos");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Handle new image uploads
    const handleImagesUploaded = async (urls: string[]) => {
        if (urls.length === 0) return;

        try {
            // Save each new URL to Firebase
            const uploadPromises = urls.map(url => {
                const newPhotoRef = push(ref(rtdb, "photos"));
                return set(newPhotoRef, {
                    url,
                    createdAt: new Date().toISOString()
                });
            });

            await Promise.all(uploadPromises);
            // Toast handled by ImageUpload component or we can add one here
            // toast.success("Photos saved to gallery"); 
        } catch (error) {
            console.error("Error saving photos to DB:", error);
            toast.error("Failed to save some photos to the gallery");
        }
    };

    // Delete photo
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering other clicks if any
        if (!window.confirm("Are you sure you want to delete this photo?")) return;

        try {
            const photoRef = ref(rtdb, `photos / ${id} `);
            await remove(photoRef);
            toast.success("Photo deleted");
        } catch (error) {
            console.error("Error deleting photo:", error);
            toast.error("Failed to delete photo");
        }
    };

    // Copy URL to clipboard
    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-black uppercase tracking-wide mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    Upload New Photos
                </h2>
                <ImageUpload
                    onImagesChange={handleImagesUploaded}
                    maxImages={10}
                    existingImages={[]} // Always start empty for the uploader
                />
            </div>

            {/* Gallery Grid */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-black uppercase tracking-wide mb-6">
                    Gallery ({photos.length})
                </h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-gray-400" size={32} />
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>No photos uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-black transition-colors"
                            >
                                <img
                                    src={photo.url}
                                    alt="Uploaded"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    {onSelect ? (
                                        <button
                                            onClick={() => onSelect(photo.url)}
                                            className="px-4 py-2 bg-white text-black rounded-lg font-bold uppercase text-xs hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            title="Select Image"
                                        >
                                            <Check size={16} />
                                            Select
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleCopyUrl(photo.url)}
                                                className="p-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
                                                title="Copy URL"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(photo.id, e)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Delete Photo"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
