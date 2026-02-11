/**
 * Image Upload Utility
 * Uploads images to Cloudinary
 */

import axios from "axios";

// Cloudinary Configuration
// Use environment variables if available, otherwise fall back to hardcoded values
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dg1jeldcu";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "txaa-tirur";
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "foms-home";

export type UploadProvider = "cloudinary";

interface UploadOptions {
    file: File;
    folder: string;
    provider?: UploadProvider;
    onProgress?: (progress: number) => void;
}

interface UploadResult {
    url: string;
    provider: UploadProvider;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "File must be an image" };
    }

    // Check file size
    const maxSize = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, error: `Image size must be less than ${maxSizeInMB}MB` };
    }

    return { valid: true };
}

/**
 * Upload to Cloudinary using Axios
 */
async function uploadToCloudinary(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // Note: Some unsigned presets might restrict folder override. 
    // If upload fails, check if the preset allows folder selection.
    formData.append("folder", `${CLOUDINARY_FOLDER}/${folder}`);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
                timeout: 30000, // 30 second timeout to prevent hanging
            }
        );

        if (response.data && response.data.secure_url) {
            return response.data.secure_url;
        } else {
            throw new Error("Invalid response from Cloudinary");
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Cloudinary Upload Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.error?.message || "Failed to upload image to Cloudinary");
        }
        throw error;
    }
}

/**
 * Main upload function
 * Uses Cloudinary
 */
export async function uploadImage(options: UploadOptions): Promise<UploadResult> {
    const { file, folder, onProgress } = options;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    try {
        // Use Cloudinary directly
        const url = await uploadToCloudinary(file, folder, onProgress);
        return { url, provider: "cloudinary" };
    } catch (error: any) {
        console.error("Upload error:", error);
        throw new Error(error.message || "Failed to upload image");
    }
}

/**
 * Hook for easy usage in components
 */
export function useImageUpload() {
    const uploadWithProgress = async (
        file: File,
        folder: string,
        onProgress?: (progress: number) => void
    ): Promise<string> => {
        const result = await uploadImage({ file, folder, onProgress });
        return result.url;
    };

    return { uploadImage: uploadWithProgress, validateImageFile };
}
