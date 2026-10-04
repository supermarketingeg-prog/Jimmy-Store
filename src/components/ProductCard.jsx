import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Phone, Edit, Check, AlertCircle } from 'lucide-react';

export const ProductCard = ({ product, onQuickView, onEditProduct }) => {
  const { addToCart, settings, isAdminLoggedIn } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '41');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, product.colors?.[0], 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const generateWhatsAppUrl = (e) => {
    e.stopPropagation();
    const msg = `السلام عليكم، عايز أطلب كوتشي:
👟 الموديل: ${product.name}
📏 المقاس: ${selectedSize}
💰 السعر: ${product.price} جنيه مصري
🖼️ رابط الصورة: ${product.image}

متاح الشحن؟`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-[#18181c] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col cursor-pointer"
    >
      {/* Top Badges & Edit Button */}
      <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Side: Badges */}
        <div className="flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black shadow-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
              خصم {discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-1 rounded-full bg-gray-700/90 text-gray-200 text-[11px] font-bold">
              غير متوفر حالياً
            </span>
          )}
        </div>

        {/* Right Side: Admin Quick Edit */}
        {isAdminLoggedIn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="pointer-events-auto p-2 rounded-xl bg-orange-500/80 hover:bg-orange-600 text-white shadow-lg transition-transform hover:scale-110"
            title="تعديل السعر والصورة"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900/60 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181c] via-transparent to-transparent opacity-60" />

        {/* Quick View Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 backdrop-blur-sm"
        >
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>تفاصيل سريعة</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 text-right">
        
        {/* Title & Category */}
        <div>
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
            {product.category === 'crocs' ? 'كروكس' : product.category === 'women' ? 'حريمي' : product.category === 'kids' ? 'أطفالي' : 'رجالي'}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Sizes Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="text-[11px] font-semibold text-gray-400 flex items-center justify-between">
              <span>المقاس المتاح:</span>
              <span className="text-orange-400 font-bold">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`min-w-[28px] h-7 px-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    selectedSize === sz
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-white/5 flex flex-col gap-3">
          
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">
                {product.price}
              </span>
              <span className="text-xs font-bold text-orange-400">ج.م</span>
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 line-through">
                {product.originalPrice} ج.م
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : product.inStock
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>أضف للسلة</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Order */}
            <a
              href={generateWhatsAppUrl({ stopPropagation: () => {} })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>طلب واتساب</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
