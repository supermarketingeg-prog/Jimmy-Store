import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Phone, Check, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export const ProductModal = ({ product, onClose, onEditProduct }) => {
  const { addToCart, settings, isAdminLoggedIn } = useStore();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '41');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1200);
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `السلام عليكم، حابب أطلب أوردر من Jimmy Store:
👟 الموديل: ${product.name}
📏 المقاس: ${selectedSize}
🎨 اللون: ${selectedColor || 'اللون الأساسي'}
🔢 الكمية: ${quantity}
💰 إجمالي السعر: ${product.price * quantity} جنيه
🖼️ صورة المنتج: ${product.image}

عنوان التوصيل: (برجاء كتابة العنوان والمحافظة)`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#18181c] rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-8 text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white flex items-center justify-center border border-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Column */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80";
              }}
            />
            {product.badge && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-black shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & Title */}
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  {product.category === 'crocs' ? 'كروكس' : product.category === 'women' ? 'حريمي' : product.category === 'kids' ? 'أطفالي' : 'كوتشيات رجالي'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {product.name}
                </h2>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">{product.price}</span>
                  <span className="text-sm font-bold text-orange-400">ج.م</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice} ج.م</span>
                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-bold">
                      وفر {product.originalPrice - product.price} ج.م
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                {product.description}
              </p>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">اختر المقاس:</span>
                    <span className="text-orange-400 font-bold">المقاس المحدد: {selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] h-10 px-3 text-xs font-bold rounded-xl transition-all ${
                          selectedSize === size
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {product.colors && product.colors.length > 1 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white">اختر اللون:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          selectedColor === color
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-white">الكمية:</span>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white text-base font-bold w-6 h-6 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-400 hover:text-white text-base font-bold w-6 h-6 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : product.inStock
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>تمت الإضافة للسلة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف إلى السلة</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Order */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>طلب مباشر واتساب</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 px-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>معاينة قبل الدفع</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-orange-400" />
                  <span>توصيل سريع</span>
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                  <span>استبدال المقاس متاح</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
