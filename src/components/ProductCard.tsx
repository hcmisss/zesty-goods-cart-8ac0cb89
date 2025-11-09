import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/40 backdrop-blur-md border-border/30">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden bg-background/20 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted/50" />
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-xs text-foreground/60 mb-4">
            وزن: {product.weight}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-primary">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-sm text-muted-foreground mr-1">تومان</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button 
          onClick={() => onAddToCart(product)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
          size="sm"
        >
          <Plus className="h-4 w-4 ml-1" />
          افزودن
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/product/${product.id}`)}
          className="flex-1"
        >
          <Eye className="h-4 w-4 ml-1" />
          مشاهده
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
