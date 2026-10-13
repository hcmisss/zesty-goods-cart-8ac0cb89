UPDATE public.products SET image = '/products/liteh.jpg' WHERE name = 'ترشی لیته';
UPDATE public.products SET image = '/products/sir.jpg' WHERE name = 'ترشی سیر';
UPDATE public.products SET image = '/products/kalam.jpg' WHERE trim(name) = 'ترشی کلم';
UPDATE public.products SET image = '/products/bademjan.jpg' WHERE name = 'ترشی بادمجان';
UPDATE public.products SET
  ingredients = 'خیار تازه، سرکه، آب، نمک، شوید تازه، سیر، فلفل قرمز (اختیاری)',
  health_benefits = 'کم‌کالری و مناسب رژیم، حاوی پروبیوتیک طبیعی در صورت تخمیر، کمک به هضم غذا، سرشار از ویتامین K و آنتی‌اکسیدان',
  food_pairings = 'کنار انواع ساندویچ، همبرگر، فلافل، غذاهای سرخ‌شده، خوراک‌ها و چلوکباب',
  food_groups = 'گروه سبزیجات؛ به‌عنوان چاشنی و مکمل کنار غذاهای پروتئینی و نشاسته‌دار'
WHERE trim(name) = 'خیارشور';