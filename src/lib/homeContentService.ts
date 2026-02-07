import { ref, push, set, update, remove, get, query, orderByChild } from 'firebase/database';
import { rtdb } from '@/firebase/config';
import type {
    HeroSlide,
    HeroSlideFormData,
    Highlight,
    HighlightFormData,
    Category,
    CategoryFormData,
    BrandStory,
    BrandStoryFormData
} from '@/types/home';

// ============================================
// HERO SLIDES
// ============================================

export const addHeroSlide = async (data: HeroSlideFormData): Promise<string> => {
    const heroSlidesRef = ref(rtdb, 'homeContent/heroSlides');
    const newSlideRef = push(heroSlidesRef);

    const slideData: Omit<HeroSlide, 'id'> = {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    await set(newSlideRef, slideData);
    return newSlideRef.key!;
};

export const updateHeroSlide = async (id: string, data: Partial<HeroSlideFormData>): Promise<void> => {
    const slideRef = ref(rtdb, `homeContent/heroSlides/${id}`);
    await update(slideRef, {
        ...data,
        updatedAt: Date.now()
    });
};

export const deleteHeroSlide = async (id: string): Promise<void> => {
    const slideRef = ref(rtdb, `homeContent/heroSlides/${id}`);
    await remove(slideRef);
};

export const reorderHeroSlides = async (slides: { id: string; order: number }[]): Promise<void> => {
    const updates: Record<string, any> = {};
    slides.forEach(({ id, order }) => {
        updates[`homeContent/heroSlides/${id}/order`] = order;
        updates[`homeContent/heroSlides/${id}/updatedAt`] = Date.now();
    });
    await update(ref(rtdb), updates);
};

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
    const slidesRef = ref(rtdb, 'homeContent/heroSlides');
    const snapshot = await get(slidesRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, slide]: [string, any]) => ({
        id,
        ...slide
    })).sort((a, b) => a.order - b.order);
};

// ============================================
// HIGHLIGHTS
// ============================================

export const addHighlight = async (data: HighlightFormData): Promise<string> => {
    const highlightsRef = ref(rtdb, 'homeContent/highlights');
    const newHighlightRef = push(highlightsRef);

    const highlightData: Omit<Highlight, 'id'> = {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    await set(newHighlightRef, highlightData);
    return newHighlightRef.key!;
};

export const updateHighlight = async (id: string, data: Partial<HighlightFormData>): Promise<void> => {
    const highlightRef = ref(rtdb, `homeContent/highlights/${id}`);
    await update(highlightRef, {
        ...data,
        updatedAt: Date.now()
    });
};

export const deleteHighlight = async (id: string): Promise<void> => {
    const highlightRef = ref(rtdb, `homeContent/highlights/${id}`);
    await remove(highlightRef);
};

export const reorderHighlights = async (highlights: { id: string; order: number }[]): Promise<void> => {
    const updates: Record<string, any> = {};
    highlights.forEach(({ id, order }) => {
        updates[`homeContent/highlights/${id}/order`] = order;
        updates[`homeContent/highlights/${id}/updatedAt`] = Date.now();
    });
    await update(ref(rtdb), updates);
};

export const getHighlights = async (): Promise<Highlight[]> => {
    const highlightsRef = ref(rtdb, 'homeContent/highlights');
    const snapshot = await get(highlightsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, highlight]: [string, any]) => ({
        id,
        ...highlight
    })).sort((a, b) => a.order - b.order);
};

// ============================================
// CATEGORIES
// ============================================

export const addCategory = async (data: CategoryFormData): Promise<string> => {
    const categoriesRef = ref(rtdb, 'homeContent/categories');
    const newCategoryRef = push(categoriesRef);

    const categoryData: Omit<Category, 'id'> = {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    await set(newCategoryRef, categoryData);
    return newCategoryRef.key!;
};

export const updateCategory = async (id: string, data: Partial<CategoryFormData>): Promise<void> => {
    const categoryRef = ref(rtdb, `homeContent/categories/${id}`);
    await update(categoryRef, {
        ...data,
        updatedAt: Date.now()
    });
};

export const deleteCategory = async (id: string): Promise<void> => {
    const categoryRef = ref(rtdb, `homeContent/categories/${id}`);
    await remove(categoryRef);
};

export const reorderCategories = async (categories: { id: string; order: number }[]): Promise<void> => {
    const updates: Record<string, any> = {};
    categories.forEach(({ id, order }) => {
        updates[`homeContent/categories/${id}/order`] = order;
        updates[`homeContent/categories/${id}/updatedAt`] = Date.now();
    });
    await update(ref(rtdb), updates);
};

export const getCategories = async (): Promise<Category[]> => {
    const categoriesRef = ref(rtdb, 'homeContent/categories');
    const snapshot = await get(categoriesRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, category]: [string, any]) => ({
        id,
        ...category
    })).sort((a, b) => a.order - b.order);
};

// ============================================
// BRAND STORY
// ============================================

export const getBrandStory = async (): Promise<BrandStory | null> => {
    const storyRef = ref(rtdb, 'homeContent/brandStory');
    const snapshot = await get(storyRef);

    if (!snapshot.exists()) return null;

    return snapshot.val();
};

export const updateBrandStory = async (data: BrandStoryFormData): Promise<void> => {
    const storyRef = ref(rtdb, 'homeContent/brandStory');
    await set(storyRef, {
        ...data,
        updatedAt: Date.now()
    });
};
