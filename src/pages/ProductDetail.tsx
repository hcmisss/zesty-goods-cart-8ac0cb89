import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowRight } from "lucide-react";
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
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast({
      title: "موفق",
      description: "محصول به سبد خرید اضافه شد.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen animated-background">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 bg-card/30 backdrop-blur-md border-border/30 hover:bg-card/40"
          onClick={() => navigate("/")}
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به فروشگاه
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12 bg-card/30 backdrop-blur-md border border-border/30 rounded-lg p-6 shadow-xl">
          <div className="animate-fade-in rounded-lg overflow-hidden bg-background/20">
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="space-y-6 animate-slide-up">
            <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
            <p className="text-lg text-foreground/80">{product.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString()} تومان
              </span>
              <span className="text-muted-foreground">{product.weight}</span>
            </div>
            <Button size="lg" onClick={addToCart} className="w-full md:w-auto">
              <ShoppingCart className="ml-2 h-5 w-5" />
              افزودن به سبد خرید
            </Button>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </main>
    </div>
  );
};

export default ProductDetail;
