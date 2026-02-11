import AdminLayout from "@/components/layout/AdminLayout";
import PhotoGallery from "@/components/admin/PhotoGallery";

export default function AdminPhotos() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-black uppercase tracking-tight font-heading">
                        Photo Gallery
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Upload and manage photos for use across the application.
                    </p>
                </div>

                <PhotoGallery />
            </div>
        </AdminLayout>
    );
}
