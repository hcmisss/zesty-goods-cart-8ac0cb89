import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import backgroundImage from "@/assets/pickles-background-optimized.jpg";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    // Check for fonts and trigger complete
    const checkReady = async () => {
      try {
        await document.fonts.ready;
      } catch (e) {
        // Fonts API not supported, continue anyway
      }
      
      // Minimum display time for smooth UX
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onLoadComplete, 500);
        }, 300);
      }, 1500);
    };

    checkReady();

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background image - same as main site */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Dark overlay with blur - same as main site */}
      <div className="absolute inset-0 backdrop-blur-[12px] bg-black/45" />

      {/* Glass card */}
      <div
        className={`relative bg-card/40 backdrop-blur-md rounded-xl border border-border/30 shadow-lg p-8 flex flex-col items-center gap-6 transition-transform duration-500 ${
          isExiting ? "scale-95" : "scale-100"
        }`}
      >
        {/* Logo */}
        <div className="w-24 h-24 rounded-full bg-card/50 backdrop-blur-md border border-border/30 flex items-center justify-center shadow-lg overflow-hidden">
          <img 
            src={logo} 
            alt="ترشی خانگی حکیمی" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Brand name */}
        <h1 
          className="text-foreground text-2xl font-bold text-center drop-shadow-lg"
          style={{ fontFamily: "Kalameh, sans-serif" }}
        >
          ترشی خانگی حکیمی
        </h1>

        {/* Loading bar */}
        <div className="w-48 h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading text */}
        <p 
          className="text-muted-foreground text-sm"
          style={{ fontFamily: "Kalameh, sans-serif" }}
        >
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
