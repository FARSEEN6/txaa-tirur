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
    // Text Styling
    titleColor?: string; // Hex color for heading (default: #ffffff)
    subtitleColor?: string; // Hex color for subtext (default: #d1d5db)
    textAlign?: "left" | "center" | "right"; // Text alignment
    // Button Styling
    buttonBgColor?: string; // Button background color (default: #ffffff)
    buttonTextColor?: string; // Button text color (default: #000000)
    // Image Styling Controls
    grayscale?: boolean; // Black & White mode toggle
    brightness?: number; // Brightness (0-200, default: 100)
    contrast?: number; // Contrast (0-200, default: 100)
    saturation?: number; // Saturation (0-200, default: 100)
    // Legacy fields for backwards compatibility
    tag?: string; // e.g. "NEW ARRIVAL"
    subtitle?: string; // e.g. "COLLECTION"
    discount?: string; // e.g. "30% OFF"
    bgColor?: string; // e.g. "#FF7F50"
    textColor?: "text-white" | "text-black";
    position?: "left" | "center" | "right";
    createdAt: number;
    updatedAt: number;
}

export interface LogoSettings {
    logoType: "svg" | "image";
    logoColor: string; // Hex color or filter string
    logoMode: "custom" | "white" | "black" | "original";
    logoFilter: string; // For image based logos (grayscale, etc)
    updatedAt: number;
}

export interface LogoFormData {
    logoType: "svg" | "image";
    logoColor: string;
    logoMode: "custom" | "white" | "black" | "original";
    logoFilter: string;
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
    // Text Styling
    titleColor?: string;
    subtitleColor?: string;
    textAlign?: "left" | "center" | "right";
    // Button Styling
    buttonBgColor?: string;
    buttonTextColor?: string;
    // Image Styling Controls
    grayscale?: boolean;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    // Legacy fields
    tag?: string;
    subtitle?: string;
    discount?: string;
    bgColor?: string;
    textColor?: "text-white" | "text-black";
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

// Styling Interface
export interface StylingFields {
    titleColor?: string;
    descriptionColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: 'small' | 'medium' | 'large';
    grayscale?: boolean;
    brightness?: number;
    contrast?: number;
    imageHeight?: string; // e.g. "500px", "50vh", "auto"
    imageWidth?: string; // e.g. "100%", "auto"
    imagePosition?: string; // object-position e.g. "center", "top", "bottom"
}

export interface Category extends StylingFields {
    id: string;
    name: string;
    imageUrl: string;
    order: number;
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface BrandStory extends StylingFields {
    heading: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    updatedAt: number;
}

export interface LamborghiniStyleSection extends StylingFields {
    heading: string; // e.g., "UNLEASH YOUR TRUE STYLE"
    subHeading?: string; // Background text e.g., "TXAA PREMIUM"
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
    updatedAt: number;
}

export interface HighlightFormData {
    title: string;
    description: string;
    iconName: string;
    order: number;
    enabled: boolean;
}

export interface CategoryFormData extends StylingFields {
    name: string;
    imageUrl: string;
    order: number;
    enabled: boolean;
}

export interface BrandStoryFormData extends StylingFields {
    heading: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
}

export interface LamborghiniStyleSectionFormData extends StylingFields {
    heading: string;
    subHeading?: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText?: string;
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

export interface CategoryTabItem extends StylingFields {
    id: string;
    group: string; // e.g., "INTERIOR", "EXTERIOR"
    name: string;
    image: string;
    link: string;
    createdAt: number;
    updatedAt: number;
}

export interface CategoryTabItemFormData extends StylingFields {
    group: string;
    name: string;
    image: string;
    link: string;
}

// Available tabs
export const CATEGORY_TABS = [
    "INTERIOR",
    "EXTERIOR",
    "LIGHTING",
    "CAR UTILITY",
    "CAR ELECTRONICS",
    "CAR CARE & STYLING"
] as const;

export type CategoryTabName = typeof CATEGORY_TABS[number];
