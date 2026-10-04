import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Phone, Heart, Shield } from 'lucide-react';

export const Footer = ({ onOpenAdmin }) => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-[#0b0b0e] border-t border-white/10 text-right pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-white/5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">توصيل سريع لجميع المحافظات</h4>
              <p className="text-xs text-gray-400 mt-0.5">توصيل آمن لباب البيت خلال 48-72 ساعة</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">معاينة وتجربة قبل الدفع</h4>
              <p className="text-xs text-gray-400 mt-0.5">الدفع كاش عند الاستلام بعد التأكد من جودة المنتج</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">استبدال المقاس متاح</h4>
              <p className="text-xs text-gray-400 mt-0.5">إمكانية تغيير المقاس بسهولة وبدون أي تعقيدات</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                👟
              </div>
              <span className="text-xl font-black text-white">{settings.storeName}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-xs text-orange-400/90 font-medium">
              {settings.shippingText}
            </p>
          </div>

          {/* Quick Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              خدمة العملاء والطلبات
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span dir="ltr">+{settings.whatsappNumber}</span>
              </a>
              <p className="text-gray-400 text-[11px] pt-1">
                متاحين يومياً للرد على استفساراتكم ومتابعة شحناتكم.
              </p>
            </div>
          </div>

          {/* Admin link */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              إدارة المتجر
            </h4>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 text-gray-400 hover:text-orange-400 border border-white/5 text-xs font-bold transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>دخول لوحة التحكم (العميل)</span>
            </button>
            <p className="text-[10px] text-gray-500">
              خاص بإدارة المتجر لتعديل الأسعار والمنتجات والصور
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.storeName}
          </div>
          <div className="flex items-center gap-1">
            <span>تم التصميم والتطوير بكل</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
