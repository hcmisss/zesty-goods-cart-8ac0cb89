import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

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

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "در حال پردازش",
      confirmed: "تایید شده",
      preparing: "در حال آماده‌سازی",
      shipped: "ارسال شده",
      delivered: "تحویل داده شده",
      cancelled: "لغو شده",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
      confirmed: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
      preparing: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
      shipped: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      delivered: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
      cancelled: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
    };
    return colorMap[status] || "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="relative min-h-screen w-full flex-col overflow-x-hidden pb-32">
      <header className="sticky top-0 z-10 flex items-center bg-background/70 backdrop-blur-lg p-4 pb-3 border-b border-border/50">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-foreground text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-8">
          سفارشات من
        </h1>
      </header>

      <main className="flex flex-col gap-4 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-foreground/70 text-lg mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              مشاهده محصولات
            </Button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col items-stretch justify-start rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-card/70 backdrop-blur-lg border border-border/50 p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-foreground text-base font-semibold">
                  سفارش #{order.id.slice(0, 8)}
                </p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">مبلغ کل</p>
                  <p className="text-foreground text-base font-medium">
                    {order.total_price.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">تاریخ ثبت</p>
                  <p className="text-foreground text-sm">
                    {new Date(order.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-foreground text-sm font-semibold mb-2">آدرس تحویل:</p>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {order.customer_address}
                </p>
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t border-border pt-3">
                  <p className="text-foreground text-sm font-semibold mb-2">محصولات:</p>
                  <div className="space-y-2">
                    {order.order_items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-foreground/80">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="text-foreground font-medium">
                          {(item.product_price * item.quantity).toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;