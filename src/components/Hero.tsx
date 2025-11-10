import heroImage from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="px-4 py-3">
      <div 
        className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px]"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url(${heroImage})`
        }}
      >
        <div className="flex flex-col p-6 gap-4">
          <p className="text-white text-[32px] font-bold leading-tight tracking-tight">
            طعم اصیل ترشی خانگی
          </p>
          <a href="#products">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all">
              <span className="truncate">مشاهده همه محصولات</span>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
