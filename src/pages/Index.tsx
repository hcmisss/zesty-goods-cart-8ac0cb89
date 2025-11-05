import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "خطا",
        description: "بارگذاری محصولات با مشکل مواجه شد.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateQuantity = (id: string, quantity: number) => {
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

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "از سبد خرید حذف شد",
      variant: "destructive",
    });
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="animated-background min-h-screen">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero />

        {/* Products Section */}
        <section id="products" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-fade-in">
              محصولات ما
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground animate-fade-in">
                <p className="text-xl">محصولی در حال حاضر موجود نیست.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl font-bold mb-8 text-primary">درباره ما</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              فروشگاه ترشیجات سنتی با بیش از ۳۰ سال سابقه، تولید کننده انواع ترشی‌های خانگی و سنتی با کیفیت بالا می‌باشد.
              ما با استفاده از بهترین مواد اولیه و دستور پخت‌های اصیل، طعمی بی‌نظیر را برای شما به ارمغان می‌آوریم.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              تمامی محصولات ما با رعایت کامل اصول بهداشتی و استفاده از مواد طبیعی تهیه می‌شوند.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary animate-fade-in">
              تماس با ما
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="float-animation flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105">
                <span className="text-4xl mb-4">📞</span>
                <h3 className="font-bold text-xl mb-2">تلفن</h3>
                <p className="text-muted-foreground" dir="ltr">021-12345678</p>
              </div>
              
              <div className="float-animation flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105" style={{ animationDelay: "1s" }}>
                <span className="text-4xl mb-4">📧</span>
                <h3 className="font-bold text-xl mb-2">ایمیل</h3>
                <p className="text-muted-foreground">info@torshijat.com</p>
              </div>
              
              <div className="float-animation flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105" style={{ animationDelay: "2s" }}>
                <span className="text-4xl mb-4">📍</span>
                <h3 className="font-bold text-xl mb-2">آدرس</h3>
                <p className="text-muted-foreground">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg font-bold mb-2">فروشگاه ترشیجات سنتی</p>
            <p className="text-sm opacity-90">تمامی حقوق محفوظ است © ۱۴۰۳</p>
          </div>
        </footer>
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default Index;
