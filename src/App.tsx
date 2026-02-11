import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/layout/AuthProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";
import CartDrawer from "@/components/shop/CartDrawer";
import ScrollToTop from "@/components/ui/ScrollToTop"; // Assuming this might exist or good to add, but sticking to existing pattern for now
import { Toaster } from "react-hot-toast";

// Lazy load pages for better performance and error isolation
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Admin = lazy(() => import("@/pages/Admin"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminAddProduct = lazy(() => import("@/pages/admin/AddProduct"));
const AdminEditProduct = lazy(() => import("@/pages/admin/EditProduct"));
const AdminHomeManager = lazy(() => import("@/pages/admin/HomeManager"));
const AdminHero = lazy(() => import("@/pages/admin/home-manager/Hero"));
const AdminHighlights = lazy(() => import("@/pages/admin/home-manager/Highlights"));
const AdminCategories = lazy(() => import("@/pages/admin/home-manager/Categories"));
const AdminStory = lazy(() => import("@/pages/admin/home-manager/Story"));
const AdminCategoryTabs = lazy(() => import("@/pages/admin/home-manager/CategoryTabs"));
const AdminLamborghiniStyle = lazy(() => import("@/pages/admin/home-manager/LamborghiniStyle"));
const AdminNavbarLogo = lazy(() => import("@/pages/admin/home-manager/NavbarLogo"));
const AdminPhotos = lazy(() => import("@/pages/admin/Photos"));
const AdminModels = lazy(() => import("@/pages/admin/Models"));
const Shop = lazy(() => import("@/pages/Shop"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Models = lazy(() => import("@/pages/Models"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );
}

// Layout wrapper to ensure Navbar/Footer persist
function Layout({ children }: { children: React.ReactNode }) {
  console.log("Layout rendered");
  return (
    <div className="font-sans antialiased bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg, #fff)',
                color: 'var(--toast-color, #000)',
              },
            }}
          />
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/add-product" element={<AdminAddProduct />} />
              <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/home-manager" element={<AdminHomeManager />} />
              <Route path="/admin/home-manager/hero" element={<AdminHero />} />
              <Route path="/admin/home-manager/highlights" element={<AdminHighlights />} />
              <Route path="/admin/home-manager/categories" element={<AdminCategories />} />
              <Route path="/admin/home-manager/story" element={<AdminStory />} />
              <Route path="/admin/home-manager/category-tabs" element={<AdminCategoryTabs />} />
              <Route path="/admin/home-manager/style-section" element={<AdminLamborghiniStyle />} />
              <Route path="/admin/home-manager/navbar-logo" element={<AdminNavbarLogo />} />
              <Route path="/admin/photos" element={<AdminPhotos />} />
              <Route path="/admin/models" element={<AdminModels />} />

              {/* Shop Routes */}
              <Route path="/shop" element={<Layout><Shop /></Layout>} />
              <Route path="/shop/:category" element={<Layout><CategoryPage /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/models" element={<Layout><Models /></Layout>} />

              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
