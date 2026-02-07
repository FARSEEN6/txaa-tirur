import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function CartDrawer() {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCartStore();
    const { isCartOpen, closeCart } = useUIStore();

    useEffect(() => {
        if (isCartOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
                    />

                    {/* Cart Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-lg font-bold tracking-[0.2em] uppercase text-black flex items-center gap-3">
                                Shopping Bag
                                <span className="text-gray-400 font-normal text-sm tracking-normal capitalize">({items.length} items)</span>
                            </h2>
                            <button onClick={closeCart} className="text-gray-400 hover:text-black transition-colors p-2 -mr-2">
                                <X size={24} strokeWidth={1} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <ShoppingBag size={48} className="text-gray-200 mb-6" strokeWidth={1} />
                                    <p className="text-gray-500 mb-6 text-lg font-light">Your bag is currently empty.</p>
                                    <Link
                                        to="/shop"
                                        onClick={closeCart}
                                        className="text-xs font-bold tracking-widest uppercase text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6">
                                        {/* Product Image */}
                                        <Link
                                            to={`/shop/product?id=${item.id}`}
                                            onClick={closeCart}
                                            className="relative w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden group"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Link
                                                        to={`/shop/product?id=${item.id}`}
                                                        onClick={closeCart}
                                                        className="text-base font-medium text-black hover:text-gray-600 transition-colors line-clamp-2"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-black">
                                                    ₹{item.price.toLocaleString("en-IN")}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Quantity Controls - Minimal */}
                                                <div className="flex items-center border border-gray-200 h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-semibold text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-lg font-bold text-black">
                                        ₹{totalPrice().toLocaleString("en-IN")}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>

                                <Link
                                    to="/checkout"
                                    onClick={closeCart}
                                    className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors mb-4"
                                >
                                    Proceed to Checkout
                                </Link>
                                <button
                                    onClick={closeCart}
                                    className="w-full text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors text-center"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
