import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CartItem } from "./Cart";

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderSuccess: () => void;
}

const OrderDialog = ({ isOpen, onClose, items, total, onOrderSuccess }: OrderDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "خطا",
        description: "لطفا تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "خطا",
          description: "لطفا ابتدا وارد حساب کاربری خود شوید",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total_price: total,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_weight: item.weight,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "موفق",
        description: "سفارش شما با موفقیت ثبت شد",
      });

      setFormData({ name: "", phone: "", address: "", notes: "" });
      onOrderSuccess();
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">تکمیل اطلاعات سفارش</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">نام و نام خانوادگی *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="نام خود را وارد کنید"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">شماره تماس *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09123456789"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">آدرس *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="آدرس کامل خود را وارد کنید"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">یادداشت (اختیاری)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="توضیحات اضافی..."
              rows={2}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">مبلغ قابل پرداخت:</span>
              <span className="text-xl font-bold text-primary">
                {total.toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              پرداخت در محل (درب منزل)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              "ثبت نهایی سفارش"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;