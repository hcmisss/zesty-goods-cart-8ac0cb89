import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
              <span className="text-2xl">🥒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">ترشیجات سنتی</h1>
              <p className="text-sm text-muted-foreground">طعم اصیل خانگی</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              خانه
            </a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors font-medium">
              محصولات
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              درباره ما
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              تماس با ما
            </a>
          </nav>

          <Button 
            onClick={onCartClick}
            className="relative bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="h-5 w-5 ml-2" />
            سبد خرید
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
