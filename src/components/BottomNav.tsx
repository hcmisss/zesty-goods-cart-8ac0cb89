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
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-lg border-t border-border/50 flex justify-around items-center px-3 z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${
              isActive 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-foreground hover:scale-105"
            }`}
          >
            <Icon className="h-5 w-5" />
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
