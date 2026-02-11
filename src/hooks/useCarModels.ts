import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '@/firebase/config';

export interface CarModel {
    id: string;
    name: string;
    image: string;
    status: 'active' | 'inactive';
    createdAt?: number;
}

/**
 * Hook to fetch car models from Firebase
 * Only returns active models by default
 */
export function useCarModels(includeInactive = false) {
    const [models, setModels] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const modelsRef = ref(rtdb, 'carModels');

        const unsubscribe = onValue(
            modelsRef,
            (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const modelsList: CarModel[] = Object.keys(data).map((key) => ({
                            id: key,
                            name: data[key].name || key,
                            image: data[key].image || '',
                            status: data[key].status || 'active',
                            createdAt: data[key].createdAt,
                        }));

                        // Filter by status if needed
                        const filtered = includeInactive
                            ? modelsList
                            : modelsList.filter((m) => m.status === 'active');

                        // Sort alphabetically
                        filtered.sort((a, b) => a.name.localeCompare(b.name));

                        setModels(filtered);
                    } else {
                        setModels([]);
                    }
                    setError(null);
                } catch (err) {
                    console.error('Error processing car models:', err);
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error('Error fetching car models:', err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [includeInactive]);

    return { models, loading, error };
}
