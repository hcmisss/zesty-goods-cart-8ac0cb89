import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Share2, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProductReviews from "@/components/ProductReviews";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
  ingredients?: string;
  health_benefits?: string;
  food_pairings?: string;
  food_groups?: string;
}
const ProductDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    fetchProduct();
    checkFavorite();
  }, [id]);
  const checkFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((f: any) => f.id === id));
  };
  const toggleFavorite = () => {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const updated = favorites.filter((f: any) => f.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
      toast({
        title: "حذف شد",
        description: "محصول از علاقه‌مندی‌ها حذف شد."
      });
    } else {
      favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "اضافه شد",
        description: "محصول به علاقه‌مندی‌ها اضافه شد."
      });
    }
  };
  const fetchProduct = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("products").select("*").eq("id", id).single();
      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "بارگذاری محصول با مشکل مواجه شد.",
        variant: "destructive"
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast({
      title: "موفق",
      description: "محصول به سبد خرید اضافه شد."
    });
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  if (!product) {
    return null;
  }
  return <div className="relative flex h-auto min-h-screen w-full flex-col animated-background overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background/70 backdrop-blur-lg px-3 py-2 justify-between border-b border-border/50">
        <button onClick={() => navigate("/")} className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-transparent text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-extrabold">جزئیات محصول</h1>
        <div className="flex items-center gap-2">
          <button onClick={toggleFavorite} className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-transparent text-foreground">
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-primary' : ''}`} />
          </button>
          <button className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-transparent text-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-28">
        {/* Product Image */}
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden min-h-80 relative" style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url(${product.image})`
          }}>
              <div className="flex justify-center gap-2 p-5">
                <div className="h-2 w-8 rounded-full bg-background text-base font-bold"></div>
                <div className="h-2 w-2 rounded-full bg-background/50"></div>
                <div className="h-2 w-2 rounded-full bg-background/50 text-base"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mx-4 mt-4 mb-2 p-4 bg-background/40 backdrop-blur-md border border-border/30 rounded-xl">
          <h1 className="text-3xl leading-tight tracking-tight mb-3 font-extrabold">
            {product.name}
          </h1>
          
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/20">
            <h2 className="text-2xl leading-tight font-extrabold text-primary-foreground">
              {product.price.toLocaleString('fa-IR')} تومان
            </h2>
          </div>

          {/* Product Details */}
          <div className="space-y-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-24">
                <span className="text-sm font-bold text-foreground/80">وزن:</span>
              </div>
              <span className="text-base text-foreground/90 font-bold">{product.weight}</span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-24">
                <span className="text-sm font-bold text-foreground/80">توضیحات:</span>
              </div>
              <p className="text-base text-foreground/90 leading-relaxed font-bold">
                {product.description}
              </p>
            </div>

            {product.ingredients && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-bold text-foreground/80">ترکیبات:</span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed font-bold">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.health_benefits && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-bold text-foreground/80">خواص:</span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed font-bold">
                  {product.health_benefits}
                </p>
              </div>
            )}

            {product.food_pairings && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-bold text-foreground/80">مناسب با:</span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed font-bold">
                  {product.food_pairings}
                </p>
              </div>
            )}

            {product.food_groups && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-bold text-foreground/80">گروه غذایی:</span>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed font-bold">
                  {product.food_groups}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 py-4">
          <ProductReviews productId={product.id} />
        </div>
      </main>

      {/* Sticky Add to Cart Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/70 backdrop-blur-lg p-4 border-t border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <button onClick={addToCart} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-white text-lg font-bold hover:bg-primary/90 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-extrabold">افزودن به سبد خرید</span>
            </button>
          </div>
          <div className="flex items-center rounded-lg border border-border bg-card">
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 text-primary">
              <Plus className="h-5 w-5" />
            </button>
            <span className="px-3 font-bold text-lg">
              {quantity.toLocaleString('fa-IR')}
            </span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-foreground/60">
              <Minus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>;
};
export default ProductDetail;