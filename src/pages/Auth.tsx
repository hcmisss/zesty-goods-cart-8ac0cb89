import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Flower2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { z } from "zod";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate fullName if signing up
      if (!isLogin) {
        const nameSchema = z.string().trim().min(1, "نام الزامی است").max(100, "نام باید کمتر از 100 کاراکتر باشد");
        const result = nameSchema.safeParse(fullName);
        if (!result.success) {
          toast({
            title: "خطای اعتبارسنجی",
            description: result.error.errors[0].message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "خوش آمدید!",
          description: "با موفقیت وارد شدید.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "ثبت نام موفق!",
          description: "حساب کاربری شما ایجاد شد.",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "مشکلی پیش آمده است.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-background/70 backdrop-blur-lg p-8 rounded-2xl border border-border/50 shadow-xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors mb-4"
        >
          <ArrowRight className="h-5 w-5" />
          <span>بازگشت به صفحه اصلی</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Flower2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? "ورود به حساب کاربری" : "ایجاد حساب کاربری"}
          </h1>
          <p className="mt-2 text-base text-foreground/80">
            {isLogin
              ? "برای ادامه وارد حساب کاربری خود شوید"
              : "برای خرید ترشی‌های خوشمزه ما ثبت نام کنید"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName" className="text-foreground pb-2 block text-sm font-medium">
                نام و نام خانوادگی
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                className="h-12 bg-background border-muted"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-foreground pb-2 block text-sm font-medium">
              ایمیل
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ایمیل خود را وارد کنید"
              className="h-12 bg-background border-muted"
            />
          </div>

          <div className="relative">
            <Label htmlFor="password" className="text-foreground pb-2 block text-sm font-medium">
              رمز عبور
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="رمز عبور خود را وارد کنید"
                minLength={6}
                className="h-12 bg-background border-muted pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-3 left-3 text-foreground/60"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-white font-bold hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "لطفا صبر کنید..." : isLogin ? "ورود" : "ثبت نام"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-grow border-muted" />
            <p className="text-sm text-foreground/60">یا</p>
            <hr className="flex-grow border-muted" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-muted text-foreground hover:bg-muted/20"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "حساب کاربری ندارید؟ ثبت نام کنید"
              : "حساب کاربری دارید؟ وارد شوید"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
