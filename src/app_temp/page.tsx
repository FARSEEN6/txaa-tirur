"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Layers, Sticker, Shield, Sun, Disc, Grid3X3, Zap, Armchair, RectangleHorizontal } from "lucide-react";
import * as Icons from "lucide-react";
import { rtdb } from "@/firebase/config";
import { ref, get, child } from "firebase/database";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";
import PromotionalCarousel from "@/components/home/PromotionalCarousel";
import SplitHero from "@/components/home/SplitHero";
import BrandStorySection from "@/components/home/BrandStorySection";
import CategoryNav from "@/components/home/CategoryNav";
import { useHighlights, useCategories, useBrandStory } from "@/hooks/useHomeContent";
import CarBrandsSlider from "@/components/shared/CarBrandsSlider";


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCartStore();

  // Fetch dynamic home content
  // const { enabledSlides, loading: heroLoading } = useHeroSlides(); // unused in new carousel
  const { enabledHighlights, loading: highlightsLoading } = useHighlights();
  const { enabledCategories, loading: categoriesLoading } = useCategories();
  const { story, loading: storyLoading } = useBrandStory();

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

  const displayCategories = enabledCategories.length > 0 ? enabledCategories : fallbackCategories;

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Star;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
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
      <section className="relative py-24 overflow-hidden bg-slate-50">
        {/* Background Gradients/Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-[20%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative mx-auto px-6 z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 shadow-sm">
              <Sparkles size={12} className="text-amber-400" /> Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Shop By Category</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">Premium upgrades designed to match your style.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Template for Glass Cards */}
            {[
              { title: "Number Plate Frames", icon: RectangleHorizontal, color: "text-orange-500", bg: "bg-orange-50", href: "/shop?category=Number Plate Frames" },
              { title: "Stickers & Decals", icon: Sticker, color: "text-pink-500", bg: "bg-pink-50", href: "/shop?category=Stickers" },
              { title: "Door Sill Plates", icon: Layers, color: "text-amber-500", bg: "bg-amber-50", href: "/shop?category=Door Sill Plates" }, // Layers acts as plates
              { title: "Seat Covers", icon: Armchair, color: "text-rose-500", bg: "bg-rose-50", href: "/shop?category=Seat Covers" },
              { title: "Floor Mats", icon: Grid3X3, color: "text-blue-500", bg: "bg-blue-50", href: "/shop?category=Floor Mats" },
              { title: "LED Lights", icon: Zap, color: "text-purple-500", bg: "bg-purple-50", href: "/shop?category=LED Lights" },
              { title: "Sun Shades", icon: Sun, color: "text-cyan-500", bg: "bg-cyan-50", href: "/shop?category=Sun Shades" },
              { title: "Gear Knobs", icon: Disc, color: "text-emerald-500", bg: "bg-emerald-50", href: "/shop?category=Gear Knobs" },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="group relative">
                <div className="relative overflow-hidden rounded-3xl p-8 bg-white/30 backdrop-blur-md border border-white/60 shadow-lg shadow-gray-200/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white/50 hover:border-white/80 h-full flex flex-col items-center justify-center text-center">

                  {/* Glossy Overlay/Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Icon Container with Soft Glow */}
                  <div className={`relative w-20 h-20 rounded-2xl ${item.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner ring-1 ring-white/50`}>
                    <item.icon size={36} className={`${item.color} drop-shadow-sm`} strokeWidth={1.5} />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-black transition-colors">{item.title}</h3>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/shop" className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all hover:scale-105 shadow-xl shadow-black/10">
              View Full Catalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

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
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <Link href={`/shop/product/${product.id}`}>{product.name}</Link>
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
            <Link href="/shop" className="inline-block border-b border-black pb-1 text-sm font-bold tracking-widest uppercase hover:text-gray-600 hover:border-gray-600 transition-all">
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
