import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Search } from "lucide-react";
import logo from "@/assets/logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    // بازیابی از localStorage در هنگام بارگذاری
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
        checkAdminRole(session.user.id);
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
        checkAdminRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkAdminRole = async (userId: string) => {
    const {
      data
    } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").single();
    setIsAdmin(!!data);
  };
  const handleLogout = async () => {
    localStorage.removeItem("user");
    await supabase.auth.signOut();
    navigate("/");
  };
  return <div className="flex items-center bg-background/70 backdrop-blur-lg p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border/50">
      <button onClick={() => navigate("/search")} className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-foreground gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 w-12">
        <Search className="h-5 w-5" />
      </button>
      
      <div className="flex items-center gap-3 flex-1 justify-center">
        
        <h1 className="text-foreground leading-tight tracking-[-0.015em] font-bold text-2xl">
          ترشی خانگی حکیمی
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={onCartClick} className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-foreground gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 w-12">
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {cartItemCount > 9 ? '۹+' : cartItemCount.toLocaleString('fa-IR')}
            </span>}
        </button>

        {user ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/orders")}>
                سفارشات من
              </DropdownMenuItem>
              {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin")}>
                  پنل مدیریت
                </DropdownMenuItem>}
              <DropdownMenuItem onClick={handleLogout}>
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : null}
      </div>
    </div>;
};
export default Header;