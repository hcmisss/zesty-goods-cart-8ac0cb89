import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative h-[500px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${heroBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />
      </div>
      
      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-primary leading-tight">
            ترشیجات سنتی
            <span className="block text-3xl md:text-4xl text-foreground mt-2">
              با طعم اصیل خانگی
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            تهیه شده از بهترین مواد اولیه با رعایت اصول بهداشتی
            <br />
            ترشی لیته، خیارشور، مخلوط و انواع ترشیجات سنتی
          </p>
          <a href="#products">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1">
              مشاهده محصولات
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
