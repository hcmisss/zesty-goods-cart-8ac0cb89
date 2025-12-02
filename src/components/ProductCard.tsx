import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: string;
}
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}
const ProductCard = ({
  product,
  onAddToCart
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((f: any) => f.id === product.id));
  });
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };
  return <div className="flex flex-col gap-3 rounded-xl bg-background/40 backdrop-blur-md border border-border/30 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="aspect-square overflow-hidden bg-muted/20 relative cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted/50" />}
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <button onClick={toggleFavorite} className="absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-md hover:scale-110 transition-transform">
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-2">
        <p className="font-semibold leading-normal line-clamp-1 text-[sidebar-primary-foreground] text-popover-foreground">
          {product.name}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm leading-normal font-bold text-[#5b452d]">
            {product.price.toLocaleString('fa-IR')} تومان
          </p>
          <button onClick={handleAddToCart} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:scale-110 transition-transform">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};
export default ProductCard;