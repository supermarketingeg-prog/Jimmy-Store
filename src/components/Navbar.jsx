import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Phone, Shield, Search, Menu, X, Sparkles, LogOut, Settings } from 'lucide-react';

export const Navbar = ({ onOpenCart, onOpenAdmin, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const { settings, cart, isAdminLoggedIn, adminLogout, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#121216]/95 backdrop-blur-md border-b border-white/10">
      {/* Announcement Bar */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs md:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span className="truncate">{settings.announcementText}</span>
        </div>
      )}

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">👟</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  {settings.storeName}
                </span>
                <span className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">
                  Sneakers & Crocs
                </span>
              </div>
            </a>
          </div>

          {/* Search Box - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن كوتشي، ماركة (Nike, Jordan, Crocs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pr-11 pl-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
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

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* WhatsApp Contact */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('السلام عليكم، كنت حابب أستفسر عن تشكيلة الكوتشيات المتاحة في Jimmy Store')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition-all"
              title="تواصل واتساب"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>

            {/* Admin Toggle Button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 text-xs font-bold transition-all shadow-lg shadow-orange-500/10"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:border-orange-500/40 hover:text-white text-xs font-semibold transition-all"
                title="دخول الإدارة لتعديل الأسعار والمنتجات"
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">دخول الإدارة</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 active:scale-95"
              aria-label="عرض سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121216] animate-bounce">
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 flex flex-col gap-2">
            <div className="text-xs text-gray-400 font-bold px-2 mb-1">الأقسام:</div>
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
                      ? 'bg-orange-500 text-white shadow'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <Phone className="w-4 h-4" />
                <span>تواصل معنا عبر واتساب</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
