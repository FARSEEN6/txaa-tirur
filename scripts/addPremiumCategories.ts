import { ref, set } from 'firebase/database';
import { rtdb } from '../src/firebase/config.js';

// Premium category list inspired by luxury automotive brands
const premiumCategories = [
    // Interior Excellence
    { name: 'Premium Seat Covers', order: 1 },
    { name: 'All-Weather Floor Mats', order: 2 },
    { name: 'Door Sill Plates', order: 3 },
    { name: 'Steering Wheel Covers', order: 4 },
    { name: 'Gear Shift Knobs', order: 5 },
    { name: 'Pedal Sets', order: 6 },
    { name: 'Center Console Organizers', order: 7 },
    { name: 'Armrest Cushions', order: 8 },

    // Exterior Styling
    { name: 'Number Plate Frames', order: 9 },
    { name: 'Body Decals & Stripes', order: 10 },
    { name: 'Window Tinting Film', order: 11 },
    { name: 'Wheel Accessories', order: 12 },
    { name: 'Mud Flaps & Guards', order: 13 },
    { name: 'Chrome Delete Kits', order: 14 },
    { name: 'Spoiler & Wing Kits', order: 15 },

    // Lighting & Electronics
    { name: 'LED Interior Lighting', order: 16 },
    { name: 'Headlight & Taillight Upgrades', order: 17 },
    { name: 'Underbody Glow Kits', order: 18 },
    { name: 'Dash Cams', order: 19 },
    { name: 'Phone Mounts', order: 20 },
    { name: 'Bluetooth Audio Adapters', order: 21 },

    // Performance & Utility
    { name: 'Air Fresheners', order: 22 },
    { name: 'Sunshades', order: 23 },
    { name: 'Trunk Organizers', order: 24 },
    { name: 'Car Covers', order: 25 },
    { name: 'Cleaning & Detailing Kits', order: 26 },
    { name: 'Tire Pressure Monitors', order: 27 },
    { name: 'Emergency Kits', order: 28 },
];

// Placeholder image URLs (you can replace these with actual images)
const placeholderImages = [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
];

async function addCategories() {
    try {
        console.log('🚀 Adding premium categories to Firebase...\n');

        for (const category of premiumCategories) {
            const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const categoryRef = ref(rtdb, `homeContent/categories/${categoryId}`);

            const categoryData = {
                name: category.name,
                imageUrl: placeholderImages[Math.floor(Math.random() * placeholderImages.length)],
                order: category.order,
                enabled: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            await set(categoryRef, categoryData);
            console.log(`✅ Added: ${category.name}`);

            // Small delay to ensure unique IDs
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log('\n🎉 All categories added successfully!');
        console.log('📝 You can now manage them in Admin > Home Manager > Categories');
        console.log('🖼️  Remember to upload proper images for each category!');

    } catch (error) {
        console.error('❌ Error adding categories:', error);
    }
}

addCategories();
