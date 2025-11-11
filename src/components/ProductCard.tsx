import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="flex flex-col gap-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-square overflow-hidden bg-muted/20 relative rounded-lg">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted/50" />
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <div>
        <p className="text-foreground text-base font-medium leading-normal">
          {product.name}
        </p>
        <p className="text-muted-foreground text-sm font-normal leading-normal">
          {product.price.toLocaleString('fa-IR')} تومان
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
