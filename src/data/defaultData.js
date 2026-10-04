export const initialSettings = {
  storeName: "Jimmy Store",
  tagline: "HIGH COPY • IMPORTED 👟 Men | Women | Kids Sneakers & Crocs 🔥",
  logoUrl: "/logo.png",
  whatsappOrdersNumber: "201119946924", // رقم استقبال الأوردرات
  whatsappInquiryNumber: "201008418338", // رقم واتس الاستفسارات والتفاصيل
  whatsappNumber: "201119946924", // Legacy fallback
  instagramUrl: "https://www.instagram.com/jimmy.store9?stkn=NWl0cmhrNWpzdTVn",
  facebookUrl: "https://www.facebook.com/share/1FLNDoikfa/?mibextid=wwXIfr",
  shippingText: "📦 شحن متاح لجميع محافظات مصر والتوصيل خلال 48-72 ساعة مع معاينة قبل الاستلام",
  shippingFee: 50,
  freeShippingThreshold: 2000,
  adminPassword: "admin",
  announcementText: "🔥 خصم خاص 15% على تشكيلة كوتشيات وكروكس Jimmy Store مع شحن سريع لكل مصر!",
  announcementActive: true,
};

export const initialBanner = {
  title: "تشكيلة كوتشيات وكروكس 2026 الأصلية",
  subtitle: "High Copy أعلى خامات مستوردة بأفضل سعر في مصر 👟 رجالي | حريمي | أطفالي | كروكس",
  badge: "🔥 Jimmy Store - الاختيار الأول في مصر",
  ctaText: "تسوق التشكيلة الآن",
  imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80",
  secondaryImageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80"
};

export const initialCategories = [
  { id: "all", name: "الكل", icon: "Sparkles" },
  { id: "men", name: "رجالي 👟", icon: "User" },
  { id: "women", name: "حريمي 👠", icon: "Heart" },
  { id: "kids", name: "أطفالي 👶", icon: "Smile" },
  { id: "crocs", name: "كروكس 🔥", icon: "Sun" },
  { id: "sale", name: "عروض خاصة 🏷️", icon: "Flame" },
];

export const initialProducts = [
  {
    id: "prod-1",
    name: "Nike Air Force 1 '07 - Triple White",
    category: "men",
    price: 850,
    originalPrice: 1100,
    badge: "الأكثر مبيعاً 🔥",
    inStock: true,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    description: "كوتشي نايكي إير فورس 1 أبيض كلاسيك، خامة هاى كوبي مستوردة درجة أولى بفرش طبي مريح جداً للاستخدام اليومي والجامعة.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["أبيض كلاسيك"]
  },
  {
    id: "prod-2",
    name: "Jordan 1 Retro High OG - Chicago",
    category: "men",
    price: 980,
    originalPrice: 1350,
    badge: "خصم 25% 🏷️",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    description: "أيقونة جوردان 1 شيكاغو أحمر مع أسود وأبيض. تفاصيل متقنة وخامات جلد مستورد عالي الجودة مع نعل مضغوط لراحة القدمين.",
    sizes: ["41", "42", "43", "44", "45"],
    colors: ["أحمر × أسود"]
  },
  {
    id: "prod-3",
    name: "Crocs Classic Clog - Black Edition",
    category: "crocs",
    price: 490,
    originalPrice: 650,
    badge: "تريند الصيف ⚡",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    description: "كروكس كلاسيك مريح وخفيف جداً ضد الماء والانزلاق، يأتي مع طقم دبابيس (Jibbitz) إكسسوار أنيق.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["أسود", "أبيض", "زيتي"]
  },
  {
    id: "prod-4",
    name: "New Balance 550 - White & Green",
    category: "men",
    price: 890,
    originalPrice: 1200,
    badge: "وصل حديثاً ✨",
    inStock: true,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    description: "نيو بالانس 550 تريند الفينتاج بلون أبيض وأخضر غامق. تصميم شيك وعصري يناسب الجينز والستايلات الكاجوال.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["أبيض × أخضر"]
  },
  {
    id: "prod-5",
    name: "Adidas Samba OG - Core White Black",
    category: "women",
    price: 820,
    originalPrice: 1050,
    badge: "الأكثر طلباً 💖",
    inStock: true,
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80",
    description: "أديداس سامبا الأصلية بلونها المميز، نعل مطاط طبيعي كلاسيكي وستايل راقي جداً للبنات والشباب.",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["أبيض × خطوط سوداء"]
  },
  {
    id: "prod-6",
    name: "Nike Dunk Low - Panda",
    category: "men",
    price: 870,
    originalPrice: 1150,
    badge: "خصم خاص 🏷️",
    inStock: true,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    description: "نايكي دانك باندا أبيض وأسود، أشهر كوتشي كاجوال شبابي يناسب كل أطقم الملابس، مريح ومتين.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["باندا أبيض × أسود"]
  },
  {
    id: "prod-7",
    name: "Crocs Echo Clog - Futuristic Beige",
    category: "crocs",
    price: 550,
    originalPrice: 750,
    badge: "كولكشن جديد 🚀",
    inStock: true,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    description: "كروكس إيكو بتصميم رياضي عصري مجسم، نعل طبي سميك مضاعف لتوفير أقصى درجات الراحة طول اليوم.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["بيج عاجي", "رمادي مطفي"]
  },
  {
    id: "prod-8",
    name: "Kids Air Jordan Light - Flash Red",
    category: "kids",
    price: 580,
    originalPrice: 780,
    badge: "أطفالي 👶",
    inStock: true,
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    description: "كوتشي أطفالي جوردان مريح جداً مع أربطة مطاطية سهلة اللبس ونعل خفيف لحماية أقدام الأطفال.",
    sizes: ["28", "29", "30", "31", "32", "33", "34", "35"],
    colors: ["أحمر × أسود"]
  }
];
