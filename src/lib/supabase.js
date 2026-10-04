import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = "https://qmummabspnyylopokaoh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_gLUnTuj2wCb5YiEuDUgraA_TyQqwsKY";

// Default / fallback keys from env or localStorage
export const getSupabaseConfig = () => {
  const storedUrl = localStorage.getItem('jimmy_supabase_url');
  const storedKey = localStorage.getItem('jimmy_supabase_key');

  const url = storedUrl || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = storedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return { url, key, isConfigured: Boolean(url && key) };
};

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('jimmy_supabase_url', url.trim());
  if (key) localStorage.setItem('jimmy_supabase_key', key.trim());
  supabaseClient = null; // Reset client
};

let supabaseClient = null;

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (err) {
    console.error('Supabase initialization error:', err);
    return null;
  }
};

/**
 * Image compressor & uploader
 * Uploads to Supabase Storage bucket 'product-images'
 * If Supabase is not configured or fails, uploads to ImgBB CDN free API as fallback
 */
export const uploadImageToCloud = async (file) => {
  if (!file) throw new Error('لا يوجد ملف مختار');

  // Compress image client-side before uploading (fast loading)
  const compressedFile = await compressImage(file, 1200, 0.85);

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `shoes_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (sbError) {
      console.warn('Supabase storage upload failed, attempting fallback CDN...', sbError);
    }
  }

  // Fallback Free Image CDN (ImgBB)
  try {
    const formData = new FormData();
    formData.append('image', compressedFile);

    const response = await fetch('https://api.imgbb.com/1/upload?key=8cf6226cb6b38c2cb57bf9e346f047ff', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success && result.data && result.data.url) {
      return result.data.display_url || result.data.url;
    }
  } catch (imgbbError) {
    console.error('Image CDN fallback failed:', imgbbError);
  }

  // Ultimate fallback to Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(compressedFile);
  });
};

/**
 * Client-side lightweight image compressor
 */
function compressImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        elem.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
