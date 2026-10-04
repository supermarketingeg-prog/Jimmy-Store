import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Phone, Shield, Search, Menu, X, Sparkles, LogOut, Settings, Instagram, Facebook } from 'lucide-react';

export const Navbar = ({ onOpenCart, onOpenAdmin, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const { settings, cart, isAdminLoggedIn, adminLogout, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const inquiryNumber = settings.whatsappInquiryNumber || "201008418338";
  const ordersNumber = settings.whatsappOrdersNumber || "201119946924";

  return (
    <header className="sticky top-0 z-40 bg-[#0e0e12]/95 backdrop-blur-md border-b border-white/10">
      {/* Announcement Bar */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-lime-500 via-emerald-600 to-lime-600 text-black text-xs md:text-sm py-1.5 px-4 text-center font-black flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          <Sparkles className="w-4 h-4 animate-pulse shrink-0 text-black" />
          <span className="truncate">{settings.announcementText}</span>
        </div>
      )}

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 sm:gap-4">
          
          {/* Logo with uploaded 3D icon */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="h-10 sm:h-12 w-14 sm:w-16 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-lime-400/40 transition-all shadow-lg">
                <img
                  src="/logo.png"
                  alt="Jimmy Store Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-lime-400 transition-colors">
                  {settings.storeName}
                </span>
                <span className="text-[10px] text-lime-400 font-bold tracking-wider uppercase">
                  Sneakers & Crocs
                </span>
              </div>
            </a>
          </div>

          {/* Search Box - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن كوتشي، ماركة (Nike, Jordan, Crocs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pr-11 pl-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-white/10 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Social Links & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Social Icons (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-pink-600/20 hover:text-pink-400 text-gray-400 border border-white/5 transition-all"
                title="إنستجرام Jimmy Store"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 text-gray-400 border border-white/5 transition-all"
                title="فيسبوك Jimmy Store"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp Inquiry Button (رقم التفاصيل) */}
            <a
              href={`https://wa.me/${inquiryNumber}?text=${encodeURIComponent('السلام عليكم، حابب أستفسر عن تفاصيل وموديلات Jimmy Store 👟')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold transition-all"
              title="واتس الاستفسار والتفاصيل: 01008418338"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>استفسارات</span>
            </a>

            {/* Admin Toggle */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/40 hover:bg-lime-500/30 text-xs font-bold transition-all shadow-lg shadow-lime-500/10"
                  title="لوحة تحكم المتجر"
                >
                  <Settings className="w-4 h-4 animate-spin-slow" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </button>
                <button
                  onClick={adminLogout}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 text-xs transition-all"
                  title="تسجيل خروج الأدمن"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:border-lime-400/40 hover:text-white text-xs font-semibold transition-all"
                title="دخول الإدارة لتعديل الأسعار والمنتجات"
              >
                <Shield className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">دخول الإدارة</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-black hover:from-lime-400 hover:to-emerald-400 transition-all shadow-lg shadow-lime-500/20 active:scale-95"
              aria-label="عرض سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121216] animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث عن كوتشي أو كروكس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-lime-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 flex flex-col gap-2.5">
            <div className="text-xs text-gray-400 font-bold px-1">الأقسام:</div>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs rounded-lg text-center font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-lime-500 text-black font-black shadow'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Social & Contact links on mobile */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/${inquiryNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>واتساب الاستفسارات والتفاصيل (01008418338)</span>
              </a>

              <div className="flex gap-2">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-pink-400 border border-white/5 text-xs font-bold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-blue-400 border border-white/5 text-xs font-bold"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
