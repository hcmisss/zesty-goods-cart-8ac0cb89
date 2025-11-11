import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Share2, ShoppingCart, Plus, Minus, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProductReviews from "@/components/ProductReviews";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "بارگذاری محصول با مشکل مواجه شد.",
        variant: "destructive",
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
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast({
      title: "موفق",
      description: "محصول به سبد خرید اضافه شد.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-sm p-4 justify-between border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-transparent text-foreground"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">جزئیات محصول</h1>
        <div className="flex items-center gap-2">
          <button className="flex cursor-pointer items-center justify-center rounded-full size-10 bg-transparent text-foreground">
            <Heart className="h-5 w-5" />
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
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden min-h-80 relative"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url(${product.image})`,
              }}
            >
              <div className="flex justify-center gap-2 p-5">
                <div className="h-2 w-8 rounded-full bg-background"></div>
                <div className="h-2 w-2 rounded-full bg-background/50"></div>
                <div className="h-2 w-2 rounded-full bg-background/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            {product.name}
          </h1>
          <p className="text-base font-normal leading-normal text-foreground/70 pt-1">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-2xl font-bold leading-tight text-primary">
              {product.price.toLocaleString('fa-IR')} تومان
            </h2>
            <p className="text-sm font-normal text-foreground/70">
              {product.weight}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 py-4">
          <ProductReviews productId={product.id} />
        </div>
      </main>

      {/* Sticky Add to Cart Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <button
              onClick={addToCart}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-white text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>افزودن به سبد خرید</span>
            </button>
          </div>
          <div className="flex items-center rounded-lg border border-border bg-card">
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-3 text-primary"
            >
              <Plus className="h-5 w-5" />
            </button>
            <span className="px-3 font-bold text-lg">
              {quantity.toLocaleString('fa-IR')}
            </span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-3 text-foreground/60"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
