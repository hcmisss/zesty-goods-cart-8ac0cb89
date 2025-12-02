import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Package, LogOut, Edit, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkUser();
  }, []);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    await fetchProfile(session.user.id);
    await checkAdminRole(session.user.id);
    setLoading(false);
  };
  const checkAdminRole = async (userId: string) => {
    const {
      data
    } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").single();
    setIsAdmin(!!data);
  };
  const fetchProfile = async (userId: string) => {
    const {
      data,
      error
    } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (!error && data) {
      setProfile(data);
      setFullName(data.full_name || "");
    }
  };
  const handleUpdateProfile = async () => {
    if (!user) return;
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: fullName
    }).eq("id", user.id);
    if (error) {
      toast({
        title: "خطا",
        description: "به‌روزرسانی پروفایل با مشکل مواجه شد.",
        variant: "destructive"
      });
    } else {
      setProfile({
        ...profile,
        full_name: fullName
      });
      setIsEditing(false);
      toast({
        title: "موفق",
        description: "پروفایل با موفقیت به‌روزرسانی شد."
      });
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="relative flex min-h-screen w-full flex-col animated-background overflow-x-hidden pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background/70 backdrop-blur-lg px-3 py-2 border-b border-border/50">
        <button onClick={() => navigate("/")} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg text-foreground font-extrabold">
          حساب کاربری
        </h1>
        <div className="w-12"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Profile Card */}
        <div className="bg-card/40 backdrop-blur-md border border-border/30 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              {isEditing ? <div className="space-y-2">
                  <Label htmlFor="fullName">نام کامل</Label>
                  <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="نام کامل خود را وارد کنید" />
                </div> : <>
                  <h2 className="font-extrabold text-popover-foreground text-2xl">
                    {profile?.full_name || "کاربر"}
                  </h2>
                  <p className="text-primary-foreground text-lg">{user?.email}</p>
                </>}
            </div>
            <button onClick={() => {
            if (isEditing) {
              handleUpdateProfile();
            } else {
              setIsEditing(true);
            }
          }} className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Edit className="h-5 w-5" />
            </button>
          </div>
          
          {isEditing && <div className="flex gap-2">
              <Button onClick={handleUpdateProfile} className="flex-1">
                ذخیره
              </Button>
              <Button onClick={() => {
            setIsEditing(false);
            setFullName(profile?.full_name || "");
          }} variant="outline" className="flex-1">
                انصراف
              </Button>
            </div>}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {isAdmin && <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-4 p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30 hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02]">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 text-right">
                <p className="font-extrabold text-sidebar-border text-xl">پنل مدیریت</p>
                <p className="text-sm font-bold text-secondary-foreground">مدیریت محصولات و سفارشات</p>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
            </button>}
          
          <button onClick={() => navigate("/orders")} className="w-full flex items-center gap-4 p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30 hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-foreground font-extrabold text-xl">سفارشات من</p>
              <p className="text-sm font-bold text-destructive-foreground">مشاهده تاریخچه سفارشات</p>
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
          </button>

          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30 hover:bg-destructive/10 transition-all duration-300 hover:scale-[1.02]">
            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-card-foreground font-extrabold text-xl">خروج از حساب</p>
              <p className="text-sm font-bold text-muted">خروج از حساب کاربری</p>
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
          </button>
        </div>
      </main>
    </div>;
};
export default Account;