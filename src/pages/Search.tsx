import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) =>
        product.name.includes(searchQuery) ||
        product.description.includes(searchQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-sm p-4 pb-3 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground ml-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجوی محصول مورد نظر"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            autoFocus
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {searchQuery.trim() === "" ? (
          <div className="flex flex-col items-center justify-center h-96 px-4">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">
              محصول مورد نظر خود را جستجو کنید
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 px-4">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">
              محصولی یافت نشد
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              لطفاً کلمه جستجو را تغییر دهید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
