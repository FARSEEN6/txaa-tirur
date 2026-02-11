# 🚀 Quick Reference: Admin Panel

## Admin Routes

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/admin` | Dashboard | Stats, recent orders, quick links |
| `/admin/products` | Products List | View, search, delete |
| `/admin/add-product` | Add Product | Form with all fields + model |
| `/admin/edit-product/:id` | Edit Product | Update existing product |
| `/admin/models` | Car Models | CRUD operations |
| `/admin/orders` | Orders | View, status update, details |
| `/admin/users` | Users | View, role management |
| `/admin/home-manager` | Home Content | Hero, categories, story, etc. |
| `/admin/photos` | Photo Gallery | Upload & manage images |

## Quick Actions

### Add a New Product
```
1. Go to /admin/products
2. Click "+ ADD PRODUCT"
3. Fill form:
   - Name, Description
   - Category
   - Model (e.g., "Swift" or leave as "All Models")
   - Price, Stock
   - Upload images
4. Click "SAVE PRODUCT"
```

### Add a Car Model
```
1. Go to /admin/models
2. Fill form:
   - Model Name (e.g., "Swift")
   - Image URL
   - Status: Active
3. Click "Save Model"
```

###Update Order Status
```
1. Go to /admin/orders
2. Find order
3. Click status dropdown
4. Select new status (Pending → Delivered)
```

### Make User an Admin
```
1. Go to /admin/users
2. Find user
3. Click "MAKE ADMIN" button
```

## Data Structure

### Product
```json
{
  "name": "Seat Covers",
  "category": "Interior",
  "model": "swift",          // NEW!
  "price": 2500,
  "stock": 50,
  "images": ["url"],
  "isNew": true
}
```

### CarModel
```json
{
  "id": "swift",
  "name": "Swift",
  "image": "url",
  "status": "active"
}
```

## Firebase Paths

- Products: `/products/{id}`
- Models: `/carModels/{id}`
- Orders: `/orders/{id}`
- Users: `/users/{uid}`
- Home Content: `/homeContent/*`

## Key Features

✅ Real-time Firebase sync  
✅ Image upload via gallery  
✅ Search & filter  
✅ Loading states  
✅ Empty states  
✅ Toast notifications  
✅ Role-based access  
✅ **Model compatibility filtering** (NEW!)

## Frontend Integration

- Products from `/admin/products` → Show on `/shop`
- Models from `/admin/models` → Show on `/models`
- Shop filters by `/shop?model=swift`
- All changes reflect instantly

## Important Files

- `src/pages/admin/*.tsx` - Admin pages
- `src/lib/productService.ts` - Product CRUD
- `src/hooks/useCarModels.ts` - Model hook (NEW!)
- `src/types/product.ts` - Product types

## Access Control

- Admin only routes protected via `AdminLayout`
- User role stored in Firebase `/users/{uid}/role`
- Roles: `admin` | `user`

## Status: ✅ 100% Complete & Production Ready
