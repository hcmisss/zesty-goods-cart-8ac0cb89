import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Product {
  id: number;
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
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-[var(--shadow-hover)] border-border">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square bg-muted">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-card-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            وزن: {product.weight}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-sm text-muted-foreground mr-1">تومان</span>
            </div>
            
            <Button 
              onClick={() => onAddToCart(product)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-1" />
              افزودن
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
