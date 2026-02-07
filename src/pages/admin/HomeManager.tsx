
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Image as ImageIcon, Star, Grid3x3, BookOpen } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function HomeManagerOverview() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    if (authLoading || !user || profile?.role !== "admin") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    const sections = [
        {
            title: "Hero Carousel",
            description: "Manage hero slides with images, headings, and call-to-action buttons",
            icon: ImageIcon,
            href: "/admin/home-manager/hero",
            color: "text-black",
        },
        {
            title: "Highlights",
            description: "Edit feature cards displayed below the hero section",
            icon: Star,
            href: "/admin/home-manager/highlights",
            color: "text-black",
        },
        {
            title: "Categories",
            description: "Manage product category images and names",
            icon: Grid3x3,
            href: "/admin/home-manager/categories",
            color: "text-black",
        },
        {
            title: "Brand Story",
            description: "Update the brand story section with photo and text",
            icon: BookOpen,
            href: "/admin/home-manager/story",
            color: "text-black",
        },
    ];

    return (
        <AdminLayout>
            <div>
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-black uppercase mb-2">
                        Content Sections
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Manage all home page content. Changes reflect instantly on the website.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Link
                                key={section.href}
                                to={section.href}
                                className="group border border-gray-100 p-8 hover:border-black transition-all bg-white"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <Icon
                                        size={32}
                                        strokeWidth={1.5}
                                        className="text-gray-300 group-hover:text-black transition-colors"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-black transition-colors">
                                        Manage →
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">
                                    {section.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {section.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 border border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">
                        💡 Quick Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• All changes are saved in real-time and reflect immediately on the homepage</li>
                        <li>• Disable items to hide them without deleting</li>
                        <li>• Use drag-and-drop to reorder items</li>
                        <li>• Optimize images before upload for best performance</li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
