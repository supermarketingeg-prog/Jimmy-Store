-- =========================================================================
--  JIMMY STORE - SUPABASE DATABASE SCHEMA
--  قم بنسخ هذا الكود بالكامل ولصقه في (Supabase -> SQL Editor -> New Query -> Run)
-- =========================================================================

-- 1. جدول المنتجات (Products Table)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'men',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    badge TEXT,
    image TEXT NOT NULL,
    description TEXT,
    sizes JSONB DEFAULT '["40", "41", "42", "43", "44", "45"]'::jsonb,
    colors JSONB DEFAULT '["أسود", "أبيض"]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. جدول البانر والإعلانات (Banner & Announcements Table)
CREATE TABLE IF NOT EXISTS banner (
    id TEXT PRIMARY KEY DEFAULT 'main_banner',
    title TEXT,
    subtitle TEXT,
    badge TEXT,
    cta_text TEXT,
    image_url TEXT,
    secondary_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. جدول إعدادات المتجر (Store Settings Table)
CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main_settings',
    store_name TEXT DEFAULT 'Jimmy Store',
    tagline TEXT,
    whatsapp_number TEXT DEFAULT '201000000000',
    shipping_fee NUMERIC DEFAULT 50,
    free_shipping_threshold NUMERIC DEFAULT 2000,
    shipping_text TEXT,
    announcement_text TEXT,
    announcement_active BOOLEAN DEFAULT true,
    admin_password TEXT DEFAULT 'admin',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. جدول الطلبات (Orders Table)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'جديد'
);

-- تفعيل سياسات الأمان (Row Level Security - Public Read & Write for Storefront)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update/Delete Products" ON products FOR ALL USING (true);

CREATE POLICY "Public Read Banner" ON banner FOR SELECT USING (true);
CREATE POLICY "Public Update Banner" ON banner FOR ALL USING (true);

CREATE POLICY "Public Read Settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public Update Settings" ON store_settings FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);

-- 5. إنشاء Storage Bucket لصور المنتجات (Product Images Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access Storage" ON storage.objects FOR ALL USING (bucket_id = 'product-images');
