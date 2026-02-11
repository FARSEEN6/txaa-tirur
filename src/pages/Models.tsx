import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Car } from "lucide-react";
import { rtdb } from "@/firebase/config";
import { ref, get } from "firebase/database";

// Model interface
interface CarModel {
    id: string;
    name: string;
    image: string;
    status: "active" | "inactive";
    createdAt?: number;
}

// Mock/fallback data - will be replaced by Firebase data if available
const mockModels: CarModel[] = [
    {
        id: "swift",
        name: "Swift",
        image: "https://picsum.photos/seed/swift/800/600",
        status: "active",
    },
    {
        id: "creta",
        name: "Creta",
        image: "https://picsum.photos/seed/creta/800/600",
        status: "active",
    },
    {
        id: "baleno",
        name: "Baleno",
        image: "https://picsum.photos/seed/baleno/800/600",
        status: "active",
    },
    {
        id: "verna",
        name: "Verna",
        image: "https://picsum.photos/seed/verna/800/600",
        status: "active",
    },
    {
        id: "fortuner",
        name: "Fortuner",
        image: "https://picsum.photos/seed/fortuner/800/600",
        status: "active",
    },
    {
        id: "innova",
        name: "Innova",
        image: "https://picsum.photos/seed/innova/800/600",
        status: "active",
    },
    {
        id: "ertiga",
        name: "Ertiga",
        image: "https://picsum.photos/seed/ertiga/800/600",
        status: "active",
    },
    {
        id: "venue",
        name: "Venue",
        image: "https://picsum.photos/seed/venue/800/600",
        status: "active",
    },
];

export default function Models() {
    const [models, setModels] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const modelsRef = ref(rtdb, "carModels");
                const snapshot = await get(modelsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const modelsArray: CarModel[] = Object.entries(data).map(([id, value]: [string, any]) => ({
                        id,
                        ...value,
                    }));

                    // Filter only active models and sort by name
                    const activeModels = modelsArray
                        .filter(model => model.status === "active")
                        .sort((a, b) => a.name.localeCompare(b.name));

                    setModels(activeModels.length > 0 ? activeModels : mockModels);
                } else {
                    // Use mock data if no Firebase data
                    setModels(mockModels);
                }
            } catch (error) {
                console.error("Error fetching car models:", error);
                // Fallback to mock data on error
                setModels(mockModels);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleModelClick = (modelId: string) => {
        navigate(`/shop?model=${modelId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center pt-20">
                <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Select Your Model
                    </h1>
                    <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
                        Choose your car model to discover premium accessories designed specifically for your vehicle
                    </p>
                </div>

                {/* Models Grid */}
                {models.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {models.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => handleModelClick(model.id)}
                                className="group block relative aspect-[4/3] bg-white overflow-hidden border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="absolute inset-0 bg-gray-100">
                                    <img
                                        src={model.image}
                                        alt={model.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />

                                {/* Model Name */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white text-xl font-bold uppercase tracking-widest group-hover:pl-2 transition-all duration-300">
                                            {model.name}
                                        </span>
                                        <ChevronRight
                                            size={20}
                                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-20">
                        <Car size={64} strokeWidth={1} className="mx-auto mb-6 text-gray-300" />
                        <h3 className="text-2xl font-bold mb-3">No Models Available</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Car models haven't been configured yet. Please check back soon or contact support.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-all"
                        >
                            Browse All Products
                        </button>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-20 text-center max-w-2xl mx-auto">
                    <div className="border-t border-gray-200 pt-12">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                            Can't Find Your Model?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We're constantly adding new models. Browse all accessories or contact us for special requests.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => navigate('/shop')}
                                className="px-6 py-3 bg-white border border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
                            >
                                View All Products
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-6 py-3 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-all"
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
