import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '@/firebase/config';
import type { HeroSlide, Highlight, Category, BrandStory } from '@/types/home';

// ============================================
// HERO SLIDES HOOK
// ============================================
export const useHeroSlides = () => {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const slidesRef = ref(rtdb, 'homeContent/heroSlides');

        const unsubscribe = onValue(
            slidesRef,
            (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const slidesArray: HeroSlide[] = Object.entries(data).map(([id, slide]: [string, any]) => ({
                            id,
                            ...slide
                        }));
                        // Sort by order and filter enabled slides
                        const sortedSlides = slidesArray
                            .sort((a, b) => a.order - b.order);
                        setSlides(sortedSlides);
                    } else {
                        setSlides([]);
                    }
                    setError(null);
                } catch (err) {
                    setError('Failed to load hero slides');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Failed to load hero slides');
                setLoading(false);
                console.error(err);
            }
        );

        return () => off(slidesRef, 'value', unsubscribe);
    }, []);

    // Get only enabled slides for frontend display
    const enabledSlides = slides.filter(slide => slide.enabled);

    return { slides, enabledSlides, loading, error };
};

// ============================================
// HIGHLIGHTS HOOK
// ============================================
export const useHighlights = () => {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const highlightsRef = ref(rtdb, 'homeContent/highlights');

        const unsubscribe = onValue(
            highlightsRef,
            (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const highlightsArray: Highlight[] = Object.entries(data).map(([id, highlight]: [string, any]) => ({
                            id,
                            ...highlight
                        }));
                        const sortedHighlights = highlightsArray.sort((a, b) => a.order - b.order);
                        setHighlights(sortedHighlights);
                    } else {
                        setHighlights([]);
                    }
                    setError(null);
                } catch (err) {
                    setError('Failed to load highlights');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Failed to load highlights');
                setLoading(false);
                console.error(err);
            }
        );

        return () => off(highlightsRef, 'value', unsubscribe);
    }, []);

    const enabledHighlights = highlights.filter(h => h.enabled);

    return { highlights, enabledHighlights, loading, error };
};

// ============================================
// CATEGORIES HOOK
// ============================================
export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const categoriesRef = ref(rtdb, 'homeContent/categories');

        const unsubscribe = onValue(
            categoriesRef,
            (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const categoriesArray: Category[] = Object.entries(data).map(([id, category]: [string, any]) => ({
                            id,
                            ...category
                        }));
                        const sortedCategories = categoriesArray.sort((a, b) => a.order - b.order);
                        setCategories(sortedCategories);
                    } else {
                        setCategories([]);
                    }
                    setError(null);
                } catch (err) {
                    setError('Failed to load categories');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Failed to load categories');
                setLoading(false);
                console.error(err);
            }
        );

        return () => off(categoriesRef, 'value', unsubscribe);
    }, []);

    const enabledCategories = categories.filter(c => c.enabled);

    return { categories, enabledCategories, loading, error };
};

// ============================================
// BRAND STORY HOOK
// ============================================
export const useBrandStory = () => {
    const [story, setStory] = useState<BrandStory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storyRef = ref(rtdb, 'homeContent/brandStory');

        const unsubscribe = onValue(
            storyRef,
            (snapshot) => {
                try {
                    if (snapshot.exists()) {
                        setStory(snapshot.val());
                    } else {
                        setStory(null);
                    }
                    setError(null);
                } catch (err) {
                    setError('Failed to load brand story');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Failed to load brand story');
                setLoading(false);
                console.error(err);
            }
        );

        return () => off(storyRef, 'value', unsubscribe);
    }, []);

    return { story, loading, error };
};
