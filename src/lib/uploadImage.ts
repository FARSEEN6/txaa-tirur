/**
 * Image Upload Utility
 * Uploads images to Cloudinary
 */

import toast from "react-hot-toast";

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = "dg1jeldcu";
const CLOUDINARY_UPLOAD_PRESET = "txaa-tirur";
const CLOUDINARY_FOLDER = "foms-home";

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
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith("image/")) {
        return { valid: false, error: "File must be an image" };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { valid: false, error: "Image size must be less than 5MB" };
    }

    return { valid: true };
}

/**
 * Upload to Cloudinary
 */
async function uploadToCloudinary(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `${CLOUDINARY_FOLDER}/${folder}`);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    onProgress(progress);
                }
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.secure_url);
                } catch (error) {
                    reject(new Error("Failed to parse upload response"));
                }
            } else {
                reject(new Error('Upload failed with status ' + xhr.status));
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error("Network error during upload"));
        });

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
        xhr.send(formData);
    });
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
