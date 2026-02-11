export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: ProductCategory;
    model?: string; // Car model compatibility (e.g., "swift", "creta", "all")
    images: string[];
    isNew?: boolean;
    isFeatured?: boolean;
    createdAt: number;
    updatedAt: number;
}

export type ProductCategory = string;

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: string;
    model?: string; // Car model compatibility
    images: string[];
    isNew?: boolean;
    isFeatured?: boolean;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
    "Number Plate Frames",
    "Stickers & Decals",
    "Door Sill Plates",
    "Seat Covers",
    "Floor Mats",
    "LED Lights",
    "Sun Shades",
    "Gear Knobs",
    "Car Comfort",
    "Steering Wheel Covers",
    "Car Armrest",
    "Door Scuff Plates",
    "Car Mats",
    "Car Parcel Tray",
    "Car Perfume",
    "Body Covers",
    "Door Visors",
    "Bumper Protectors",
    "Mud Flaps",
    "Spoilers",
    "Chrome Accessories",
    "Ambient Lights",
    "Fog Lights",
    "Tail Lights",
    "DRL Lights",
    "Vacuum Cleaner",
    "Car Chargers",
    "Phone Holders",
    "Car Organizers",
    "First Aid Kit",
    "Dash Cameras",
    "Car Stereos",
    "Speakers",
    "GPS Trackers",
    "Car Polish",
    "Cleaning Kits",
    "Microfiber Cloths",
    "Wax Sealants"
];
