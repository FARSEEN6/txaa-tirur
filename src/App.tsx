import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/layout/AuthProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";
import CartDrawer from "@/components/shop/CartDrawer";
import { Toaster } from "react-hot-toast";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminUsers from "@/pages/admin/Users";
import AdminAddProduct from "@/pages/admin/AddProduct";
import AdminEditProduct from "@/pages/admin/EditProduct";
import AdminHomeManager from "@/pages/admin/HomeManager";
import AdminHero from "@/pages/admin/home-manager/Hero";
import AdminHighlights from "@/pages/admin/home-manager/Highlights";
import AdminCategories from "@/pages/admin/home-manager/Categories";
import AdminStory from "@/pages/admin/home-manager/Story";

// Layout wrapper to ensure Navbar/Footer persist
function Layout({ children }: { children: React.ReactNode }) {
  // Can add location logic here if needed
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
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/edit-product" element={<AdminEditProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/home-manager" element={<AdminHomeManager />} />
            <Route path="/admin/home-manager/hero" element={<AdminHero />} />
            <Route path="/admin/home-manager/highlights" element={<AdminHighlights />} />
            <Route path="/admin/home-manager/categories" element={<AdminCategories />} />
            <Route path="/admin/home-manager/story" element={<AdminStory />} />
            {/* Future routes */
              /* <Route path="/shop" element={<Shop />} /> */
            }
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
