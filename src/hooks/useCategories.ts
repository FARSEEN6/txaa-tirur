
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '@/firebase/config';
import { categories as defaultCategories } from '@/data/mockData';

export interface Category {
    id: string;
    name: string;
    image: string;
    description: string;
}

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(rtdb, 'products');

        const unsubscribe = onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                const categorySet = new Set<string>();

                // Extract unique categories from products
                Object.values(products).forEach((product: any) => {
                    if (product.category && product.category !== 'Other') {
                        categorySet.add(product.category);
                    }
                });

                // Merge with default categories to ensure they exist even if no products yet
                // and to preserve images/descriptions
                const uniqueCategories: Category[] = [];
                const processCategory = (name: string) => {
                    const existing = defaultCategories.find(c => c.name === name);
                    if (existing) {
                        return existing;
                    }
                    return {
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name: name,
                        image: 'https://picsum.photos/seed/auto/800/600', // Default image
                        description: 'Premium automotive accessories'
                    };
                };

                // Add default categories first
                defaultCategories.forEach(c => {
                    uniqueCategories.push(c);
                    categorySet.delete(c.name);
                });

                // Add remaining dynamic categories
                categorySet.forEach(name => {
                    uniqueCategories.push(processCategory(name));
                });

                setCategories(uniqueCategories);
            } else {
                setCategories(defaultCategories);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { categories, loading };
};
