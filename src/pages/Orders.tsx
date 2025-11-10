import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  product_weight: string;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData) {
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: items } = await supabase
              .from("order_items")
              .select("*")
              .eq("order_id", order.id);

            return {
              ...order,
              order_items: items || [],
            };
          })
        );

        setOrders(ordersWithItems);
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      pending: { label: "در انتظار تایید", variant: "secondary" },
      confirmed: { label: "تایید شده", variant: "default" },
      preparing: { label: "در حال آماده‌سازی", variant: "outline" },
      shipped: { label: "ارسال شده", variant: "default" },
      delivered: { label: "تحویل داده شده", variant: "default" },
      cancelled: { label: "لغو شده", variant: "destructive" },
    };

    return statusMap[status] || { label: status, variant: "outline" };
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-background pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="bg-card/30 backdrop-blur-md border-border/30 hover:bg-card/40">
              <ArrowRight className="h-5 w-5 ml-2" />
              بازگشت به فروشگاه
            </Button>
            <h1 className="text-3xl font-bold text-foreground">سفارش‌های من</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-foreground/70 mb-4">
              شما هنوز سفارشی ثبت نکرده‌اید
            </p>
            <Button onClick={() => navigate("/")}>
              شروع خرید
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              return (
                <Card key={order.id} className="bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 text-foreground">
                          سفارش #{order.id.slice(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-foreground/60">
                          {new Date(order.created_at).toLocaleDateString("fa-IR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-background/30 rounded-lg border border-border/20">
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">نام</p>
                          <p className="font-medium text-foreground">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">تلفن</p>
                          <p className="font-medium text-foreground">{order.customer_phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">آدرس</p>
                          <p className="font-medium text-foreground">{order.customer_address}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 text-foreground">اقلام سفارش:</h3>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border/20"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.product_name}</p>
                                <p className="text-sm text-foreground/60">
                                  وزن: {item.product_weight}
                                </p>
                              </div>
                              <div className="text-left">
                                <p className="text-sm text-foreground/60">
                                  تعداد: {item.quantity}
                                </p>
                                <p className="font-medium text-foreground">
                                  {(item.product_price * item.quantity).toLocaleString("fa-IR")} تومان
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <div className="p-3 bg-background/30 rounded-lg border border-border/20">
                          <p className="text-sm text-foreground/60 mb-1">یادداشت:</p>
                          <p className="text-foreground">{order.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-border/20">
                        <span className="text-lg font-semibold text-foreground">مجموع:</span>
                        <span className="text-2xl font-bold text-primary">
                          {order.total_price.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;