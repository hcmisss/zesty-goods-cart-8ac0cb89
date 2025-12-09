import heroImage from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="px-4 py-3">
      <div 
        className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px] relative"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="relative flex flex-col items-center p-6 gap-4 mx-4 mb-4">
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30 shadow-lg">
            <p 
              className="text-white text-4xl font-bold leading-tight tracking-tight text-center drop-shadow-lg"
              style={{ fontFamily: 'Kalameh, sans-serif' }}
            >
              طعم اصیل ترشی خانگی
            </p>
          </div>
          <a href="#products" className="w-full max-w-xs">
            <button className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 shadow-lg">
              <span className="truncate">مشاهده همه محصولات</span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
