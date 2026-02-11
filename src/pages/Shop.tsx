import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '@/lib/productService';
import type { Product } from '@/types/product';
import ProductCard from '@/components/shop/ProductCard';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';
import SEO from "@/components/common/SEO";
import { useCategories } from "@/hooks/useHomeContent";

const MOCK_PRODUCTS: Product[] = [
    {
        id: "mock-1",
        name: "Premium Leather Seat Covers",
        price: 15999,
        discountPrice: 12999,
        images: ["https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop"],
        category: "Seat Covers",
        description: "High-quality leather seat covers for premium comfort.",
        isNew: true,
        stock: 10,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "mock-2",
        name: "Carbon Fiber Steering Wheel",
        price: 25000,
        images: ["https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1931&auto=format&fit=crop"],
        category: "Steering Wheel Covers",
        description: "Real carbon fiber steering wheel with ergonomic grip.",
        stock: 5,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "mock-3",
        name: "LED Headlight Kit",
        price: 8500,
        discountPrice: 6999,
        images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2072&auto=format&fit=crop"],
        category: "LED Lights",
        description: "Bright LED headlights for better night visibility.",
        isNew: true,
        stock: 20,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "mock-4",
        name: "Performance Exhaust System",
        price: 45000,
        images: ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"],
        category: "Spoilers",
        description: "Enhance your car's sound and performance.",
        stock: 3,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "mock-5",
        name: "All-Weather Floor Mats",
        price: 4500,
        images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1887&auto=format&fit=crop"],
        category: "Floor Mats",
        description: "Durable floor mats to protect your car's carpet.",
        stock: 15,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: "mock-6",
        name: "Ceramic Coating Kit",
        price: 3500,
        images: ["https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop"],
        category: "Cleaning Kits",
        description: "Professional grade ceramic coating for long lasting shine.",
        stock: 50,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

export default function Shop() {
    console.log("Shop component rendering");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || "";
    const categoryQuery = searchParams.get('category') || "";
    const modelQuery = searchParams.get('model') || "";

    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const hookResult = useCategories();
    // Safety check for hookResult
    const categories = hookResult?.categories.length ? hookResult.categories : [
        { id: '1', name: 'Seat Covers', enabled: true },
        { id: '2', name: 'Steering Wheel Covers', enabled: true },
        { id: '3', name: 'LED Lights', enabled: true },
        { id: '4', name: 'Spoilers', enabled: true },
        { id: '5', name: 'Floor Mats', enabled: true },
        { id: '6', name: 'Cleaning Kits', enabled: true },
    ];
    console.log("Shop categories:", categories);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all products - filtering happens client side for now as dataset is small
                // In a larger app, we'd use server-side filtering or more complex queries
                let allProducts = await getProducts();

                // Fallback to mock data if no products found or API error simulation
                if (!allProducts || allProducts.length === 0) {
                    console.log("No products found from API, using mock data");
                    allProducts = MOCK_PRODUCTS;
                }

                let filtered = allProducts;

                // Filter by search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                    );
                }

                // Filter by category
                if (categoryQuery) {
                    filtered = filtered.filter(p =>
                        p.category.toLowerCase() === categoryQuery.toLowerCase()
                    );
                }

                // Filter by model (if product has a model field)
                if (modelQuery) {
                    filtered = filtered.filter(p =>
                        (p as any).model?.toLowerCase() === modelQuery.toLowerCase()
                    );
                }

                setProducts(filtered);
            } catch (error) {
                console.error("Error fetching products:", error);
                // Fallback on error too
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, categoryQuery, modelQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        // Keep category if it exists? Or clear it? Let's keep it for drill-down, or user can clear.
        // Usually searching searches *everything*, so maybe clear category?
        // Let's keep it simple: Search is global.
        params.delete('category');
        navigate(`/shop?${params.toString()}`);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        navigate(`/shop?${params.toString()}`);
    }

    return (
        <div className="pt-24 min-h-screen bg-white">
            <SEO
                title={searchQuery ? `Search Results for "${searchQuery}"` : modelQuery ? `${modelQuery.charAt(0).toUpperCase()}${modelQuery.slice(1)} Accessories` : categoryQuery ? `${categoryQuery} Accessories` : "Shop All Accessories"}
                description="Browse our complete collection of premium car accessories."
                url="/shop"
            />
            <div className="container mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
                            {searchQuery
                                ? `Search: "${searchQuery}"`
                                : modelQuery
                                    ? `${modelQuery.charAt(0).toUpperCase()}${modelQuery.slice(1)} Accessories`
                                    : categoryQuery
                                        ? categoryQuery
                                        : "All Products"}
                        </h1>
                        <p className="text-gray-500">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <select
                            value={categoryQuery}
                            onChange={handleCategoryChange}
                            className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.filter((c: any) => c.enabled).map((cat: any) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-black focus:ring-0 transition-colors"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </form>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="animate-spin text-gray-400" size={40} />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-bold mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">
                                We couldn't find any products matching your search. Try checking for typos or using different keywords.
                            </p>
                            <Link
                                to="/shop"
                                onClick={() => setSearchTerm("")}
                                className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                Clear Search
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
