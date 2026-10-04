import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Phone, Heart, Shield, Instagram, Facebook, MessageSquare } from 'lucide-react';

export const Footer = ({ onOpenAdmin }) => {
  const { settings } = useStore();

  const ordersNumber = settings.whatsappOrdersNumber || "201119946924";
  const inquiryNumber = settings.whatsappInquiryNumber || "201008418338";

  return (
    <footer className="bg-[#070709] border-t border-white/10 text-right pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 border-b border-white/5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">توصيل سريع لجميع المحافظات</h4>
              <p className="text-xs text-gray-400 mt-0.5">توصيل آمن لباب البيت خلال 48-72 ساعة</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">معاينة وتجربة قبل الدفع</h4>
              <p className="text-xs text-gray-400 mt-0.5">الدفع كاش عند الاستلام بعد التأكد من جودة المنتج</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0">
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
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded-xl bg-black/80 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Jimmy Store Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black text-white">{settings.storeName}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              {settings.tagline}
            </p>
            <p className="text-xs text-lime-400/90 font-medium">
              {settings.shippingText}
            </p>

            {/* Social Accounts */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-pink-600/20 hover:text-pink-400 text-gray-300 border border-white/5 text-xs font-bold transition-all"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>

              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 text-gray-300 border border-white/5 text-xs font-bold transition-all"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* WhatsApp Contacts */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              أرقام التواصل والطلبات
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              {/* Orders Number */}
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-lime-400 font-bold block">📦 واتساب استقبال الأوردرات:</span>
                <a
                  href={`https://wa.me/${ordersNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 font-mono font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span dir="ltr">+20 11 19946924</span>
                </a>
              </div>

              {/* Inquiry Number */}
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-orange-400 font-bold block">💬 واتساب الاستفسارات والتفاصيل:</span>
                <a
                  href={`https://wa.me/${inquiryNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-400 font-mono font-bold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                  <span dir="ltr">+20 10 08418338</span>
                </a>
              </div>
            </div>
          </div>

          {/* Admin link */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              إدارة المتجر
            </h4>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-lime-500/10 hover:border-lime-400/30 text-gray-400 hover:text-lime-400 border border-white/5 text-xs font-bold transition-all w-full justify-center"
            >
              <Shield className="w-4 h-4 text-lime-400" />
              <span>دخول لوحة التحكم (العميل)</span>
            </button>
            <p className="text-[10px] text-gray-500 text-center">
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
            <span>متجر كوتشيات وكروكس هاي كوبي في مصر</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
