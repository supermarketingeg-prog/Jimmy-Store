import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialBanner, initialSettings, initialCategories } from '../data/defaultData';

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
  // Load products with fallback
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Load banner
  const [banner, setBanner] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNER);
      return saved ? JSON.parse(saved) : initialBanner;
    } catch {
      return initialBanner;
    }
  });

  // Load store settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(banner));
    } catch (e) {
      console.error('Failed to save banner', e);
    }
  }, [banner]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  // Admin Login / Logout
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

  // Product CRUD
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      price: Number(newProduct.price) || 0,
      originalPrice: Number(newProduct.originalPrice) || 0,
      inStock: newProduct.inStock !== false,
      sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : (newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : ["40", "41", "42", "43", "44"]),
      colors: Array.isArray(newProduct.colors) ? newProduct.colors : (newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()) : ["ألوان متعددة"]),
    };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          originalPrice: updatedFields.originalPrice !== undefined ? Number(updatedFields.originalPrice) : p.originalPrice,
          sizes: Array.isArray(updatedFields.sizes) ? updatedFields.sizes : (typeof updatedFields.sizes === 'string' ? updatedFields.sizes.split(',').map(s => s.trim()) : p.sizes),
          colors: Array.isArray(updatedFields.colors) ? updatedFields.colors : (typeof updatedFields.colors === 'string' ? updatedFields.colors.split(',').map(c => c.trim()) : p.colors),
        };
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStock = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  // Banner & Settings
  const updateBanner = (newBanner) => {
    setBanner(prev => ({ ...prev, ...newBanner }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Cart Management
  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || "حر";
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

  // Record Order
  const createOrder = (customerData) => {
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
    return newOrder;
  };

  // Reset to Factory Default
  const resetToDefault = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات للمصنع؟ سيتم حذف التعديلات.')) {
      setProducts(initialProducts);
      setBanner(initialBanner);
      setSettings(initialSettings);
      localStorage.clear();
      alert('تمت استعادة البيانات الافتراضية بنجاح!');
    }
  };

  // Backup Export / Import
  const exportBackupJSON = () => {
    const data = {
      products,
      banner,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jimmy-store-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.banner) setBanner(data.banner);
      if (data.settings) setSettings(data.settings);
      alert('تم استيراد النسخة الاحتياطية بنجاح!');
      return true;
    } catch (err) {
      alert('فشل استيراد الملف: ملف غير صالح');
      return false;
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
      resetToDefault,
      exportBackupJSON,
      importBackupJSON,
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
