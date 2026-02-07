"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Heart, ShoppingCart, Grid3X3, LayoutGrid, ChevronDown, Check } from "lucide-react";
import { featuredProducts, categories } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { rtdb } from "@/firebase/config";
import { ref, get, child } from "firebase/database";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import CarBrandsSlider from "@/components/shared/CarBrandsSlider";

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "All";

    const [selectedCategory, setSelectedCategory] = useState(urlCategory);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [sortBy, setSortBy] = useState("featured");
    const [gridCols, setGridCols] = useState<2 | 3>(3);
    const [firestoreProducts, setFirestoreProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartStore();

    useEffect(() => {
        setSearchQuery(urlSearch);
        setSelectedCategory(urlCategory);
    }, [urlSearch, urlCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const dbRef = ref(rtdb);
                const snapshot = await get(child(dbRef, "products"));

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const products = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));

                    const normalizedProducts = products.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        originalPrice: p.originalPrice,
                        image: p.image || (p.images && p.images[0]) || 'https://picsum.photos/seed/placeholder/600/600',
                        category: p.category,
                        rating: p.rating || 4.5,
                        reviews: p.reviews || 0,
                        isNew: p.isNew
                    }));
                    setFirestoreProducts(normalizedProducts);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const allProducts = useMemo(() => {
        return [...firestoreProducts, ...featuredProducts];
    }, [firestoreProducts]);

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [allProducts, selectedCategory, searchQuery, sortBy]);

    const allCategories = useMemo(() => {
        const cats = ["All", ...categories.map(c => c.name), "Accessories", "Performance"];
        return [...new Set(cats)];
    }, []);

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Minimalist Hero */}
            <section className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">
                        Collection
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
                        {selectedCategory === "All" ? "All Products" : selectedCategory}
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wide max-w-xl mx-auto">
                        Discover our premium range of automotive accessories designed for performance, comfort, and style.
                    </p>
                </div>
            </section>

            {/* Car Brands Auto-Scrolling - Full Version */}
            <CarBrandsSlider
                variant="full"
                showTitle={true}
                title="Shop By Car Brand"
                backgroundColor="bg-gray-900"
            />

            <div className="container mx-auto px-6 py-12">
                {/* Clean Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 sticky top-24 z-30 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100">

                    {/* Category Tabs */}
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {allCategories.slice(0, 5).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? "text-black border-b-2 border-black pb-1"
                                    : "text-gray-400 hover:text-black"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block group">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                                Sort By <ChevronDown size={14} />
                            </div>
                            {/* Dropdown would go here - simplified for now */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Grid Toggle */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => setGridCols(2)}
                                className={`p-2 transition-colors ${gridCols === 2 ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setGridCols(3)}
                                className={`p-2 transition-colors ${gridCols === 3 ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Product Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className={`grid gap-x-8 gap-y-16 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                                <AnimatePresence>
                                    {filteredProducts.map((product, idx) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group cursor-pointer"
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-6">
                                                <Link href={`/shop/product?id=${product.id}`} className="block w-full h-full">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        unoptimized
                                                    />
                                                </Link>

                                                {/* Wishlist */}
                                                <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white rounded-full">
                                                    <Heart size={14} />
                                                </button>

                                                {/* Add to Cart Overlay */}
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
                                                        className="w-full py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
                                                    >
                                                        Add to Bag
                                                    </button>
                                                </div>

                                                {product.isNew && (
                                                    <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                        New
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-center">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2 block">
                                                    {product.category || "Accessories"}
                                                </span>
                                                <h3 className="text-lg font-medium text-black mb-1 group-hover:text-gray-600 transition-colors">
                                                    <Link href={`/shop/product?id=${product.id}`}>{product.name}</Link>
                                                </h3>
                                                <div className="flex items-center justify-center gap-3">
                                                    <p className="text-sm font-bold text-black">
                                                        ₹{product.price?.toLocaleString("en-IN")}
                                                    </p>
                                                    {product.originalPrice && product.originalPrice > product.price && (
                                                        <p className="text-xs text-gray-400 line-through decoration-gray-400">
                                                            ₹{product.originalPrice?.toLocaleString("en-IN")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <Search size={48} className="text-gray-200 mb-6" strokeWidth={1} />
                                <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="text-xs font-bold tracking-widest uppercase text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function ShopLoading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopLoading />}>
            <ShopContent />
        </Suspense>
    );
}
