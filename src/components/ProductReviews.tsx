import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
}
interface ProductReviewsProps {
  productId: string;
}
const ProductReviews = ({
  productId
}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    checkUser();
    fetchReviews();
  }, [productId]);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };
  const fetchReviews = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("reviews").select(`
          *,
          profiles (
            full_name
          )
        `).eq("product_id", productId).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: "بارگذاری نظرات با مشکل مواجه شد.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "خطا",
        description: "برای ثبت نظر باید وارد شوید.",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("reviews").insert([{
        product_id: productId,
        user_id: user.id,
        rating,
        comment
      }]);
      if (error) throw error;
      toast({
        title: "موفق",
        description: "نظر شما با موفقیت ثبت شد."
      });
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "ثبت نظر با مشکل مواجه شد.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  const renderStars = (count: number, interactive: boolean = false) => {
    return <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-5 w-5 ${star <= count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`} onClick={() => interactive && setRating(star)} />)}
      </div>;
  };
  return <div className="space-y-6">
      <Card className="animate-fade-in bg-card/40 backdrop-blur-md border-border/30 shadow-xl">
        <CardHeader>
          <CardTitle className="text-foreground font-extrabold">نظرات مشتریان</CardTitle>
        </CardHeader>
        <CardContent>
          {user && <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-background/30 backdrop-blur-sm border border-border/20 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">امتیاز شما:</label>
                {renderStars(rating, true)}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">نظر شما:</label>
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="نظر خود را بنویسید..." required className="min-h-[100px] bg-background/50 backdrop-blur-sm border-border/30" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "ثبت نظر"}
              </Button>
            </form>}

          {loading ? <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div> : reviews.length === 0 ? <p className="text-center text-foreground/70 p-8">
              هنوز نظری ثبت نشده است.
            </p> : <div className="space-y-4">
              {reviews.map(review => <div key={review.id} className="p-4 bg-background/30 backdrop-blur-sm border border-border/20 rounded-lg space-y-2 animate-slide-up shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-extrabold">
                      {review.profiles?.full_name || "کاربر"}
                    </span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-foreground/80 font-bold">{review.comment}</p>
                  <p className="text-xs text-foreground/60">
                    {new Date(review.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>)}
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default ProductReviews;