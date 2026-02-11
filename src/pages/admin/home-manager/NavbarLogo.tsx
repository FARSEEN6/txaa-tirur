
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getLogoSettings, updateLogoSettings } from "@/lib/homeContentService";
import type { LogoFormData } from "@/types/home";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { ArrowLeft, Save, Loader2, Palette } from "lucide-react";

export default function AdminNavbarLogo() {
    const { user, profile, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default form data
    const [formData, setFormData] = useState<LogoFormData>({
        logoType: "image", // Default to image as per existing implementation
        logoColor: "#ffffff",
        logoMode: "white",
        logoFilter: "brightness(0) invert(1)" // Default filter for white logo
    });

    useEffect(() => {
        if (!authLoading && (!user || profile?.role !== "admin")) {
            navigate("/");
        }
    }, [user, profile, authLoading, navigate]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getLogoSettings();
                if (data) {
                    setFormData({
                        logoType: data.logoType || "image",
                        logoColor: data.logoColor || "#ffffff",
                        logoMode: data.logoMode || "white",
                        logoFilter: data.logoFilter || "brightness(0) invert(1)"
                    });
                }
            } catch (error) {
                console.error("Error fetching logo settings:", error);
                toast.error("Failed to load logo settings");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleModeChange = (mode: "white" | "black" | "custom" | "original") => {
        let newFilter = "";
        let newColor = formData.logoColor;

        switch (mode) {
            case "white":
                newFilter = "brightness(0) invert(1)";
                newColor = "#ffffff";
                break;
            case "black":
                newFilter = "brightness(0)"; // Black
                newColor = "#000000";
                break;
            case "original":
                newFilter = "none";
                newColor = ""; // No color override for SVG in original mode
                break;
            case "custom":
                // Keep existing filter/color or set defaults if empty
                if (!newFilter) newFilter = "none";
                if (!newColor) newColor = "#000000";
                break;
        }

        setFormData(prev => ({
            ...prev,
            logoMode: mode,
            logoFilter: newFilter,
            logoColor: newColor
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateLogoSettings(formData);
            toast.success("Logo settings updated!");
        } catch (error) {
            console.error("Error updating logo settings:", error);
            toast.error("Failed to update logo settings");
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
                        <h1 className="text-2xl font-bold uppercase tracking-tight">Navbar Logo Settings</h1>
                        <p className="text-gray-500 text-sm">Customize the appearance of the navbar logo</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">

                    {/* Header */}
                    <div className="mb-10 border-b border-gray-100 pb-6">
                        <h2 className="text-lg font-bold uppercase mb-2 flex items-center gap-2">
                            <Palette size={20} /> Appearance
                        </h2>
                        <p className="text-xs text-gray-500">
                            Choose how the logo should appear on the navigation bar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Controls */}
                        <div className="space-y-8">

                            {/* Logo Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-3">Logo Type</label>
                                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, logoType: "image" })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${formData.logoType === "image" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        Image (PNG/JPG)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, logoType: "svg" })}
                                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${formData.logoType === "svg" ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        SVG Code
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">
                                    Current logo: <span className="font-mono text-black">/txaa-logo.png</span> (Hardcoded for now in Navbar)
                                </p>
                            </div>

                            {/* Color Modes */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-3">Color Mode</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("white")}
                                        className={`px-4 py-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.logoMode === "white" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                                        White
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("black")}
                                        className={`px-4 py-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.logoMode === "black" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                        Black
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("original")}
                                        className={`px-4 py-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.logoMode === "original" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                                        Original
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange("custom")}
                                        className={`px-4 py-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.logoMode === "custom" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <Palette size={12} />
                                        Custom
                                    </button>
                                </div>
                            </div>

                            {/* Custom Controls */}
                            {formData.logoMode === "custom" && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    {formData.logoType === "svg" ? (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Fill Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={formData.logoColor}
                                                    onChange={(e) => setFormData({ ...formData, logoColor: e.target.value })}
                                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.logoColor}
                                                    onChange={(e) => setFormData({ ...formData, logoColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">CSS Filter</label>
                                            <input
                                                type="text"
                                                value={formData.logoFilter}
                                                onChange={(e) => setFormData({ ...formData, logoFilter: e.target.value })}
                                                placeholder="e.g. brightness(0) invert(1)"
                                                className="w-full px-3 py-2 border border-gray-200 rounded text-xs font-mono"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                Common filters: <br />
                                                White: <code className="bg-gray-200 px-1 rounded">brightness(0) invert(1)</code><br />
                                                Black: <code className="bg-gray-200 px-1 rounded">brightness(0)</code>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Preview */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-3">Live Preview</label>

                            <div className="bg-gray-100 p-8 rounded-xl flex items-center justify-center border border-gray-200 mb-4 h-48 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                                {/* Navbar Mock */}
                                <div className="w-full max-w-xs bg-black/90 p-4 rounded-lg shadow-xl flex items-center justify-between">
                                    <div className="w-8 h-1 bg-white/20 rounded-full"></div>

                                    {/* Logo Preview */}
                                    <div className="w-12 h-12 relative flex items-center justify-center">
                                        <img
                                            src="/txaa-logo.png"
                                            alt="Logo Preview"
                                            className="w-full h-full object-contain"
                                            style={{
                                                filter: formData.logoType === 'image' ? formData.logoFilter : 'none',
                                                // Simulating SVG fill if we could renders SVG inline, but for now assuming image logo mostly being used
                                            }}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                                        <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 border border-gray-100 rounded-xl">
                                <h4 className="font-bold text-xs uppercase tracking-wider mb-2">Current Settings</h4>
                                <div className="space-y-2 text-xs font-mono text-gray-500">
                                    <div className="flex justify-between border-b border-gray-50 pb-1">
                                        <span>Type:</span>
                                        <span className="text-black">{formData.logoType}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-1">
                                        <span>Mode:</span>
                                        <span className="text-black">{formData.logoMode}</span>
                                    </div>
                                    {formData.logoType === 'image' && (
                                        <div className="flex justify-between flex-col gap-1">
                                            <span>Filter:</span>
                                            <span className="text-black break-all">{formData.logoFilter || "none"}</span>
                                        </div>
                                    )}
                                    {formData.logoType === 'svg' && (
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                            <span>Color:</span>
                                            <span className="text-black">{formData.logoColor}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 mt-8 flex justify-end">
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
