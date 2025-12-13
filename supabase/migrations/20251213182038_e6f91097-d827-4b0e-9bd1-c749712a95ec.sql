-- Add detailed information columns to products table
ALTER TABLE public.products 
ADD COLUMN ingredients text,
ADD COLUMN health_benefits text,
ADD COLUMN food_pairings text,
ADD COLUMN food_groups text;

-- Add comments for clarity
COMMENT ON COLUMN public.products.ingredients IS 'ترکیبات و مواد تشکیل‌دهنده محصول';
COMMENT ON COLUMN public.products.health_benefits IS 'خواص و فواید سلامتی محصول';
COMMENT ON COLUMN public.products.food_pairings IS 'زمانبندی و نحوه استفاده با انواع غذاها';
COMMENT ON COLUMN public.products.food_groups IS 'گروه‌های غذایی که این محصول مکمل آنهاست';