import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadFavorites();
    updateCartCount();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCartCount(count);
  };

  const removeFavorite = (productId: string) => {
    const updated = favorites.filter((f) => f.id !== productId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    toast({
      title: "حذف شد",
      description: "محصول از علاقه‌مندی‌ها حذف شد.",
    });
  };

  const addToCart = (product: FavoriteProduct) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    toast({
      title: "موفق",
      description: "محصول به سبد خرید اضافه شد.",
    });
  };

  const addAllToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    favorites.forEach((product) => {
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    toast({
      title: "موفق",
      description: "همه محصولات به سبد خرید اضافه شدند.",
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background overflow-x-hidden">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 p-4 pb-2 backdrop-blur-sm">
        <button
          onClick={() => navigate("/")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold tracking-[-0.015em] text-foreground">
          لیست علاقه‌مندی‌ها
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={() => navigate("/")}
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full text-foreground"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {cartCount > 9 ? "۹+" : cartCount.toLocaleString('fa-IR')}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pb-28 pt-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 px-4">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">
              لیست علاقه‌مندی‌های شما خالی است
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              محصولات مورد علاقه خود را اضافه کنید
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-6"
            >
              مشاهده محصولات
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="flex items-stretch justify-between gap-4 rounded-xl bg-card p-4 shadow-sm"
              >
                <div className="flex flex-[2_2_0px] flex-col justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-bold leading-tight text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm font-normal leading-normal text-primary">
                      {product.price.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex w-fit min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-primary/20 px-4 py-1.5 text-sm font-medium leading-normal text-primary"
                  >
                    <span className="truncate">افزودن به سبد</span>
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative flex-1">
                  <div
                    className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary shadow-md"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Sticky Footer Button */}
      {favorites.length > 0 && (
        <footer className="fixed bottom-0 left-0 z-10 w-full bg-background/80 p-4 backdrop-blur-sm">
          <button
            onClick={addAllToCart}
            className="flex h-14 w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold tracking-[0.015em] text-white shadow-lg shadow-primary/30"
          >
            <span className="truncate">افزودن همه به سبد خرید</span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default Favorites;
