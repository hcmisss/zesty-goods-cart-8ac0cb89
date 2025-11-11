import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "fruit-pickles",
    name: "ترشی میوه",
    description: "شیرین و هیجان‌انگیز",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsVWnymQp6aMCBDASf9xrrlyghpiFCNKYww_LEGMW7cDUOdNEp0D12GJVpukik6PcaSsGLgnZI1CkrzjTRbMpjzaS0SpbSYCIxXYovy2EeV4NwvFuxezhLsFcRUvmUme57FmKPUomEick1hhsdWexEaXGHtg0GHxLM2sdTPsM0rhLr8Vowlunak2yodSLhCVaaxOhV_P-w9mpXLN9GbnF5SL83AkfqycM8EGnmbGLOgLm_b29TjOjWcwTXsI--uZfMo2xK_fglpd6j"
  },
  {
    id: "vegetable-pickles",
    name: "ترشی سبزیجات",
    description: "طعم اصیل خانگی",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIAr1GlT_vUoPqS_-EKLhXXcEsrrvC0NANIekyfFuO_mjABnffHrkgA-qVgDWzmmfbhztaWqJaUGVe3RVEgn3OvjxQ3CllkOoPjcsOHIltCGRL8C6_pwwu0n8h9sR0f5E6Sf9weMMsEe8SZ6JRjSdQY8cNE7Xw4rgsvGaLRApcFSJKtzkaGr51iivhZBSgLAIHDVVO73IYoG8n3iwXoRgLn179XcN_NrIIePfE81_jWGtjhMJlNWwAsvUwCZoObuDkcqaauo4QBDbf"
  },
  {
    id: "mixed-pickles",
    name: "ترشی مخلوط",
    description: "ترکیبی از بهترین‌ها",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT3UjmMGDDyBGUkXKjRw6ZUjNNLkxvTa6k3FK3jla3KMjZE4txWrXpgzvVwIH8glZsveEQL4UsNRXEBDVvXR7Ne0u2jl2DZsOBkugyKe6vlTLnnsot8TxoCokNp3YHBQUJzvL6Dl0Cj0kLoXeN3j0B4TWzfanb_VjQozrVPUXS6Poo5DEDNVj85Llp20tnJl7C5v9catjkABIPgeqwi1i3jbeOVdi2z-yNiavDqSbCCjw1Iz5YfdNQn2mC-S-27dXjZuhkL8ysByZv"
  },
  {
    id: "brined",
    name: "شور",
    description: "یادآور خاطرات",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH8GWnF1SpUYP3Pspe36yWm1rk3bJeet5_byAZkmxhXJgLIwXAUdLUKA-kUS1HXDYF7SrsBLWyc52nSVMxHJYZNV_5ojo8KV66BHKcOrSTkISRNWSTPjqRXisfpiTtSd1mLgPzbt6sc8wkWenXIateDQsxUSY_DNABt_JFdRAmXdW7cqIhUfA1gf1MX85luEkPjBCXkzoDo-Q5YG5CGpp9YvpIV1HtlEkJRmczKbHPMBu54LKEgaubh-bH_3pkGwSuxfvxJsPSrSDn"
  },
  {
    id: "olives",
    name: "زیتون",
    description: "پرورده و ساده",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBQ_eUPMxdUYXf2f-kwRtXYVjSEI11y_vuFByB-PoX34Gc3Lybs9juZSJ7WWPRnQ1BnpoZ1gYRfM9zcEo0r0WuI8jDPDDT0rQyBXZpLnyQC1VYPTVHxuq_nPvWp83mCmSlEkovTImy2Umw8Mv899pXZHLwFZE9EhRQVrflrT1nVrXI8J2YFMslSjTMLJ8qyMCkfb3HE71-IvDeMHFyaihJYyz6-NdF48XN2m4LQF8HbK4itn5vaoiXtlmpOMP6EV9r7RzPXopI9onT"
  },
  {
    id: "paste",
    name: "رب و چاشنی",
    description: "عطر و طعم غذا",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl-xF6HUrCbuaK1ST_K98pih3AI1AmVsMoeuZlaT1LcuiiggHM0oyAqKrWp7Kg19VLQanmgxln3-CLDxrSnmeLUsyZMbylWAWFIbHR4xbz90phac92DTH9HTrITAQ5I38NuAWOOz1Q5Lus5A5ZMTnFDHz5K2jbjxzX8-U9CYFDnjY7xqg82TkDW2FLthv9nvDdfF0hP6FMifiXYQby_KtBVgWhuFq8le0HeAYfR_NASKvjrzHDFH45pftiPk_RzGhjUgSG2z8ZrSq-"
  }
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-sm p-4 pb-3">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center p-2 text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground">
          دسته‌بندی‌ها
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-end">
          <button
            onClick={() => navigate("/search")}
            className="flex items-center justify-center p-2 text-foreground"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main Content: Image Grid */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex flex-col gap-3 rounded-xl cursor-pointer active:opacity-80"
              onClick={() => navigate("/")}
            >
              <div className="w-full overflow-hidden rounded-xl bg-muted">
                <img
                  className="h-auto w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-base font-medium text-foreground">
                  {category.name}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-10 flex h-16 border-t border-border bg-background">
        <button
          onClick={() => navigate("/")}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground"
        >
          <span className="text-2xl">🏠</span>
          <p className="text-xs font-medium">خانه</p>
        </button>
        <button
          onClick={() => navigate("/categories")}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-primary"
        >
          <span className="text-2xl">🏷️</span>
          <p className="text-xs font-bold">دسته‌بندی</p>
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground"
        >
          <span className="text-2xl">❤️</span>
          <p className="text-xs font-medium">علاقه‌ها</p>
        </button>
        <button
          onClick={() => navigate("/account")}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground"
        >
          <span className="text-2xl">👤</span>
          <p className="text-xs font-medium">پروفایل</p>
        </button>
      </nav>
    </div>
  );
};

export default Categories;
