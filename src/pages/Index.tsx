import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import BottomNav from "@/components/BottomNav";
import { Loader2, Plus } from "lucide-react";
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
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "خطا",
        description: "بارگذاری محصولات با مشکل مواجه شد.",
        variant: "destructive"
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
          description: `تعداد ${product.name} افزایش یافت`
        });
        return prevItems.map(item => item.id === product.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      }
      toast({
        title: "به سبد خرید اضافه شد",
        description: product.name
      });
      return [...prevItems, {
        ...product,
        quantity: 1
      }];
    });
  };
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      quantity
    } : item));
  };
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "از سبد خرید حذف شد",
      variant: "destructive"
    });
  };
  const handleOrderSuccess = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };
  const categories = [{
    name: "ترشی سبزیجات",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"
  }, {
    name: "ترشی میوه‌جات",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400"
  }, {
    name: "ترشی‌های محلی",
    image: "https://images.unsplash.com/photo-1571681701598-8cd4c584c5e3?w=400"
  }, {
    name: "شورها",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400"
  }];
  return <div className="animated-background min-h-screen pb-24">
      <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

      <main>
        <Hero />

        {/* Best Sellers Section */}
        <section className="py-4">
          <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
            پرفروش‌ترین‌ها
          </h2>
          
          {loading ? <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div> : products.length === 0 ? <div className="text-center py-10 text-muted-foreground px-4">
              <p className="text-lg">محصولی در حال حاضر موجود نیست.</p>
            </div> : <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch px-4 gap-4">
                {products.slice(0, 6).map(product => <div key={product.id} className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-40 w-40 bg-card/50 backdrop-blur-sm p-2">
                    <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" style={{
                backgroundImage: `url(${product.image})`
              }} onClick={() => navigate(`/product/${product.id}`)} />
                    <div className="flex flex-col gap-1">
                      <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                        {product.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-muted-foreground text-sm font-normal leading-normal">
                          {product.price.toLocaleString('fa-IR')} تومان
                        </p>
                        <button onClick={e => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }} className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:scale-110 transition-transform">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
        </section>

        {/* Categories Section */}
        <section className="py-8">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 text-stone-50">
            دسته‌بندی‌ها
          </h2>
          
          <div className="grid grid-cols-2 gap-4 px-4">
            {categories.map((category, index) => <div key={index} className="relative flex flex-col items-center justify-center rounded-lg aspect-square overflow-hidden bg-cover bg-center cursor-pointer hover:scale-105 transition-transform" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${category.image})`
          }}>
                <p className="relative text-white font-bold text-lg z-10">
                  {category.name}
                </p>
              </div>)}
          </div>
        </section>

        {/* All Products Section */}
        <section id="products" className="py-8 px-4">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6 text-stone-50">
            تمام محصولات
          </h2>
          
          {loading ? <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div> : products.length === 0 ? <div className="text-center py-10 text-muted-foreground">
              <p className="text-lg">محصولی در حال حاضر موجود نیست.</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
            </div>}
        </section>

        {/* About Section */}
        <section id="about" className="py-12 px-4 bg-card/30 backdrop-blur-md border-y border-border/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-50">درباره ما</h2>
            <p className="text-base leading-relaxed text-foreground/90 mb-4">
              فروشگاه ترشیجات سنتی با بیش از ۳۰ سال سابقه، تولید کننده انواع ترشی‌های خانگی و سنتی با کیفیت بالا می‌باشد.
              ما با استفاده از بهترین مواد اولیه و دستور پخت‌های اصیل، طعمی بی‌نظیر را برای شما به ارمغان می‌آوریم.
            </p>
            <p className="text-base leading-relaxed text-foreground/90">
              تمامی محصولات ما با رعایت کامل اصول بهداشتی و استفاده از مواد طبیعی تهیه می‌شوند.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-50">
              تماس با ما
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 bg-card/40 backdrop-blur-md border border-border/30 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <span className="text-4xl mb-4">📞</span>
                <h3 className="font-bold text-lg mb-2 text-foreground">تلفن</h3>
                <p className="text-foreground/80 font-medium" dir="ltr">021-12345678</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card/40 backdrop-blur-md border border-border/30 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <span className="text-4xl mb-4">📧</span>
                <h3 className="font-bold text-lg mb-2 text-foreground">ایمیل</h3>
                <p className="text-foreground/80 font-medium">info@torshijat.com</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card/40 backdrop-blur-md border border-border/30 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <span className="text-4xl mb-4">📍</span>
                <h3 className="font-bold text-lg mb-2 text-foreground">آدرس</h3>
                <p className="text-foreground/80 font-medium">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onOrderSuccess={handleOrderSuccess} />
      
      <BottomNav />
    </div>;
};
export default Index;