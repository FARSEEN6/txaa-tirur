"use client";

import { useState } from "react";
import { rtdb } from "@/firebase/config";
import { ref, set } from "firebase/database";
import toast from "react-hot-toast";

export default function SeedHomeContent() {
    const [seeding, setSeeding] = useState(false);

    const seedData = async () => {
        setSeeding(true);
        try {
            // Hero Slides
            const heroSlides = {
                slide1: {
                    heading: "Premium Performance Accessories",
                    subtext: "Transform your vehicle with professional-grade upgrades — from racing seats to exhaust systems.",
                    ctaText: "Explore Accessories",
                    ctaLink: "/shop",
                    imageUrl: "/hero-bmw.jpg", // Local image from public folder
                    enabled: true,
                    order: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
            };

            // Seed ONLY hero slides to avoid overwriting other data
            await set(ref(rtdb, "homeContent/heroSlides"), heroSlides);

            // Commenting out others to preserve existing data
            // await set(ref(rtdb, "homeContent/highlights"), highlights);
            // await set(ref(rtdb, "homeContent/categories"), categories);
            // await set(ref(rtdb, "homeContent/brandStory"), brandStory);

            toast.success("Hero section updated with BMW image!");

            toast.success("Home content seeded successfully!");
        } catch (error) {
            console.error("Seeding error:", error);
            toast.error("Failed to seed home content");
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Seed Home Content Data</h1>
                <p className="text-gray-600 mb-6">
                    This will populate the Firebase Realtime Database with initial home page content
                    including hero slides, highlights, categories, and brand story.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded">
                    <p className="text-sm text-yellow-800">
                        <strong>Warning:</strong> This will overwrite existing home content data.
                    </p>
                </div>

                <button
                    onClick={seedData}
                    disabled={seeding}
                    className="px-8 py-4 bg-black text-white text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {seeding ? "Seeding..." : "Seed Home Content"}
                </button>
            </div>
        </div>
    );
}
