import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center animated-background">
      <div className="text-center bg-card/40 backdrop-blur-md border border-border/30 rounded-lg p-12 shadow-xl animate-scale-in">
        <h1 className="mb-4 text-6xl font-bold text-foreground">۴۰۴</h1>
        <p className="mb-6 text-xl text-foreground/70">صفحه مورد نظر یافت نشد</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all"
        >
          بازگشت به صفحه اصلی
        </a>
      </div>
    </div>
  );
};

export default NotFound;
