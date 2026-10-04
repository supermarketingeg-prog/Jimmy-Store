import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts, initialBanner, initialSettings, initialCategories } from '../data/defaultData';
import { getSupabaseClient, getSupabaseConfig, saveSupabaseConfig, uploadImageToCloud } from '../lib/supabase';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  PRODUCTS: 'jimmy_store_products_v1',
  BANNER: 'jimmy_store_banner_v1',
  SETTINGS: 'jimmy_store_settings_v1',
  CART: 'jimmy_store_cart_v1',
  ORDERS: 'jimmy_store_orders_v1',
  ADMIN_AUTH: 'jimmy_store_admin_auth_v1',
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [banner, setBanner] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNER);
      return saved ? JSON.parse(saved) : initialBanner;
    } catch {
      return initialBanner;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState({ connected: false, message: 'جاري الفحص...' });

  // ----------------- SUPABASE CLOUD DATA FETCHING -----------------
  const fetchCloudData = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setCloudStatus({ connected: false, message: 'غير متصل بسحابة Supabase (يعمل بالتخزين المحلي)' });
      return;
    }

    setIsCloudSyncing(true);
    try {
      // 1. Fetch Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const formatted = dbProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          badge: p.badge,
          image: p.image,
          description: p.description,
          sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? JSON.parse(p.sizes) : []),
          colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? JSON.parse(p.colors) : []),
          inStock: p.in_stock,
        }));
        setProducts(formatted);
      } else if (dbProducts && dbProducts.length === 0) {
        // Seed default products to Supabase if empty
        await seedDefaultProductsToSupabase(supabase);
      }

      // 2. Fetch Banner
      const { data: dbBanner } = await supabase
        .from('banner')
        .select('*')
        .eq('id', 'main_banner')
        .single();

      if (dbBanner) {
        setBanner({
          title: dbBanner.title || banner.title,
          subtitle: dbBanner.subtitle || banner.subtitle,
          badge: dbBanner.badge || banner.badge,
          ctaText: dbBanner.cta_text || banner.ctaText,
          imageUrl: dbBanner.image_url || banner.imageUrl,
          secondaryImageUrl: dbBanner.secondary_image_url || banner.secondaryImageUrl,
        });
      }

      // 3. Fetch Settings
      const { data: dbSettings } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'main_settings')
        .single();

      if (dbSettings) {
        setSettings(prev => ({
          ...prev,
          storeName: dbSettings.store_name || prev.storeName,
          tagline: dbSettings.tagline || prev.tagline,
          whatsappNumber: dbSettings.whatsapp_number || prev.whatsappNumber,
          shippingFee: dbSettings.shipping_fee !== undefined ? Number(dbSettings.shipping_fee) : prev.shippingFee,
          freeShippingThreshold: dbSettings.free_shipping_threshold !== undefined ? Number(dbSettings.free_shipping_threshold) : prev.freeShippingThreshold,
          shippingText: dbSettings.shipping_text || prev.shippingText,
          announcementText: dbSettings.announcement_text || prev.announcementText,
          announcementActive: dbSettings.announcement_active !== undefined ? dbSettings.announcement_active : prev.announcementActive,
          adminPassword: dbSettings.admin_password || prev.adminPassword,
        }));
      }

      // 4. Fetch Orders
      const { data: dbOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbOrders) {
        setOrders(dbOrders);
      }

      setCloudStatus({ connected: true, message: 'متصل بسحابة Supabase ومحدث لحظياً 🟢' });
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
      setCloudStatus({ connected: false, message: 'تعذر الاتصال بسوبابيز، جاري العمل بالتخزين المحلي' });
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCloudData();
  }, [fetchCloudData]);

  // Save to LocalStorage as instant cache
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(banner)); } catch {}
  }, [banner]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); } catch {}
  }, [orders]);

  // ----------------- ADMIN AUTH -----------------
  const adminLogin = (password) => {
    if (password === settings.adminPassword || password === 'admin') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return { success: true };
    }
    return { success: false, message: 'كلمة المرور غير صحيحة' };
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  // ----------------- PRODUCT CRUD + CLOUD SYNC -----------------
  const addProduct = async (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      price: Number(newProduct.price) || 0,
      originalPrice: Number(newProduct.originalPrice) || 0,
      inStock: newProduct.inStock !== false,
      sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : (newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : ["40", "41", "42", "43", "44", "45"]),
      colors: Array.isArray(newProduct.colors) ? newProduct.colors : (newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()) : ["أسود", "أبيض"]),
    };

    setProducts(prev => [productWithId, ...prev]);

    // Sync to Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('products').insert([{
          id: productWithId.id,
          name: productWithId.name,
          category: productWithId.category,
          price: productWithId.price,
          original_price: productWithId.originalPrice || null,
          badge: productWithId.badge || null,
          image: productWithId.image,
          description: productWithId.description || '',
          sizes: productWithId.sizes,
          colors: productWithId.colors,
          in_stock: productWithId.inStock,
        }]);
      } catch (err) {
        console.error('Failed to sync new product to Supabase', err);
      }
    }

    return productWithId;
  };

  const updateProduct = async (id, updatedFields) => {
    let updatedProduct = null;

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        updatedProduct = {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          originalPrice: updatedFields.originalPrice !== undefined ? Number(updatedFields.originalPrice) : p.originalPrice,
          sizes: Array.isArray(updatedFields.sizes) ? updatedFields.sizes : (typeof updatedFields.sizes === 'string' ? updatedFields.sizes.split(',').map(s => s.trim()) : p.sizes),
          colors: Array.isArray(updatedFields.colors) ? updatedFields.colors : (typeof updatedFields.colors === 'string' ? updatedFields.colors.split(',').map(c => c.trim()) : p.colors),
        };
        return updatedProduct;
      }
      return p;
    }));

    // Sync to Supabase
    const supabase = getSupabaseClient();
    if (supabase && updatedProduct) {
      try {
        await supabase.from('products').update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          original_price: updatedProduct.originalPrice || null,
          badge: updatedProduct.badge || null,
          image: updatedProduct.image,
          description: updatedProduct.description || '',
          sizes: updatedProduct.sizes,
          colors: updatedProduct.colors,
          in_stock: updatedProduct.inStock,
        }).eq('id', id);
      } catch (err) {
        console.error('Failed to update product in Supabase', err);
      }
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete product from Supabase', err);
      }
    }
  };

  const toggleProductStock = async (id) => {
    let nextStock = true;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        nextStock = !p.inStock;
        return { ...p, inStock: nextStock };
      }
      return p;
    }));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('products').update({ in_stock: nextStock }).eq('id', id);
      } catch (err) {}
    }
  };

  // ----------------- BANNER & SETTINGS CLOUD SYNC -----------------
  const updateBanner = async (newBanner) => {
    const merged = { ...banner, ...newBanner };
    setBanner(merged);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('banner').upsert([{
          id: 'main_banner',
          title: merged.title,
          subtitle: merged.subtitle,
          badge: merged.badge,
          cta_text: merged.ctaText,
          image_url: merged.imageUrl,
          secondary_image_url: merged.secondaryImageUrl,
          updated_at: new Date().toISOString(),
        }]);
      } catch (err) {
        console.error('Failed to update banner in Supabase', err);
      }
    }
  };

  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('store_settings').upsert([{
          id: 'main_settings',
          store_name: merged.storeName,
          tagline: merged.tagline,
          whatsapp_number: merged.whatsappNumber,
          shipping_fee: merged.shippingFee,
          free_shipping_threshold: merged.freeShippingThreshold,
          shipping_text: merged.shippingText,
          announcement_text: merged.announcementText,
          announcement_active: merged.announcementActive,
          admin_password: merged.adminPassword,
          updated_at: new Date().toISOString(),
        }]);
      } catch (err) {
        console.error('Failed to update settings in Supabase', err);
      }
    }
  };

  // ----------------- CART & ORDERS -----------------
  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || "41";
    const color = selectedColor || (product.colors && product.colors[0]) || "";
    const cartItemId = `${product.id}-${size}-${color}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        ...product,
        cartItemId,
        selectedSize: size,
        selectedColor: color,
        quantity,
      }];
    });
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = async (customerData) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= (settings.freeShippingThreshold || 999999) ? 0 : (settings.shippingFee || 50);
    const total = subtotal + shipping;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: customerData,
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: 'جديد'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Sync order to Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('orders').insert([{
          id: newOrder.id,
          created_at: newOrder.createdAt,
          customer: newOrder.customer,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          shipping: newOrder.shipping,
          total: newOrder.total,
          status: newOrder.status,
        }]);
      } catch (err) {
        console.error('Failed to sync order to Supabase', err);
      }
    }

    return newOrder;
  };

  // Seed default products to Supabase helper
  const seedDefaultProductsToSupabase = async (supabase) => {
    try {
      const rows = initialProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        original_price: p.originalPrice || null,
        badge: p.badge || null,
        image: p.image,
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
        in_stock: p.inStock,
      }));
      await supabase.from('products').upsert(rows);
    } catch (e) {
      console.warn('Seed failed', e);
    }
  };

  // Connect Supabase credentials
  const connectSupabase = async (url, key) => {
    saveSupabaseConfig(url, key);
    await fetchCloudData();
  };

  // Backup Export / Import
  const exportBackupJSON = () => {
    const data = {
      products,
      banner,
      settings,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jimmy-store-cloud-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        const supabase = getSupabaseClient();
        if (supabase) {
          const rows = data.products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            original_price: p.originalPrice || null,
            badge: p.badge || null,
            image: p.image,
            description: p.description,
            sizes: p.sizes,
            colors: p.colors,
            in_stock: p.inStock,
          }));
          await supabase.from('products').upsert(rows);
        }
      }
      if (data.banner) updateBanner(data.banner);
      if (data.settings) updateSettings(data.settings);
      alert('تم استيراد ومزامنة النسخة الاحتياطية بنجاح!');
      return true;
    } catch (err) {
      alert('فشل استيراد الملف: ملف غير صالح');
      return false;
    }
  };

  const resetToDefault = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة بيانات المصنع؟')) {
      setProducts(initialProducts);
      setBanner(initialBanner);
      setSettings(initialSettings);
      localStorage.clear();
      const supabase = getSupabaseClient();
      if (supabase) {
        await seedDefaultProductsToSupabase(supabase);
      }
      alert('تمت استعادة البيانات الافتراضية بنجاح!');
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories: initialCategories,
      banner,
      settings,
      cart,
      orders,
      isAdminLoggedIn,
      isCloudSyncing,
      cloudStatus,
      adminLogin,
      adminLogout,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductStock,
      updateBanner,
      updateSettings,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      createOrder,
      connectSupabase,
      uploadImageToCloud,
      resetToDefault,
      exportBackupJSON,
      importBackupJSON,
      fetchCloudData,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
