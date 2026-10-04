import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const HeroBanner = ({ onShopNow }) => {
  const { banner, settings } = useStore();

  return (
    <div className="relative overflow-hidden pt-4 pb-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-[#18181c] to-zinc-900 shadow-2xl">
          
          {/* Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-6 sm:p-10 lg:p-14">
            
            {/* Text Side */}
            <div className="lg:col-span-7 flex flex-col items-start text-right space-y-4 md:space-y-6">
              
              {/* Badge */}
              {banner.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>{banner.badge}</span>
                </div>
              )}

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {banner.title}
              </h1>

              {/* Subtitle */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                {banner.subtitle}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 w-full text-xs text-gray-300">
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>معاينة قبل الاستلام</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                  <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>شحن لكل المحافظات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                  <RotateCcw className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>استبدال مقاس فوري</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 w-full sm:w-auto">
                <button
                  onClick={onShopNow}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>{banner.ctaText || "تصفح المنتجات الآن"}</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <span>استفسار واتساب</span>
                </a>
              </div>

            </div>

            {/* Image Side */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115]/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Tag */}
                <div className="absolute bottom-4 right-4 left-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-white">الكميات محدودة 🔥</span>
                  </div>
                  <span className="text-orange-400 font-bold">تسوق بأمان</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
