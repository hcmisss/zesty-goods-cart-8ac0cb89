import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ShoppingBag, Package, Search, ArrowRight, Wallet, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Order { id: string; customer_name: string; total_price: number; status: string; created_at: string; }

const fa = (n: number) => n.toLocaleString("fa-IR").replace(/,|٬/g, "٬");
const STATUS: Record<string, string> = {
  pending: "در انتظار تایید", confirmed: "تایید شده", preparing: "در حال آماده‌سازی",
  shipped: "ارسال شده", delivered: "تحویل داده شده", cancelled: "لغو شده",
};
// JS getDay: 0=Sun … 6=Sat → Persian week starts Saturday
const DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const toFaDay = (d: Date) => (d.getDay() + 1) % 7;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/auth");
      setEmail(session.user.email ?? "");
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      if (!role) return navigate("/");
      const [{ data: o }, { count }] = await Promise.all([
        supabase.from("orders").select("id,customer_name,total_price,status,created_at").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ]);
      setOrders(o ?? []);
      setProductCount(count ?? 0);
      setLoading(false);
    })();
  }, [navigate]);

  const stats = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");
    return {
      revenue: valid.reduce((s, o) => s + o.total_price, 0),
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  }, [orders]);

  const weekly = useMemo(() => {
    const sums = Array(7).fill(0);
    const weekAgo = Date.now() - 7 * 864e5;
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      if (d.getTime() >= weekAgo && o.status !== "cancelled") sums[toFaDay(d)] += o.total_price;
    });
    return sums;
  }, [orders]);
  const max = Math.max(...weekly, 1);

  const filtered = orders.filter((o) => o.customer_name.includes(query) || o.id.startsWith(query)).slice(0, 8);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  const cards = [
    { label: "درآمد کل", value: `${fa(stats.revenue)} تومان`, icon: Wallet },
    { label: "کل سفارش‌ها", value: fa(stats.total), icon: ShoppingBag },
    { label: "در انتظار تایید", value: fa(stats.pending), icon: Clock },
    { label: "تحویل شده", value: fa(stats.delivered), icon: CheckCircle2 },
  ];

  const nav = [
    { group: "اصلی", items: [{ label: "داشبورد", icon: LayoutDashboard, to: "/admin/dashboard", badge: 0 }] },
    { group: "فروشگاه", items: [
      { label: "سفارش‌ها", icon: ShoppingBag, to: "/admin/orders", badge: stats.pending },
      { label: "محصولات", icon: Package, to: "/admin", badge: productCount },
    ] },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col gap-6 border-e border-border/30 bg-background/40 backdrop-blur-md p-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowRight className="h-4 w-4" /> بازگشت به فروشگاه
        </button>
        <nav aria-label="منوی مدیریت" className="flex flex-col gap-5">
          {nav.map((g) => (
            <div key={g.group}>
              <p className="text-xs text-muted-foreground mb-2">{g.group}</p>
              {g.items.map((it) => (
                <button key={it.to} onClick={() => navigate(it.to)} aria-current={it.to === "/admin/dashboard" ? "page" : undefined}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-primary/15 aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <it.icon className="h-4 w-4" />
                  <span className="flex-1 text-start">{it.label}</span>
                  {it.badge > 0 && <span className="rounded-full bg-primary/20 px-2 text-xs">{fa(it.badge)}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/30 bg-background/60 backdrop-blur-lg px-4 py-3">
          <button onClick={() => navigate("/")} className="md:hidden rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="بازگشت">
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی سفارش یا مشتری…" aria-label="جستجو"
              className="ios-input w-full rounded-lg border border-border/40 bg-background/50 ps-9 pe-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground">{email.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
        </header>

        <main className="p-4 space-y-4">
          <h1 className="text-2xl font-extrabold text-foreground">داشبورد فروشگاه</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-border/30 bg-background/50 backdrop-blur-md p-4">
                <div className="flex items-center justify-between text-muted-foreground text-sm">{c.label}<c.icon className="h-4 w-4 text-primary" /></div>
                <p className="mt-2 text-lg font-extrabold text-foreground">{c.value}</p>
              </div>
            ))}
          </div>

          <section aria-label="فروش هفتگی" className="rounded-xl border border-border/30 bg-background/50 backdrop-blur-md p-4">
            <h2 className="font-bold text-foreground mb-4">فروش ۷ روز اخیر</h2>
            <div className="flex items-end gap-3 h-40">
              {weekly.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div role="img" aria-label={`${DAYS[i]}: ${fa(v)} تومان`} className="w-full rounded-t-md bg-primary transition-all duration-300 motion-reduce:transition-none" style={{ height: `${Math.max((v / max) * 100, 3)}%` }} />
                  <span className="text-xs text-muted-foreground">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border/30 bg-background/50 backdrop-blur-md p-4 overflow-x-auto">
            <h2 className="font-bold text-foreground mb-3">سفارش‌های اخیر</h2>
            {filtered.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">سفارشی یافت نشد.</p> : (
              <table className="w-full text-sm">
                <thead><tr className="text-muted-foreground text-start border-b border-border/30">
                  <th className="py-2 text-start font-normal">شماره</th><th className="text-start font-normal">مشتری</th>
                  <th className="text-start font-normal">مبلغ</th><th className="text-start font-normal">وضعیت</th>
                </tr></thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-border/20 last:border-0 text-foreground">
                      <td className="py-2">#{o.id.slice(0, 6)}</td>
                      <td>{o.customer_name}</td>
                      <td className="whitespace-nowrap">{fa(o.total_price)} تومان</td>
                      <td><span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs whitespace-nowrap">{STATUS[o.status] ?? o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
