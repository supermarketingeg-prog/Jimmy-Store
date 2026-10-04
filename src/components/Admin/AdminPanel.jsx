import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X, Plus, Edit, Trash2, Save, Image, Tag, DollarSign, Package,
  Sliders, Bell, Settings, Lock, Eye, Check, AlertCircle, Download,
  Upload, RefreshCw, Layers, Phone, ShieldCheck, ShoppingCart
} from 'lucide-react';

export const AdminPanel = ({ isOpen, onClose, initialEditingProduct = null }) => {
  const {
    products,
    banner,
    settings,
    orders,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    updateBanner,
    updateSettings,
    exportBackupJSON,
    importBackupJSON,
    resetToDefault
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'banner' | 'settings' | 'orders'
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Product Form State (for adding/editing)
  const [isProductModalOpen, setIsProductModalOpen] = useState(!!initialEditingProduct);
  const [editingId, setEditingId] = useState(initialEditingProduct?.id || null);
  const [productForm, setProductForm] = useState(initialEditingProduct || {
    name: '',
    category: 'men',
    price: '',
    originalPrice: '',
    badge: 'وصل حديثاً ✨',
    image: '',
    description: '',
    sizes: '40, 41, 42, 43, 44, 45',
    colors: 'أسود, أبيض',
    inStock: true
  });

  // Banner Form State
  const [bannerForm, setBannerForm] = useState(banner);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(settings);

  // Success Notification state
  const [saveSuccess, setSaveSuccess] = useState('');

  if (!isOpen) return null;

  const triggerSuccess = (msg) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const res = adminLogin(passwordInput);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginError('');
      setPasswordInput('');
    }
  };

  // Handle open add product
  const handleOpenAdd = () => {
    setEditingId(null);
    setProductForm({
      name: '',
      category: 'men',
      price: '',
      originalPrice: '',
      badge: 'جديد 🔥',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      description: '',
      sizes: '40, 41, 42, 43, 44, 45',
      colors: 'أسود, أبيض',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  // Handle open edit product
  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setProductForm({
      ...p,
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes,
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors,
    });
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('من فضلك ادخل اسم المنتج وسعره');
      return;
    }

    if (editingId) {
      updateProduct(editingId, productForm);
      triggerSuccess('تم تعديل بيانات وسعر المنتج بنجاح! ✅');
    } else {
      addProduct(productForm);
      triggerSuccess('تمت إضافة المنتج الجديد بنجاح! 🎉');
    }
    setIsProductModalOpen(false);
  };

  // Save Banner
  const handleSaveBanner = (e) => {
    e.preventDefault();
    updateBanner(bannerForm);
    triggerSuccess('تم حفظ تعديلات البانر بنجاح! ✅');
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    triggerSuccess('تم حفظ إعدادات المتجر بنجاح! ✅');
  };

  // Handle image upload / paste conversion to DataURL
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Image upload
  const handleBannerFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ------------------ LOGIN SCREEN ------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-right">
        <div className="relative w-full max-w-md bg-[#18181c] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">لوحة تحكم Jimmy Store</h2>
            <p className="text-xs text-gray-400">
              خاصة بالعميل / صاحب المتجر لتغيير الأسعار والصور والمنتجات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                كلمة مرور الإدارة
              </label>
              <input
                type="password"
                placeholder="ادخل كلمة المرور (الافتراضية: admin)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                autoFocus
              />
              {loginError && (
                <p className="text-xs text-red-400 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all"
            >
              تسجيل الدخول للوحة التحكم
            </button>
          </form>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-[11px] text-gray-400 leading-relaxed text-center">
            💡 كلمة المرور الافتراضية هي: <strong className="text-orange-400 font-mono">admin</strong> ويمكنك تغييرها من داخل الإعدادات في أي وقت.
          </div>

        </div>
      </div>
    );
  }

  // ------------------ MAIN ADMIN DASHBOARD ------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md text-right overflow-hidden">
      
      <div className="relative w-full max-w-5xl h-[94vh] bg-[#16161a] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Notification Toast */}
        {saveSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#121216]">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>لوحة تحكم المتجر</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  متصل ومباشر
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                تعديل فوري للأسعار، الصور، المنتجات، والبانرات
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportBackupJSON}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/5"
              title="تحميل نسخة احتياطية من كافة المنتجات والأسعار"
            >
              <Download className="w-3.5 h-3.5" />
              <span>نسخة احتياطية</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold"
            >
              خروج
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-white/10 bg-[#141418] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات والأسعار ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'banner'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>البانر والإعلانات</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>سجل الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات المتجر & الواتساب</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#16161a]">
          
          {/* ---------------- TAB 1: PRODUCTS ---------------- */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div className="text-xs text-gray-400">
                  انقر على زر <strong className="text-orange-400">"تعديل"</strong> لتغيير السعر أو الصورة أو المقاسات، أو أضف كوتشي جديد.
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة كوتشي / منتج جديد</span>
                </button>
              </div>

              {/* Products Table / Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between gap-3 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-orange-400">
                            {p.category === 'crocs' ? 'كروكس' : p.category === 'women' ? 'حريمي' : p.category === 'kids' ? 'أطفالي' : 'رجالي'}
                          </span>
                          {p.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-bold">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">{p.name}</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-black text-white">{p.price} ج.م</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-gray-500 line-through">{p.originalPrice} ج.م</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Status & Action Buttons */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          p.inStock
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {p.inStock ? 'متوفر بالمخزن ✅' : 'نفذت الكمية ❌'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white transition-all"
                          title="تعديل السعر والصورة"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف ${p.name}؟`)) {
                              deleteProduct(p.id);
                              triggerSuccess('تم حذف المنتج بنجاح');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ---------------- TAB 2: BANNER & ADS ---------------- */}
          {activeTab === 'banner' && (
            <form onSubmit={handleSaveBanner} className="max-w-2xl mx-auto space-y-5">
              
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Image className="w-4 h-4 text-orange-400" />
                  <span>تعديل البانر الرئيسي في أول الصفحة</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    عنوان البانر الرئيسي
                  </label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    الوصف الترويجي
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      شارة العرض (Badge)
                    </label>
                    <input
                      type="text"
                      value={bannerForm.badge}
                      onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      نص زر الشراء
                    </label>
                    <input
                      type="text"
                      value={bannerForm.ctaText}
                      onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    رابط صورة البانر (URL) أو ارفع صورة من جهازك
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 text-left"
                      dir="ltr"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleBannerFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Banner Preview */}
                {bannerForm.imageUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-gray-400 block mb-1">معاينة صورة البانر:</span>
                    <img
                      src={bannerForm.imageUrl}
                      alt="Banner Preview"
                      className="w-full h-36 rounded-xl object-cover border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Announcement Bar Settings */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-400" />
                  <span>شريط الإعلان المتحرك في أعلى الموقع</span>
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="announcementActive"
                    checked={settingsForm.announcementActive}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-0 bg-black/40"
                  />
                  <label htmlFor="announcementActive" className="text-xs font-bold text-gray-200 cursor-pointer">
                    تفعيل إظهار شريط الإعلانات في أعلى الصفحة
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    نص الإعلان
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات البانر والإعلانات</span>
              </button>

            </form>
          )}

          {/* ---------------- TAB 3: ORDERS ---------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  سجل طلبات الشراء المسجلة عبر الموقع
                </h3>
                <span className="text-xs text-gray-400 font-bold">
                  إجمالي الطلبات: {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <ShoppingCart className="w-10 h-10 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-400">لا توجد طلبات مسجلة بعد.</p>
                  <p className="text-[11px] text-gray-500">عندما يقوم أي عميل بإتمام أوردر عبر الموقع سيظهر تفاصيله هنا فوراً.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-orange-400">#{ord.id}</span>
                          <span className="text-gray-400 font-mono">
                            {new Date(ord.createdAt).toLocaleString('ar-EG')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                            {ord.status || 'تم الإرسال'}
                          </span>
                          <span className="text-sm font-black text-white">{ord.total} ج.م</span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-black/30 p-2.5 rounded-xl text-gray-300">
                        <div>👤 العميل: <strong className="text-white">{ord.customer?.name}</strong></div>
                        <div>📱 الموبايل: <strong className="text-white font-mono">{ord.customer?.phone}</strong></div>
                        <div>📍 المحافظة: <strong className="text-white">{ord.customer?.governorate}</strong></div>
                        <div className="sm:col-span-3">🏠 العنوان: <span className="text-white">{ord.customer?.address}</span></div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-bold text-gray-400 block">المنتجات المطلوبة:</span>
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-gray-300 pr-2">
                            <span>• {it.name} (مقاس: {it.selectedSize}) × {it.quantity}</span>
                            <span className="font-bold text-white">{it.price * it.quantity} ج.م</span>
                          </div>
                        ))}
                      </div>

                      {/* Direct WhatsApp Action for store owner */}
                      <div className="pt-2 flex justify-end">
                        <a
                          href={`https://wa.me/2${ord.customer?.phone}?text=${encodeURIComponent(`السلام عليكم أستاذ ${ord.customer?.name}، بخصوص طلبك من Jimmy Store برقم #${ord.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>مراسلة العميل واتساب</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- TAB 4: SETTINGS ---------------- */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-5">
              
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>بيانات التواصل والواتساب</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    رقم الواتساب لاستقبال الطلبات (مع كود الدولة مثل: 201012345678) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    اسم المتجر
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      سعر الشحن الأساسي (ج.م)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.shippingFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shippingFee: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      شحن مجاني للطلبات فوق (ج.م)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    نص معلومات الشحن والتوصيل
                  </label>
                  <input
                    type="text"
                    value={settingsForm.shippingText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shippingText: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Security & Password */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-400" />
                  <span>أمان لوحة التحكم وكلمة المرور</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    كلمة مرور دخول لوحة التحكم
                  </label>
                  <input
                    type="text"
                    value={settingsForm.adminPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    يمكنك تغيير كلمة المرور لتكون خاصة بك فقط
                  </span>
                </div>
              </div>

              {/* Reset to Default */}
              <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-400">إعادة تعيين بيانات المصنع</h4>
                  <p className="text-[10px] text-gray-400">استعادة المنتجات والأسعار الأولية وحذف التعديلات</p>
                </div>
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition-all"
                >
                  إعادة ضبط المصنع
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ كافة الإعدادات</span>
              </button>

            </form>
          )}

        </div>

      </div>

      {/* ---------------- PRODUCT ADD / EDIT MODAL ---------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#1c1c22] rounded-3xl border border-white/10 p-5 sm:p-7 shadow-2xl my-6 text-right space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black text-white">
                {editingId ? 'تعديل بيانات وسعر الكوتشي' : 'إضافة كوتشي جديد للمتجر'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-gray-300 mb-1">اسم الموديل / الكوتشي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Nike Air Force 1 '07 - White"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">القسم *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#141418] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="men">رجالي 👟</option>
                    <option value="women">حريمي 👠</option>
                    <option value="kids">أطفالي 👶</option>
                    <option value="crocs">كروكس 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">السعر النهائي (ج.م) *</label>
                  <input
                    type="number"
                    required
                    placeholder="850"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    placeholder="1100"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">شارة العرض (Badge)</label>
                <input
                  type="text"
                  placeholder="مثال: الأكثر مبيعاً 🔥 أو خصم 20%"
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">
                  صورة الكوتشي (رابط URL أو رفع صورة من جهازك) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-left"
                    dir="ltr"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white font-bold flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع صورة</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {productForm.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={productForm.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <span className="text-[10px] text-emerald-400">تم اختيار الصورة بنجاح ✅</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    المقاسات المتاحة (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
                    placeholder="40, 41, 42, 43, 44, 45"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    الألوان المتاحة
                  </label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    placeholder="أسود, أبيض, أحمر"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">وصف المنتج ومميزاته</label>
                <textarea
                  rows={2}
                  placeholder="اكتب تفاصيل الخامة والفرش الطبي ومناسبته للاستخدام..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded bg-black/40 focus:ring-0"
                />
                <label htmlFor="inStockCheck" className="font-bold text-gray-200 cursor-pointer">
                  المنتج متوفر بالمخزن ويمكن للعملاء شراؤه
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'حفظ التعديلات' : 'إضافة الكوتشي للمتجر'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
