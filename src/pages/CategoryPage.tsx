import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '@/lib/productService';
import type { Product, ProductCategory } from '@/types/product';
import ProductCard from '@/components/shop/ProductCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from "@/components/common/SEO";

export default function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!category) return;

            setLoading(true);
            try {
                // Decode category from URL (e.g. "Seat%20Covers" -> "Seat Covers")
                const decodedCategory = decodeURIComponent(category) as ProductCategory;
                const data = await getProductsByCategory(decodedCategory);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const decodedCategory = category ? decodeURIComponent(category) : "Collection";

    return (
        <div className="pt-24 min-h-screen bg-white">
            <SEO
                title={`${decodedCategory} - Car Accessories`}
                description={`Shop premium ${decodedCategory} for your car. High quality materials, perfect fit, and competitive prices.`}
                url={`/shop/${category}`}
            />
            <div className="container mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Shop
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                            {decodedCategory}
                        </h1>
                        <p className="text-gray-500 max-w-2xl text-lg">
                            Explore our premium range of {decodedCategory.toLowerCase()}.
                            Designed for style, durability, and perfect fit.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="animate-spin text-gray-400" size={40} />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">
                                We currently don't have any products in the <strong>{decodedCategory}</strong> category.
                                Please check back later or explore other categories.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
