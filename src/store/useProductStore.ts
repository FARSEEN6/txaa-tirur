import { create } from 'zustand';
import { ref, onValue, update, get } from 'firebase/database';
import { rtdb } from '@/firebase/config';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    brochureUrl?: string;
    features?: string[];
    specifications?: Record<string, string>;
    updatedAt?: string;
}

interface ProductState {
    product: Product | null;
    loading: boolean;
    error: string | null;
    fetchProduct: () => void;
    updateProduct: (data: Partial<Product>) => Promise<void>;
}

// Default product structure
const DEFAULT_PRODUCT: Product = {
    id: 'main-product',
    name: 'Premium Car Seat Cover',
    description: 'Transform your car interior with our premium leather seat covers. Designed for ultimate comfort and durability.',
    price: 3499,
    originalPrice: 4999,
    images: ['/images/product-1.jpg'],
    features: [
        'Premium leather material',
        'Universal fit for most cars',
        'Easy installation',
        'Water resistant',
        '1 Year Warranty'
    ],
    specifications: {
        'Material': 'PU Leather',
        'Color': 'Black',
        'Compatibility': 'Universal',
        'Package': 'Full Set (Front + Rear)'
    }
};

export const useProductStore = create<ProductState>((set) => ({
    product: null,
    loading: true,
    error: null,

    fetchProduct: () => {
        const productRef = ref(rtdb, 'product');

        onValue(productRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                set({
                    product: { id: 'main-product', ...data },
                    loading: false,
                    error: null
                });
            } else {
                // Initialize with default product if none exists
                try {
                    await update(ref(rtdb, 'product'), DEFAULT_PRODUCT);
                    set({ product: DEFAULT_PRODUCT, loading: false, error: null });
                } catch (error) {
                    set({ product: DEFAULT_PRODUCT, loading: false, error: null });
                }
            }
        }, (error) => {
            console.error('Error fetching product:', error);
            set({ error: 'Failed to load product', loading: false });
        });
    },

    updateProduct: async (data: Partial<Product>) => {
        try {
            await update(ref(rtdb, 'product'), {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
}));
