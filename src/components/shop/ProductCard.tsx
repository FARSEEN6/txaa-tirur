import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

interface ProductProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Add to cart and go to checkout
        addToCart({ ...product, quantity: 1 });
        toast.success("Added to cart!");
        navigate("/checkout");
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ ...product, quantity: 1 });
        toast.success("Added to bag");
    };

    return (
        <Link to={`/shop/product?id=${product.id}`} className="group flex flex-col h-full cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)] mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Wishlist Button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 p-2.5 bg-[var(--color-background)]/80 text-[var(--color-text-primary)] hover:text-[#d4a017] transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Heart size={18} />
                </button>
                {/* Quick Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 py-3 bg-white/90 hover:bg-white text-black text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={14} /> Add
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 py-3 bg-[#d4a017] hover:bg-[#b8860b] text-black text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                    >
                        Buy Now <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#d4a017] mb-2">
                    {product.category}
                </span>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2 group-hover:text-[#d4a017] transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <div className="mt-auto">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>
        </Link>
    );
}
