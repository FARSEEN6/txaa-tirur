import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, Share2 } from 'lucide-react';
import { getProductById } from '@/lib/productService';
import type { Product } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from "@/components/common/SEO";

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartStore();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await getProductById(id);
                if (data) {
                    setProduct(data);
                } else {
                    toast.error("Product not found");
                    navigate('/shop');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Error loading product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        // Reset scroll to top when product changes
        window.scrollTo(0, 0);
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.images?.[0] || "",
            quantity: 1,
            category: product.category
        } as any);
        toast.success("Added to cart");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.name,
                    text: product?.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    if (loading) {
        return (
            <div className="pt-24 min-h-[80vh] flex justify-center items-center bg-white">
                <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) return null;

    const images = product.images && product.images.length > 0 ? product.images : [""];
    const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="pt-24 min-h-screen bg-white">
            <SEO
                title={product.name}
                description={product.description.slice(0, 160)}
                image={images[0]}
                url={`/product/${id}`}
                type="product"
            />
            <div className="container mx-auto px-4 md:px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100">
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={activeImageIndex}
                                    src={images[activeImageIndex]}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-contain p-4"
                                />
                            </AnimatePresence>

                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {product.isNew && (
                                    <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm">
                                        New Arrival
                                    </span>
                                )}
                                {discountPercentage > 0 && (
                                    <span className="bg-white text-black border border-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-sm">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-black ring-1 ring-black/20' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                                {product.category}
                            </span>
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-3 mb-8 border-b border-gray-100 pb-8">
                            {product.discountPrice && product.discountPrice < product.price ? (
                                <>
                                    <span className="text-3xl font-light text-black">
                                        ₹{product.discountPrice.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through mb-1">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-light text-black">
                                    ₹{product.price.toLocaleString("en-IN")}
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-8">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <Truck size={20} className="text-black" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Delivery</p>
                                        <p className="text-sm font-semibold">Free Shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <ShieldCheck size={20} className="text-black" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Warranty</p>
                                        <p className="text-sm font-semibold">Quality Assured</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
                                >
                                    <ShoppingBag size={18} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
