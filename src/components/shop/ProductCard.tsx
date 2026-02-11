import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types/product";
import toast from "react-hot-toast";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.images?.[0] || "",
            quantity: 1,
            category: product.category
        });

        toast.success("Added to cart");
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    };

    const discountPercentage = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <div className="group block h-full">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                            No Image
                        </div>
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {product.isNew && (
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            New
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-white text-black border border-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            -{discountPercentage}%
                        </span>
                    )}
                </div>

                {/* Quick Actions (Hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 z-10">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-white text-black py-3 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                        <ShoppingBag size={14} /> Add
                    </button>
                    <button
                        onClick={handleQuickView}
                        className="p-3 bg-white text-black hover:bg-black hover:text-white transition-colors shadow-lg cursor-pointer"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-bold text-sm leading-tight group-hover:underline decoration-1 underline-offset-4">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 pt-1">
                    {product.discountPrice && product.discountPrice < product.price ? (
                        <>
                            <span className="font-bold">₹{product.discountPrice.toLocaleString("en-IN")}</span>
                            <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString("en-IN")}</span>
                        </>
                    ) : (
                        <span className="font-bold">₹{product.price.toLocaleString("en-IN")}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

