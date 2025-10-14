import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard, { Product } from "@/components/ProductCard";
import Cart, { CartItem } from "@/components/Cart";

import productLiteh from "@/assets/product-liteh.jpg";
import productKhiarshoor from "@/assets/product-khiarshoor.jpg";
import productMakhloot from "@/assets/product-makhloot.jpg";
import productSeer from "@/assets/product-seer.jpg";
import productBademjan from "@/assets/product-bademjan.jpg";
import productMooseer from "@/assets/product-mooseer.jpg";

const products: Product[] = [
  {
    id: 1,
    name: "ترشی لیته سنتی",
    description: "ترشی لیته خانگی تهیه شده از بهترین سبزیجات با طعم اصیل و سنتی",
    price: 85000,
    image: productLiteh,
    weight: "۷۰۰ گرم"
  },
  {
    id: 2,
    name: "ترشی خیارشور",
    description: "خیارشور خوشمزه و ترد با سرکه طبیعی و چاشنی‌های سنتی",
    price: 65000,
    image: productKhiarshoor,
    weight: "۸۰۰ گرم"
  },
  {
    id: 3,
    name: "ترشی مخلوط",
    description: "ترکیبی از بهترین سبزیجات شامل هویج، گل کلم، لیته و کرفس",
    price: 75000,
    image: productMakhloot,
    weight: "۷۰۰ گرم"
  },
  {
    id: 4,
    name: "ترشی سیر",
    description: "سیر ترشی شده در سرکه با طعم تند و خوشمزه",
    price: 55000,
    image: productSeer,
    weight: "۵۰۰ گرم"
  },
  {
    id: 5,
    name: "ترشی بادمجان",
    description: "بادمجان ترشی شده با گردو، سبزیجات معطر و چاشنی‌های خوشمزه",
    price: 95000,
    image: productBademjan,
    weight: "۷۰۰ گرم"
  },
  {
    id: 6,
    name: "ترشی موسیر",
    description: "موسیر تازه و خوشمزه با سرکه طبیعی",
    price: 70000,
    image: productMooseer,
    weight: "۶۰۰ گرم"
  }
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: "به سبد خرید اضافه شد",
          description: `تعداد ${product.name} افزایش یافت`,
        });
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      toast({
        title: "به سبد خرید اضافه شد",
        description: product.name,
      });
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "از سبد خرید حذف شد",
      variant: "destructive",
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={totalItems} 
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <Hero />

      <section id="products" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">محصولات ما</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تمامی محصولات با بهترین کیفیت و رعایت کامل اصول بهداشتی تهیه می‌شوند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-primary mb-6">درباره ما</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              ما با بیش از ۲۰ سال تجربه در تهیه ترشیجات سنتی، بهترین و مرغوب‌ترین محصولات را با رعایت کامل اصول بهداشتی و استفاده از مرغوب‌ترین مواد اولیه تهیه می‌کنیم.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تمام محصولات ما به صورت خانگی و با دستور اصیل سنتی تهیه شده و هیچگونه مواد نگهدارنده و افزودنی شیمیایی ندارند.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-primary mb-6">تماس با ما</h2>
            <div className="space-y-4 text-lg">
              <p className="text-muted-foreground">
                📞 تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
              </p>
              <p className="text-muted-foreground">
                📱 موبایل: ۰۹۱۲-۱۲۳۴۵۶۷
              </p>
              <p className="text-muted-foreground">
                📍 آدرس: تهران، خیابان انقلاب، پلاک ۱۲۳
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">
            © ۱۴۰۳ فروشگاه ترشیجات سنتی - تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
