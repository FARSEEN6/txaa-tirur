"use client";

import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin" size={40} />
            </div>
        }>
            <ProductDetailClient />
        </Suspense>
    );
}
