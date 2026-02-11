import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Layers, Sticker, Sun, Disc, Grid3X3, Zap, Armchair, RectangleHorizontal, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { rtdb } from "@/firebase/config";
import { ref, get, child } from "firebase/database";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import PromotionalCarousel from "@/components/home/PromotionalCarousel";
// import SplitHero from "@/components/home/SplitHero"; // Unused in original
import BrandStorySection from "@/components/home/BrandStorySection";
import CategoryNav from "@/components/home/CategoryNav";
import { useHighlights, useCategories, useBrandStory } from "@/hooks/useHomeContent";
import CarBrandsSlider from "@/components/shared/CarBrandsSlider";
import LamborghiniStyleSection from "@/components/home/LamborghiniStyleSection";

import SEO from "@/components/common/SEO";

export default function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCartStore();

    // Fetch dynamic home content
    const { enabledHighlights } = useHighlights();
    const { enabledCategories } = useCategories();
    const { story } = useBrandStory();

    // Real car accessories fallback images
    const accessoryImages = [
        "https://m.media-amazon.com/images/I/71Qz3ZBvZNL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71kR5gVKZGL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81Rd6MlY2dL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71Y1R7eFnrL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71YVWN8wUmL._SL1500_.jpg",
    ];

    // Fetch products from Firebase
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const dbRef = ref(rtdb);
                const snapshot = await get(child(dbRef, "products"));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const productList = Object.entries(data).map(([id, prod]: [string, any], index) => ({
                        id,
                        ...prod,
                        image: prod.images?.[0] || prod.image || accessoryImages[index % accessoryImages.length]
                    }));
                    setProducts(productList.slice(0, 6)); // First 6 products
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Fallback categories if no data from Firebase
    const fallbackCategories = [
        {
            id: "fallback-1",
            name: "Seat Covers",
            imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=1000&fit=crop",
            enabled: true,
            order: 0,
        },
        {
            id: "fallback-2",
            name: "Floor Mats",
            imageUrl: "https://m.media-amazon.com/images/I/71Qz3ZBvZNL._SL1500_.jpg",
            enabled: true,
            order: 1,
        },
    ];

    // const displayCategories = enabledCategories.length > 0 ? enabledCategories : fallbackCategories; // Unused variable

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName];
        return IconComponent || Icons.Star;
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-black">
            <SEO
                title="Premium Car Accessories & Modifications"
                description="Upgrade your ride with TXAA's premium range of seat covers, lighting, audio systems, and custom modifications in Tirur."
            />
            {/* Hero Carousel - New Promotional Style */}
            <PromotionalCarousel />

            {/* Car Brands Auto-Scrolling - Compact Version */}
            <CarBrandsSlider
                variant="compact"
                showTitle={false}
                backgroundColor="bg-gray-900"
            />

            {/* Category Navigation - Shop by Category */}
            <CategoryNav />

            {/* Features Bar - Minimalist */}
            {enabledHighlights.length > 0 && (
                <section className="border-b border-gray-100 py-16">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                            {enabledHighlights.map((highlight) => {
                                const IconComponent = getIcon(highlight.iconName);
                                return (
                                    <div key={highlight.id} className="flex flex-col items-center text-center group">
                                        <IconComponent size={28} strokeWidth={1} className="mb-4 text-black group-hover:scale-110 transition-transform duration-500" />
                                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{highlight.title}</h3>
                                        <p className="text-xs text-gray-500">{highlight.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Shop By Category - Modern Glassmorphism */}
            <LamborghiniStyleSection />

            {/* Featured Products - Minimal Grid */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500 mb-2 block">Curated Selection</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Latest Arrivals</h2>
                        <div className="h-px w-20 bg-black mx-auto"></div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="relative aspect-square overflow-hidden bg-gray-200 mb-6">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Quick Actions Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button
                                                onClick={() => {
                                                    addToCart({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: product.image,
                                                        quantity: 1
                                                    });
                                                    toast.success("Added to cart");
                                                }}
                                                className="w-full py-4 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>

                                        {product.isNew && (
                                            <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-black mb-2 group-hover:text-gray-600 transition-colors">
                                            <Link to={`/shop/product/${product.id}`}>{product.name}</Link>
                                        </h3>
                                        <p className="text-sm font-bold text-gray-900">
                                            ₹{product.price?.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-20">
                        <Link to="/shop" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest uppercase hover:text-gray-600 hover:border-gray-600 transition-all">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Lifestyle / Brand Story */}
            <BrandStorySection story={story} />

        </div >
    );
}
