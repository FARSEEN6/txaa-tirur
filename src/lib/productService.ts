import { ref, push, set, update, remove, get, query, orderByChild, equalTo } from "firebase/database";
import { rtdb } from "@/firebase/config";
import type { Product, ProductFormData, ProductCategory } from "@/types/product";

// Add Product
export const addProduct = async (data: ProductFormData): Promise<string> => {
    const productsRef = ref(rtdb, "products");
    const newProductRef = push(productsRef);

    const productData: Omit<Product, "id"> = {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await set(newProductRef, productData);
    return newProductRef.key!;
};

// Update Product
export const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<void> => {
    const productRef = ref(rtdb, `products/${id}`);
    await update(productRef, {
        ...data,
        updatedAt: Date.now(),
    });
};

// Delete Product
export const deleteProduct = async (id: string): Promise<void> => {
    const productRef = ref(rtdb, `products/${id}`);
    await remove(productRef);
};

// Get All Products
export const getProducts = async (): Promise<Product[]> => {
    const productsRef = ref(rtdb, "products");
    const snapshot = await get(productsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    // Convert object to array and sort by newest
    return Object.entries(data).map(([id, prod]: [string, any]) => ({
        id,
        ...prod,
    })).sort((a, b) => b.createdAt - a.createdAt);
};

// Get Products by Category
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
    const productsRef = ref(rtdb, "products");
    const categoryQuery = query(productsRef, orderByChild("category"), equalTo(category));
    const snapshot = await get(categoryQuery);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, prod]: [string, any]) => ({
        id,
        ...prod,
    })).sort((a, b) => b.createdAt - a.createdAt);
};

// Get Single Product
export const getProductById = async (id: string): Promise<Product | null> => {
    const productRef = ref(rtdb, `products/${id}`);
    const snapshot = await get(productRef);

    if (!snapshot.exists()) return null;

    return {
        id,
        ...snapshot.val(),
    };
};
