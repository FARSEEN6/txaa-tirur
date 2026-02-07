"use client";

import { useState } from "react";
import { rtdb } from "@/firebase/config";
import { ref, set } from "firebase/database";
import { useAuthStore } from "@/store/useAuthStore";

const premiumProducts = [
    // 🚘 EXTERIOR ACCESSORIES
    {
        id: "ext_001",
        name: "LED Matrix Headlights (Projector)",
        price: 18999,
        originalPrice: 29999,
        category: "Exterior",
        description: "Premium LED matrix headlights with dynamic light distribution. Adaptive beam control automatically adjusts to oncoming traffic for safer night driving.",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.9,
        reviews: 127,
        isNew: true,
        features: ["Matrix LED Technology", "Auto High Beam", "Plug & Play"],
        specifications: { "Type": "Projector LED", "Power": "60W", "Compatibility": "Universal" }
    },
    {
        id: "ext_002",
        name: "Diamond Cut Alloy Wheels (17 inch)",
        price: 45999,
        originalPrice: 65000,
        category: "Exterior",
        description: "Premium diamond-cut alloy wheels with a stunning dual-tone finish. Lightweight construction enhances performance while delivering head-turning aesthetics.",
        image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.8,
        reviews: 84,
        isNew: true,
        features: ["Diamond Cut Finish", "Lightweight Alloy", "OEM Quality"],
        specifications: { "Size": "17 inch", "Material": "Aluminum Alloy", "Set": "4 Wheels" }
    },
    {
        id: "ext_003",
        name: "Front & Rear Bumper Lip Kit",
        price: 3499,
        originalPrice: 5999,
        category: "Exterior",
        description: "Sport styling meets function. This bumper lip kit reduces drag and enhances ground clearance protection with a premium matte black finish.",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.6,
        reviews: 156,
        isNew: false,
        features: ["Aerodynamic Design", "Easy Installation", "Weather Resistant"],
        specifications: { "Material": "ABS Plastic", "Finish": "Matte Black", "Fitment": "Universal" }
    },
    {
        id: "ext_004",
        name: "Chrome Black Car Emblems",
        price: 899,
        originalPrice: 1499,
        category: "Exterior",
        description: "Premium chrome-black emblems for a sleek, sophisticated look. Easy stick-on application with strong 3M adhesive.",
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.5,
        reviews: 203,
        isNew: false,
        features: ["3M Adhesive", "Chrome Black", "Weather Proof"],
        specifications: { "Material": "ABS + Chrome", "Type": "Stick-on", "Set": "Front + Rear" }
    },
    {
        id: "ext_005",
        name: "Smoked Rain Visor (4 Piece Set)",
        price: 1299,
        originalPrice: 2199,
        category: "Exterior",
        description: "Smoked acrylic rain visors allow fresh air circulation even during rain. Sleek aerodynamic design reduces wind noise.",
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.7,
        reviews: 289,
        isNew: false,
        features: ["Smoked Finish", "Aerodynamic", "Easy Install"],
        specifications: { "Material": "Acrylic", "Set": "4 Windows", "Mount": "3M Tape" }
    },

    // 🛋 INTERIOR ACCESSORIES
    {
        id: "int_001",
        name: "Ambient LED Lighting Kit (64 Colors)",
        price: 3499,
        originalPrice: 5999,
        category: "Interior",
        description: "Transform your cabin with 64-color ambient lighting. App-controlled with music sync, voice control, and custom presets for every mood.",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517153673752-6a695394be5f?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.8,
        reviews: 412,
        isNew: true,
        features: ["App Control", "Music Sync", "Voice Control"],
        specifications: { "Colors": "64 RGB", "Voltage": "12V", "Length": "5 meters" }
    },
    {
        id: "int_002",
        name: "Premium Leather Seat Covers (PU)",
        price: 8999,
        originalPrice: 14999,
        category: "Interior",
        description: "Luxury PU leather seat covers with diamond stitching. Custom-fit design ensures perfect fit with airbag compatibility.",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.9,
        reviews: 178,
        isNew: true,
        features: ["Diamond Stitch", "Airbag Safe", "Custom Fit"],
        specifications: { "Material": "PU Leather", "Type": "Full Set", "Warranty": "1 Year" }
    },
    {
        id: "int_003",
        name: "Custom Steering Wheel Cover (Alcantara)",
        price: 1499,
        originalPrice: 2499,
        category: "Interior",
        description: "Premium Alcantara-style steering wheel cover with anti-slip grip. Temperature regulating material keeps hands comfortable year-round.",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ebdd9?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1580273916550-e323be2ebdd9?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.7,
        reviews: 94,
        isNew: false,
        features: ["Anti-Slip", "Sweat Absorbent", "Universal Fit"],
        specifications: { "Material": "Alcantara", "Diameter": "38cm", "Color": "Black" }
    },
    {
        id: "int_004",
        name: "Wireless Charging Pad (Fast Charge)",
        price: 2199,
        originalPrice: 3499,
        category: "Interior",
        description: "Qi-certified 15W wireless charging pad. Auto-grip arms hold phone securely while fast charging. Compatible with all Qi devices.",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.6,
        reviews: 267,
        isNew: true,
        features: ["15W Fast Charge", "Auto Grip", "Qi Certified"],
        specifications: { "Power": "15W", "Mount": "Dashboard/Vent", "Compatibility": "All Qi Devices" }
    },
    {
        id: "int_005",
        name: "Premium Dashboard Mats (Anti-Slip)",
        price: 799,
        originalPrice: 1299,
        category: "Interior",
        description: "Protect your dashboard from UV damage and scratches. Non-slip silicone backing keeps items secure during drives.",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.4,
        reviews: 156,
        isNew: false,
        features: ["UV Protection", "Anti-Slip", "Custom Fit"],
        specifications: { "Material": "Velvet + Silicone", "Type": "Single Piece", "Color": "Black" }
    },

    // 🔊 TECH & UTILITY
    {
        id: "tech_001",
        name: "Android Touchscreen Infotainment (10.1\")",
        price: 24999,
        originalPrice: 39999,
        category: "Tech",
        description: "Premium 10.1\" Android infotainment system with GPS, Bluetooth, WiFi, and reverse camera input. Seamless smartphone integration.",
        image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.9,
        reviews: 89,
        isNew: true,
        features: ["Android Auto", "Apple CarPlay", "Reverse Camera"],
        specifications: { "Screen": "10.1\" IPS", "OS": "Android 12", "RAM": "4GB" }
    },
    {
        id: "tech_002",
        name: "Dash Camera (Front + Rear 4K)",
        price: 8999,
        originalPrice: 14999,
        category: "Tech",
        description: "Dual 4K dash camera with night vision, parking mode, and G-sensor. Loop recording captures every moment of your drive.",
        image: "https://images.unsplash.com/photo-1486754735325-27bc2f0bd7c3?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1486754735325-27bc2f0bd7c3?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.8,
        reviews: 234,
        isNew: true,
        features: ["4K Recording", "Night Vision", "G-Sensor"],
        specifications: { "Resolution": "4K Front + 1080p Rear", "Storage": "128GB Max", "Display": "3 inch" }
    },
    {
        id: "tech_003",
        name: "TPMS (Tyre Pressure Monitor System)",
        price: 3999,
        originalPrice: 6499,
        category: "Tech",
        description: "Real-time tire pressure and temperature monitoring. Wireless sensors with LCD display alert you to pressure changes instantly.",
        image: "https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.7,
        reviews: 176,
        isNew: false,
        features: ["Real-Time Monitor", "Wireless", "Audio Alerts"],
        specifications: { "Sensors": "4 External", "Display": "LCD", "Battery": "Solar Powered" }
    },
    {
        id: "tech_004",
        name: "Car Vacuum Cleaner (High Power)",
        price: 2499,
        originalPrice: 3999,
        category: "Tech",
        description: "Portable 120W car vacuum with HEPA filter. Cordless operation with LED light for deep cleaning in tight spaces.",
        image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.6,
        reviews: 312,
        isNew: false,
        features: ["120W Power", "HEPA Filter", "LED Light"],
        specifications: { "Power": "120W", "Battery": "2200mAh", "Runtime": "30 mins" }
    },
    {
        id: "tech_005",
        name: "Fast USB Charger (Type-C 65W)",
        price: 1299,
        originalPrice: 1999,
        category: "Tech",
        description: "Dual-port 65W fast charger with Type-C PD and USB-A QC 3.0. Charges laptops, phones, and tablets at maximum speed.",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop"
        ],
        rating: 4.8,
        reviews: 421,
        isNew: true,
        features: ["65W Power Delivery", "Dual Port", "QC 3.0"],
        specifications: { "Output": "65W PD + 18W QC", "Ports": "Type-C + USB-A", "Protection": "Over-voltage" }
    }
];

export default function SeedPage() {
    const [status, setStatus] = useState("Idle");
    const { user } = useAuthStore();

    const seedData = async () => {
        if (!user) {
            setStatus("Please login as Admin first.");
            return;
        }

        setStatus("Seeding...");
        try {
            const productsData: any = {};
            premiumProducts.forEach(product => {
                productsData[product.id] = product;
            });

            await set(ref(rtdb, 'products'), productsData); // Replaces all products at 'products' node
            setStatus("Success! Products seeded.");
        } catch (error: any) {
            console.error(error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-10">
            <h1 className="text-3xl font-bold mb-6">Database Seeder</h1>
            <p className="mb-6 max-w-md text-center text-gray-500">
                This will overwrite all current products with the Premium Product Set.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg mb-6 w-full max-w-md">
                <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(premiumProducts, null, 2)}
                </pre>
            </div>

            <button
                onClick={seedData}
                disabled={status === "Seeding..."}
                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
            >
                {status === "Seeding..." ? "Working..." : "Seed Products"}
            </button>

            {status !== "Idle" && (
                <p className={`mt-4 font-bold ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {status}
                </p>
            )}
        </div>
    );
}
