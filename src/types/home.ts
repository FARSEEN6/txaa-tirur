// TypeScript interfaces for Home Content Management

export interface HeroSlide {
    id: string;
    heading: string; // Used as main Title
    subtext: string; // Used as Description
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    enabled: boolean;
    order: number;
    // New fields for Promotional Carousel
    tag?: string; // e.g. "NEW ARRIVAL"
    subtitle?: string; // e.g. "COLLECTION"
    discount?: string; // e.g. "30% OFF"
    bgColor?: string; // e.g. "#FF7F50"
    textColor?: "text-white" | "text-black";
    createdAt: number;
    updatedAt: number;
}

export interface Highlight {
    id: string;
    title: string;
    description: string;
    iconName: string; // e.g., "Truck", "ShieldCheck", "Award", "Headset"
    order: number;
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface Category {
    id: string;
    name: string;
    imageUrl: string;
    order: number;
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface BrandStory {
    heading: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    updatedAt: number;
}

// Form data types (without id and timestamps)
export interface HeroSlideFormData {
    heading: string;
    subtext: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    enabled: boolean;
    order: number;
    // New fields
    tag?: string;
    subtitle?: string;
    discount?: string;
    bgColor?: string;
    textColor?: "text-white" | "text-black";
}

export interface HighlightFormData {
    title: string;
    description: string;
    iconName: string;
    order: number;
    enabled: boolean;
}

export interface CategoryFormData {
    name: string;
    imageUrl: string;
    order: number;
    enabled: boolean;
}

export interface BrandStoryFormData {
    heading: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
}

// Available icon names for highlights
export const AVAILABLE_ICONS = [
    'Truck',
    'ShieldCheck',
    'Award',
    'Headset',
    'Zap',
    'Star',
    'Heart',
    'Package',
    'Clock',
    'Check'
] as const;

export type IconName = typeof AVAILABLE_ICONS[number];
