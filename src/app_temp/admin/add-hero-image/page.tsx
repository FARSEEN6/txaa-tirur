"use client";

import { useState } from "react";
import { rtdb } from "@/firebase/config";
import { ref, set } from "firebase/database";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function AddHeroImagePage() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const addHeroSlide = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }

        setLoading(true);
        try {
            const slideId = `slide_${Date.now()}`;

            await set(ref(rtdb, `homeContent/heroSlides/${slideId}`), {
                heading: "Premium Performance Accessories",
                subtext: "Transform your vehicle with professional-grade upgrades — from racing seats to exhaust systems.",
                ctaText: "Explore Accessories",
                ctaLink: "/shop",
                imageUrl: "/hero-bmw-garage.png",
                enabled: true,
                order: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            toast.success("Hero slide added!");
        } catch (error: any) {
            console.error(error);
            toast.error("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-10">
            <h1 className="text-3xl font-bold mb-6">Add BMW Garage Hero Image</h1>

            <div className="max-w-4xl w-full mb-6">
                <img
                    src="/hero-bmw-garage.png"
                    alt="BMW M8 Garage"
                    className="w-full h-auto"
                />
            </div>

            <p className="mb-6 max-w-md text-center text-gray-500">
                This will add the BMW M8 garage image as a hero slide to your homepage.
            </p>

            <button
                onClick={addHeroSlide}
                disabled={loading}
                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add to Hero Section"}
            </button>
        </div>
    );
}
