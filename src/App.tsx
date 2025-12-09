import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import Index from "./pages/Index";
import LoadingScreen from "./components/LoadingScreen";

// Lazy load less frequently accessed routes
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Orders = lazy(() => import("./pages/Orders"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Categories = lazy(() => import("./pages/Categories"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Account = lazy(() => import("./pages/Account"));
const Search = lazy(() => import("./pages/Search"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded in this session
    const alreadyLoaded = sessionStorage.getItem("app-loaded");
    if (alreadyLoaded) {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem("app-loaded", "true");
    setIsLoading(false);
    setHasLoaded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading && !hasLoaded && (
          <LoadingScreen onLoadComplete={handleLoadComplete} />
        )}
        <div className={isLoading && !hasLoaded ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/account" element={<Account />} />
                <Route path="/search" element={<Search />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
