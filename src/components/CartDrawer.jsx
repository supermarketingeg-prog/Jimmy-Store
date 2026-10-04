import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowLeft, Phone, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';

const EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية",
  "البحيرة", "الغربية", "المنوفية", "كفر الشيخ", "دمياط", "بورسعيد",
  "الإسماعيلية", "السويس", "بني سويف", "الفيوم", "المنيا", "أسيوط",
  "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "مطروح"
];

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQty, removeFromCart, clearCart, settings, createOrder } = useStore();
  
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: 'القاهرة',
    address: '',
    notes: '',
  });
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeShipping = subtotal >= (settings.freeShippingThreshold || 2000);
  const shippingCost = isFreeShipping ? 0 : (settings.shippingFee || 50);
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('من فضلك أكمل البيانات المطلوبة (الاسم، الموبايل، العنوان)');
      return;
    }

    // Save order in store database
    const order = createOrder(formData);
    setLastCreatedOrder(order);

    // Build formatted WhatsApp message
    const itemsList = cart.map((item, idx) => 
      `${idx + 1}. ${item.name}\n   - المقاس: ${item.selectedSize} | اللون: ${item.selectedColor || 'أساسي'}\n   - الكمية: ${item.quantity} × ${item.price} ج.م = ${item.quantity * item.price} ج.م`
    ).join('\n\n');

    const whatsappMessage = `*🔥 طلب شراء جديد من موقع Jimmy Store*
*رقم الأوردر:* #${order.id}
----------------------------------------
*👤 بيانات العميل:*
- *الاسم:* ${formData.name}
- *رقم الموبايل:* ${formData.phone}
- *المحافظة:* ${formData.governorate}
- *العنوان بالتفصيل:* ${formData.address}
${formData.notes ? `- *ملاحظات إضافية:* ${formData.notes}\n` : ''}----------------------------------------
*👟 تفاصيل المنتجات:*
${itemsList}
----------------------------------------
- *المجموع الفرعي:* ${subtotal} ج.م
- *تكلفة الشحن:* ${isFreeShipping ? 'مجاني 🎉' : `${shippingCost} ج.م`}
- *💰 الإجمالي المطلوب عند الاستلام:* ${total} جنيه مصري
----------------------------------------
برجاء تأكيد تجهيز الأوردر وشحنه. شكراً!`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart and switch to success view
    clearCart();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-right">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#16161a] border-r border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">
                {step === 'cart' ? 'سلة المشتريات' : step === 'checkout' ? 'بيانات الشحن والتوصيل' : 'تم استلام طلبك'}
              </span>
              <ShoppingBag className="w-5 h-5 text-orange-400" />
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Step 1: Cart Items */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl">
                      👟
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">سلتك فارغة حالياً</h3>
                      <p className="text-xs text-gray-400">تصفح تشكيلة الكوتشيات والكروكس وأضف ما يعجبك!</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
                    >
                      تصفح المنتجات الآن
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 relative group"
                      >
                        {/* Thumbnail */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-zinc-900 shrink-0"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.name}
                          </h4>
                          
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <span>المقاس: <strong className="text-orange-400">{item.selectedSize}</strong></span>
                            {item.selectedColor && (
                              <span>اللون: <strong className="text-gray-300">{item.selectedColor}</strong></span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs sm:text-sm font-black text-white">
                              {item.price * item.quantity} ج.م
                            </span>

                            {/* Qty Controls */}
                            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-xs">
                              <button
                                onClick={() => updateCartQty(item.cartItemId, item.quantity - 1)}
                                className="text-gray-400 hover:text-white font-bold w-4 text-center"
                              >
                                -
                              </button>
                              <span className="text-white font-bold min-w-[12px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.cartItemId, item.quantity + 1)}
                                className="text-gray-400 hover:text-white font-bold w-4 text-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-500 hover:text-red-400 p-1.5 transition-colors self-start"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Checkout Form */}
            {step === 'checkout' && (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                
                <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-xs text-orange-400 flex items-center gap-2">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>الدفع عند الاستلام مع إمكانية المعاينة والتجربة قبل الدفع</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      الاسم بالكامل *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="مثال: أحمد محمد"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      رقم الموبايل (واتساب للتأكيد) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="مثال: 01012345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      المحافظة *
                    </label>
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleInputChange}
                      className="w-full bg-[#1e1e24] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      العنوان بالتفصيل (المنطقة، اسم الشارع، رقم العمارة) *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="مثال: التجمع الخامس، شارع التسعين، عمارة 15 الدور الثاني"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="مثال: الاتصال قبل الوصول / الاستلام بعد الساعة 5"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    <span>تأكيد وإرسال الطلب عبر واتساب 🚀</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {step === 'success' && (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">تم إرسال طلبك بنجاح! 🎉</h3>
                  <p className="text-xs text-gray-300">
                    رقم الطلب: <strong className="text-orange-400">#{lastCreatedOrder?.id}</strong>
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed pt-2">
                    تم تجهيز رسالة الواتساب وفتحها لتأكيد المقاس وميعاد وصول الشحنة مع خدمة العملاء.
                  </p>
                </div>

                <div className="pt-6 space-y-2">
                  <button
                    onClick={() => {
                      setStep('cart');
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all"
                  >
                    العودة للتسوق
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Price Summary (when in cart step and cart not empty) */}
          {step === 'cart' && cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#121216] space-y-4">
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>المجموع الفرعي ({cart.reduce((t, i) => t + i.quantity, 0)} منتجات):</span>
                  <span className="font-bold text-white">{subtotal} ج.م</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>مصاريف الشحن:</span>
                  <span className={`font-bold ${isFreeShipping ? 'text-emerald-400' : 'text-white'}`}>
                    {isFreeShipping ? 'شحن مجاني 🎉' : `${shippingCost} ج.م`}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-sm sm:text-base font-black text-white">
                  <span>الإجمالي:</span>
                  <span className="text-orange-400 text-lg font-black">{total} ج.م</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>متابعة إتمام الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>دفع عند الاستلام</span>
                  </span>
                  <span>•</span>
                  <span>معاينة قبل الدفع</span>
                </div>
              </div>

            </div>
          )}

          {step === 'checkout' && (
            <div className="p-4 border-t border-white/10 bg-[#121216]">
              <button
                onClick={() => setStep('cart')}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all"
              >
                الرجوع لتعديل السلة
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
