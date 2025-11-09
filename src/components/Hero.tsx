import picklesBackground from "@/assets/pickles-background.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative h-[500px] overflow-hidden">
      {/* Background with frosted glass effect */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${picklesBackground})` }}
        />
        <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
      </div>
      
      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
            ترشیجات سنتی
            <span className="block text-3xl md:text-4xl text-white/90 mt-2">
              با طعم اصیل خانگی
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed drop-shadow-md">
            تهیه شده از بهترین مواد اولیه با رعایت اصول بهداشتی
            <br />
            ترشی لیته، خیارشور، مخلوط و انواع ترشیجات سنتی
          </p>
          <a href="#products">
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1">
              مشاهده محصولات
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
