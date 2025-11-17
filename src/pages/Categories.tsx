import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Cart from "@/components/Cart";
import { CartItem } from "@/components/Cart";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "fruit-pickles",
    name: "ترشی میوه",
    description: "شیرین و هیجان‌انگیز",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsVWnymQp6aMCBDASf9xrrlyghpiFCNKYww_LEGMW7cDUOdNEp0D12GJVpukik6PcaSsGLgnZI1CkrzjTRbMpjzaS0SpbSYCIxXYovy2EeV4NwvFuxezhLsFcRUvmUme57FmKPUomEick1hhsdWexEaXGHtg0GHxLM2sdTPsM0rhLr8Vowlunak2yodSLhCVaaxOhV_P-w9mpXLN9GbnF5SL83AkfqycM8EGnmbGLOgLm_b29TjOjWcwTXsI--uZfMo2xK_fglpd6j"
  },
  {
    id: "vegetable-pickles",
    name: "ترشی سبزیجات",
    description: "طعم اصیل خانگی",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIAr1GlT_vUoPqS_-EKLhXXcEsrrvC0NANIekyfFuO_mjABnffHrkgA-qVgDWzmmfbhztaWqJaUGVe3RVEgn3OvjxQ3CllkOoPjcsOHIltCGRL8C6_pwwu0n8h9sR0f5E6Sf9weMMsEe8SZ6JRjSdQY8cNE7Xw4rgsvGaLRApcFSJKtzkaGr51iivhZBSgLAIHDVVO73IYoG8n3iwXoRgLn179XcN_NrIIePfE81_jWGtjhMJlNWwAsvUwCZoObuDkcqaauo4QBDbf"
  },
  {
    id: "mixed-pickles",
    name: "ترشی مخلوط",
    description: "ترکیبی از بهترین‌ها",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT3UjmMGDDyBGUkXKjRw6ZUjNNLkxvTa6k3FK3jla3KMjZE4txWrXpgzvVwIH8glZsveEQL4UsNRXEBDVvXR7Ne0u2jl2DZsOBkugyKe6vlTLnnsot8TxoCokNp3YHBQUJzvL6Dl0Cj0kLoXeN3j0B4TWzfanb_VjQozrVPUXS6Poo5DEDNVj85Llp20tnJl7C5v9catjkABIPgeqwi1i3jbeOVdi2z-yNiavDqSbCCjw1Iz5YfdNQn2mC-S-27dXjZuhkL8ysByZv"
  },
  {
    id: "brined",
    name: "شور",
    description: "یادآور خاطرات",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH8GWnF1SpUYP3Pspe36yWm1rk3bJeet5_byAZkmxhXJgLIwXAUdLUKA-kUS1HXDYF7SrsBLWyc52nSVMxHJYZNV_5ojo8KV66BHKcOrSTkISRNWSTPjqRXisfpiTtSd1mLgPzbt6sc8wkWenXIateDQsxUSY_DNABt_JFdRAmXdW7cqIhUfA1gf1MX85luEkPjBCXkzoDo-Q5YG5CGpp9YvpIV1HtlEkJRmczKbHPMBu54LKEgaubh-bH_3pkGwSuxfvxJsPSrSDn"
  },
  {
    id: "olives",
    name: "زیتون",
    description: "پرورده و ساده",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBQ_eUPMxdUYXf2f-kwRtXYVjSEI11y_vuFByB-PoX34Gc3Lybs9juZSJ7WWPRnQ1BnpoZ1gYRfM9zcEo0r0WuI8jDPDDT0rQyBXZpLnyQC1VYPTVHxuq_nPvWp83mCmSlEkovTImy2Umw8Mv899pXZHLwFZE9EhRQVrflrT1nVrXI8J2YFMslSjTMLJ8qyMCkfb3HE71-IvDeMHFyaihJYyz6-NdF48XN2m4LQF8HbK4itn5vaoiXtlmpOMP6EV9r7RzPXopI9onT"
  },
  {
    id: "paste",
    name: "رب و چاشنی",
    description: "عطر و طعم غذا",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl-xF6HUrCbuaK1ST_K98pih3AI1AmVsMoeuZlaT1LcuiiggHM0oyAqKrWp7Kg19VLQanmgxln3-CLDxrSnmeLUsyZMbylWAWFIbHR4xbz90phac92DTH9HTrITAQ5I38NuAWOOz1Q5Lus5A5ZMTnFDHz5K2jbjxzX8-U9CYFDnjY7xqg82TkDW2FLthv9nvDdfF0hP6FMifiXYQby_KtBVgWhuFq8le0HeAYfR_NASKvjrzHDFH45pftiPk_RzGhjUgSG2z8ZrSq-"
  }
];

const Categories = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <div className="animated-background min-h-screen pb-24">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      <main className="flex-1 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-card/70 backdrop-blur-sm border border-border/50 shadow-lg transition-all hover:scale-105"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-foreground/70">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={handleUpdateQuantity} 
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSuccess}
      />
      
      <BottomNav />
    </div>
  );
};

export default Categories;
