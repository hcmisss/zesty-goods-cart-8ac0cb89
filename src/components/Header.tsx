import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}
const Header = ({
  cartItemCount,
  onCartClick
}: HeaderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkAdminRole = async (userId: string) => {
    const {
      data
    } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  return <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-card/30 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
              <span className="text-2xl">🥒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-950">ترشیجات سنتی</h1>
              <p className="text-sm text-zinc-800">طعم اصیل خانگی</p>
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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>}
            </Button>

            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    سفارش‌های من
                  </DropdownMenuItem>
                  {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="ml-2 h-4 w-4" />
                      پنل مدیریت
                    </DropdownMenuItem>}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button variant="outline" onClick={() => navigate("/auth")}>
                ورود / ثبت نام
              </Button>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;