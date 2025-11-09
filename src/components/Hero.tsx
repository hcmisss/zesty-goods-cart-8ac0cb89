const Hero = () => {
  return (
    <section id="home" className="relative h-[500px] overflow-hidden">
      {/* Hero content without separate background - uses global background */}
      
      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight drop-shadow-2xl">
            ترشیجات سنتی
            <span className="block text-3xl md:text-4xl text-white/95 mt-2">
              با طعم اصیل خانگی
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg font-medium">
            تهیه شده از بهترین مواد اولیه با رعایت اصول بهداشتی
            <br />
            ترشی لیته، خیارشور، مخلوط و انواع ترشیجات سنتی
          </p>
          <a href="#products">
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
              مشاهده محصولات
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
