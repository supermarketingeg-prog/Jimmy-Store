import React, { useState, useMemo, useRef } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Footer } from './components/Footer';
import { Filter, ArrowUpDown, Sparkles, AlertCircle } from 'lucide-react';

function Storefront() {
  const { products } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc'
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const productsSectionRef = useRef(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory === 'sale') {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleEditFromCard = (prod) => {
    setEditingProduct(prod);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e12] text-gray-100 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          setEditingProduct(null);
          setIsAdminOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Banner */}
      <HeroBanner onShopNow={scrollToProducts} />

      {/* Main Store Content */}
      <main ref={productsSectionRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Controls Bar: Categories & Sorting */}
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>تشكيلة الكوتشيات والكروكس</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                  {filteredProducts.length} موديل
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                أعلى جودة High Copy مستوردة في مصر مع ضمان المعاينة قبل الاستلام
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">الترتيب:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#18181c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="featured">الأحدث والمميز</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalCount={products.length}
          />

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                onEditProduct={handleEditFromCard}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">لم نجد منتجات مطابقة للبحث</h3>
              <p className="text-xs text-gray-400">
                جرب البحث بكلمة أخرى أو اختر قسماً آخر من الأقسام بالأعلى.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all"
            >
              عرض كافة المنتجات
            </button>
          </div>
        )}

      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onEditProduct={handleEditFromCard}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingProduct(null);
        }}
        initialEditingProduct={editingProduct}
      />

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Storefront />
    </StoreProvider>
  );
}
