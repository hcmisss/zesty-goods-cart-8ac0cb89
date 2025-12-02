import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, LogOut } from "lucide-react";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
}
const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    weight: "",
    image: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    checkAdminAccess();
    fetchProducts();
  }, []);
  const checkAdminAccess = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    const {
      data,
      error
    } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").single();
    if (error || !data) {
      toast({
        title: "دسترسی محدود",
        description: "شما دسترسی به پنل مدیریت ندارید.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
    setIsAdmin(true);
  };
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("products").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "بارگذاری محصولات با مشکل مواجه شد.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const {
          error
        } = await supabase.from("products").update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          weight: formData.weight,
          image: formData.image
        }).eq("id", formData.id);
        if (error) throw error;
        toast({
          title: "موفق",
          description: "محصول با موفقیت ویرایش شد."
        });
      } else {
        const {
          error
        } = await supabase.from("products").insert([{
          name: formData.name,
          description: formData.description,
          price: formData.price,
          weight: formData.weight,
          image: formData.image
        }]);
        if (error) throw error;
        toast({
          title: "موفق",
          description: "محصول با موفقیت اضافه شد."
        });
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "عملیات با مشکل مواجه شد.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    try {
      const {
        error
      } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast({
        title: "موفق",
        description: "محصول با موفقیت حذف شد."
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "حذف محصول با مشکل مواجه شد.",
        variant: "destructive"
      });
    }
  };
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: 0,
      weight: "",
      image: ""
    });
    setIsEditing(false);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>;
  }
  return <div className="min-h-screen animated-background p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-secondary-foreground">پنل مدیریت</h1>
          <Button onClick={handleLogout} variant="outline" className="bg-card/30 backdrop-blur-md border-border/30 hover:bg-card/40">
            <LogOut className="ml-2 h-4 w-4" />
            خروج
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form Section */}
          <Card className="animate-fade-in bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-foreground">{isEditing ? "ویرایش محصول" : "افزودن محصول جدید"}</CardTitle>
              <CardDescription className="text-foreground/70">
                اطلاعات محصول را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">نام محصول</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} required className="bg-background/50 border-border/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">توضیحات</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({
                  ...formData,
                  description: e.target.value
                })} required className="bg-background/50 border-border/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-foreground">قیمت (تومان)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={e => setFormData({
                  ...formData,
                  price: parseInt(e.target.value)
                })} required className="bg-background/50 border-border/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-foreground">وزن</Label>
                  <Input id="weight" value={formData.weight} onChange={e => setFormData({
                  ...formData,
                  weight: e.target.value
                })} placeholder="مثال: 500 گرم" required className="bg-background/50 border-border/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-foreground">آدرس تصویر</Label>
                  <Input id="image" value={formData.image} onChange={e => setFormData({
                  ...formData,
                  image: e.target.value
                })} placeholder="URL تصویر" required className="bg-background/50 border-border/50" />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <>
                        <Edit className="ml-2 h-4 w-4" />
                        ویرایش
                      </> : <>
                        <Plus className="ml-2 h-4 w-4" />
                        افزودن
                      </>}
                  </Button>
                  {isEditing && <Button type="button" variant="outline" onClick={resetForm} className="bg-background/50">
                      انصراف
                    </Button>}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="space-y-4">
            <h2 className="text-2xl text-primary-foreground font-extrabold">محصولات</h2>
            {loading ? <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : products.length === 0 ? <Card className="bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
                <CardContent className="p-8 text-center text-foreground/70">
                  هنوز محصولی اضافه نشده است.
                </CardContent>
              </Card> : <div className="space-y-4">
                {products.map(product => <Card key={product.id} className="animate-slide-up bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-lg text-foreground font-extrabold">{product.name}</h3>
                          <p className="text-foreground/70 line-clamp-2 text-lg font-semibold">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="font-bold text-secondary-foreground">
                              {product.price.toLocaleString()} تومان
                            </span>
                            <span className="text-sm text-foreground/70">
                              {product.weight}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="bg-background/50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Admin;