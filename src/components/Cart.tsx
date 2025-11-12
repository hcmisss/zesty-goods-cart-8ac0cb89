import { useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Product } from "./ProductCard";
import OrderDialog from "./OrderDialog";

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onOrderSuccess: () => void;
}

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onOrderSuccess }: CartProps) => {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-lg bg-background/70 backdrop-blur-lg border-l border-border/50">
        <SheetHeader className="border-b border-border pb-2">
          <SheetTitle className="text-lg font-bold text-foreground text-center">سبد خرید</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-80px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-foreground/70 text-lg">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pt-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-card/50 backdrop-blur-sm px-4 py-3 justify-between border-b border-border/50 rounded-lg mb-2"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-[70px] object-cover rounded-lg"
                      />
                      <div className="flex flex-1 flex-col justify-center gap-1">
                        <p className="text-foreground text-base font-medium leading-normal">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal">
                          {item.price.toLocaleString('fa-IR')} تومان
                        </p>
                        <p className="text-muted-foreground text-sm font-normal leading-normal">
                          مجموع: {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div className="flex items-center gap-2 text-foreground">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-muted cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-base font-medium leading-normal w-4 p-0 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-muted cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border/50 pt-4">
                <div className="px-4">
                  <div className="flex justify-between gap-x-6 py-2">
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      جمع کل محصولات
                    </p>
                    <p className="text-foreground text-sm font-normal leading-normal text-right">
                      {total.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                  <div className="flex justify-between gap-x-6 py-2">
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      هزینه ارسال
                    </p>
                    <p className="text-foreground text-sm font-normal leading-normal text-right">
                      وابسته به آدرس
                    </p>
                  </div>
                  <div className="flex justify-between gap-x-6 py-2 border-t border-dashed border-border mt-2 pt-2">
                    <p className="text-foreground text-base font-bold leading-normal">مبلغ نهایی</p>
                    <p className="text-foreground text-base font-bold leading-normal text-right">
                      {total.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>

                <div className="flex px-4 py-3 mt-2">
                  <Button
                    className="flex-1 h-12 bg-primary text-white font-bold hover:bg-primary/90"
                    onClick={() => setIsOrderDialogOpen(true)}
                  >
                    ادامه و تسویه حساب
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <OrderDialog
          isOpen={isOrderDialogOpen}
          onClose={() => setIsOrderDialogOpen(false)}
          items={items}
          total={total}
          onOrderSuccess={onOrderSuccess}
        />
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
