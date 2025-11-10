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
      <SheetContent side="left" className="w-full sm:max-w-lg bg-background/95 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-foreground">سبد خرید شما</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100%-120px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-foreground/70 text-lg">سبد خرید شما خالی است</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pl-2">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 rounded-lg border border-border/30 bg-card/40 backdrop-blur-md shadow-md"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{item.name}</h4>
                      <p className="text-sm text-foreground/60 mb-2">{item.weight}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-border/30 rounded-md bg-background/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-bold text-foreground">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <p className="font-bold text-primary">
                        {(item.price * item.quantity).toLocaleString('fa-IR')}
                      </p>
                      <p className="text-xs text-foreground/60">تومان</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/30 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-foreground">جمع کل:</span>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-primary">
                      {total.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-sm text-foreground/60 mr-2">تومان</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full py-6 text-lg font-bold"
                  onClick={() => setIsOrderDialogOpen(true)}
                >
                  ثبت سفارش
                </Button>
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
