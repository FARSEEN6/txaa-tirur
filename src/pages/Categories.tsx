
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { ChevronRight } from 'lucide-react';

export default function Categories() {
    const { categories, loading } = useCategories();

    return (
        <div className="pt-24 min-h-screen bg-white text-black">
            <div className="container mx-auto px-6 py-12">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-6">Model Selection</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Choose your vehicle model to find compatible accessories styled for your drive.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="group relative aspect-[16/9] overflow-hidden bg-gray-100"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white text-xl font-bold uppercase tracking-widest translate-y-0 transition-transform group-hover:-translate-y-1">
                                            {cat.name}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
