import { Home, Grid3x3, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "خانه", path: "/" },
    { icon: Grid3x3, label: "دسته‌بندی", path: "/categories" },
    { icon: Heart, label: "علاقه‌ها", path: "/favorites" },
    { icon: User, label: "پروفایل", path: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-md border-t border-border flex justify-around items-center px-4 z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
