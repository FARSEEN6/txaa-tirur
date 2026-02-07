"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { featuredProducts } from "@/data/mockData";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { rtdb } from "@/firebase/config";
import { ref, get, child } from "firebase/database";

export default function ProductDetailClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore((state) => state.addToCart);
    const router = useRouter();

    // Fetch product from Firebase or fallback to mock data
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                // Try to fetch from Firebase first
                const dbRef = ref(rtdb);
                const snapshot = await get(child(dbRef, `products/${id}`));

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setProduct({
                        id: id,
                        ...data,
                        // Ensure images array exists
                        images: data.images || (data.image ? [data.image] : ['https://picsum.photos/seed/product1/600/600'])
                    });
                } else {
                    // Fallback to mock data
                    const mockProduct = featuredProducts.find((p) => p.id === id);
                    if (mockProduct) {
                        setProduct({
                            ...mockProduct,
                            images: [mockProduct.image,
                            `https://picsum.photos/seed/${id}a/600/600`,
                            `https://picsum.photos/seed/${id}b/600/600`
                            ]
                        });
                    } else {
                        // Default placeholder
                        setProduct({
                            id: id,
                            name: "Premium Product",
                            price: 2999,
                            description: "This is a placeholder for product details.",
                            category: "Accessories",
                            rating: 4.5,
                            images: [
                                `https://picsum.photos/seed/${id}1/600/600`,
                                `https://picsum.photos/seed/${id}2/600/600`
                            ]
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                // Fallback to mock
                const mockProduct = featuredProducts.find((p) => p.id === id);
                setProduct(mockProduct ? {
                    ...mockProduct,
                    images: [mockProduct.image, `https://picsum.photos/seed/${id}alt/600/600`]
                } : null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!id || !product) return notFound();

    const images = product.images || [product.image];

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: images[0],
            quantity: quantity,
        });
        toast.success(`Added ${quantity} item(s) to cart`);
    };

    const handleBuyNow = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: images[0],
            quantity: quantity,
        });
        router.push("/checkout");
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="min-h-screen bg-white text-black pt-12 pb-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Product Images with Slider */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 group">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white text-black hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white text-black hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-24 h-24 flex-shrink-0 transition-all ${selectedImage === idx
                                            ? 'opacity-100 ring-1 ring-black ring-offset-2'
                                            : 'opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col pt-4">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">
                            {product.category || "Accessories"}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex text-black">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} strokeWidth={1} />
                                ))}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 underline">124 Reviews</span>
                        </div>

                        <div className="text-3xl font-bold text-black mb-8 border-b border-gray-100 pb-8">
                            ₹{product.price.toLocaleString("en-IN")}
                        </div>

                        <p className="text-gray-600 mb-10 leading-relaxed font-light text-lg">
                            {product.description || "Elevate your driving experience with this premium accessory. Designed for durability and style, it fits perfectly and enhances the look of your car while providing practical benefits. Easy to install and made from high-quality materials."}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex gap-4">
                                <Truck className="text-black flex-shrink-0" size={24} strokeWidth={1} />
                                <div>
                                    <div className="text-sm font-bold uppercase tracking-wide text-black mb-1">Free Delivery</div>
                                    <div className="text-xs text-gray-500">For orders over ₹999</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <ShieldCheck className="text-black flex-shrink-0" size={24} strokeWidth={1} />
                                <div>
                                    <div className="text-sm font-bold uppercase tracking-wide text-black mb-1">1 Year Warranty</div>
                                    <div className="text-xs text-gray-500">Official manufacturer cover</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center border border-gray-200 h-14 w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-full px-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="flex-1 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-full px-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
                                    <Heart size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="py-5 bg-white border border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all"
                                >
                                    Add to Bag
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="py-5 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
