/* =====================================================
   RAILQUICK — Frontend Application Shell
   UI/UX refined without backend/API/business-logic changes
   ===================================================== */

'use strict';

// ===== API CONFIG =====
const origin = window.location.origin || '';
const API_BASE = (origin.startsWith('file://') || origin === 'null') ? 'http://localhost:3000' : origin;

// ===== APP STATE =====
let appState = {
  currentPage: 'page-pnr',
  user: {
    name: 'Your account',
    phone: '8826387844',
    email: 'kartik.railquick@gmail.com',
    avatarUrl: ''
  },
  cart: [],
  orders: [],
  pnrData: {
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Howrah Jn (HWH)',
    passengerList: [{ coach: 'B2', berth: '45', currentStatus: 'CNF' }]
  },
  pnrLiveData: null,
  isPnrConfirmed: true,
  hasOnboarded: false,
  favorites: [],
  trainData: null,
  selectedPayment: 'upi',
  modalProduct: null,
  modalQty: 1,
  currentFilter: 'all',
  searchQuery: '',
  appliedCoupon: null,
  vegOnly: false,
  themeMode: 'dark'
};

let clerkInstance = null;

// ===== PRODUCTS DATABASE (PHOTO 3 + CATEGORY ESSENTIALS) =====
const PRODUCTS = [
  // ── PHOTO 3 HERO PRODUCTS ──
  {
    id: 1101,
    name: "Lay's India's Magic Masala Potato Chips",
    price: 21,
    mrp: 25,
    discountText: '16% OFF on MRP',
    category: 'all',
    subcategories: ['all', 'beverages', 'navratri'],
    weight: '58 g',
    optionsLabel: '2 options',
    options: [
      { weight: '58 g', price: 21, mrp: 25, discount: '16% OFF' },
      { weight: '115 g', price: 40, mrp: 50, discount: '20% OFF' }
    ],
    img: 'product_lays.png',
    rating: 5,
    reviews: '6.6 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: "Lay's India's Magic Masala potato chips made with highest grade farm potatoes, sliced thin and seasoned with rich, aromatic Indian spices."
  },
  {
    id: 1102,
    name: "Uncle Chipps Spicy Treat Potato Chips",
    price: 20,
    mrp: 20,
    discountText: 'Special Price',
    category: 'all',
    subcategories: ['all', 'beverages'],
    weight: '53 g',
    optionsLabel: '3 options',
    options: [
      { weight: '53 g', price: 20, mrp: 20, discount: 'Best Value' },
      { weight: '90 g', price: 35, mrp: 40, discount: '12% OFF' },
      { weight: '150 g Party Pack', price: 55, mrp: 65, discount: '15% OFF' }
    ],
    img: 'product_uncle.png',
    rating: 5,
    reviews: '6.3 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: "Bole Mere Lips, I Love Uncle Chipps! Golden ridged potato chips seasoned with the original spicy treat desi masala blend."
  },
  {
    id: 1103,
    name: "Kurkure Masala Munch Crisps",
    price: 20,
    mrp: 20,
    discountText: 'Trending',
    category: 'all',
    subcategories: ['all', 'beverages'],
    weight: '75 g',
    optionsLabel: '2 options',
    options: [
      { weight: '75 g', price: 20, mrp: 20, discount: 'Best Seller' },
      { weight: '140 g Family Pack', price: 38, mrp: 45, discount: '15% OFF' }
    ],
    img: 'product_kurkure.png',
    rating: 5,
    reviews: '8.2 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: "Tedha Hai Par Mera Hai! Classic crunch made with real dal, corn, and rice with a mouth-watering spicy chatpata masala flavour."
  },

  // ── NAVRATRI & FESTIVE SPECIALS (PHOTO 1 & PHOTO 2 BANNER) ──
  {
    id: 1201,
    name: "Farmley Himalayan Salt Roasted Makhana",
    price: 120,
    mrp: 160,
    discountText: '25% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '100 g',
    optionsLabel: '2 options',
    options: [
      { weight: '100 g', price: 120, mrp: 160, discount: '25% OFF' },
      { weight: '200 g Tub', price: 220, mrp: 300, discount: '26% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '4.9 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Crunchy slow-roasted fox nuts tossed in pure Himalayan pink rock salt, ideal for Vrat & fasting.'
  },
  {
    id: 1202,
    name: "Festive Wooden Dandiya Sticks (Pair)",
    price: 99,
    mrp: 150,
    discountText: '34% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '1 Pair',
    optionsLabel: '2 options',
    options: [
      { weight: '1 Pair (Traditional)', price: 99, mrp: 150, discount: '34% OFF' },
      { weight: '2 Pairs (Family Pack)', price: 179, mrp: 280, discount: '36% OFF' }
    ],
    img: 'nav_prod_dandiya.png',
    rating: 5,
    reviews: '14,200',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Polished wooden dandiya sticks with mirror work and festive bells for Navratri celebrations.'
  },
  {
    id: 1205,
    name: "Handcrafted Brass Durga Maa Idol (4-inch)",
    price: 499,
    mrp: 899,
    discountText: '44% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '1 unit',
    img: 'nav_prod_durga.png',
    rating: 5,
    reviews: '8,430',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Auspicious pure brass handcrafted Durga idol for devotional journey prayers and festive altar.'
  },
  {
    id: 1206,
    name: "Mata Ki Red Chunri with Golden Lace",
    price: 49,
    mrp: 100,
    discountText: '51% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '1 unit',
    img: 'nav_prod_chunri.png',
    rating: 5,
    reviews: '19,500',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Traditional red georgette embroidered Chunri with golden Kiran gota border for pooja rituals.'
  },
  {
    id: 1207,
    name: "Dandiya Ready Ethnic Necklace Set",
    price: 299,
    mrp: 900,
    discountText: '66% OFF (Save ₹601)',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '1 set',
    img: 'navratri_hero_section.png',
    rating: 5,
    reviews: '5,280',
    deliveryTime: '12 mins',
    veg: false,
    description: 'Stunning oxidized silver festive necklace and earrings set for Dandiya night celebrations.'
  },
  {
    id: 1208,
    name: "Flowers & Pooja Needs Essentials Kit",
    price: 149,
    mrp: 220,
    discountText: '32% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '1 kit',
    img: 'navratri_hero_section.png',
    rating: 5,
    reviews: '11,100',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Sacred pooja kit including fresh coconut, marigold garland, pure roli chandan and incense sticks.'
  },
  {
    id: 1203,
    name: "Pure Cow Ghee Diya & Camphor Pack",
    price: 85,
    mrp: 110,
    discountText: '22% OFF on MRP',
    category: 'navratri',
    subcategories: ['all', 'navratri'],
    weight: '30 Pcs',
    optionsLabel: '2 options',
    options: [
      { weight: '30 Pcs', price: 85, mrp: 110, discount: '22% OFF' },
      { weight: '60 Pcs Box', price: 150, mrp: 200, discount: '25% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '4.8 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Ready-to-use pure cow ghee wax-free wicks for pooja rituals and auspicious festive prayers.'
  },

  // ── ELECTRONICS (MATCHING USER SCREENSHOT 2 EXACTLY) ──
  {
    id: 1305,
    name: "Portronics Conch Theta C Type C Wired Earphones",
    price: 299,
    mrp: 799,
    discountText: '62% OFF on MRP',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: '1 unit',
    optionsLabel: 'IPX4 · USB C',
    img: 'prod_conch.png',
    rating: 5,
    reviews: '41,081',
    deliveryTime: '12 mins',
    veg: false,
    description: 'High definition audio with Type-C connector, IPX4 splash resistance and in-line microphone.'
  },
  {
    id: 1306,
    name: "Hammer Ultra Pods TWS Earbuds (Sky Blue)",
    price: 499,
    mrp: 3499,
    discountText: '85% OFF on MRP',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: '1 unit',
    optionsLabel: 'IPX5 · Bluetooth',
    img: 'prod_ultrapods.png',
    rating: 5,
    reviews: '11,884',
    deliveryTime: '16 mins',
    veg: false,
    description: 'Transparent casing TWS earbuds with digital LED battery display, IPX5 water resistance and deep bass.'
  },
  {
    id: 1307,
    name: "Hammer Airflow Neo TWS Earbuds (Grey)",
    price: 649,
    mrp: 2499,
    discountText: '74% OFF on MRP',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: '1 unit',
    optionsLabel: 'Bluetooth 5.3',
    img: 'prod_airflow.png',
    rating: 5,
    reviews: '4,870',
    deliveryTime: '16 mins',
    veg: false,
    description: 'Sleek ergonomic fit true wireless earbuds with 30-hour playtime and crystal clear environmental noise cancellation.'
  },
  {
    id: 1308,
    name: "Amazon Fire TV Stick with Alexa Voice Remote",
    price: 2799,
    mrp: 3999,
    discountText: '30% OFF on MRP',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: '1 unit',
    img: 'elec_card_firetv.png',
    rating: 5,
    reviews: '82,410',
    deliveryTime: '15 mins',
    veg: false,
    description: 'Full HD streaming with Alexa Voice Remote, TV controls and fast app launches.'
  },
  {
    id: 1309,
    name: "Portronics Fast Power Bank & Dual Charger",
    price: 899,
    mrp: 1599,
    discountText: '43% OFF on MRP',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: '1 unit',
    img: 'elec_card_powerbanks.png',
    rating: 5,
    reviews: '19,300',
    deliveryTime: '12 mins',
    veg: false,
    description: 'Compact high-speed power bank with dual USB charging ports suitable for long train rides.'
  },

  // ── BEAUTY (PHOTO 1 & PHOTO 2 TILE 2/3) ──
  {
    id: 1401,
    name: "L'Oréal Paris Casting Crème Gloss Hair Colour",
    price: 550,
    mrp: 650,
    discountText: '15% OFF on MRP',
    category: 'beauty',
    subcategories: ['all', 'beauty', 'navratri'],
    weight: 'Ebony Black',
    optionsLabel: '2 options',
    options: [
      { weight: 'Ebony Black 200', price: 550, mrp: 650, discount: '15% OFF' },
      { weight: 'Dark Brown 400', price: 550, mrp: 650, discount: '15% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '2.8 lac',
    deliveryTime: '12 mins',
    veg: false,
    description: 'No ammonia conditioning hair color cream providing natural-looking color with ultra-glossy shimmering shine.'
  },
  {
    id: 1402,
    name: "Gillette Venus ComfortGlide Breeze Razor",
    price: 285,
    mrp: 350,
    discountText: '18% OFF on MRP',
    category: 'beauty',
    subcategories: ['all', 'beauty'],
    weight: '1 Razor Pack',
    optionsLabel: '2 options',
    options: [
      { weight: 'Razor + 1 Cartridge', price: 285, mrp: 350, discount: '18% OFF' },
      { weight: 'Cartridge Pack of 4', price: 499, mrp: 650, discount: '23% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '3.9 lac',
    deliveryTime: '12 mins',
    veg: false,
    description: 'Built-in flexible moisture bars lather with water for an effortless, smooth travel-friendly glide.'
  },
  {
    id: 1403,
    name: "TonyMoly I'm Red Wine Sheet Mask",
    price: 99,
    mrp: 150,
    discountText: '34% OFF on MRP',
    category: 'beauty',
    subcategories: ['all', 'beauty'],
    weight: '21 ml Pouch',
    optionsLabel: '2 options',
    options: [
      { weight: '1 Sheet Mask', price: 99, mrp: 150, discount: '34% OFF' },
      { weight: 'Pack of 3 Masks', price: 249, mrp: 450, discount: '44% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1567928815111-94572f77c3e5?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '1.9 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Red wine extract sheet mask enriched with botanical antioxidants for immediate pore care and radiant journey glow.'
  },

  // ── PHARMACY (PHOTO 1 & ESSENTIALS) ──
  {
    id: 1501,
    name: "Dettol Instant Hand Sanitizer Gel",
    price: 50,
    mrp: 65,
    discountText: '23% OFF on MRP',
    category: 'pharmacy',
    subcategories: ['all', 'pharmacy'],
    weight: '50 ml',
    optionsLabel: '2 options',
    options: [
      { weight: '50 ml Pocket Bottle', price: 50, mrp: 65, discount: '23% OFF' },
      { weight: '200 ml Pump Bottle', price: 120, mrp: 160, discount: '25% OFF' }
    ],
    img: 'product_sanitizer.png',
    rating: 5,
    reviews: '4.1 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Original germ protection rinse-free sanitizing gel killing 99.9% viruses and bacteria.'
  },
  {
    id: 1502,
    name: "Volini Instant Pain Relief Spray",
    price: 145,
    mrp: 180,
    discountText: '19% OFF on MRP',
    category: 'pharmacy',
    subcategories: ['all', 'pharmacy'],
    weight: '55 g Can',
    optionsLabel: '2 options',
    options: [
      { weight: '55 g Can', price: 145, mrp: 180, discount: '19% OFF' },
      { weight: '100 g Value Can', price: 230, mrp: 290, discount: '20% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '3.6 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Micro-gel spray technology providing instant cooling penetration for back, neck, and joint stiffness.'
  },
  {
    id: 1503,
    name: "Eno Regular Fast Action Antacid Sachet",
    price: 10,
    mrp: 12,
    discountText: '16% OFF on MRP',
    category: 'pharmacy',
    subcategories: ['all', 'pharmacy'],
    weight: '5 g',
    optionsLabel: '3 options',
    options: [
      { weight: 'Regular 5 g', price: 10, mrp: 12, discount: '16% OFF' },
      { weight: 'Lemon 5 g', price: 10, mrp: 12, discount: '16% OFF' },
      { weight: 'Pack of 6 Sachets', price: 50, mrp: 65, discount: '23% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '6.7 lac',
    deliveryTime: '12 mins',
    veg: true,
    description: 'Fast acting effervescent fruit salt antacid that works in 6 seconds to relieve acidity and heartburn.'
  },

  // ── 1. CHIPS & NAMKEEN ──
  {
    id: 1104,
    name: "Haldiram's Nagpur Aloo Bhujia",
    price: 40,
    mrp: 50,
    discountText: '20% OFF on MRP',
    category: 'chips-namkeen',
    subcategories: ['all', 'chips-namkeen'],
    weight: '150 g',
    optionsLabel: '2 options',
    options: [
      { weight: '150 g Pack', price: 40, mrp: 50, discount: '20% OFF' },
      { weight: '350 g Family Pack', price: 90, mrp: 110, discount: '18% OFF' }
    ],
    img: 'product_haldirams.png',
    rating: 5,
    reviews: '5.4 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Classic spicy mint-infused potato and gram flour crispy sev namkeen. The ultimate journey companion."
  },
  {
    id: 1105,
    name: "Crax Corn Curls Chatpata Masala",
    price: 20,
    mrp: 20,
    discountText: 'Special Price',
    category: 'chips-namkeen',
    subcategories: ['all', 'chips-namkeen'],
    weight: '60 g',
    optionsLabel: 'Single Pack',
    img: 'product_crax.png',
    rating: 5,
    reviews: '2.9 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Crunchy baked corn rings with chatpata seasoning. Light, non-fried and delicious."
  },

  // ── 2. SWEETS & CHOCOLATES ──
  {
    id: 1601,
    name: "Cadbury Dairy Milk Silk Chocolate",
    price: 85,
    mrp: 95,
    discountText: '11% OFF',
    category: 'sweets-chocolates',
    subcategories: ['all', 'sweets-chocolates'],
    weight: '60 g',
    optionsLabel: '2 options',
    options: [
      { weight: '60 g Bar', price: 85, mrp: 95, discount: '11% OFF' },
      { weight: '150 g Silk Roast Almond', price: 175, mrp: 195, discount: '10% OFF' }
    ],
    img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '8.1 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Irresistibly smooth and creamy chocolate made with finest cocoa. Melts gracefully in the mouth."
  },
  {
    id: 1602,
    name: "Bikano Royal Gulab Jamun Tin",
    price: 140,
    mrp: 165,
    discountText: '15% OFF on MRP',
    category: 'sweets-chocolates',
    subcategories: ['all', 'sweets-chocolates'],
    weight: '500 g Tin',
    optionsLabel: 'Sealed Tin',
    img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '3.7 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Mouth-melting soft spongy mawa dumplings soaked in fragrant cardamom rose sugar syrup."
  },
  {
    id: 1603,
    name: "Haldiram's Sponge Rasgulla Tin",
    price: 135,
    mrp: 160,
    discountText: '16% OFF',
    category: 'sweets-chocolates',
    subcategories: ['all', 'sweets-chocolates'],
    weight: '500 g Tin',
    optionsLabel: 'Sealed Tin',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '4.2 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Authentic cottage cheese chenna balls slow-cooked in light sugar syrup for juicy sweetness."
  },
  {
    id: 1604,
    name: "Ferrero Rocher Moments Gift Box",
    price: 199,
    mrp: 249,
    discountText: '20% OFF on MRP',
    category: 'sweets-chocolates',
    subcategories: ['all', 'sweets-chocolates'],
    weight: '16 Pcs (116 g)',
    optionsLabel: 'Gift Box',
    img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '5.8 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Crunchy hazelnut center covered with smooth cocoa cream and crispy wafer shell."
  },

  // ── 3. DRINKS & JUICES ──
  {
    id: 1701,
    name: "Real Fruit Power Alphonso Mango Nectar",
    price: 110,
    mrp: 130,
    discountText: '15% OFF on MRP',
    category: 'drinks-juices',
    subcategories: ['all', 'drinks-juices'],
    weight: '1 L Tetra Pak',
    optionsLabel: 'Chilled Pack',
    img: 'https://images.unsplash.com/photo-1622484214149-6e3e56cb9426?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '7.3 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Rich mango nectar packed with genuine Alphonso mango goodness and vitamin C."
  },
  {
    id: 1702,
    name: "Coca-Cola Original Chilled Bottle",
    price: 40,
    mrp: 45,
    discountText: 'Special Price',
    category: 'drinks-juices',
    subcategories: ['all', 'drinks-juices'],
    weight: '750 ml Pet Bottle',
    optionsLabel: 'Chilled Bottle',
    img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '9.5 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "The crisp, refreshing taste of ice-cold Coca-Cola delivered straight to your train seat."
  },
  {
    id: 1703,
    name: "Bisleri Sealed Packaged Mineral Water",
    price: 20,
    mrp: 20,
    discountText: 'Station Essential',
    category: 'drinks-juices',
    subcategories: ['all', 'drinks-juices'],
    weight: '1 L Bottle',
    optionsLabel: 'Sealed Cap',
    img: 'product_water.png',
    rating: 5,
    reviews: '12.4 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Pure ozonated mineral water with essential minerals and tamper-evident cap seal."
  },
  {
    id: 1704,
    name: "Red Rock Sparkling Energy Drink",
    price: 99,
    mrp: 120,
    discountText: '18% OFF',
    category: 'drinks-juices',
    subcategories: ['all', 'drinks-juices'],
    weight: '250 ml Can',
    optionsLabel: 'Chilled Can',
    img: 'product_redrock.png',
    rating: 5,
    reviews: '2.1 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Electrifying taurine and B-vitamin energy boost for overnight long distance travel."
  },

  // ── 4. TEA, COFFEE & MILK DRINKS ──
  {
    id: 1801,
    name: "Nescafé Classic 100% Pure Instant Coffee Jar",
    price: 160,
    mrp: 190,
    discountText: '16% OFF on MRP',
    category: 'tea-coffee',
    subcategories: ['all', 'tea-coffee'],
    weight: '50 g Glass Jar',
    optionsLabel: 'Glass Jar',
    img: 'product_beanly.png',
    rating: 5,
    reviews: '6.4 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Signature roasted aroma and rich taste crafted from medium-dark roasted Robusta coffee beans."
  },
  {
    id: 1802,
    name: "Tata Tea Premium Desi Masala Chai",
    price: 135,
    mrp: 155,
    discountText: '13% OFF',
    category: 'tea-coffee',
    subcategories: ['all', 'tea-coffee'],
    weight: '250 g Pack',
    optionsLabel: 'Desi Blend',
    img: 'product_tea.png',
    rating: 5,
    reviews: '7.8 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Desh ki Chai! Perfect balance of strong Assam leaf and ginger-cardamom flavor."
  },
  {
    id: 1803,
    name: "Amul Kool Badam Flavoured Milk Can",
    price: 35,
    mrp: 40,
    discountText: 'Chilled Drink',
    category: 'tea-coffee',
    subcategories: ['all', 'tea-coffee'],
    weight: '200 ml Can',
    optionsLabel: 'Chilled Can',
    img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '4.9 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Nutritious sterilized double-toned milk infused with real real crushed badam and saffron."
  },

  // ── 5. INSTANT FOOD ──
  {
    id: 1901,
    name: "Maggi 2-Minute Masala Noodles",
    price: 14,
    mrp: 14,
    discountText: 'Best Seller',
    category: 'instant-food',
    subcategories: ['all', 'instant-food'],
    weight: '70 g Pack',
    optionsLabel: 'Single Pack',
    img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '15.2 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "India's favorite 2-minute instant noodles with the iconic blend of 10 aromatic spices."
  },
  {
    id: 1902,
    name: "McCain Crispy French Fries",
    price: 95,
    mrp: 120,
    discountText: '21% OFF',
    category: 'instant-food',
    subcategories: ['all', 'instant-food'],
    weight: '420 g Frozen Pack',
    optionsLabel: 'Crispy Pack',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '3.1 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Golden crispy potato french fries prepared with prime quality farm potatoes."
  },
  {
    id: 1903,
    name: "Nissin Cup Noodles Spicy Mazedaar",
    price: 45,
    mrp: 50,
    discountText: 'Ready In Cup',
    category: 'instant-food',
    subcategories: ['all', 'instant-food'],
    weight: '70 g Cup',
    optionsLabel: 'Instant Cup',
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '5.2 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Just add hot water! Steaming cup noodles loaded with veggies and rich desi gravy spices."
  },

  // ── 6. SAUCES & SPREADS ──
  {
    id: 2001,
    name: "Nutella Hazelnut & Cocoa Spread",
    price: 210,
    mrp: 245,
    discountText: '14% OFF on MRP',
    category: 'sauces-spreads',
    subcategories: ['all', 'sauces-spreads'],
    weight: '350 g Glass Jar',
    optionsLabel: 'Glass Jar',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '8.4 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Creamy cocoa hazelnut spread made with top quality roasted hazelnuts and skimmed milk."
  },
  {
    id: 2002,
    name: "Kissan Fresh Royal Tomato Ketchup",
    price: 65,
    mrp: 75,
    discountText: '13% OFF',
    category: 'sauces-spreads',
    subcategories: ['all', 'sauces-spreads'],
    weight: '450 g Squeezy Pack',
    optionsLabel: 'Squeezy Spout',
    img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '6.9 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "100% real ripe sun-kissed juicy tomatoes blended into a rich sweet and tangy sauce."
  },

  // ── 7. PAAN CORNER ──
  {
    id: 2101,
    name: "Pass Pass Sweet Fragrant Mouth Freshener",
    price: 20,
    mrp: 20,
    discountText: 'After Meal Special',
    category: 'paan-corner',
    subcategories: ['all', 'paan-corner'],
    weight: '45 g Pouch',
    optionsLabel: 'Pocket Pouch',
    img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '4.8 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Herbal blend of silver-coated cardamom, fennel seeds, dates, and fragrant menthol crystals."
  },
  {
    id: 2102,
    name: "Happydent Wave Mint Sugarfree Chewing Gum",
    price: 25,
    mrp: 30,
    discountText: '17% OFF',
    category: 'paan-corner',
    subcategories: ['all', 'paan-corner'],
    weight: 'Pocket Dispenser',
    optionsLabel: 'Dispenser',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '5.5 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Liquid-filled spearmint core providing immediate oral freshness and sparkling confidence."
  },
  {
    id: 2103,
    name: "Orbit Spearmint Sugarfree Chewing Gum",
    price: 50,
    mrp: 50,
    discountText: 'Pocket Pack',
    category: 'paan-corner',
    subcategories: ['all', 'paan-corner'],
    weight: 'Pack of 14 Dragees',
    optionsLabel: 'Value Pack',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '3.9 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Dentist approved sugarfree chewing gum that cleans teeth and freshens breath after train meals."
  },

  // ── 8. ICE CREAMS & MORE ──
  {
    id: 2201,
    name: "Amul Vanilla Gold Rich Dairy Ice Cream",
    price: 120,
    mrp: 140,
    discountText: '14% OFF on MRP',
    category: 'ice-creams',
    subcategories: ['all', 'ice-creams'],
    weight: '750 ml Tub',
    optionsLabel: 'Insulated Tub',
    img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '8.3 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Real milk and cream vanilla ice cream packed in special cold thermal bag to prevent melting."
  },
  {
    id: 2202,
    name: "Kwality Wall's Cornetto Double Choc",
    price: 40,
    mrp: 45,
    discountText: 'Crispy Cone',
    category: 'ice-creams',
    subcategories: ['all', 'ice-creams'],
    weight: '105 ml Cone',
    optionsLabel: 'Single Cone',
    img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=240&h=240&fit=crop',
    rating: 5,
    reviews: '9.1 lac',
    deliveryTime: '11 mins',
    veg: true,
    description: "Creamy chocolate ice cream in a crunchy wafer cone topped with chocolate sauce and nuts."
  },

  // ── NEWLY LAUNCHED TRAVEL ESSENTIAL KIT ──
  {
    id: 9999,
    name: "RailQuick 3-in-1 Journey Essentials Kit",
    price: 1499,
    mrp: 2499,
    discountText: '40% OFF - NEWLY LAUNCHED',
    category: 'electronics',
    subcategories: ['all', 'electronics'],
    weight: 'PowerBank + ANC Earphones + Neck Pillow',
    optionsLabel: 'Travel Edition',
    img: 'featured_card_1.jpg',
    rating: 5,
    reviews: '4.8 lac',
    deliveryTime: '11 mins',
    veg: false,
    description: "Sleek Matte Black GaN Power Bank (98% LED display), Active Noise Cancelling Earphones, and Memory Foam Neck Pillow. 100% journey ready!"
  }
];

function isTicketConfirmed(pnrData) {
  if (!pnrData || !pnrData.passengerList || pnrData.passengerList.length === 0) return false;
  return pnrData.passengerList.some(p => {
    const status = (p.currentStatus || p.bookingStatus || "").toUpperCase();
    return status.includes("CNF") || status.includes("CONFIRMED");
  });
}

// ===== MOCK DATA GENERATORS =====
function getMockPNRData(pnr) {
  const pnrStr = String(pnr);
  const isUnconfirmed = pnrStr.endsWith('5') || pnrStr.endsWith('0');
  const oddPnr = parseInt(pnrStr.charAt(pnrStr.length - 1), 10) % 2 !== 0;
  const coach = oddPnr ? 'B2' : 'C4';
  const seat = oddPnr ? '45' : '18';
  const berth = oddPnr ? 'UB' : 'WS';
  
  if (isUnconfirmed) {
    return {
      pnrNumber: pnrStr,
      trainNumber: oddPnr ? '12301' : '12424',
      trainName: oddPnr ? 'Rajdhani Express' : 'Vande Bharat Express',
      dateOfJourney: new Date().toLocaleDateString('en-IN'),
      source: 'New Delhi (NDLS)',
      destination: oddPnr ? 'Howrah Junction (HWH)' : 'Dibrugarh (DBRG)',
      reservationClass: oddPnr ? 'AC 3 Tier (3A)' : 'AC Chair Car (CC)',
      chartPrepared: 'Prepared',
      fare: oddPnr ? 1640 : 1250,
      passengerList: [{ serialNumber: 'Passenger 1', bookingStatus: 'WL / 15', currentStatus: 'WL / 12', coach: '—', berth: '—', berthCode: '—' }]
    };
  }

  return {
    pnrNumber: pnrStr,
    trainNumber: oddPnr ? '12301' : '12424',
    trainName: oddPnr ? 'Rajdhani Express' : 'Vande Bharat Express',
    dateOfJourney: new Date().toLocaleDateString('en-IN'),
    source: 'New Delhi (NDLS)',
    destination: oddPnr ? 'Howrah Junction (HWH)' : 'Dibrugarh (DBRG)',
    reservationClass: oddPnr ? 'AC 3 Tier (3A)' : 'AC Chair Car (CC)',
    chartPrepared: 'Prepared',
    fare: oddPnr ? 1640 : 1250,
    passengerList: [{ serialNumber: 'Passenger 1', bookingStatus: `CNF / ${coach} / ${seat} / ${berth}`, currentStatus: `CNF / ${coach} / ${seat} / ${berth}`, coach, berth: seat, berthCode: berth }]
  };
}

function getMockLiveStatus(trainNo, routeInfo = null) {
  if (routeInfo && Array.isArray(routeInfo.route) && routeInfo.route.length) {
    const stations = routeInfo.route;
    const currentIdx = Math.max(0, Math.floor(stations.length * 0.65));
    const timeline = stations.map((s, idx) => ({
      stationName: s.stnName || s.stationName || s.name || 'Station',
      stationCode: s.stnCode || s.stationCode || s.code || 'STN',
      type: 'stoppage',
      status: idx < currentIdx ? 'passed' : idx === currentIdx ? 'current' : 'upcoming',
      platform: s.platform || '1',
      arrival: { actual: s.arrival || s.arr || '—', scheduled: s.arrival || s.arr || '—' },
      departure: { actual: s.departure || s.dep || '—', scheduled: s.departure || s.dep || '—' }
    }));
    const cur = timeline[currentIdx];
    return { trainNo: routeInfo.trainInfo?.train_no || trainNo, trainName: routeInfo.trainInfo?.train_name || `Train ${trainNo}`, lastUpdate: 'Just now', statusNote: `Departed from ${cur.stationName}(${cur.stationCode})`, currentStationCode: cur.stationCode, timeline };
  }

  const rajdhani = trainNo === '12301';
  const timeline = rajdhani ? [
    ['Howrah Jn', 'HWH', 'passed', '16:50', '9'], ['Asansol Jn', 'ASN', 'passed', '18:47', '4'], ['Dhanbad Jn', 'DHN', 'passed', '19:55', '3'], ['Gaya Jn', 'GAYA', 'passed', '22:32', '1'], ['Prayagraj Jn', 'PRYJ', 'passed', '02:40', '6'], ['Kanpur Central', 'CNB', 'current', '05:08', '1'], ['New Delhi', 'NDLS', 'upcoming', '10:05', '14']
  ] : [
    ['New Delhi', 'NDLS', 'passed', '16:10', '16'], ['Kanpur Central', 'CNB', 'passed', '21:02', '1'], ['Prayagraj Jn', 'PRYJ', 'passed', '23:08', '6'], ['Patna Jn', 'PNBE', 'current', '21:30', '1'], ['Guwahati', 'GHY', 'upcoming', '12:40', '1'], ['Dibrugarh', 'DBRG', 'upcoming', '20:15', '1']
  ];
  return {
    trainNo: trainNo || (rajdhani ? '12301' : '12424'),
    trainName: rajdhani ? 'Howrah - New Delhi Rajdhani Express' : 'New Delhi - Dibrugarh Rajdhani Express',
    lastUpdate: 'Just now',
    statusNote: rajdhani ? 'Departed from KANPUR CENTRAL(CNB) at 05:18 (28 mins late)' : 'Departed from PATNA JN(PNBE) at 21:40 (10 mins late)',
    currentStationCode: rajdhani ? 'CNB' : 'PNBE',
    timeline: timeline.map(([stationName, stationCode, status, time, platform]) => ({ stationName, stationCode, type: 'stoppage', status, arrival: { actual: time, scheduled: time }, departure: { actual: time, scheduled: time }, platform }))
  };
}

function getMockTrainSchedule(query) {
  return {
    trainInfo: { train_name: 'New Delhi Express', train_no: query || '12002', from_stn_name: 'NDLS', to_stn_name: 'KLK', travel_time: '4h 15m' },
    route: [
      { stationName: 'New Delhi', stationCode: 'NDLS', arrival: 'Source', departure: '07:40' },
      { stationName: 'Panipat Junction', stationCode: 'PNP', arrival: '08:50', departure: '08:52' },
      { stationName: 'Ambala Cantt', stationCode: 'UMB', arrival: '10:05', departure: '10:07' },
      { stationName: 'Chandigarh', stationCode: 'CDG', arrival: '11:00', departure: '11:05' },
      { stationName: 'Kalka', stationCode: 'KLK', arrival: '11:55', departure: 'Destination' }
    ]
  };
}

// ===== STATE STORAGE =====
function loadState() {
  try {
    const defaultUser = {
      name: 'Your account',
      phone: '8826387844',
      email: 'kartik.railquick@gmail.com',
      avatarUrl: ''
    };
    const saved = localStorage.getItem('railquick_state');
    if (!saved) {
      appState.currentPage = 'page-pnr';
      appState.hasOnboarded = false;
      appState.user = defaultUser;
      appState.favorites = [];
      return;
    }
    const p = JSON.parse(saved);
    appState.user = p.user || defaultUser;
    if (!appState.user.name) appState.user.name = 'Your account';
    if (!appState.user.phone) appState.user.phone = '8826387844';
    if (!appState.user.email) appState.user.email = 'kartik.railquick@gmail.com';
    appState.cart = Array.isArray(p.cart) ? p.cart : [];
    appState.orders = Array.isArray(p.orders) ? p.orders : [];
    appState.pnrData = p.pnrData || {
      trainNumber: '12301',
      trainName: 'Rajdhani Express',
      source: 'New Delhi (NDLS)',
      destination: 'Howrah Jn (HWH)',
      passengerList: [{ coach: 'B2', berth: '45', currentStatus: 'CNF' }]
    };
    appState.pnrLiveData = p.pnrLiveData || null;
    appState.isPnrConfirmed = true;
    appState.currentPage = 'page-pnr';
    appState.hasOnboarded = false;
    appState.favorites = Array.isArray(p.favorites) ? p.favorites : [];
    appState.themeMode = 'dark';
  } catch(e) {}
}

function saveState() {
  try {
    localStorage.setItem('railquick_state', JSON.stringify({ 
      user: appState.user, 
      cart: appState.cart, 
      orders: appState.orders, 
      pnrData: appState.pnrData, 
      pnrLiveData: appState.pnrLiveData,
      isPnrConfirmed: appState.isPnrConfirmed,
      currentPage: appState.currentPage,
      hasOnboarded: appState.hasOnboarded,
      favorites: appState.favorites,
      themeMode: 'dark'
    }));
    if (appState.user && appState.user.clerkId) {
      localStorage.setItem(`railquick_orders_${appState.user.clerkId}`, JSON.stringify(appState.orders));
      if (appState.user.phone) {
        localStorage.setItem(`railquick_phone_${appState.user.clerkId}`, appState.user.phone);
      }
    }
  } catch(e) {}
}

// ===== NAVIGATION =====
function navigateTo(pageId) {
  // Allow direct navigation to page-pnr always (both PNR check and Live train tabs live there)
  const current = document.getElementById(appState.currentPage);
  const target = document.getElementById(pageId);
  if (!target || pageId === appState.currentPage) return;
  if (current) {
    current.classList.remove('active');
    current.classList.add('slide-out');
    setTimeout(() => current.classList.remove('slide-out'), 400);
  }
  target.classList.add('active');
  appState.currentPage = pageId;
  saveState();
  if (pageId === 'page-shop') initShopPage();
  if (pageId === 'page-cart') initCartPage();
  if (pageId === 'page-pnr') initPnrPage();
  if (pageId === 'page-live-tracking') initLiveTrackingPage();
  if (pageId === 'page-orders') initOrdersPage();
  if (pageId === 'page-account') initAccountPage();
  if (pageId === 'page-checkout') initCheckoutPage();
  if (pageId === 'page-track-order') initTrackOrderPage();
  const continueBar = document.getElementById('continue-bar');
  if (continueBar && pageId !== 'page-pnr') continueBar.classList.add('hidden');
  updateCartFAB();
  updateBottomNav(pageId);
}

function completeOnboarding() { 
  appState.hasOnboarded = true; 
  saveState();
  navigateTo('page-shop'); 
}

function goToLiveStatusFromHome() {
  appState.hasOnboarded = true;
  saveState();
  navigateTo('page-pnr');
}

// ===== PNR & LIVE STATUS FLOWS =====
function switchPNRTab(tab) {
  const panelPnr = document.getElementById('panel-pnr');
  const panelLive = document.getElementById('panel-live');
  if (panelPnr) {
    panelPnr.style.display = (tab === 'pnr') ? '' : 'none';
    panelPnr.classList.toggle('hidden', tab !== 'pnr');
  }
  if (panelLive) {
    panelLive.style.display = (tab === 'live') ? '' : 'none';
    panelLive.classList.toggle('hidden', tab !== 'live');
  }
  document.getElementById('travel-utility-section')?.classList.toggle('hidden', tab === 'live');
  const tabPnrBtn = document.getElementById('tab-pnr');
  const tabLiveBtn = document.getElementById('tab-live');
  if (!tabPnrBtn || !tabLiveBtn) return;
  
  const indicator = document.getElementById('pnr-tab-indicator');
  
  if (tab === 'pnr') {
    tabPnrBtn.className = 'relative z-10 flex-1 h-9 flex items-center justify-center text-[12px] font-semibold text-white transition-all duration-300 rounded-lg focus:outline-none';
    tabLiveBtn.className = 'relative z-10 flex-1 h-9 flex items-center justify-center text-[12px] font-medium text-[#6B7280] hover:text-[#118A4E] transition-all duration-300 rounded-lg focus:outline-none';
    if (indicator) {
      indicator.style.transform = 'translateX(0)';
    }
  } else {
    tabLiveBtn.className = 'relative z-10 flex-1 h-9 flex items-center justify-center text-[12px] font-semibold text-white transition-all duration-300 rounded-lg focus:outline-none';
    tabPnrBtn.className = 'relative z-10 flex-1 h-9 flex items-center justify-center text-[12px] font-medium text-[#6B7280] hover:text-[#118A4E] transition-all duration-300 rounded-lg focus:outline-none';
    if (indicator) {
      indicator.style.transform = 'translateX(calc(100% + 6px))';
    }
  }
  const results = document.getElementById('pnr-results');
  if (results) { results.classList.add('hidden'); results.innerHTML = ''; }
}

function validatePNR(input) { input.value = input.value.slice(0, 10); }

function validateApiResponse(data) {
  if (!data || !data.success || !data.data) throw new Error(data?.error || 'Failed to fetch data');
  let payload = data.data;
  if (payload.success !== undefined && payload.data !== undefined) {
    if (payload.success === false || payload.error) throw new Error(payload.error || 'No data found');
    payload = payload.data;
  }
  if (payload.success === false || payload.error) throw new Error(payload.error || 'No data found');
  return payload;
}

function hasTrainReachedDestination(pnrData, liveData) {
  if (!pnrData || !liveData?.timeline?.length) return false;
  
  const destMatch = pnrData.destination.match(/\(([^)]+)\)/);
  if (!destMatch) return false;
  const destCode = destMatch[1].toUpperCase();

  const destStop = liveData.timeline.find(s => s.stationCode && s.stationCode.toUpperCase() === destCode);
  if (!destStop) return false;

  const destIndex = liveData.timeline.indexOf(destStop);

  const currentStnCode = liveData.currentStationCode;
  const currentStop = liveData.timeline.find(s => 
    s.status === 'current' || 
    (s.stationCode && currentStnCode && s.stationCode.toUpperCase() === currentStnCode.toUpperCase())
  );
  
  if (currentStop) {
    const currentIndex = liveData.timeline.indexOf(currentStop);
    if (currentIndex >= destIndex) {
      return true;
    }
  }

  if (destStop.status === 'departed' || destStop.status === 'current') {
    return true; 
  }

  return false;
}

async function checkPNRStatus() {
  const pnr = document.getElementById('pnr-input').value.trim();
  if (pnr.length !== 10 || !/^\d+$/.test(pnr)) { 
    showToast('Please enter a valid 10-digit numeric PNR', 'warning'); 
    return; 
  }
  
  if (pnr.startsWith('000') || pnr === '9999999999' || pnr.startsWith('123456')) {
    showToast('Invalid PNR Number. Please check your ticket and try again.', 'error');
    return;
  }
  
  showLoading('Verifying PNR booking segment...');
  try {
    const resp = await fetch(`/api/pnr/${pnr}`);
    const data = await resp.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Invalid PNR number');
    }
    
    const d = validateApiResponse(data);
    const mapped = {
      pnrNumber: d.pnr,
      trainNumber: d.train?.number || '—',
      trainName: d.train?.name || 'Train',
      dateOfJourney: d.journey?.dateOfJourney || '—',
      source: `${d.journey?.source?.name || '—'} (${d.journey?.source?.code || ''})`,
      destination: `${d.journey?.destination?.name || '—'} (${d.journey?.destination?.code || ''})`,
      reservationClass: d.journey?.class || '—', chartPrepared: d.chart?.status || '—', fare: d.booking?.fare || null,
      passengerList: (d.passengers || []).map(p => ({ serialNumber: p.serialNumber || 'Passenger', bookingStatus: p.booking?.details || '—', currentStatus: p.current?.details || '—', coach: p.current?.coach || p.booking?.coach || '', berth: p.current?.berthNo || p.booking?.berthNo || '', berthCode: p.current?.berthCode || p.booking?.berthCode || '' }))
    };
    
    let liveData = null;
    if (mapped.trainNumber && mapped.trainNumber !== '—') {
      try {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
        const liveResp = await fetch(`/api/track-train/${mapped.trainNumber}/${dateStr}`);
        const liveJson = await liveResp.json();
        if (liveJson?.success && liveJson.data) liveData = validateApiResponse(liveJson);
      } catch(e) { console.warn('Failed to fetch live train position for PNR:', e.message); }
    }
    if (!liveData && mapped.trainNumber) liveData = getMockLiveStatus(mapped.trainNumber);
    
    // bypassed destination restriction
    /*
    if (hasTrainReachedDestination(mapped, liveData)) {
      hideLoading();
      showToast('Cannot enter app: Train has already reached your destination.', 'error');
      return;
    }
    */
    
    appState.pnrData = mapped; 
    appState.pnrLiveData = liveData; 
    
    const isConfirmed = isTicketConfirmed(mapped);
    if (isConfirmed) {
      appState.isPnrConfirmed = true;
      appState.hasOnboarded = true;
      saveState();
      hideLoading(); 
      renderPNRResult(mapped);
      updateShopTopbar(); 
      showToast('Ticket verified! You can now browse the shop.', 'success');
      
      // Show sticky bottom continue bar
      const bar = document.getElementById('continue-bar');
      if (bar) {
        const info = document.getElementById('train-info-mini');
        let seatDesc = '';
        if (mapped.passengerList && mapped.passengerList.length > 0) {
          const p = mapped.passengerList[0];
          seatDesc = p.coach ? `Seat ${p.coach}, ${p.berth || ''}` : 'Seat Assigned';
        } else {
          seatDesc = 'Onboard seat-side delivery';
        }
        if (info) {
          info.innerHTML = `<strong class="text-sm text-primary">${mapped.trainName || 'Train'}</strong><span class="text-xs text-secondary font-bold">${seatDesc}</span>`;
        }
        bar.classList.remove('hidden');
      }
    } else {
      appState.isPnrConfirmed = false;
      appState.hasOnboarded = true;
      saveState();
      hideLoading();
      renderUnconfirmedPNRResult(mapped);
      showToast('Waitlisted PNR verified! Seat-side delivery requires confirmation.', 'warning');
      
      // Show sticky bottom continue bar
      const bar = document.getElementById('continue-bar');
      if (bar) {
        const info = document.getElementById('train-info-mini');
        if (info) {
          info.innerHTML = `<strong class="text-sm text-primary">${mapped.trainName || 'Train'}</strong><span class="text-xs text-amber-650 font-bold">Waitlisted (Requires Confirmation)</span>`;
        }
        bar.classList.remove('hidden');
      }
    }
  } catch (err) {
    console.warn('API Offline, running fallback mock:', err.message);
    const mock = getMockPNRData(pnr);
    const liveData = getMockLiveStatus(mock.trainNumber);
    
    // bypassed destination restriction
    /*
    if (hasTrainReachedDestination(mock, liveData)) {
      hideLoading();
      showToast('Cannot enter app: Train has already reached your destination.', 'error');
      return;
    }
    */
    
    appState.pnrData = mock; 
    appState.pnrLiveData = liveData; 
    
    const isConfirmed = isTicketConfirmed(mock);
    if (isConfirmed) {
      appState.isPnrConfirmed = true;
      appState.hasOnboarded = true;
      saveState();
      hideLoading(); 
      renderPNRResult(mock);
      updateShopTopbar(); 
      showToast('Ticket verified! You can now browse the shop.', 'success');
      
      // Show sticky bottom continue bar
      const bar = document.getElementById('continue-bar');
      if (bar) {
        const info = document.getElementById('train-info-mini');
        let seatDesc = '';
        if (mock.passengerList && mock.passengerList.length > 0) {
          const p = mock.passengerList[0];
          seatDesc = p.coach ? `Seat ${p.coach}, ${p.berth || ''}` : 'Seat Assigned';
        } else {
          seatDesc = 'Onboard seat-side delivery';
        }
        if (info) {
          info.innerHTML = `<strong class="text-sm text-primary">${mock.trainName || 'Train'}</strong><span class="text-xs text-secondary font-bold">${seatDesc}</span>`;
        }
        bar.classList.remove('hidden');
      }
    } else {
      appState.isPnrConfirmed = false;
      appState.hasOnboarded = true;
      saveState();
      hideLoading();
      renderUnconfirmedPNRResult(mock);
      showToast('Waitlisted PNR verified! Seat-side delivery requires confirmation.', 'warning');
      
      // Show sticky bottom continue bar
      const bar = document.getElementById('continue-bar');
      if (bar) {
        const info = document.getElementById('train-info-mini');
        if (info) {
          info.innerHTML = `<strong class="text-sm text-primary">${mock.trainName || 'Train'}</strong><span class="text-xs text-amber-650 font-bold">Waitlisted (Requires Confirmation)</span>`;
        }
        bar.classList.remove('hidden');
      }
    }
  }
}

function getCurrentStationIndex(liveData) {
  if (!liveData?.timeline?.length) return -1;
  let idx = liveData.timeline.findIndex(x => x.status === 'current');
  if (idx === -1) idx = liveData.timeline.findIndex(x => x.stationCode === liveData.currentStationCode);
  return idx;
}

function getStationNodeClass(liveData, station, idx) {
  if (station.status) return station.status;
  const curIdx = getCurrentStationIndex(liveData);
  if (curIdx === -1) return 'upcoming';
  if (idx < curIdx) return 'passed';
  if (idx === curIdx) return 'current';
  return 'upcoming';
}

function getLiveProgressPercent(liveData) {
  const total = liveData?.timeline?.length || 0;
  const curIdx = getCurrentStationIndex(liveData);
  if (total <= 1 || curIdx < 0) return 0;
  return Math.max(5, Math.min(96, Math.round((curIdx / (total - 1)) * 100)));
}

function formatStationTime(station) {
  return station.arrival?.actual || station.arrival?.scheduled || station.departure?.actual || station.departure?.scheduled || '—';
}

function getHaltMinutes(station) {
  if (station.halt) return station.halt;
  try {
    const arrTimeStr = station.arrival?.scheduled || station.arrival?.actual;
    const depTimeStr = station.departure?.scheduled || station.departure?.actual;
    if (!arrTimeStr || !depTimeStr || arrTimeStr === 'SRC' || depTimeStr === 'DST') return '';
    
    const parseTime = (str) => {
      const match = str.match(/(\d{2}):(\d{2})/);
      if (!match) return null;
      return { hrs: parseInt(match[1]), mins: parseInt(match[2]) };
    };
    
    const arr = parseTime(arrTimeStr);
    const dep = parseTime(depTimeStr);
    if (!arr || !dep) return '';
    
    let arrMinutes = arr.hrs * 60 + arr.mins;
    let depMinutes = dep.hrs * 60 + dep.mins;
    
    if (depMinutes < arrMinutes) {
      depMinutes += 24 * 60;
    }
    
    const diff = depMinutes - arrMinutes;
    return diff > 0 ? `${diff} min` : '';
  } catch (e) {
    return '';
  }
}

function formatStoppageTimes(s) {
  let arr = s.arrival?.actual || s.arrival?.scheduled || s.arrival || '';
  let dep = s.departure?.actual || s.departure?.scheduled || s.departure || '';
  
  if (typeof arr === 'object') arr = '';
  if (typeof dep === 'object') dep = '';
  
  arr = String(arr).trim();
  dep = String(dep).trim();

  // Strip date suffix if present (e.g. "10:05 05-Jul" -> "10:05")
  if (arr.includes(' ')) arr = arr.split(' ')[0];
  if (dep.includes(' ')) dep = dep.split(' ')[0];

  const isArrEmpty = !arr || arr === '--' || arr.toLowerCase().includes('src');
  const isDepEmpty = !dep || dep === '--' || dep.toLowerCase().includes('dst');

  if (isArrEmpty) {
    return `<div class="text-right shrink-0"><span class="text-[8px] uppercase tracking-widest font-black text-slate-400 block mb-0.5">Departure</span><span class="font-mono text-[11px] font-black text-slate-900">${dep || '—'}</span></div>`;
  }
  if (isDepEmpty) {
    return `<div class="text-right shrink-0"><span class="text-[8px] uppercase tracking-widest font-black text-slate-400 block mb-0.5">Arrival</span><span class="font-mono text-[11px] font-black text-slate-900">${arr || '—'}</span></div>`;
  }
  return `
    <div class="text-right shrink-0 flex gap-2.5 justify-end items-center">
      <div>
        <span class="text-[7px] uppercase tracking-widest font-black text-slate-400 block mb-0.5">Arr</span>
        <span class="font-mono text-[11px] font-black text-slate-900">${arr}</span>
      </div>
      <div class="h-5 w-[1px] bg-slate-200"></div>
      <div>
        <span class="text-[7px] uppercase tracking-widest font-black text-slate-400 block mb-0.5">Dep</span>
        <span class="font-mono text-[11px] font-black text-slate-900">${dep}</span>
      </div>
    </div>
  `;
}

function expandPassedStations() {
  const trigger = document.getElementById('passed-stations-trigger');
  const content = document.getElementById('passed-stations-content');
  if (trigger && content) {
    trigger.classList.add('hidden');
    content.classList.remove('hidden');
    content.classList.add('fade-in-item');
  }
}

function expandUpcomingStations() {
  const trigger = document.getElementById('upcoming-stations-trigger');
  const content = document.getElementById('upcoming-stations-content');
  if (trigger && content) {
    trigger.classList.add('hidden');
    content.classList.remove('hidden');
    content.classList.add('fade-in-item');
  }
}

function buildPremiumStationTimelineHTML(liveData, statusNote, isDelayed) {
  const rawTimeline = liveData.timeline || [];
  
  // Find the current station code
  const currentStnCode = liveData.currentStationCode;
  
  // Filter timeline: keep stoppages, or any station that has scheduled times, or the current station itself
  const timeline = rawTimeline.filter(s => {
    const isStoppage = s.type === 'stoppage' || s.stoppage === true;
    const hasTimes = s.arrival?.scheduled || s.departure?.scheduled || s.arrival || s.departure;
    const isCurrent = s.status === 'current' || 
                     (s.stationCode && currentStnCode && s.stationCode.toUpperCase() === currentStnCode.toUpperCase());
    return isStoppage || (hasTimes && s.stationCode !== '—') || isCurrent;
  });

  // Find index in the filtered timeline
  let currentIdx = timeline.findIndex(x => 
    x.status === 'current' ||
    (x.stationCode && currentStnCode && x.stationCode.toUpperCase() === currentStnCode.toUpperCase())
  );

  if (currentIdx === -1) {
    // If yet to start, the first station is current
    if (statusNote && statusNote.toLowerCase().includes('yet to start')) {
      currentIdx = 0;
    }
  }
  
  const htmlList = timeline.map((s, idx) => {
    // Determine node class based on filtered index or s.status
    let nodeClass = s.status || 'upcoming';
    if (currentIdx !== -1) {
      if (idx < currentIdx) nodeClass = 'passed';
      else if (idx === currentIdx) nodeClass = 'current';
      else nodeClass = 'upcoming';
    } else {
      const isCompleted = statusNote && (statusNote.toLowerCase().includes('completed') || statusNote.toLowerCase().includes('arrived at destination'));
      if (isCompleted) {
        nodeClass = 'passed';
      } else {
        nodeClass = s.status || 'upcoming';
      }
    }
    
    const timesHTML = formatStoppageTimes(s);
    const isCurrent = nodeClass === 'current';
    const delayText = isCurrent ? `<div class="mt-2.5 text-[10px] font-bold ${isDelayed ? 'text-amber-700 animate-pulse' : 'text-primary'}">${statusNote}</div>` : '';
    const markerIcon = isCurrent 
      ? '<span class="material-symbols-outlined text-[12px] fill-1 animate-pulse">train</span>' 
      : (nodeClass === 'passed' 
          ? '<span class="material-symbols-outlined text-[11px] font-black">check</span>' 
          : '<span class="material-symbols-outlined text-[11px]">radio_button_unchecked</span>');
    const currentBadge = isCurrent ? `<span class="you-are-here-badge bg-blue-50 text-blue-600 border border-blue-100"><span class="material-symbols-outlined text-[11px] fill-1 animate-pulse">train</span>Train is here</span>` : '';
    const halt = getHaltMinutes(s);
    const haltText = halt ? `<span class="inline-flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md"><span class="material-symbols-outlined text-[10px]">pause_circle</span>Halt ${halt}</span>` : '';
    
    // Determine blur/low-opacity classes (Disabled to keep timeline fully visible)
    let blurClass = '';
    
    return `
      <div class="live-station-node ${nodeClass} ${blurClass} ${isCurrent ? 'current-active-node' : ''}" style="animation-delay:${Math.min(idx * 30, 300)}ms" onclick="handleStationNodeClick(this)">
        <div class="live-node-marker">${markerIcon}</div>
        <div class="live-station-card"><div class="flex justify-between gap-3 items-center">
          <div class="min-w-0"><div class="flex flex-wrap items-center gap-1.5 mb-1"><h5 class="text-[12px] font-black ${isCurrent ? 'text-blue-600' : 'text-slate-800'} truncate max-w-[140px]">${s.stationName}</h5><span class="text-[9px] font-mono font-black text-slate-500 bg-slate-100 rounded-md px-1.5 py-0.5">${s.stationCode || '—'}</span></div>${currentBadge}<div class="flex items-center gap-1.5 mt-2 text-[9px] text-slate-500 font-semibold"><span class="inline-flex items-center gap-0.5"><span class="material-symbols-outlined text-[11px]">layers</span>PF ${s.platform || '—'}</span>${haltText}<span class="inline-flex items-center gap-0.5"><span class="material-symbols-outlined text-[11px]">schedule</span>${nodeClass === 'passed' ? 'Departed' : isCurrent ? 'Current stop' : 'Upcoming'}</span></div>${delayText}</div>
          ${timesHTML}
        </div></div>
      </div>`;
  });

  // Wrap list inside an id-tagged div
  let finalHTML = `<div id="timeline-list" class="space-y-0.5 relative">${htmlList.join('')}</div>`;
  
  return finalHTML;
}

function togglePastStationsReveal(event) {
  if (event) event.stopPropagation();
  const list = document.getElementById('timeline-list');
  if (list) list.classList.toggle('reveal-past');
}

function toggleUpcomingStationsReveal(event) {
  if (event) event.stopPropagation();
  const list = document.getElementById('timeline-list');
  if (list) list.classList.toggle('reveal-upcoming');
}

function handleStationNodeClick(element) {
  if (element.classList.contains('station-past-blur')) {
    togglePastStationsReveal();
  } else if (element.classList.contains('station-upcoming-blur')) {
    toggleUpcomingStationsReveal();
  }
}

function generateTimelineContainerHTML(d, statusNote, isDelayed, timelineHTML) {
  const timeline = d.timeline || [];
  const curIdx = getCurrentStationIndex(d);
  const current = curIdx >= 0 ? timeline[curIdx] : null;
  const previous = curIdx > 0 ? timeline[curIdx - 1] : null;
  const next = curIdx >= 0 && curIdx < timeline.length - 1 ? timeline[curIdx + 1] : null;
  const progress = getLiveProgressPercent(d);
  const stateText = isDelayed ? 'Running Late' : 'On Schedule';
  const stateClass = isDelayed ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
  
  const trainNo = d.trainNo || d.trainNumber || '';
  const trainName = d.trainName || 'Express Train';

  return `
    <div class="space-y-5 animate-scale-in">
      <!-- Premium Back Button Capsule -->
      <button onclick="goBackToSearch()" class="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 transition-colors font-headline font-black text-[9px] uppercase tracking-widest focus:outline-none bg-emerald-50 border border-emerald-100/50 px-3.5 py-1.5 rounded-full select-none mb-1">
        <span class="material-symbols-outlined text-[11px] font-bold">arrow_back</span>
        Search Another Train
      </button>

      <div class="live-hero-map p-5 rounded-[2rem] shadow-premium">
        <div class="relative z-10 flex items-start justify-between gap-3 mb-5">
          <div class="min-w-0">
            <!-- Train Details Header Badge -->
            <div class="bg-white/15 px-2.5 py-1 rounded-lg flex items-center gap-1.5 mb-3 max-w-fit border border-white/5 shadow-sm">
              <span class="material-symbols-outlined text-[12px] text-emerald-300">train</span>
              <span class="text-[9px] font-black text-white uppercase tracking-wider">${trainNo} - ${trainName}</span>
            </div>
            
            <div class="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-350 mb-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Live Railway Position
            </div>
            <h4 class="text-base font-headline font-black leading-tight truncate text-white">${current ? `${current.stationName} (${current.stationCode})` : 'Live Train'}</h4>
            <p class="text-[11px] text-white/75 font-semibold mt-1 leading-relaxed">${statusNote}</p>
          </div>
          <span class="shrink-0 border text-[9px] font-black px-2.5 py-1 rounded-full ${stateClass}">${stateText}</span>
        </div>
        
        <div class="relative z-10">
          <div class="flex justify-between items-center text-[10px] font-bold text-white/75 mb-2">
            <span class="truncate max-w-[38%]">${previous ? previous.stationName : 'Origin'}</span>
            <span class="text-emerald-250">${progress}% Journey Completed</span>
            <span class="truncate max-w-[38%] text-right">${next ? next.stationName : 'Destination'}</span>
          </div>
          <div class="live-progress-track relative h-4 bg-white/25 rounded-full overflow-hidden flex items-center justify-center">
            <div class="live-progress-fill absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-450 to-emerald-300 transition-all duration-500" style="width:${progress}%"></div>
            <span class="relative z-10 text-[9px] font-black text-white uppercase tracking-wider">${progress}%</span>
          </div>
          <div class="flex justify-between items-center mt-3 text-[9px] font-mono text-white/70">
            <span>${curIdx >= 0 ? curIdx + 1 : 0}/${timeline.length || '—'} stations covered</span>
            <span>Next ETA ${next ? (next.arrival?.scheduled || next.arrival?.actual || '—') : 'Arriving'}</span>
          </div>
        </div>
      </div>
      
      <div class="py-2 px-1">
        <div class="flex items-center justify-between mb-4 px-2">
          <div>
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Station Timeline</div>
            <div class="text-[11px] text-slate-500 font-semibold mt-0.5">Real-time route and station progress</div>
          </div>
          <span class="material-symbols-outlined text-primary text-[20px]">route</span>
        </div>
        <div class="live-station-list">${timelineHTML}</div>
      </div>
    </div>`;
}

function renderJourneyDashboard(containerId, pnrData, liveData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Hide the search card and bottom utilities grid so results take over the screen
  const searchCard = document.getElementById('pnr-search-card');
  if (searchCard) searchCard.classList.add('hidden');
  const botUtils = document.getElementById('travel-utility-section');
  if (botUtils && containerId === 'pnr-results') botUtils.classList.add('hidden');

  const trainNo = pnrData?.trainNumber || liveData?.trainNo || '—';
  const trainName = pnrData?.trainName || liveData?.trainName || 'Express Train';
  const statusNote = liveData?.statusNote || 'Running';
  const isDelayed = statusNote.toLowerCase().includes('late') || statusNote.toLowerCase().includes('delay');
  
  // Passenger Info mapping
  let paxHTML = '';
  let coachSeatTitle = 'Onboard Delivery';
  if (pnrData?.passengerList && pnrData.passengerList.length > 0) {
    paxHTML = pnrData.passengerList.map(p => `
      <div class="flex justify-between items-center bg-slate-50 border border-slate-200/50 rounded-2xl px-4 py-3 text-xs shadow-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-slate-400 text-sm">person</span>
          <span class="font-bold text-slate-800">${p.serialNumber}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] font-black font-mono uppercase px-2.5 py-0.5 rounded-lg border ${p.currentStatus.includes('CNF') || p.currentStatus.includes('CONFIRMED') ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-100'}">
            ${p.currentStatus}
          </span>
          ${p.coach ? `<span class="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-lg text-[9.5px] font-mono font-black">${p.coach} / Seat ${p.berth}</span>` : ''}
        </div>
      </div>
    `).join('');
    
    const p0 = pnrData.passengerList[0];
    if (p0 && p0.coach) {
      coachSeatTitle = `Coach ${p0.coach}, Seat ${p0.berth}`;
    }
  }

  // Live stations timeline calculations
  const rawTimeline = liveData?.timeline || [];
  const currentStnCode = liveData?.currentStationCode;
  
  const timeline = rawTimeline.filter(s => {
    const isStoppage = s.type === 'stoppage' || s.stoppage === true;
    const hasTimes = s.arrival?.scheduled || s.departure?.scheduled || s.arrival || s.departure;
    const isCurrent = s.status === 'current' || 
                     (s.stationCode && currentStnCode && s.stationCode.toUpperCase() === currentStnCode.toUpperCase());
    return isStoppage || (hasTimes && s.stationCode !== '—') || isCurrent;
  });

  let currentIdx = timeline.findIndex(x => 
    x.status === 'current' ||
    (x.stationCode && currentStnCode && x.stationCode.toUpperCase() === currentStnCode.toUpperCase())
  );
  if (currentIdx === -1 && statusNote.toLowerCase().includes('yet to start')) {
    currentIdx = 0;
  }

  const current = currentIdx >= 0 ? timeline[currentIdx] : null;
  const previous = currentIdx > 0 ? timeline[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < timeline.length - 1 ? timeline[currentIdx + 1] : null;
  const progress = getLiveProgressPercent(liveData || { timeline });
  
  const stateText = isDelayed ? 'Running Late' : 'On Schedule';
  const stateClass = isDelayed ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';

  const timelineHTML = buildPremiumStationTimelineHTML(liveData || { timeline }, statusNote, isDelayed);

  // Horizontally scrollable product carousels
  const beveragesHTML = getCarouselHTML('Snacks & Beverages', 'Refreshments on train', 'beverages');
  const comfortHTML = getCarouselHTML('Travel Comfort Essentials', 'Pillows, sleep masks & kits', 'comfort');
  const hygieneHTML = getCarouselHTML('Hygiene & Tech Accessories', 'Sanitizers, wipes & chargers', 'hygiene_tech');

  container.innerHTML = `
    <div class="space-y-6 animate-scale-in">
      <!-- 1. Beautiful Journey Summary Card at the Top -->
      <div class="rounded-[2.5rem] bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-800/40 p-5 text-white relative overflow-hidden shadow-xl">
        <div class="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-28 h-28 bg-secondary/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <!-- Premium Back Button Capsule -->
        <button onclick="goBackToSearch()" class="flex items-center gap-1.5 text-emerald-300 hover:text-white mb-4 transition-colors font-headline font-black text-[9px] uppercase tracking-widest focus:outline-none relative z-20 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full select-none">
          <span class="material-symbols-outlined text-[12px] font-bold">arrow_back</span>
          Search Another PNR / Train
        </button>
        
        <div class="flex justify-between items-start mb-4 relative z-10">
          <div class="min-w-0">
            <!-- Train Details Header Badge -->
            <div class="bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 mb-2 max-w-fit border border-white/5 shadow-sm">
              <span class="material-symbols-outlined text-[12px] text-emerald-300">train</span>
              <span class="text-[9px] font-black text-white uppercase tracking-wider">${trainNo} · ${trainName}</span>
            </div>
            
            <div class="inline-flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.18em] text-emerald-300">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              GPS Satellite Live Tracking
            </div>
          </div>
          <span class="shrink-0 border text-[9px] font-black px-2.5 py-1 rounded-full ${stateClass}">${stateText}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 py-3.5 border-t border-b border-white/10 mb-4 relative z-10">
          <div>
            <span class="text-[8px] font-black text-white/45 uppercase tracking-wider block">Boarding Station</span>
            <div class="text-[11px] font-bold text-white truncate">${pnrData?.source || (timeline[0] ? `${timeline[0].stationName} (${timeline[0].stationCode})` : '—')}</div>
          </div>
          <div class="text-right">
            <span class="text-[8px] font-black text-white/45 uppercase tracking-wider block">Destination Station</span>
            <div class="text-[11px] font-bold text-white truncate">${pnrData?.destination || (timeline[timeline.length - 1] ? `${timeline[timeline.length - 1].stationName} (${timeline[timeline.length - 1].stationCode})` : '—')}</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-xs relative z-10">
          <div>
            <span class="text-[7.5px] font-black text-white/40 uppercase tracking-wider block mb-0.5">Current Stop</span>
            <div class="font-extrabold text-[10px] text-emerald-300 truncate">${current ? current.stationName : 'Not Started'}</div>
          </div>
          <div>
            <span class="text-[7.5px] font-black text-white/40 uppercase tracking-wider block mb-0.5">Coach & Seat</span>
            <div class="font-extrabold text-[10px] text-emerald-300 truncate">${coachSeatTitle}</div>
          </div>
          <div>
            <span class="text-[7.5px] font-black text-white/40 uppercase tracking-wider block mb-0.5">Next Station ETA</span>
            <div class="font-extrabold text-[10px] text-emerald-300 truncate">${next ? (next.arrival?.scheduled || next.arrival?.actual || '—') : 'Destination'}</div>
          </div>
        </div>

        <!-- Progress Tracker Bar -->
        <div class="mt-5 relative z-10">
          <div class="flex justify-between items-center text-[8.5px] font-bold text-white/70 mb-1.5">
            <span>${previous ? previous.stationName : 'Origin'}</span>
            <span class="text-emerald-250">${progress}% Journey Covered</span>
            <span>${next ? next.stationName : 'Destination'}</span>
          </div>
          <div class="h-3.5 bg-white/20 rounded-full overflow-hidden flex items-center justify-center relative">
            <div class="h-full bg-gradient-to-r from-emerald-450 to-emerald-300 absolute left-0 top-0 transition-all duration-500" style="width:${progress}%"></div>
            <span class="relative z-10 text-[8px] font-black text-white">${progress}%</span>
          </div>
        </div>
      </div>

      <!-- 2. Order Essentials for Your Journey (Blinkit/Zepto Horizontal Product Carousels) -->
      <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
        <div class="flex items-center gap-2.5 border-b border-slate-50 pb-3">
          <div class="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-[15px]">shopping_bag</span>
          </div>
          <div>
            <h3 class="text-xs font-black text-slate-800 leading-tight">Order Essentials for Your Journey</h3>
            <p class="text-[9px] text-slate-405 font-bold">Delivery directly to your seat at upcoming stations</p>
          </div>
        </div>

        <div class="space-y-6">
          ${beveragesHTML}
          ${comfortHTML}
          ${hygieneHTML}
        </div>
      </div>

      <!-- 3. Passenger Seat Allocations (Only if PNR data has passenger allocations) -->
      ${paxHTML ? `
      <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
        <div class="flex items-center gap-2 border-b border-slate-50 pb-2">
          <span class="material-symbols-outlined text-primary text-base">assignment_ind</span>
          <span class="text-xs font-black text-slate-800">Passenger Seat Bookings</span>
        </div>
        <div class="space-y-2.5">
          ${paxHTML}
        </div>
      </div>` : ''}

      <!-- 4. Quick Travel Utilities Grid -->
      <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div class="flex items-center gap-2 border-b border-slate-50 pb-2">
          <span class="material-symbols-outlined text-primary text-base">construction</span>
          <span class="text-xs font-black text-slate-800">Quick Travel Utilities</span>
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          <div onclick="prefillPlatformSearch('${trainNo}')" class="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-slate-105 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-95 border border-slate-100/50">
            <span class="material-symbols-outlined text-primary text-[15px] mb-1">directions_railway</span>
            <span class="text-[8px] font-bold text-slate-700 leading-tight truncate w-full">Platform</span>
          </div>
          <div onclick="openUtilModal('seatmap')" class="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-slate-105 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-95 border border-slate-100/50">
            <span class="material-symbols-outlined text-primary text-[15px] mb-1">airline_seat_recline_extra</span>
            <span class="text-[8px] font-bold text-slate-700 leading-tight truncate w-full">Seat Map</span>
          </div>
          <div onclick="openUtilModal('refund')" class="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-slate-105 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-95 border border-slate-100/50">
            <span class="material-symbols-outlined text-primary text-[15px] mb-1">currency_rupee</span>
            <span class="text-[8px] font-bold text-slate-700 leading-tight truncate w-full">Refund</span>
          </div>
          <div onclick="prefillTimetableSearch('${trainNo}')" class="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-slate-105 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-95 border border-slate-100/50">
            <span class="material-symbols-outlined text-primary text-[15px] mb-1">schedule</span>
            <span class="text-[8px] font-bold text-slate-700 leading-tight truncate w-full">Timetable</span>
          </div>
          <div onclick="openUtilModal('alarm')" class="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-slate-105 rounded-2xl cursor-pointer transition-all duration-200 text-center active:scale-95 border border-slate-100/50">
            <span class="material-symbols-outlined text-primary text-[15px] mb-1">alarm</span>
            <span class="text-[8px] font-bold text-slate-700 leading-tight truncate w-full">GPS Alarm</span>
          </div>
        </div>
      </div>

      <!-- 5. Collapsible Live Journey Timeline -->
      <div class="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
        <button onclick="toggleDashboardTimeline()" class="w-full flex justify-between items-center text-xs text-slate-700 font-bold focus:outline-none">
          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-primary text-base">route</span>Live Station Timeline</span>
          <span id="timeline-toggle-icon" class="material-symbols-outlined text-slate-400 text-base transition-transform duration-300">expand_more</span>
        </button>
        <div id="dashboard-timeline-content" class="hidden transition-all duration-300 pt-3 border-t border-slate-100">
          <div class="live-station-list font-medium">${timelineHTML}</div>
        </div>
      </div>
    </div>
  `;

  container.classList.remove('hidden');
}

function getCarouselHTML(title, subtitle, categoryFilter) {
  let filtered = [];
  if (categoryFilter === 'comfort') {
    filtered = PRODUCTS.filter(p => p.category === 'comfort');
  } else if (categoryFilter === 'beverages') {
    filtered = PRODUCTS.filter(p => p.category === 'beverages');
  } else {
    filtered = PRODUCTS.filter(p => p.category === 'hygiene' || p.category === 'tech');
  }
  
  const cardsHTML = filtered.map(p => getDashboardProductCardHTML(p)).join('');
  
  return `
    <div class="space-y-2 pb-2">
      <div class="flex justify-between items-end px-1 select-none">
        <div>
          <span class="text-[8.5px] font-black text-primary uppercase tracking-wider block">${title}</span>
          <h4 class="text-[10px] font-extrabold text-slate-500 mt-0.5">${subtitle}</h4>
        </div>
      </div>
      
      <div class="flex overflow-x-auto gap-3.5 pb-2.5 scrollbar-none px-0.5 snap-x snap-mandatory">
        ${cardsHTML}
      </div>
    </div>
  `;
}

function getDashboardProductCardHTML(p) {
  const inCart = appState.cart.find(c => c.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  return getProductCardHTML(p, qty, `addToCart(${p.id})`, (delta) => `changeProductQty(${p.id},${delta})`, true);
}

function toggleDashboardTimeline() {
  const content = document.getElementById('dashboard-timeline-content');
  const icon = document.getElementById('timeline-toggle-icon');
  if (content && icon) {
    const isHidden = content.classList.contains('hidden');
    if (isHidden) {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    } else {
      content.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

function renderPNRResult(d) {
  const paxHTML = (d.passengerList || []).map(p => `<div class="flex justify-between items-center bg-[#F8F9FA] border border-outline-variant/60 rounded-xl px-4 py-3 text-xs"><span class="font-bold text-on-surface">${p.serialNumber}</span><span class="text-primary font-bold">${p.currentStatus}</span></div>`).join('');
  const isPrepared = (d.chartPrepared || '').toLowerCase().includes('prepared');
  const chartBadge = isPrepared ? `<span class="bg-emerald-50 text-primary border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-lg">Chart Prepared</span>` : `<span class="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-lg">Chart Not Prepared</span>`;
  
  document.getElementById('pnr-results').innerHTML = `
    <div class="bg-white border border-outline-variant/60 rounded-[2rem] overflow-hidden shadow-premium">
      <div class="gradient-header p-5 text-white flex justify-between items-start">
        <div>
          <h3 class="font-serif-display text-xl text-white font-bold">${d.trainName || 'Train'}</h3>
          <p class="font-mono text-[10px] text-white/70 mt-1">Train #${d.trainNumber || '—'}</p>
        </div>
        <div>
          <p class="text-[9px] font-bold text-white/50 uppercase tracking-widest text-right">Journey Date</p>
          <p class="text-xs font-bold text-secondary mt-0.5 text-right">${d.dateOfJourney || '—'}</p>
        </div>
      </div>
      <div class="p-5 space-y-4">
        <div class="flex justify-between items-center text-xs">
          <span class="text-gray-400 font-medium">PNR Number</span>
          <strong class="text-on-surface font-mono font-bold">${d.pnrNumber}</strong>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-gray-400 font-medium">Class / Category</span>
          <strong class="text-on-surface">${d.reservationClass || '—'}</strong>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-gray-400 font-medium">Chart Status</span>
          ${chartBadge}
        </div>
        <div class="border-t border-dashed border-gray-100 pt-3">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Passenger Seat Allocations</div>
          <div class="space-y-2">${paxHTML}</div>
        </div>
        ${d.fare ? `<div class="border-t border-gray-100 pt-3 flex justify-between items-center text-xs"><span class="text-gray-400 font-medium">Total Ticket Fare</span><strong class="text-secondary font-black text-sm">₹${d.fare}</strong></div>` : ''}
        
        <div class="pt-4 border-t border-gray-100">
          <button onclick="proceedToShop()" class="w-full bg-primary hover:bg-[#16A35E] text-white py-4 rounded-2xl font-sans font-bold active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-sm shadow-md">
            <span>Continue to Store &amp; Order</span>
            <span class="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('pnr-results').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('pnr-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderUnconfirmedPNRResult(d) {
  const paxHTML = (d.passengerList || []).map(p => `
    <div class="flex justify-between items-center bg-[#FFF1F2] border border-rose-100 rounded-2xl px-4 py-3.5 shadow-sm">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-rose-500 text-base">person</span>
        <span class="font-bold text-slate-800 text-xs">${p.serialNumber}</span>
      </div>
      <div class="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        <span class="text-rose-600 font-extrabold font-mono text-[10px] uppercase tracking-wider">${p.currentStatus}</span>
      </div>
    </div>
  `).join('');

  const routeHTML = `
    <div class="bg-slate-50 border border-slate-100 rounded-3xl p-4 shadow-inner">
      <div class="flex justify-between items-center text-xs text-slate-650 font-bold mb-3 pb-3 border-b border-dashed border-slate-205">
        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">directions_railway</span>Route Summary</span>
        <span class="font-mono text-slate-800">${d.pnrNumber}</span>
      </div>
      <div class="flex justify-between items-center text-slate-850">
        <div class="flex flex-col">
          <span class="text-[9px] text-slate-400 uppercase font-black tracking-wider">From</span>
          <span class="text-xs font-black truncate max-w-[120px] mt-0.5">${d.source ? d.source.split('(')[0].trim() : '—'}</span>
          <span class="text-[9px] font-mono font-bold text-slate-400 mt-0.5">${d.source && d.source.includes('(') ? d.source.split('(')[1].replace(')', '') : ''}</span>
        </div>
        <div class="flex flex-col items-center px-4 flex-1">
          <div class="w-full h-[1px] bg-slate-200 relative flex items-center justify-center">
            <span class="material-symbols-outlined absolute text-[14px] text-slate-400 bg-slate-50 px-1">arrow_forward</span>
          </div>
        </div>
        <div class="flex flex-col text-right">
          <span class="text-[9px] text-slate-400 uppercase font-black tracking-wider">To</span>
          <span class="text-xs font-black truncate max-w-[120px] mt-0.5">${d.destination ? d.destination.split('(')[0].trim() : '—'}</span>
          <span class="text-[9px] font-mono font-bold text-slate-400 mt-0.5">${d.destination && d.destination.includes('(') ? d.destination.split('(')[1].replace(')', '') : ''}</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('pnr-results').innerHTML = `
    <div class="bg-white border border-rose-200 rounded-[2.5rem] overflow-hidden shadow-premium p-1 relative animate-scale-in">
      <div class="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/5 blur-2xl rounded-full"></div>
      
      <!-- Premium Warning Header Banner -->
      <div class="bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-600 rounded-[2.25rem] p-5 text-white flex justify-between items-start shadow-[0_8px_20px_rgba(225,29,72,0.15)] relative overflow-hidden">
        <div class="absolute inset-0 bg-glass opacity-10 pointer-events-none"></div>
        <div>
          <h3 class="font-serif-display text-lg text-white font-extrabold">${d.trainName || 'Train'}</h3>
          <p class="font-mono text-[9px] text-rose-105 uppercase tracking-widest mt-1.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">train</span> Train #${d.trainNumber || '—'}
          </p>
        </div>
        <div class="bg-white/20 border border-white/10 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-inner">
          WL / RAC Status
        </div>
      </div>
      
      <div class="p-5 space-y-5">
        <!-- Warning Callout Box -->
        <div class="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex gap-3.5 relative overflow-hidden">
          <div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 shadow-sm">
            <span class="material-symbols-outlined text-rose-600 text-xl font-bold">warning</span>
          </div>
          <div>
            <h4 class="text-xs font-black text-rose-955">Seat-side delivery unavailable</h4>
            <p class="text-[10px] text-rose-700 font-semibold leading-relaxed mt-1">We can only deliver essentials directly to your seat for confirmed tickets (CNF/RAC). Waitlisted bookings do not have seat assignments.</p>
          </div>
        </div>

        ${routeHTML}

        <!-- Passenger Allocations -->
        <div class="space-y-2.5 pt-1">
          <div class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px]">assignment_ind</span> Passenger Current Booking Details
          </div>
          ${paxHTML}
        </div>
        
        <!-- Helpful suggestion footer -->
        <div class="text-center pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-semibold leading-relaxed px-3">
          If your booking changes to CNF/RAC later, please search your PNR again to proceed with ordering.
        </div>
      </div>
    </div>
  `;
  document.getElementById('pnr-results').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('pnr-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function showContinueBar(data) {
  const bar = document.getElementById('continue-bar');
  const info = document.getElementById('train-info-mini');
  const pax = data.passengerList && data.passengerList[0];
  let seatDesc = '';
  if (pax) {
    seatDesc = `Delivery to: ${pax.coach}, Seat ${pax.berth}`;
  } else {
    seatDesc = 'Onboard seat-side delivery';
  }
  if (info) info.innerHTML = `<strong class="text-sm text-primary">${data.trainName || 'Train'}</strong><span class="text-xs text-secondary font-bold">${seatDesc}</span>`;
  if (bar) bar.classList.remove('hidden');
}

function proceedToShop() { 
  appState.hasOnboarded = true;
  saveState();
  navigateTo('page-shop'); 
}

function initPnrPage() {
  const tabPnrBtn = document.getElementById('tab-pnr');
  const tabLiveBtn = document.getElementById('tab-live');
  const tabHeaders = document.getElementById('pnr-tabs-container');
  const panelPnr = document.getElementById('panel-pnr');
  const panelLive = document.getElementById('panel-live');
  const resultsEl = document.getElementById('pnr-results');
  const headerTitle = document.querySelector('#page-pnr header h1');
  const headerDesc = document.querySelector('#page-pnr header p');

  const backBtn = document.getElementById('pnr-back-btn');
  if (backBtn) {
    if (appState.hasOnboarded) {
      backBtn.style.display = 'flex';
      backBtn.onclick = () => navigateTo('page-shop');
    } else {
      backBtn.style.display = 'none';
    }
  }

  // Keep PNR status and Live Train tabs, Segmented control, and inputs always available!
  if (headerTitle) headerTitle.innerHTML = 'Delivered to<br/><span class="text-[#4ADE80]">your seat.</span>';
  if (headerDesc) headerDesc.textContent = 'Tasty snacks, drinks, chargers & comfort kits.';
  if (tabHeaders) tabHeaders.style.display = '';

  const isLiveTab = tabLiveBtn && tabLiveBtn.classList.contains('text-white') || (appState.pnrLiveData && !appState.pnrData);
  if (isLiveTab) {
    switchPNRTab('live');
    if (panelPnr) panelPnr.style.display = 'none';
    if (panelLive) panelLive.style.display = '';
  } else {
    switchPNRTab('pnr');
    if (panelPnr) panelPnr.style.display = '';
    if (panelLive) panelLive.style.display = 'none';
  }

  // Restore train value if existing in state
  const liveTrainInput = document.getElementById('live-train-input');
  const trainNo = (appState.pnrData && appState.pnrData.trainNumber && appState.pnrData.trainNumber !== '—') 
    ? appState.pnrData.trainNumber 
    : (appState.pnrLiveData?.trainNo || appState.pnrLiveData?.trainNumber || '');
  if (liveTrainInput && trainNo && !liveTrainInput.value) {
    liveTrainInput.value = trainNo;
  }

  // Restore PNR result if checked
  if (resultsEl) {
    if (appState.pnrData && appState.pnrData.pnrNumber && appState.pnrData.pnrNumber !== '—') {
      resultsEl.classList.remove('hidden');
      const isConfirmed = isTicketConfirmed(appState.pnrData);
      if (isConfirmed) {
        renderPNRResult(appState.pnrData);
      } else {
        renderUnconfirmedPNRResult(appState.pnrData);
      }
    } else if (appState.pnrLiveData) {
      resultsEl.classList.remove('hidden');
      renderLiveTrainResult(appState.pnrLiveData, trainNo);
    } else {
      resultsEl.classList.add('hidden');
      resultsEl.innerHTML = '';
    }
  }

  // Testimonials should always remain visible on PNR page
  document.getElementById('testimonials-section')?.classList.remove('hidden');
}

function isValidTrainNumber(trainNo) {
  return trainNo && trainNo !== '—' && /^\d+$/.test(trainNo);
}

async function searchLiveTrainDirectly() {
  const inputEl = document.getElementById('live-tracking-search-input');
  const dateEl = document.getElementById('live-tracking-date-input');
  const trainNo = inputEl ? inputEl.value.trim() : '';
  if (!trainNo) { showToast('Enter a train number', 'warning'); return; }
  
  showLoading('Fetching live train status...');
  const dateInput = dateEl ? dateEl.value : '';
  let dateStr;
  if (dateInput) {
    const [y, m, d] = dateInput.split('-');
    dateStr = `${d}-${m}-${y}`;
  } else {
    const now = new Date();
    dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  }

  try {
    const resp = await fetch(`/api/track-train/${trainNo}/${dateStr}`);
    const data = await resp.json();
    const d = validateApiResponse(data);
    
    hideLoading();
    
    // Update view header labels dynamically for this session search
    const titleEl = document.getElementById('live-tracking-header-title');
    const subtitleEl = document.getElementById('live-tracking-header-subtitle');
    if (titleEl) titleEl.textContent = d.trainName || `Train ${trainNo}`;
    if (subtitleEl) subtitleEl.textContent = `Tracking Train #${d.trainNo || trainNo} · Live Position`;
    
    // Render timeline
    const resultsEl = document.getElementById('live-tracking-results');
    if (resultsEl) {
      resultsEl.classList.remove('hidden');
      renderLiveTrainResult(d, d.trainNo || trainNo);
      setTimeout(() => {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    
    showToast('Live status loaded!');
    if (inputEl) inputEl.value = '';
  } catch (err) {
    console.warn('API Offline, using mock:', err.message);
    const mock = getMockLiveStatus(trainNo);
    hideLoading();
    
    const titleEl = document.getElementById('live-tracking-header-title');
    const subtitleEl = document.getElementById('live-tracking-header-subtitle');
    if (titleEl) titleEl.textContent = mock.trainName || `Train ${trainNo}`;
    if (subtitleEl) subtitleEl.textContent = `Tracking Train #${mock.trainNo || trainNo} · Live Position`;
    
    const resultsEl = document.getElementById('live-tracking-results');
    if (resultsEl) {
      resultsEl.classList.remove('hidden');
      renderLiveTrainResult(mock, mock.trainNo || trainNo);
      setTimeout(() => {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    
    showToast('Mock tracking loaded (API offline)', 'info');
    if (inputEl) inputEl.value = '';
  }
}

function initLiveTrackingPage() {
  const resultsEl = document.getElementById('live-tracking-results');
  const titleEl = document.getElementById('live-tracking-header-title');
  const subtitleEl = document.getElementById('live-tracking-header-subtitle');
  
  if (appState.pnrData && appState.pnrData.trainNumber && appState.pnrData.trainNumber !== '—') {
    if (titleEl) titleEl.textContent = appState.pnrData.trainName || 'Live Train Status';
    const pax = appState.pnrData.passengerList && appState.pnrData.passengerList[0];
    const coachSeat = pax ? `Seat ${pax.coach}-${pax.berth}` : 'No seat assigned';
    if (subtitleEl) subtitleEl.textContent = `Tracking Train #${appState.pnrData.trainNumber} · ${coachSeat}`;
  } else if (appState.pnrLiveData) {
    const tName = appState.pnrLiveData.trainName || 'Express Train';
    const tNo = appState.pnrLiveData.trainNo || appState.pnrLiveData.trainNumber || '';
    if (titleEl) titleEl.textContent = tName;
    if (subtitleEl) subtitleEl.textContent = `Tracking Train #${tNo}`;
  }
  
  if (resultsEl) {
    if (appState.pnrLiveData) {
      const trainNo = (appState.pnrData && appState.pnrData.trainNumber && appState.pnrData.trainNumber !== '—')
        ? appState.pnrData.trainNumber
        : (appState.pnrLiveData.trainNo || appState.pnrLiveData.trainNumber || '');
      renderLiveTrainResult(appState.pnrLiveData, trainNo);
    } else {
      const trainNo = appState.pnrData?.trainNumber;
      if (isValidTrainNumber(trainNo)) {
        fetchLiveStatusForPnrPage(trainNo);
      } else {
        resultsEl.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center py-20 px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <span class="material-symbols-outlined text-3xl">route</span>
            </div>
            <h3 class="text-sm font-black text-slate-700">No active tracking found</h3>
            <p class="text-[11px] text-slate-500 font-semibold mt-1 max-w-[240px]">Search a train number under PNR section to view live railway route status.</p>
          </div>`;
      }
    }
  }
}

async function fetchLiveStatusForPnrPage(trainNo) {
  showLoading('Getting live train position...');
  try {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
    const resp = await fetch(`/api/track-train/${trainNo}/${dateStr}`);
    const data = await resp.json();
    const d = validateApiResponse(data);
    appState.pnrLiveData = d;
    saveState();
    hideLoading();
    renderLiveTrainResult(d, trainNo);
  } catch(err) {
    console.warn('API Offline, running mock live position:', err.message);
    const mock = getMockLiveStatus(trainNo);
    appState.pnrLiveData = mock;
    saveState();
    hideLoading();
    renderLiveTrainResult(mock, trainNo);
  }
}

const POPULAR_TRAINS = [
  { number: "12301", name: "Howrah Rajdhani Express", route: ["HWH", "ASN", "DHN", "GAYA", "PRYJ", "CNB", "NDLS"] },
  { number: "12424", name: "New Delhi - Dibrugarh Rajdhani Express", route: ["NDLS", "CNB", "PRYJ", "PNBE", "GHY", "DBRG"] },
  { number: "12002", name: "New Delhi - Bhopal Shatabdi Express", route: ["NDLS", "MTJ", "AGC", "GWL", "VGLB", "BPL"] },
  { number: "12952", name: "Mumbai Rajdhani Express", route: ["MMCT", "BCT", "KOTA", "RTM", "BRC", "NDLS"] },
  { number: "22436", name: "Varanasi Vande Bharat Express", route: ["NDLS", "CNB", "PRYJ", "BSB"] },
  { number: "12626", name: "Kerala Express", route: ["NDLS", "AGC", "VGLB", "BPL", "NGP", "RU", "MAS", "TVC"] },
  { number: "12260", name: "Sealdah Duronto Express", route: ["NDLS", "CNB", "DHN", "SDAH"] }
];

function handleLiveTrainInput(inputEl) {
  const query = inputEl.value.trim().toLowerCase();
  
  // Automatically trigger verification when exactly 5 digits are typed
  if (/^\d{5}$/.test(query)) {
    const container = document.getElementById('live-train-suggestions');
    if (container) container.classList.add('hidden');
    verifyTrainAndShowDates();
    return;
  }

  const container = document.getElementById('live-train-suggestions');
  if (!container) return;

  if (query.length < 2) {
    container.classList.add('hidden');
    return;
  }

  // Filter local database
  const matches = POPULAR_TRAINS.filter(t => 
    t.number.includes(query) || t.name.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    if (/^\d{5}$/.test(query)) {
      container.innerHTML = `
        <div class="px-4 py-3 text-xs text-primary font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-between" onclick="selectTrainSuggestion('${query}', 'Train #${query}')">
          <span>Search Train #${query} dynamically</span>
          <span class="material-symbols-outlined text-sm">travel_explore</span>
        </div>
      `;
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
    return;
  }

  container.innerHTML = matches.map(t => `
    <div class="px-4 py-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 flex flex-col gap-0.5" onclick="selectTrainSuggestion('${t.number}', '${t.name}')">
      <div class="font-bold text-slate-800">${t.name}</div>
      <div class="text-[9px] font-mono font-semibold text-slate-450">Train #${t.number}</div>
    </div>
  `).join('');

  container.classList.remove('hidden');
}

function selectTrainSuggestion(number, name) {
  const inputEl = document.getElementById('live-train-input');
  if (inputEl) inputEl.value = `${number} - ${name}`;
  
  const container = document.getElementById('live-train-suggestions');
  if (container) container.classList.add('hidden');

  verifyTrainAndShowDates();
}

async function verifyTrainAndShowDates() {
  const val = document.getElementById('live-train-input').value.trim();
  const trainNo = val.includes(' - ') ? val.split(' - ')[0] : val;
  if (!trainNo) { showToast('Enter train number or name', 'warning'); return; }
  
  showLoading('Verifying train route schedule...');
  try {
    const resp = await fetch(`/api/train-info/${trainNo}`);
    const data = await resp.json();
    const d = validateApiResponse(data);
    
    hideLoading();
    showToast('Train route verified! Select start date.', 'success');
    
    // Render the beautiful verified train card with dynamic start dates
    renderVerifiedTrainCard(trainNo, d.trainInfo);
    
    // Hide previous results
    const results = document.getElementById('pnr-results');
    if (results) { results.classList.add('hidden'); results.innerHTML = ''; }
  } catch (err) {
    console.warn('API offline or invalid train, loading mock schedule info:', err.message);
    hideLoading();
    // Fallback schedule info for offline/simulation
    const mockInfo = {
      train_no: trainNo,
      train_name: 'Express Train',
      runsOn: { mon: 'Y', tue: 'Y', wed: 'Y', thu: 'Y', fri: 'Y', sat: 'Y', sun: 'Y' }
    };
    renderVerifiedTrainCard(trainNo, mockInfo);
    const results = document.getElementById('pnr-results');
    if (results) { results.classList.add('hidden'); results.innerHTML = ''; }
  }
}

function renderVerifiedTrainCard(trainNo, trainInfo) {
  const datesContainer = document.getElementById('live-train-dates-container');
  if (!datesContainer) return;
  
  const runsOn = trainInfo?.runsOn || trainInfo?.runs_on || null;
  const now = new Date();
  const options = [];
  
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayNamesDisplay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate Tomorrow (i=1), Today (i=0), Yesterday (i=-1)
  for (let i = 1; i >= -1; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    
    const dayIndex = d.getDay();
    const dayNameShort = daysOfWeek[dayIndex];
    const dayNameDisplay = dayNamesDisplay[dayIndex];
    
    let runs = true;
    if (runsOn) {
      if (typeof runsOn === 'object' && !Array.isArray(runsOn)) {
        const key = dayNameShort;
        const val = runsOn[key] || runsOn[key.toUpperCase()] || runsOn[dayNameDisplay] || runsOn[dayNameDisplay.toLowerCase()];
        if (val === 'N' || val === 'n' || val === false || val === '0') {
          runs = false;
        }
      } else if (Array.isArray(runsOn)) {
        const runsOnUpper = runsOn.map(x => String(x).toUpperCase());
        if (!runsOnUpper.includes(dayNameDisplay.toUpperCase()) && !runsOnUpper.includes(dayNameShort.toUpperCase())) {
          runs = false;
        }
      }
    }
    
    if (!runs) continue;

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY
    
    let label = '';
    if (i === 1) label = 'Tomorrow';
    else if (i === 0) label = 'Today';
    
    const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); // e.g. "11 Jul"
    
    options.push({
      label,
      displayDate,
      apiDate: formattedDate
    });
  }

  const pillsHTML = options.length === 0 
    ? `<div class="text-xs text-slate-500 font-bold p-3 text-center w-full">This train does not run on any available dates in the tracking window.</div>`
    : options.map(opt => `
        <button type="button" class="date-pill bg-white/60 backdrop-blur-sm border border-slate-200/50 px-4 py-3 rounded-2xl font-bold text-xs text-slate-800 active:scale-95 transition-all flex flex-col items-center justify-center min-w-[85px] cursor-pointer" onclick="selectLiveDate('${trainNo}', '${opt.apiDate}', this)">
          <span class="text-xs font-black">${opt.displayDate}</span>
          ${opt.label ? `<span class="text-[8px] uppercase tracking-wider text-slate-450 font-bold mt-1">${opt.label}</span>` : ''}
        </button>
      `).join('');

  // Update datesContainer with the full Premium Verified Card
  datesContainer.innerHTML = `
    <div class="bg-slate-50/50 border border-slate-100 rounded-3xl p-4.5 space-y-4 shadow-sm backdrop-blur-sm animate-fade-in-up mt-5">
      <!-- Train Details Section -->
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <span class="text-[9px] font-black text-primary bg-primary/5 px-2.5 py-0.5 rounded-md uppercase tracking-wider">Verified Route</span>
          <h3 class="text-sm font-headline font-black text-slate-800 truncate mt-1">${trainInfo.train_name || 'Express Train'}</h3>
          <p class="text-[10px] font-mono font-bold text-slate-400">Train #${trainInfo.train_no || trainNo}</p>
        </div>
        <span class="material-symbols-outlined text-primary text-xl bg-slate-50 p-2 rounded-xl border border-slate-100">train</span>
      </div>
      
      <!-- Route Info -->
      <div class="flex justify-between items-center bg-white/60 backdrop-blur-sm border border-slate-100/50 rounded-2xl p-3.5 text-xs text-slate-700">
        <div class="flex flex-col">
          <span class="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Source</span>
          <span class="font-black truncate max-w-[90px]">${trainInfo.from_stn_name || 'Origin'}</span>
        </div>
        <div class="flex-grow flex items-center justify-center px-3">
          <div class="w-full h-[1px] bg-slate-200 relative flex items-center justify-center">
            <span class="material-symbols-outlined absolute text-[12px] text-slate-400 bg-slate-50 px-1">arrow_forward</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Destination</span>
          <span class="font-black truncate max-w-[90px]">${trainInfo.to_stn_name || 'Destination'}</span>
        </div>
      </div>
      
      <!-- Date Selector Section -->
      <div class="space-y-2.5 pt-2">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-0.5">Select Train Start Date</label>
        <div id="live-date-pills" class="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none -mx-5 px-5">
          ${pillsHTML}
        </div>
      </div>
    </div>
  `;
  
  datesContainer.classList.remove('hidden');
  setTimeout(() => {
    datesContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function selectLiveDate(trainNo, dateStr, buttonEl) {
  // Highlight active pill
  document.querySelectorAll('.date-pill').forEach(btn => {
    btn.classList.remove('border-primary', 'bg-primary/5', 'text-primary');
    btn.classList.add('bg-slate-50', 'text-slate-700');
  });
  buttonEl.classList.remove('bg-slate-50', 'text-slate-700');
  buttonEl.classList.add('border-primary', 'bg-primary/5', 'text-primary');

  // Trigger live status check!
  document.getElementById('live-date-input').value = dateStr.split('-').reverse().join('-'); // Set in hidden YYYY-MM-DD
  checkLiveStatusDirectly(trainNo, dateStr);
}

async function checkLiveStatusDirectly(trainNo, dateStr) {
  showLoading('Getting live train position...');
  try {
    const resp = await fetch(`/api/track-train/${trainNo}/${dateStr}`);
    const data = await resp.json();
    const d = validateApiResponse(data);
    
    const source = d.timeline?.[0];
    const dest = d.timeline?.[d.timeline.length - 1];
    appState.pnrData = {
      pnrNumber: '—',
      trainNumber: d.trainNo || trainNo,
      trainName: d.trainName || `Train ${trainNo}`,
      dateOfJourney: dateStr,
      source: source ? `${source.stationName} (${source.stationCode})` : '—',
      destination: dest ? `${dest.stationName} (${dest.destinationCode || dest.stationCode || ''})` : '—',
      reservationClass: '—',
      chartPrepared: '—',
      fare: null,
      passengerList: []
    };
    appState.pnrLiveData = d;
    appState.isPnrConfirmed = false;
    saveState();
    hideLoading();
    
    renderLiveTrainResult(d, trainNo);
    // Hide continue shopping bar
    const bar = document.getElementById('continue-bar');
    if (bar) bar.classList.add('hidden');
    updateShopTopbar();
    showToast('Live tracking status loaded!', 'success');
  } catch(err) {
    console.warn('API Offline, running mock live position:', err.message);
    let routeInfo = null;
    try { const infoResp = await fetch(`/api/train-info/${trainNo}`); const infoData = await infoResp.json(); if (infoData.success) routeInfo = validateApiResponse(infoData); } catch(e) { console.warn('Failed to fetch train schedule for dynamic mock:', e.message); }
    const mock = getMockLiveStatus(trainNo, routeInfo);
    
    const source = mock.timeline?.[0];
    const dest = mock.timeline?.[mock.timeline.length - 1];
    appState.pnrData = {
      pnrNumber: '—',
      trainNumber: mock.trainNo || trainNo,
      trainName: mock.trainName || `Train ${trainNo}`,
      dateOfJourney: dateStr,
      source: source ? `${source.stationName} (${source.stationCode})` : '—',
      destination: dest ? `${dest.stationName} (${dest.stationCode})` : '—',
      reservationClass: '—',
      chartPrepared: '—',
      fare: null,
      passengerList: []
    };
    appState.pnrLiveData = mock;
    appState.isPnrConfirmed = false;
    saveState();
    hideLoading();
    
    renderLiveTrainResult(mock, trainNo);
    // Hide continue shopping bar
    const bar = document.getElementById('continue-bar');
    if (bar) bar.classList.add('hidden');
    updateShopTopbar();
    showToast('Simulated tracking status loaded', 'info');
  }
}

async function checkLiveStatus() {
  let val = document.getElementById('live-train-input').value.trim();
  // Extract number if it matches the '12301 - Name' format
  const trainNo = val.includes(' - ') ? val.split(' - ')[0] : val;
  const dateInput = document.getElementById('live-date-input').value; // hidden DD-MM-YYYY format helper
  if (!trainNo) { showToast('Enter train number or name', 'warning'); return; }
  
  let dateStr = dateInput;
  if (!dateStr) {
    const now = new Date();
    dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  }
  
  await checkLiveStatusDirectly(trainNo, dateStr);
}

function renderLiveTrainResult(d, trainNo) {
  const statusNote = d.statusNote || 'Running';
  const isDelayed = statusNote.toLowerCase().includes('late') || statusNote.toLowerCase().includes('delay');
  const timelineHTML = buildPremiumStationTimelineHTML(d, statusNote, isDelayed);

  const containerHTML = generateTimelineContainerHTML(d, statusNote, isDelayed, timelineHTML);

  const resultsPnr = document.getElementById('pnr-results');
  const resultsLive = document.getElementById('live-tracking-results');
  const innerHTML = `
    <div class="fade-in-item">
      ${containerHTML}
    </div>`;

  // Hide the search card and bottom utilities grid so results take over the screen
  if (appState.currentPage === 'page-pnr') {
    const searchCard = document.getElementById('pnr-search-card');
    if (searchCard) searchCard.classList.add('hidden');
    const botUtils = document.getElementById('travel-utility-section');
    if (botUtils) botUtils.classList.add('hidden');
  }

  if (resultsPnr) {
    resultsPnr.innerHTML = innerHTML;
    resultsPnr.classList.remove('hidden');
  }
  if (resultsLive) {
    resultsLive.innerHTML = innerHTML;
  }
  
  // Keep testimonials visible
  document.getElementById('testimonials-section')?.classList.remove('hidden');
  
  // Smooth scroll container into view, then current station node
  setTimeout(() => {
    let scrollTarget = null;
    if (appState.currentPage === 'page-pnr' && resultsPnr && !resultsPnr.classList.contains('hidden')) {
      scrollTarget = resultsPnr;
    } else if (appState.currentPage === 'page-live-tracking' && resultsLive) {
      scrollTarget = resultsLive;
    }
    
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Slightly later, scroll the current node to center inside the scroll container without shifting parent pages
    setTimeout(() => {
      const listContainer = document.querySelector('.live-station-list');
      const currentNode = listContainer ? listContainer.querySelector('.live-station-node.current') : null;
      if (listContainer && currentNode) {
        const containerHeight = listContainer.clientHeight;
        const nodeOffsetTop = currentNode.offsetTop;
        const nodeHeight = currentNode.clientHeight;
        listContainer.scrollTo({
          top: nodeOffsetTop - (containerHeight / 2) + (nodeHeight / 2),
          behavior: 'smooth'
        });
      }
    }, 280);
  }, 100);
}

// Search Train Route
async function searchTrain() {
  const query = document.getElementById('train-search-input').value.trim();
  if (!query) { showToast('Enter train number or name', 'warning'); return; }
  showLoading('Searching train route...');
  try {
    const resp = await fetch(`/api/train-info/${query}`);
    const data = await resp.json();
    hideLoading();
    const d = validateApiResponse(data);
    
    renderTrainSchedule(d);
    showToast('Train route loaded!');
  } catch (err) {
    console.warn('API Offline, running mock route schedule:', err.message);
    const mock = getMockTrainSchedule(query);
    renderTrainSchedule(mock);
    hideLoading();
    showToast('Mock route loaded (API offline)', 'info');
  }
}

function renderTrainSchedule(d) {
  const info = d.trainInfo || {};
  const stations = d.route || [];
  const stationsHTML = stations.map(s => `
    <div class="flex justify-between items-center py-2.5 border-b border-gray-50 text-xs">
      <div>
        <span class="font-bold text-on-surface">${s.stnName || s.stationName}</span>
        <span class="text-[9px] text-gray-400 font-bold ml-1.5">${s.stnCode || s.stationCode || ''}</span>
      </div>
      <span class="font-mono text-gray-600">${s.arrival || 'Source'} / ${s.departure || 'Destination'}</span>
    </div>
  `).join('');

  document.getElementById('pnr-results').innerHTML = `
    <div class="bg-white border border-outline-variant/60 rounded-[2.5rem] overflow-hidden shadow-premium p-1 relative">
      <div class="gradient-header p-5 text-white rounded-[2.25rem] shadow-md relative overflow-hidden">
        <h3 class="font-serif-display text-xl text-white font-bold">${info.train_name || 'Train'}</h3>
        <p class="font-mono text-[10px] text-white/70 mt-1">#${info.train_no || ''} · ${info.from_stn_name || ''} → ${info.to_stn_name || ''}</p>
      </div>
      
      <div class="p-5">
        <!-- Track Live Position Button -->
        <button class="w-full bg-secondary hover:bg-secondary/80 text-white font-headline font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-[0_8px_20px_rgba(245,158,11,0.25)] mb-5 active:scale-95 transition-all" onclick="fetchLiveStatusForPnrPage('${info.train_no || ''}'); navigateTo('page-live-tracking');">
          <span class="material-symbols-outlined text-sm animate-pulse">gps_fixed</span>
          Track Live Position
        </button>

        <div class="flex justify-between items-center text-xs pb-3 border-b border-gray-100 mb-3">
          <span class="text-gray-400 font-medium">Total Travel Time</span>
          <strong class="text-on-surface font-bold">${info.travel_time || '—'}</strong>
        </div>
        
        <div class="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
          <span>Station</span>
          <span>Arr / Dep</span>
        </div>
        
        <div class="max-h-[300px] overflow-y-auto no-scrollbar border border-slate-50 rounded-2xl p-2.5 bg-slate-50/50">
          ${stationsHTML}
        </div>
      </div>
    </div>`;
  document.getElementById('pnr-results').classList.remove('hidden');
}


function productById(id) { return PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; }
function productBadge(p, idx = 0) {
  const badgeByCategory = { comfort: 'Travel Comfort', beverages: 'Fast Delivery', hygiene: 'Travel Ready', tech: 'Journey Saver' };
  return p.tags?.[0] || badgeByCategory[p.category] || ['Popular', 'Fresh', 'Limited Stock'][idx % 3];
}
function getSimilarProducts(product, limit = 5) {
  return PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).concat(PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category)).slice(0, limit);
}

// ===== RESTART APP STATE & PNR EXPIRY =====
function resetAppStateAndRestart() {
  localStorage.clear();
  showToast('App state reset! Restarting...', 'info');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function checkPnrExpiry() {
  if (!appState.pnrData || !appState.pnrLiveData) return;
  
  // Find destination station code
  let destCode = '';
  if (appState.pnrData.destination) {
    const match = appState.pnrData.destination.match(/\(([^)]+)\)/);
    destCode = match ? match[1].trim().toUpperCase() : appState.pnrData.destination.trim().toUpperCase();
  }
  if (!destCode) return;
  
  const timeline = appState.pnrLiveData.timeline || [];
  const destIdx = timeline.findIndex(s => s.stationCode && s.stationCode.toUpperCase() === destCode);
  if (destIdx === -1) return;
  
  // Check if destination is passed
  let reached = false;
  const currentIdx = timeline.findIndex(s => s.status === 'current');
  if (currentIdx !== -1) {
    reached = currentIdx >= destIdx;
  } else {
    const destStation = timeline[destIdx];
    if (destStation && destStation.status === 'passed') {
      reached = true;
    }
  }
  
  if (reached) {
    console.warn('[PNR Expiry] Destination station reached. Logging out PNR session.');
    appState.pnrData = null;
    appState.pnrLiveData = null;
    appState.isPnrConfirmed = false;
    appState.hasOnboarded = false;
    saveState();
    
    // Reset home page variables
    updateShopTopbar();
    const strip = document.getElementById('train-strip');
    if (strip) strip.classList.add('hidden');
    
    showToast('Your train has reached its destination! PNR session expired.', 'warning');
    navigateTo('page-pnr');
  }
}

// ===== SHOP PAGE =====
function initShopPage() {
  if (!appState.pnrData) {
    appState.pnrData = {
      trainNumber: '12301',
      trainName: 'Rajdhani Express',
      source: 'New Delhi (NDLS)',
      destination: 'Howrah Jn (HWH)',
      passengerList: [{ coach: 'B2', berth: '45', currentStatus: 'CNF' }]
    };
  }
  // Check for PNR expiry on load if live data exists
  if (appState.pnrLiveData) {
    checkPnrExpiry();
  }

  // Update greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Good Night' : hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetEl = document.getElementById('shop-delivering-label');
  if (greetEl && !appState.pnrData) greetEl.textContent = greeting;

  showProductSkeletons();
  setTimeout(() => {
    filterCategory(appState.currentFilter || 'all');
  }, 100);
  updateShopTopbar();
  updateCartFAB();

  // Background fetch live tracking for home strip if we have a train number
  if (appState.pnrData && appState.pnrData.trainNumber && appState.pnrData.trainNumber !== '—') {
    fetchLiveStatusForHome(appState.pnrData.trainNumber);
  }
}

async function fetchLiveStatusForHome(trainNo) {
  try {
    const now = new Date();
    // Query with actual date of journey if available
    let dateStr = (appState.pnrData && appState.pnrData.dateOfJourney) ? appState.pnrData.dateOfJourney : '';
    if (!dateStr) {
      dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
    }
    const resp = await fetch(`/api/track-train/${trainNo}/${dateStr}`);
    const data = await resp.json();
    let liveData = null;
    if (data?.success && data.data) {
      liveData = validateApiResponse(data);
    } else {
      liveData = getMockLiveStatus(trainNo);
    }
    appState.pnrLiveData = liveData;
    saveState();
    
    // Check if journey is completed
    checkPnrExpiry();
    
    if (appState.pnrData) {
      updateTrainStripWithLiveStatus(liveData);
    }
  } catch (err) {
    console.warn('Failed to fetch live status for home strip, using mock:', err.message);
    const mock = getMockLiveStatus(trainNo);
    appState.pnrLiveData = mock;
    saveState();
    
    // Check if journey is completed on mock data too
    checkPnrExpiry();
    
    if (appState.pnrData) {
      updateTrainStripWithLiveStatus(mock);
    }
  }
}

function updateTrainStripWithLiveStatus(liveData) {
  const strip = document.getElementById('train-strip');
  if (!strip || !liveData) return;

  const currentStnCode = liveData.currentStationCode;

  // Filter timeline: keep stoppages, or any station that has scheduled times, or the current station itself
  const timeline = (liveData.timeline || []).filter(s => {
    const isStoppage = s.type === 'stoppage' || s.stoppage === true;
    const hasTimes = s.arrival?.scheduled || s.departure?.scheduled || s.arrival || s.departure;
    const isCurrent = s.status === 'current' || 
                     (s.stationCode && currentStnCode && s.stationCode.toUpperCase() === currentStnCode.toUpperCase());
    return isStoppage || (hasTimes && s.stationCode !== '—') || isCurrent;
  });

  if (!timeline.length) return;

  // Find current station index on stoppage list
  const currentIdx = timeline.findIndex(x => 
    x.status === 'current' ||
    (x.stationCode && currentStnCode && x.stationCode.toUpperCase() === currentStnCode.toUpperCase())
  );

  let upcomingStation = null;
  if (currentIdx !== -1 && currentIdx < timeline.length - 1) {
    upcomingStation = timeline[currentIdx + 1];
  } else {
    upcomingStation = timeline.find(s => s.status === 'upcoming');
  }

  // Fallback to last station if no upcoming station found
  if (!upcomingStation && timeline.length) {
    upcomingStation = timeline[timeline.length - 1];
  }

  if (!upcomingStation) return;

  const pf = upcomingStation.platform && upcomingStation.platform !== '—' ? `PF ${upcomingStation.platform}` : 'PF TBD';
  const stationText = `${upcomingStation.stationName} (${upcomingStation.stationCode})`;

  // Visual layout: Simple, small, and beautiful
  strip.className = "mx-margin-mobile mt-4 bg-emerald-50/30 border border-emerald-100/60 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,169,104,0.03)] hover:bg-emerald-50/50 hover:border-emerald-100 transition-all cursor-pointer";
  strip.setAttribute('onclick', "navigateTo('page-live-tracking')");

  strip.innerHTML = `
    <div class="flex items-center gap-2.5 min-w-0">
      <span class="relative flex h-2 w-2 shrink-0">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <div class="font-headline text-[11px] font-bold text-slate-700 truncate leading-none">
        Next stop: <span class="text-slate-900 font-extrabold">${stationText}</span> · <span class="text-primary font-extrabold">${pf}</span>
      </div>
    </div>
    <div class="flex items-center text-slate-400 shrink-0">
      <span class="material-symbols-outlined text-lg font-bold">chevron_right</span>
    </div>
  `;

  strip.classList.remove('hidden');
}

// Dynamic header showing train name, seat number, and birth details
function updateShopTopbar() {
  const trainNameEl = document.getElementById('shop-delivering-train-name');
  const seatCoachEl = document.getElementById('shop-delivering-seat-coach');
  const distanceEl = document.getElementById('shop-delivering-distance');
  const badgeEl = document.getElementById('shop-delivering-badge');

  const seatEl = document.getElementById('shop-pnr-seat');
  const statusEl = document.getElementById('shop-pnr-status');
  const fromEl = document.getElementById('shop-pnr-from');
  const toEl = document.getElementById('shop-pnr-to');
  const strip = document.getElementById('train-strip');

  if (appState.pnrData && appState.pnrData.trainNumber && appState.pnrData.trainNumber !== '—') {
    const d = appState.pnrData;
    const pax = d.passengerList && d.passengerList[0];
    const coach = pax ? pax.coach : '';
    const seat = pax ? pax.berth : '';
    const berth = pax ? pax.berthCode : '';

    if (trainNameEl) {
      trainNameEl.textContent = d.trainName || 'Train name';
    }
    if (seatCoachEl) {
      seatCoachEl.textContent = coach ? `Coach ${coach} / Seat ${seat} ${berth ? `(${berth})` : ''}` : 'Seat no/ caoch';
    }
    if (badgeEl) {
      badgeEl.classList.remove('hidden');
    }
    if (distanceEl) {
      distanceEl.textContent = appState.isPnrConfirmed ? 'Verified' : 'Waitlisted';
    }

    if (seatEl) {
      seatEl.textContent = coach ? `Seat ${coach}-${seat} ${berth ? `(${berth})` : ''}` : 'Seat —';
    }
    if (statusEl) {
      statusEl.textContent = appState.isPnrConfirmed ? 'Verified' : 'Waitlisted';
    }
    if (fromEl) fromEl.textContent = d.source.split('(')[0].trim();
    if (toEl) toEl.textContent = d.destination.split('(')[0].trim();
    
    if (strip) {
      if (appState.pnrLiveData) {
        updateTrainStripWithLiveStatus(appState.pnrLiveData);
      } else {
        strip.classList.add('hidden');
      }
    }
  } else {
    if (trainNameEl) {
      trainNameEl.textContent = 'Train name';
    }
    if (seatCoachEl) {
      seatCoachEl.textContent = 'Seat no/ caoch';
    }
    if (badgeEl) {
      badgeEl.classList.remove('hidden');
    }
    if (distanceEl) {
      distanceEl.textContent = '880 m away';
    }

    if (seatEl) seatEl.textContent = 'Seat —';
    if (statusEl) statusEl.textContent = 'No Ticket';
    if (fromEl) fromEl.textContent = '—';
    if (toEl) toEl.textContent = '—';
    if (strip) strip.classList.add('hidden');
  }
}

function resetAppStateAndLogin() {
  appState.pnrData = null;
  appState.pnrLiveData = null;
  appState.isPnrConfirmed = false;
  appState.hasOnboarded = false;
  saveState();
  
  // Reset all page views, activate onboarding PNR page
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  
  const pnrPage = document.getElementById('page-pnr');
  if (pnrPage) pnrPage.classList.add('active');
  appState.currentPage = 'page-pnr';
  updateBottomNav('page-pnr');
  
  // Render search forms
  setTimeout(() => {
    switchPNRTab('pnr');
    initPnrPage();
  }, 100);
  
  showToast('Session reset. Please enter PNR or Train.', 'info');
}



function getProductCardHTML(p, qty, addClickCode, changeClickCodeFunc, isSlider = false) {
  const isLiked = Array.isArray(appState.favorites) && appState.favorites.includes(p.id);
  const mrp = p.mrp || Math.round(p.price * 1.25);
  const discountText = p.discountText || (mrp > p.price ? `${Math.round(((mrp - p.price) / mrp) * 100)}% OFF on MRP` : '');
  const optionsLabel = p.optionsLabel || (p.options && p.options.length > 1 ? `${p.options.length} options` : '');
  const weightText = p.weight || '58 g';

  const vegBadgeHTML = p.veg ? `
    <div class="pcard-veg-badge">
      <div class="pcard-veg-dot"></div>
    </div>
  ` : '';

  const buttonHTML = qty > 0
    ? `<div class="pcard-stepper" onclick="event.stopPropagation();">
         <button class="pcard-stepper-btn" onclick="changeProductQty(${p.id}, -1)">−</button>
         <span class="pcard-stepper-val">${qty}</span>
         <button class="pcard-stepper-btn" onclick="changeProductQty(${p.id}, 1)">+</button>
       </div>`
    : `<button class="pcard-add-btn" onclick="event.stopPropagation(); handleAddProductClick(${p.id});">
         <span class="pcard-add-label">ADD</span>
         ${optionsLabel ? `<span class="pcard-options-label" onclick="event.stopPropagation(); openProductOptionsModal(${p.id});">${optionsLabel}</span>` : ''}
       </button>`;

  return `
    <div class="product-card-premium" data-product-id="${p.id}" onclick="openProductModal(${p.id})">
      <div>
        <!-- Image Container -->
        <div class="pcard-img-box">
          <!-- Heart Like Button -->
          <button class="pcard-like-btn ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleProductLike(${p.id});" aria-label="Like product">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'rgba(255,255,255,0.7)'}" stroke-width="2.2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          
          <!-- Centered Product Image -->
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='product_lays.png';" />
          
          <!-- Veg Symbol -->
          ${vegBadgeHTML}
          
          <!-- Carousel Dots -->
          <div class="pcard-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <!-- Weight and ADD button row -->
        <div class="pcard-action-row">
          <span class="pcard-weight">${weightText}</span>
          <div class="qty-btn-wrapper font-sans" data-product-id="${p.id}" onclick="event.stopPropagation();">
            ${buttonHTML}
          </div>
        </div>

        <!-- Price Details -->
        <div class="pcard-price-row">
          <span class="pcard-price">₹${p.price}</span>
          ${mrp > p.price ? `<span class="pcard-mrp">₹${mrp}</span>` : ''}
        </div>

        <!-- Discount -->
        ${discountText ? `<div class="pcard-discount">${discountText}</div>` : ''}

        <!-- Product Name -->
        <h4 class="pcard-title" title="${p.name}">${p.name}</h4>
      </div>

      <!-- Rating & Reviews -->
      <div>
        <div class="pcard-rating-row">
          <span class="pcard-star-icon">★</span>
          <span class="pcard-star-icon">★</span>
          <span class="pcard-star-icon">★</span>
          <span class="pcard-star-icon">★</span>
          <span class="pcard-star-icon">★</span>
          <span class="pcard-reviews-text">${p.reviews || '6.6 lac'}</span>
        </div>

        <!-- Delivery Time -->
        <div class="pcard-delivery-row">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>${p.deliveryTime || '12 mins'}</span>
        </div>
      </div>
    </div>
  `;
}

function renderSingleProductCardHTML(p) {
  const inCart = appState.cart.find(c => c.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  return getProductCardHTML(p, qty, `handleAddProductClick(${p.id})`, (delta) => `changeProductQty(${p.id},${delta})`);
}

function renderDarkProductCardHTML(p, theme) {
  if (appState.themeMode === 'light') {
    const inCart = appState.cart.find(c => c.id === p.id);
    const qty = inCart ? inCart.qty : 0;
    return getProductCardHTML(p, qty, `addToCart(${p.id})`, (delta) => `changeProductQty(${p.id},${delta})`);
  }

  const inCart = appState.cart.find(c => c.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  
  const weightText = p.weight ? p.weight : '1 Unit';
  const mrp = p.mrp || Math.round(p.price * 1.25);
  const discPct = Math.round(((mrp - p.price) / mrp) * 100);
  
  const vegDot = p.veg
    ? `<span style="position:absolute;bottom:6px;right:6px;width:16px;height:16px;background:#ffffff;border-radius:4px;border:1.5px solid #16a34a;display:flex;align-items:center;justify-content:center;z-index:2;">
         <span style="width:7px;height:7px;background:#16a34a;border-radius:50%;display:block;"></span>
       </span>` : '';

  let cardBg = '#152945';
  let textMuted = '#94a3b8';
  let badgeColor = '#38bdf8';
  if (theme === 'tech') { cardBg = '#141923'; textMuted = '#94a3b8'; badgeColor = '#60a5fa'; }
  else if (theme === 'pharmacy') { cardBg = '#122232'; textMuted = '#94a3b8'; badgeColor = '#38bdf8'; }
  else if (theme === 'beauty') { cardBg = '#1c121b'; textMuted = '#c084fc'; badgeColor = '#f472b6'; }
  else if (theme === 'babycare') { cardBg = '#182838'; textMuted = '#a5f3fc'; badgeColor = '#22d3ee'; }

  const changeHandler = `changeCategoryProductQty`;
  const addHandler = `addCategoryProductToCart`;
  const changeArgsSuffix = `, '${p.category}'`;
  
  const buttonHTML = qty > 0
    ? `<div style="display:flex;align-items:center;background:#1c1c1e;border:1.5px solid #16a34a;border-radius:10px;overflow:hidden;height:36px;min-width:76px;z-index:10;box-shadow:0 2px 4px rgba(22,163,74,0.08);">
         <button style="width:26px;height:100%;color:#16a34a;font-size:18px;font-weight:700;background:transparent;border:none;cursor:pointer;" onclick="event.stopPropagation();${changeHandler}(${p.id},-1${changeArgsSuffix})">−</button>
         <span style="flex:1;text-align:center;font-size:13px;font-weight:700;color:#ffffff;font-family:'Outfit',sans-serif;">${qty}</span>
         <button style="width:26px;height:100%;color:#16a34a;font-size:18px;font-weight:700;background:transparent;border:none;cursor:pointer;" onclick="event.stopPropagation();${changeHandler}(${p.id},1${changeArgsSuffix})">+</button>
       </div>`
    : `<div style="display:flex;flex-direction:column;align-items:center;width:100%;">
         <button style="background:#1c1c1e;border:1.5px solid #16a34a;color:#16a34a;border-radius:10px;height:36px;width:100%;font-size:12px;font-weight:800;letter-spacing:0.03em;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.1s;box-shadow:0 2px 4px rgba(22,163,74,0.08);" onclick="event.stopPropagation();${addHandler}(${p.id}${changeArgsSuffix})">ADD</button>
       </div>`;

  const isUmbrella = p.subcategory === 'umbrella';
  const subPillHTML = isUmbrella 
    ? `<span style="font-size:9px; font-weight:700; color:${badgeColor}; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.1); margin-top:4px; max-width:fit-content; font-family:'Outfit',sans-serif;">${p.id === 503 ? 'Manual' : 'Auto Open'}</span>`
    : `<span style="font-size:9px; font-weight:700; color:${badgeColor}; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.1); margin-top:4px; max-width:fit-content; font-family:'Outfit',sans-serif;">Top Deal</span>`;

  return `
    <div style="cursor:pointer; background:${cardBg}; border:1px solid rgba(255,255,255,0.06); border-radius:18px; padding:10px; display:flex; flex-direction:column; justify-content:space-between; position:relative; box-shadow:0 4px 15px rgba(0,0,0,0.15);" onclick="openProductModal(${p.id})" class="product-card-premium" data-product-id="${p.id}">
      <div>
        <!-- Image Container -->
        <div style="position:relative; width:100%; aspect-ratio:1; background:#1c1c1e; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:10px;">
          <img src="${p.img}" alt="${p.name}" style="max-width:92%; max-height:92%; object-fit:contain;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';">
          ${vegDot}
          <!-- Slider dots (bottom left) -->
          <div style="position:absolute; bottom:4px; left:4px; display:flex; gap:2.5px; align-items:center;">
            <span style="width:4px; height:4px; border-radius:50%; background:#94a3b8; display:block;"></span>
            <span style="width:3.5px; height:3.5px; border-radius:50%; background:#cbd5e1; display:block;"></span>
            <span style="width:3.5px; height:3.5px; border-radius:50%; background:#cbd5e1; display:block;"></span>
          </div>
        </div>
        
        <!-- Weight and ADD button row (Matches Photo 3) -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; gap:6px;">
          <div style="border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:4px 8px; font-size:10.5px; font-weight:700; color:#ffffff; font-family:'Outfit',sans-serif; text-align:center; min-width:48px; white-space:nowrap;">
            ${weightText}
          </div>
          <div class="qty-btn-wrapper font-sans" data-product-id="${p.id}" onclick="event.stopPropagation();" style="flex-shrink:0;">
            ${buttonHTML}
          </div>
        </div>

        <!-- Price Details -->
        <div style="display:flex; align-items:baseline; gap:4px; margin-bottom:2px;">
          <span style="font-size:16px; font-weight:850; color:#ffffff; font-family:'Outfit',sans-serif;">₹${p.price}</span>
          <span style="font-size:10.5px; font-weight:500; color:${textMuted}; text-decoration:line-through; font-family:'Outfit',sans-serif;">₹${mrp}</span>
        </div>
        <div style="font-size:9.5px; font-weight:800; color:${badgeColor}; margin-bottom:6px; font-family:'Outfit',sans-serif;">${discPct}% OFF on MRP</div>
        
        <!-- Product Name -->
        <h4 style="font-size:12px; font-weight:700; color:#ffffff; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin:0; font-family:'Outfit',sans-serif; min-height:32px;">${p.name}</h4>
        
        <!-- Sub pill badge -->
        ${subPillHTML}
      </div>

      <!-- Rating and reviews -->
      <div style="display:flex; align-items:center; gap:3px; margin-top:6px; font-family:'Outfit',sans-serif;">
        <span class="material-symbols-outlined" style="font-size:12px; color:#f59e0b; font-variation-settings:'FILL' 1;">star</span>
        <span style="font-size:10px; font-weight:700; color:#ffffff;">${p.rating || '4.8'}</span>
        <span style="font-size:9px; color:${textMuted};">(${p.reviews || '120'})</span>
      </div>
    </div>
  `;
}

function renderDarkCategoryProduct(p, theme) {
  const inCart = appState.cart.find(c => c.id === p.id);
  const qty = inCart ? inCart.qty : 0;
  return getProductCardHTML(p, qty, `addToCart(${p.id})`, (delta) => `changeProductQty(${p.id},${delta})`);
}

// ===== PRODUCT LIKE / FAVORITE FUNCTIONALITY =====
function toggleProductLike(productId) {
  if (!Array.isArray(appState.favorites)) appState.favorites = [];
  const idx = appState.favorites.indexOf(productId);
  const isLiked = idx > -1;

  if (isLiked) {
    appState.favorites.splice(idx, 1);
    showToast('Removed from favorites', 'info');
  } else {
    appState.favorites.push(productId);
    showToast('Saved to your favorites ❤️', 'success');
  }

  saveState();

  // Instant DOM update for all matching like buttons
  document.querySelectorAll(`.product-card-premium[data-product-id="${productId}"] .pcard-like-btn`).forEach(btn => {
    const svg = btn.querySelector('svg');
    if (isLiked) {
      btn.classList.remove('liked');
      if (svg) {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'rgba(255,255,255,0.7)');
      }
    } else {
      btn.classList.add('liked');
      if (svg) {
        svg.setAttribute('fill', '#ef4444');
        svg.setAttribute('stroke', '#ef4444');
      }
      btn.style.transform = 'scale(1.35)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    }
  });
}

// ===== ADD TO CART & VARIANT HANDLERS =====
function handleAddProductClick(productId, variantIndex = 0) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  const inCart = appState.cart.find(c => c.id === productId);
  if (inCart) {
    inCart.qty += 1;
  } else {
    let weight = p.weight;
    let price = p.price;
    let mrp = p.mrp;
    if (p.options && p.options[variantIndex]) {
      weight = p.options[variantIndex].weight;
      price = p.options[variantIndex].price;
      mrp = p.options[variantIndex].mrp;
    }
    appState.cart.push({
      id: p.id,
      name: p.name,
      price: price,
      mrp: mrp,
      weight: weight,
      img: p.img,
      category: p.category,
      veg: p.veg,
      qty: 1
    });
  }

  saveState();
  showToast(`${p.name} added to cart!`, 'success');
  renderProducts(PRODUCTS);
  updateCartBadge();
  updateCartFAB();
  if (appState.currentPage === 'page-cart') initCartPage();
}

function changeProductQty(productId, delta) {
  const inCart = appState.cart.find(c => c.id === productId);
  if (!inCart) {
    if (delta > 0) handleAddProductClick(productId);
    return;
  }

  const newQty = inCart.qty + delta;
  if (newQty <= 0) {
    appState.cart = appState.cart.filter(c => c.id !== productId);
    showToast('Item removed from cart', 'info');
  } else {
    inCart.qty = newQty;
  }

  saveState();
  renderProducts(PRODUCTS);
  if (typeof updateSingleProductCardDOM === 'function') {
    try { updateSingleProductCardDOM(productId); } catch(e) {}
  }
  updateCartBadge();
  updateCartFAB();
  if (appState.currentPage === 'page-cart') initCartPage();
}

// ===== VARIANT OPTIONS MODAL =====
function openProductOptionsModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p || !p.options) {
    handleAddProductClick(productId);
    return;
  }

  const backdrop = document.getElementById('product-options-backdrop');
  const imgEl = document.getElementById('options-modal-img');
  const titleEl = document.getElementById('options-modal-title');
  const listEl = document.getElementById('options-modal-list');

  if (imgEl) imgEl.src = p.img;
  if (titleEl) titleEl.textContent = p.name;

  if (listEl) {
    listEl.innerHTML = p.options.map((opt, idx) => {
      return `
        <div class="p-3 rounded-2xl bg-[#1c1d24] border border-white/10 flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-white font-headline">${opt.weight}</div>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-sm font-black text-white font-mono">₹${opt.price}</span>
              ${opt.mrp > opt.price ? `<span class="text-[11px] text-gray-500 line-through">₹${opt.mrp}</span>` : ''}
              ${opt.discount ? `<span class="text-[10px] font-bold text-[#38bdf8]">${opt.discount}</span>` : ''}
            </div>
          </div>
          <button onclick="handleAddProductClick(${p.id}, ${idx}); closeProductOptionsModal();" class="bg-[#14151a] border-1.5 border-[#22c55e] text-[#22c55e] font-extrabold px-4 py-1.5 rounded-lg text-xs hover:bg-[#22c55e]/10 active:scale-95 transition-all">
            ADD
          </button>
        </div>
      `;
    }).join('');
  }

  if (backdrop) backdrop.classList.add('active');
}

function closeProductOptionsModal() {
  const backdrop = document.getElementById('product-options-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

// ===== PAYMENT OFFERS MODAL =====
function openPaymentOffersModal() {
  const modal = document.getElementById('payment-offers-modal');
  if (modal) modal.classList.add('active');
}

function closePaymentOffersModal() {
  const modal = document.getElementById('payment-offers-modal');
  if (modal) modal.classList.remove('active');
}

function applyPaymentOffer(code, amount) {
  appState.appliedCoupon = { code, discount: amount };
  saveState();
  closePaymentOffersModal();
  showToast(`Coupon ${code} applied! ₹${amount} discount active.`, 'success');
  updateCartFAB();
  if (appState.currentPage === 'page-cart') initCartPage();
}

// ===== GADGET SPOTLIGHT MODAL (TRAIN ESSENTIALS) =====
function openGadgetSpotlightModal() {
  const modal = document.getElementById('gadget-spotlight-modal');
  if (modal) modal.classList.add('active');
}

function closeGadgetSpotlightModal() {
  const modal = document.getElementById('gadget-spotlight-modal');
  if (modal) modal.classList.remove('active');
}

function addSpotlightKitToCart() {
  const existing = appState.cart.find(c => c.id === 9999);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({
      id: 9999,
      name: 'RailQuick 3-in-1 Journey Essentials Kit',
      price: 1499,
      mrp: 2499,
      weight: 'PowerBank + ANC Earphones + Neck Pillow',
      img: 'featured_card_1.jpg',
      category: 'electronics',
      subcategories: ['all', 'electronics'],
      qty: 1
    });
  }
  saveState();
  showToast('✓ Journey Essentials Kit added to cart!', 'success');
  updateCartBadge();
  updateCartFAB();
}
const addSpotlightPhoneToCart = addSpotlightKitToCart;

// ===== UNIFIED BLINKIT FLOATING CART BAR (ONLY ONE) =====
function updateCartFAB() {
  const fab = document.getElementById('cart-fab');
  if (!fab) return;

  const totalQty = appState.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = appState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const searchInput = document.getElementById('overlay-search-input');
  const isSearchInputFocused = searchInput && document.activeElement === searchInput;

  if (totalQty > 0 && !isSearchInputFocused && appState.currentPage === 'page-shop') {
    fab.classList.remove('hidden');

    const countEl = document.getElementById('cart-fab-count');
    const totalEl = document.getElementById('cart-fab-total');
    const previewEl = document.getElementById('cart-fab-preview');

    if (countEl) countEl.textContent = `${totalQty} ITEM${totalQty > 1 ? 'S' : ''}`;
    if (totalEl) totalEl.textContent = `₹${totalPrice}`;

    if (previewEl) {
      previewEl.innerHTML = appState.cart.slice(0, 3).map(item => `
        <div class="w-8 h-8 rounded-full border-2 border-[#12151d] bg-white p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow">
          <img src="${item.img}" alt="${item.name}" class="w-full h-full object-contain" onerror="this.src='product_lays.png'" />
        </div>
      `).join('');
    }
  } else {
    fab.classList.add('hidden');
  }
}

// ===== BLINKIT SNACKS & DRINKS CATEGORY SELECTOR =====
function selectSnacksCategory(catKey) {
  appState.currentFilter = catKey;

  // Highlight selected card in the 8-grid
  document.querySelectorAll('.cat-grid-card').forEach(c => {
    c.classList.remove('active');
  });
  const clicked = document.querySelector(`.cat-grid-card[onclick*="${catKey}"]`);
  if (clicked) clicked.classList.add('active');

  // Deactivate photo 1 tabs
  document.querySelectorAll('.rq-cat-tab').forEach(tab => tab.classList.remove('active'));

  const titles = {
    'chips-namkeen': 'Chips & Namkeen',
    'sweets-chocolates': 'Sweets & Chocolates',
    'drinks-juices': 'Drinks & Juices',
    'tea-coffee': 'Tea, Coffee & Milk Drinks',
    'instant-food': 'Instant Food & Noodles',
    'sauces-spreads': 'Sauces & Spreads',
    'paan-corner': 'Paan Corner & Refreshers',
    'ice-creams': 'Ice Creams & Frozen Desserts'
  };

  const titleEl = document.getElementById('products-section');
  if (titleEl) {
    titleEl.textContent = titles[catKey] || 'Snacks & Drinks';
  }

  renderProducts(PRODUCTS);

  // Smooth scroll to products list
  const listSec = document.getElementById('products-list-section');
  if (listSec) {
    listSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`Showing ${titles[catKey] || catKey}`, 'info');
}

// ===== TRAIN & SEAT SELECTOR MODAL HANDLERS =====
let selectedBerthType = 'Upper Berth';
function openTrainSeatSelectorModal() {
  const modal = document.getElementById('train-seat-selector-modal');
  if (!modal) return;

  if (appState.pnrData) {
    const selTrain = document.getElementById('modal-train-select');
    const inpCoach = document.getElementById('modal-coach-input');
    const inpSeat = document.getElementById('modal-seat-input');
    const selStation = document.getElementById('modal-station-select');

    if (selTrain && appState.pnrData.trainName) {
      for (let i = 0; i < selTrain.options.length; i++) {
        if (selTrain.options[i].text.includes(appState.pnrData.trainNumber) || selTrain.options[i].value.includes(appState.pnrData.trainName)) {
          selTrain.selectedIndex = i;
          break;
        }
      }
    }
    const pax = appState.pnrData.passengerList?.[0];
    if (inpCoach && pax) inpCoach.value = pax.coach || 'B2';
    if (inpSeat && pax) inpSeat.value = pax.berth || '45';
  }
  modal.classList.add('active');
}

function closeTrainSeatSelectorModal() {
  const modal = document.getElementById('train-seat-selector-modal');
  if (modal) modal.classList.remove('active');
}

function setBerthType(type, btn) {
  selectedBerthType = type;
  document.querySelectorAll('.berth-chip').forEach(b => {
    b.className = 'berth-chip px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/15 text-gray-300 bg-[#1c1d24] active:scale-95';
  });
  if (btn) {
    btn.className = 'berth-chip px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10 active:scale-95';
  }
}

function saveTrainSeatDetails() {
  const selTrain = document.getElementById('modal-train-select')?.value || '12301 Rajdhani Express';
  const inpCoach = (document.getElementById('modal-coach-input')?.value || 'B2').trim().toUpperCase();
  const inpSeat = (document.getElementById('modal-seat-input')?.value || '45').trim();
  const selStation = document.getElementById('modal-station-select')?.value || 'Kanpur Central (CNB)';

  if (!inpCoach || !inpSeat) {
    showToast('Please enter both Coach and Seat number', 'warning');
    return;
  }

  const trainParts = selTrain.split(' ');
  const trainNo = trainParts[0];
  const trainName = trainParts.slice(1).join(' ') || selTrain;

  if (!appState.pnrData) {
    appState.pnrData = {};
  }
  appState.pnrData.trainNumber = trainNo;
  appState.pnrData.trainName = trainName;
  appState.pnrData.passengerList = [{
    coach: inpCoach,
    berth: inpSeat,
    berthCode: selectedBerthType,
    currentStatus: 'CNF'
  }];
  appState.pnrData.destination = selStation;
  appState.isPnrConfirmed = true;

  saveState();
  updateShopTopbar();

  // Also update checkout page if open
  const trainEl = document.getElementById('checkout-train');
  const seatEl = document.getElementById('checkout-seat');
  const stationEl = document.getElementById('checkout-station');
  if (trainEl) trainEl.textContent = `${trainName} (#${trainNo})`;
  if (seatEl) seatEl.textContent = `Coach ${inpCoach}, Seat ${inpSeat} (${selectedBerthType})`;
  if (stationEl) stationEl.textContent = selStation;

  closeTrainSeatSelectorModal();
  showToast(`✓ Updated! Delivering to Coach ${inpCoach}, Seat ${inpSeat}`, 'success');
}


// ===== CATEGORY FILTERING (PHOTO 1 INTERACTIVE) =====
function filterCategory(catKey, element) {
  appState.currentFilter = catKey;

  // Update active state in category strip
  document.querySelectorAll('.rq-cat-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-cat') === catKey) {
      tab.classList.add('active');
    }
  });

  if (element && element.classList.contains('rq-cat-tab')) {
    element.classList.add('active');
  }

  // Toggle category-specific hero headers right below the category strip
  const homeView = document.getElementById('home-main-view');
  const navratriView = document.getElementById('navratri-main-view');
  const elecView = document.getElementById('electronics-main-view');
  const beautyView = document.getElementById('beauty-main-view');
  const pharmView = document.getElementById('pharmacy-main-view');

  if (homeView) homeView.classList.toggle('hidden', catKey !== 'all');
  if (navratriView) navratriView.classList.toggle('hidden', catKey !== 'navratri');
  if (elecView) elecView.classList.toggle('hidden', catKey !== 'electronics');
  if (beautyView) beautyView.classList.toggle('hidden', catKey !== 'beauty');
  if (pharmView) pharmView.classList.toggle('hidden', catKey !== 'pharmacy');

  // Update section title & subtitle dynamically
  const sectionTitleEl = document.getElementById('products-section');
  const sectionSubEl = document.querySelector('#products-list-section .products-section-header div div');
  
  if (sectionTitleEl) {
    if (catKey === 'all') {
      sectionTitleEl.textContent = 'Trending Essentials';
      if (sectionSubEl) sectionSubEl.innerHTML = '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#22c55e;"></span> Delivered in 12 mins to your seat';
    } else if (catKey === 'navratri') {
      sectionTitleEl.textContent = 'Revel in the spirit of Navratri';
      if (sectionSubEl) sectionSubEl.innerHTML = 'Get idols, kalash, chunri and more';
    } else if (catKey === 'electronics') {
      sectionTitleEl.textContent = 'Top Deals';
      if (sectionSubEl) sectionSubEl.innerHTML = '<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#22c55e;"></span> Delivered in 12-16 mins to your seat';
    } else if (catKey === 'beauty') {
      sectionTitleEl.textContent = 'Festive Glam & Grooming';
      if (sectionSubEl) sectionSubEl.innerHTML = 'Hair, Skincare & Fragrance essentials';
    } else if (catKey === 'pharmacy') {
      sectionTitleEl.textContent = 'Station Pharmacy & First Aid';
      if (sectionSubEl) sectionSubEl.innerHTML = 'Express medicinal care at your coach';
    } else {
      sectionTitleEl.textContent = `${catKey.toUpperCase()} Essentials`;
    }
  }

  renderProducts(PRODUCTS);

  // ALWAYS scroll smoothly to the very top so the category banner is right at the top
  const pageShop = document.getElementById('page-shop');
  if (pageShop) {
    pageShop.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Navratri subcategory hotspot actions
function openNavratriSpotlight(type) {
  if (type === 'necklace') {
    addToCart(1207);
    showToast('✓ Added Ethnic Necklace Set (₹299) to cart!', 'success');
  } else {
    filterCategory('navratri');
  }
}

function filterNavratriSub(subType) {
  filterCategory('navratri');
  const titles = {
    pooja: 'Flowers & Pooja Needs',
    kanjak: 'Kanjak Corner Essentials',
    fasting: 'Vrat & Fasting Essentials',
    kids: 'Kids Mela Toys & Festive Needs'
  };
  showToast(`Showing ${titles[subType] || 'Navratri Essentials'}`, 'info');
}

// Electronics subcategory carousel actions
function filterElectronicsSub(subType) {
  filterCategory('electronics');
  const titles = {
    earbuds: 'Earbuds & Headsets',
    firetv: 'Fire TV & Streaming',
    powerbanks: 'Power Banks & Chargers',
    portronics: 'Brand in Focus: Portronics'
  };
  showToast(`Viewing ${titles[subType] || 'Electronics'}`, 'info');
}

// ===== PRODUCTS RENDERER (PHOTO 3 3-COLUMN GRID) =====
function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filter = appState.currentFilter || 'all';
  const query = (appState.searchQuery || '').toLowerCase().trim();

  let filtered = products.filter(p => {
    const matchCat = (filter === 'all') ||
                     (p.category === filter) ||
                     (Array.isArray(p.subcategories) && p.subcategories.includes(filter));
    const matchQuery = !query ||
                       p.name.toLowerCase().includes(query) ||
                       (p.description && p.description.toLowerCase().includes(query)) ||
                       (p.category && p.category.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="grid-column: span 3; text-align: center; padding: 40px 10px; color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 600; font-family: 'Outfit', sans-serif;">
        <span class="material-symbols-outlined" style="font-size: 32px; display: block; margin-bottom: 8px; color: rgba(255,255,255,0.2);">inventory_2</span>
        No products found in this category.
      </div>
    `;
    updateCartFAB();
    return;
  }

  grid.innerHTML = filtered.map(p => renderSingleProductCardHTML(p)).join('');
  updateCartFAB();
}

window.filterMonsoonSubcategory = function(subcat, element) {
  const isLight = appState.themeMode === 'light';
  
  if (element) {
    document.querySelectorAll('.monsoon-subcat').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = isLight ? '#f3f4f6' : 'rgba(255,255,255,0.08)';
      btn.style.color = isLight ? '#1a1a1a' : '#ffffff';
      btn.style.border = isLight ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.1)';
      btn.style.boxShadow = 'none';
      const label = btn.querySelector('span:last-child');
      if (label) label.style.color = isLight ? '#4b5563' : 'rgba(255,255,255,0.85)';
    });
    element.classList.add('active');
    element.style.background = isLight ? '#118a4e' : '#ffffff';
    element.style.color = isLight ? '#ffffff' : '#0b1e36';
    element.style.border = 'none';
    element.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
    const label = element.querySelector('span:last-child');
    if (label) label.style.color = isLight ? '#ffffff' : '#0b1e36';
  }

  const grid = document.getElementById('monsoon-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = 'monsoon';
  const filtered = PRODUCTS.filter(p => p.category === 'monsoon' && p.subcategory === subcat);
  
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:span 2;text-align:center;padding:40px 0;color:rgba(255,255,255,0.45);font-size:12px;font-weight:600;">No products in this subcategory.</div>`;
    return;
  }
  
  grid.innerHTML = filtered.map(p => renderDarkCategoryProduct(p, 'monsoon')).join('');
};

window.renderTechCategoryProducts = function() {
  const grid = document.getElementById('tech-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = 'tech';
  const filtered = PRODUCTS.filter(p => p.category === 'tech');
  grid.innerHTML = filtered.map(p => renderDarkCategoryProduct(p, 'tech')).join('');
};

window.renderPharmacyCategoryProducts = function() {
  const grid = document.getElementById('pharmacy-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = 'pharmacy';
  const filtered = PRODUCTS.filter(p => p.category === 'pharmacy');
  grid.innerHTML = filtered.map(p => renderDarkCategoryProduct(p, 'pharmacy')).join('');
};

window.renderBeautyCategoryProducts = function() {
  const grid = document.getElementById('beauty-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = 'beauty';
  const filtered = PRODUCTS.filter(p => p.category === 'beauty');
  grid.innerHTML = filtered.map(p => renderDarkCategoryProduct(p, 'beauty')).join('');
};

window.renderBabyCategoryProducts = function() {
  const grid = document.getElementById('baby-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = 'babycare';
  const filtered = PRODUCTS.filter(p => p.category === 'babycare');
  grid.innerHTML = filtered.map(p => renderDarkCategoryProduct(p, 'babycare')).join('');
};

function renderCustomCategoryLayout(cat) {
  const container = document.getElementById('custom-category-content-container');
  if (!container) return;
  
  const activeLabel = document.querySelector('.rq-cdt.active')?.querySelector('.rq-cdt-label')?.textContent?.trim() || '';
  const isLight = appState.themeMode === 'light';

  // Monsoon theme styling
  const monsoonBg = isLight ? '#ffffff' : '#0b1e36';
  const monsoonText = isLight ? '#1a1a1a' : '#ffffff';
  const monsoonTextMuted = isLight ? '#4b5563' : 'rgba(255,255,255,0.85)';
  const monsoonSubcatBg = isLight ? '#f3f4f6' : 'rgba(255,255,255,0.08)';
  const monsoonSubcatBorder = isLight ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.1)';
  const monsoonSubcatActiveBg = isLight ? '#118a4e' : '#ffffff';
  const monsoonSubcatActiveColor = isLight ? '#ffffff' : '#0b1e36';
  const monsoonBannerBg = isLight ? '#f3f4f6' : '#1b3d6b';
  const monsoonBannerText = isLight ? '#118a4e' : '#ffffff';

  // Tech theme styling
  const techBg = isLight ? '#ffffff' : '#090d16';
  const techText = isLight ? '#1a1a1a' : '#ffffff';

  // Pharmacy theme styling
  const pharmBg = isLight ? '#ffffff' : '#091b29';
  const pharmText = isLight ? '#1a1a1a' : '#ffffff';
  const pharmTextMuted = isLight ? '#4b5563' : 'rgba(255,255,255,0.85)';
  const pharmCircleBg = isLight ? '#f3f4f6' : '#102e46';
  const pharmCircleBorder = isLight ? '1px solid #e5e7eb' : '1px solid #1e425f';

  // Beauty theme styling
  const beautyBg = isLight ? '#ffffff' : '#1d0e1b';
  const beautyText = isLight ? '#1a1a1a' : '#ffffff';

  // Baby Care theme styling
  const babyBg = isLight ? '#ffffff' : '#11202e';
  const babyText = isLight ? '#1a1a1a' : '#ffffff';

  if (cat === 'monsoon') {
    container.innerHTML = `
      <div style="background:${monsoonBg}; padding:16px 14px; min-height:80vh; color:${monsoonText};">
        <!-- Monsoon Subcategories Row -->
        <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:14px; margin-bottom:16px;" class="scrollbar-none">
          <!-- Active Umbrella -->
          <div onclick="filterMonsoonSubcategory('umbrella', this)" class="monsoon-subcat active" style="flex:0 0 auto; display:flex; flex-direction:column; align-items:center; background:${monsoonSubcatActiveBg}; color:${monsoonSubcatActiveColor}; border-radius:18px; padding:12px 14px; text-align:center; min-width:85px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
            <span class="material-symbols-outlined" style="font-size:24px; color:#ec4899;">umbrella</span>
            <span style="font-size:10px; font-weight:800; margin-top:6px; font-family:'Outfit',sans-serif; color:${monsoonSubcatActiveColor};">Umbrella</span>
          </div>
          <!-- Raincoats -->
          <div onclick="filterMonsoonSubcategory('raincoat', this)" class="monsoon-subcat" style="flex:0 0 auto; display:flex; flex-direction:column; align-items:center; background:${monsoonSubcatBg}; border:${monsoonSubcatBorder}; border-radius:18px; padding:12px 14px; text-align:center; min-width:85px; cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:24px; color:#fbbf24;">rainy</span>
            <span style="font-size:10px; font-weight:700; margin-top:6px; font-family:'Outfit',sans-serif; color:${monsoonTextMuted};">Raincoats</span>
          </div>
          <!-- Cloth Clips -->
          <div onclick="filterMonsoonSubcategory('clips', this)" class="monsoon-subcat" style="flex:0 0 auto; display:flex; flex-direction:column; align-items:center; background:${monsoonSubcatBg}; border:${monsoonSubcatBorder}; border-radius:18px; padding:12px 14px; text-align:center; min-width:85px; cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:24px; color:#60a5fa;">wc</span>
            <span style="font-size:10px; font-weight:700; margin-top:6px; font-family:'Outfit',sans-serif; color:${monsoonTextMuted};">Clips & Hangers</span>
          </div>
          <!-- Soups & Snacks -->
          <div onclick="filterMonsoonSubcategory('soups', this)" class="monsoon-subcat" style="flex:0 0 auto; display:flex; flex-direction:column; align-items:center; background:${monsoonSubcatBg}; border:${monsoonSubcatBorder}; border-radius:18px; padding:12px 14px; text-align:center; min-width:85px; cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:24px; color:#f87171;">soup_kitchen</span>
            <span style="font-size:10px; font-weight:700; margin-top:6px; font-family:'Outfit',sans-serif; color:${monsoonTextMuted};">Soups & Snacks</span>
          </div>
          <!-- Cough & Cold -->
          <div onclick="filterMonsoonSubcategory('health', this)" class="monsoon-subcat" style="flex:0 0 auto; display:flex; flex-direction:column; align-items:center; background:${monsoonSubcatBg}; border:${monsoonSubcatBorder}; border-radius:18px; padding:12px 14px; text-align:center; min-width:85px; cursor:pointer;">
            <span class="material-symbols-outlined" style="font-size:24px; color:#34d399;">medical_services</span>
            <span style="font-size:10px; font-weight:700; margin-top:6px; font-family:'Outfit',sans-serif; color:${monsoonTextMuted};">Cough & Cold</span>
          </div>
        </div>
        
        <!-- Monsoon Product Grid -->
        <div id="monsoon-products-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <!-- Loaded dynamically -->
        </div>
        
        <!-- See all products bottom banner -->
        <div style="margin-top:20px; background:${monsoonBannerBg}; border-radius:16px; padding:16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; color:${monsoonBannerText};" onclick="filterCategory('all', null); setRQCatByLabel('All')">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="display:flex; -space-x:8px;">
              <span class="material-symbols-outlined" style="background:${isLight ? '#118a4e' : '#ffffff'}; color:${isLight ? '#ffffff' : '#1b3d6b'}; font-size:18px; border-radius:50%; padding:3px;">umbrella</span>
            </div>
            <span style="font-size:12px; font-weight:800; font-family:'Outfit',sans-serif; color:${isLight ? '#118a4e' : '#ffffff'};">See all products</span>
          </div>
          <span class="material-symbols-outlined" style="font-size:18px; color:${monsoonBannerText};">chevron_right</span>
        </div>
      </div>
    `;
    filterMonsoonSubcategory('umbrella');
  } 
  else if (cat === 'tech') {
    container.innerHTML = `
      <div style="background:${techBg}; padding:16px 14px; min-height:80vh; color:${techText};">
        <!-- Horizontal Brand Banners -->
        <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:12px; margin-bottom:16px;" class="scrollbar-none">
          <!-- Banner 1 -->
          <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius:14px; border:2px solid #3b82f6; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <span style="font-size:7px; font-weight:900; background:#fff; color:#1e3a8a; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Featured</span>
            <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">LED Lights</span>
          </div>
          <!-- Banner 2 -->
          <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #1f2937, #111827); border-radius:14px; border:2px solid #22c55e; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <span style="font-size:8px; font-weight:900; color:#22c55e; font-family:'Outfit',sans-serif; text-transform:uppercase; letter-spacing:0.05em;">DIGITEK</span>
            <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">Ring Lights</span>
          </div>
          <!-- Banner 3 -->
          <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #1e1b4b, #312e81); border-radius:14px; border:2px solid #2563eb; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <span style="font-size:7px; font-weight:900; background:#fff; color:#1e1b4b; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Power</span>
            <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">Power Banks</span>
          </div>
          <!-- Banner 4 -->
          <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #311042, #581c87); border-radius:14px; border:2px solid #c084fc; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
            <span style="font-size:7px; font-weight:900; background:#fff; color:#311042; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Speakers</span>
            <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">BT Audio</span>
          </div>
        </div>

        <!-- Big Summer Cooling Card -->
        <div style="background:#e5e7eb; border-radius:20px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; color:#111827; position:relative; overflow:hidden;">
          <div style="max-width:55%;">
            <h4 style="font-size:16px; font-weight:900; margin:0; font-family:'Outfit',sans-serif; color:#111827; line-height:1.25;">Summers are here!</h4>
            <p style="font-size:10px; color:#4b5563; margin:4px 0 12px 0; font-family:'Outfit',sans-serif; font-weight:500;">Beat the heat with fans & coolers</p>
            <button style="background:#111827; color:#ffffff; font-size:10px; font-weight:850; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Outfit',sans-serif;">Shop now</button>
          </div>
          <div style="width:100px; height:90px; display:flex; align-items:center; justify-content:center;">
            <img src="https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=140&h=140&fit=crop" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;">
          </div>
        </div>

        <h3 style="font-size:14px; font-weight:900; color:${techText}; margin:0 0 12px 0; font-family:'Outfit',sans-serif;">Top Deals</h3>
        <!-- Product Grid -->
        <div id="tech-products-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <!-- Loaded dynamically -->
        </div>
      </div>
    `;
    renderTechCategoryProducts();
  }
  else if (cat === 'hygiene') {
    if (activeLabel.toLowerCase() === 'pharmacy') {
      container.innerHTML = `
        <div style="background:${pharmBg}; padding:16px 14px; min-height:80vh; color:${pharmText};">
          <!-- Large Pharmacy Insulin/Consultation Banner -->
          <div style="background:linear-gradient(135deg, #0284c7, #0369a1); border-radius:20px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; position:relative; overflow:hidden;">
            <div style="max-width:60%;">
              <h4 style="font-size:16px; font-weight:900; margin:0; font-family:'Outfit',sans-serif; color:#ffffff; line-height:1.25;">Medicines and insulins available</h4>
              <p style="font-size:10px; color:rgba(255,255,255,0.85); margin:6px 0 12px 0; font-family:'Outfit',sans-serif;"><span style="background:#fbbf24; color:#1e293b; font-size:8px; font-weight:900; padding:1px 4px; border-radius:3px; margin-right:4px;">FREE</span>Doctor consultation after ordering</p>
              <button style="background:#ffffff; color:#0369a1; font-size:10px; font-weight:850; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Outfit',sans-serif;">Shop now</button>
            </div>
            <div style="width:90px; height:90px; display:flex; align-items:center; justify-content:center;">
              <img src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=140&h=140&fit=crop" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;">
            </div>
          </div>

          <!-- Featured Symptoms Row -->
          <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:12px; margin-bottom:16px;" class="scrollbar-none">
            <!-- Symptom 1 -->
            <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #581c87, #3b0764); border-radius:14px; border:2px solid #5b21b6; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
              <span style="font-size:7px; font-weight:900; background:#fff; color:#581c87; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Featured</span>
              <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">Headache</span>
            </div>
            <!-- Symptom 2 -->
            <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #78350f, #451a03); border-radius:14px; border:2px solid #d97706; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
              <span style="font-size:7px; font-weight:900; background:#fff; color:#78350f; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Featured</span>
              <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">Fever</span>
            </div>
            <!-- Symptom 3 -->
            <div style="flex:0 0 130px; height:80px; background:linear-gradient(135deg, #1e3a8a, #172554); border-radius:14px; border:2px solid #2563eb; padding:8px; display:flex; flex-direction:column; justify-content:space-between; cursor:pointer;">
              <span style="font-size:7px; font-weight:900; background:#fff; color:#1e3a8a; padding:1px 4px; border-radius:3px; max-width:fit-content; text-transform:uppercase;">Featured</span>
              <span style="font-size:11px; font-weight:800; font-family:'Outfit',sans-serif; color:#fff;">Pain Relief</span>
            </div>
          </div>

          <!-- Shop by Category circles -->
          <h3 style="font-size:14px; font-weight:900; color:${pharmText}; margin:16px 0 12px 0; font-family:'Outfit',sans-serif;">Shop by category</h3>
          <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; margin-bottom:20px;" class="scrollbar-none">
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; flex:0 0 auto;">
              <div style="width:60px; height:60px; border-radius:50%; background:${pharmCircleBg}; border:${pharmCircleBorder}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60&h=60&fit=crop" style="max-width:80%; max-height:80%; object-fit:contain;">
              </div>
              <span style="font-size:9px; font-weight:700; color:${pharmTextMuted}; margin-top:6px; line-height:1.2; font-family:'Outfit',sans-serif;">Cough, Cold</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; flex:0 0 auto;">
              <div style="width:60px; height:60px; border-radius:50%; background:${pharmCircleBg}; border:${pharmCircleBorder}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1550572017-edd951b55104?w=60&h=60&fit=crop" style="max-width:80%; max-height:80%; object-fit:contain;">
              </div>
              <span style="font-size:9px; font-weight:700; color:${pharmTextMuted}; margin-top:6px; line-height:1.2; font-family:'Outfit',sans-serif;">Stomach Care</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; flex:0 0 auto;">
              <div style="width:60px; height:60px; border-radius:50%; background:${pharmCircleBg}; border:${pharmCircleBorder}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=60&h=60&fit=crop" style="max-width:80%; max-height:80%; object-fit:contain;">
              </div>
              <span style="font-size:9px; font-weight:700; color:${pharmTextMuted}; margin-top:6px; line-height:1.2; font-family:'Outfit',sans-serif;">Pain & Aid</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; cursor:pointer; flex:0 0 auto;">
              <div style="width:60px; height:60px; border-radius:50%; background:${pharmCircleBg}; border:${pharmCircleBorder}; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=60&h=60&fit=crop" style="max-width:80%; max-height:80%; object-fit:contain;">
              </div>
              <span style="font-size:9px; font-weight:700; color:${pharmTextMuted}; margin-top:6px; line-height:1.2; font-family:'Outfit',sans-serif;">Antibiotics</span>
            </div>
          </div>

          <h3 style="font-size:14px; font-weight:900; color:${pharmText}; margin:0 0 12px 0; font-family:'Outfit',sans-serif;">Top Products</h3>
          <!-- Product Grid -->
          <div id="pharmacy-products-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <!-- Loaded dynamically -->
          </div>
        </div>
      `;
      renderPharmacyCategoryProducts();
    } else {
      container.innerHTML = `
        <div style="background:${beautyBg}; padding:16px 14px; min-height:80vh; color:${beautyText};">
          <!-- Large Beauty Banner -->
          <div style="background:linear-gradient(135deg, #ec4899, #db2777); border-radius:20px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div style="max-width:60%;">
              <h4 style="font-size:16px; font-weight:900; margin:0; font-family:'Outfit',sans-serif; color:#ffffff; line-height:1.25;">Glow & Groom Essentials</h4>
              <p style="font-size:10px; color:rgba(255,255,255,0.85); margin:6px 0 12px 0; font-family:'Outfit',sans-serif;">Get flat 15% off on major skincare brands</p>
              <button style="background:#ffffff; color:#db2777; font-size:10px; font-weight:850; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Outfit',sans-serif;">Shop now</button>
            </div>
            <div style="width:90px; height:90px; display:flex; align-items:center; justify-content:center;">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=140&h=140&fit=crop" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;">
            </div>
          </div>

          <h3 style="font-size:14px; font-weight:900; color:${beautyText}; margin:0 0 12px 0; font-family:'Outfit',sans-serif;">Beauty & Care</h3>
          <!-- Product Grid -->
          <div id="beauty-products-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <!-- Loaded dynamically -->
          </div>
        </div>
      `;
      renderBeautyCategoryProducts();
    }
  } 
  else if (cat === 'comfort') {
    container.innerHTML = `
      <div style="background:${babyBg}; padding:16px 14px; min-height:80vh; color:${babyText};">
        <!-- Large Baby Care Banner -->
        <div style="background:linear-gradient(135deg, #06b6d4, #0891b2); border-radius:20px; padding:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div style="max-width:60%;">
            <h4 style="font-size:16px; font-weight:900; margin:0; font-family:'Outfit',sans-serif; color:#ffffff; line-height:1.25;">Baby Care & Wipes</h4>
            <p style="font-size:10px; color:rgba(255,255,255,0.85); margin:6px 0 12px 0; font-family:'Outfit',sans-serif;">Extra gentle protection for your little ones</p>
            <button style="background:#ffffff; color:#0891b2; font-size:10px; font-weight:850; padding:6px 12px; border-radius:8px; border:none; cursor:pointer; font-family:'Outfit',sans-serif;">Shop now</button>
          </div>
          <div style="width:90px; height:90px; display:flex; align-items:center; justify-content:center;">
            <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=140&h=140&fit=crop" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;">
          </div>
        </div>

        <h3 style="font-size:14px; font-weight:900; color:${babyText}; margin:0 0 12px 0; font-family:'Outfit',sans-serif;">Baby Essentials</h3>
        <!-- Product Grid -->
        <div id="baby-products-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <!-- Loaded dynamically -->
        </div>
      </div>
    `;
    renderBabyCategoryProducts();
  }
}

function renderCategoryProducts(cat) {
  const grid = document.getElementById('category-products-grid');
  if (!grid) return;
  
  grid.dataset.activeCategory = cat; // Set active category
  const filtered = PRODUCTS.filter(p => p.category === cat);
  
  if (!filtered.length) {
    grid.innerHTML = `<div class="col-span-2 text-center py-16 text-gray-400 text-xs font-semibold">No items available.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const inCart = appState.cart.find(c => c.id === p.id);
    const qty = inCart ? inCart.qty : 0;
    return getProductCardHTML(p, qty, `addCategoryProductToCart(${p.id},'${cat}')`, (delta) => `changeCategoryProductQty(${p.id},${delta},'${cat}')`);
  }).join('');
}

function addCategoryProductToCart(id, cat) {
  addToCart(id);
  if (document.getElementById('category-products-grid')) {
    renderCategoryProducts(cat);
  } else if (cat === 'tech' && typeof renderTechCategoryProducts === 'function') {
    renderTechCategoryProducts();
  } else if (cat === 'pharmacy' && typeof renderPharmacyCategoryProducts === 'function') {
    renderPharmacyCategoryProducts();
  } else if (cat === 'beauty' && typeof renderBeautyCategoryProducts === 'function') {
    renderBeautyCategoryProducts();
  } else if (cat === 'babycare' && typeof renderBabyCategoryProducts === 'function') {
    renderBabyCategoryProducts();
  } else if (cat === 'monsoon' && typeof filterMonsoonSubcategory === 'function') {
    const activeSubcat = document.querySelector('.monsoon-subcat.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    if (activeSubcat) {
      filterMonsoonSubcategory(activeSubcat);
    }
  }
}

function changeCategoryProductQty(id, delta, cat) {
  changeProductQty(id, delta);
  if (document.getElementById('category-products-grid')) {
    renderCategoryProducts(cat);
  } else if (cat === 'tech' && typeof renderTechCategoryProducts === 'function') {
    renderTechCategoryProducts();
  } else if (cat === 'pharmacy' && typeof renderPharmacyCategoryProducts === 'function') {
    renderPharmacyCategoryProducts();
  } else if (cat === 'beauty' && typeof renderBeautyCategoryProducts === 'function') {
    renderBeautyCategoryProducts();
  } else if (cat === 'babycare' && typeof renderBabyCategoryProducts === 'function') {
    renderBabyCategoryProducts();
  } else if (cat === 'monsoon' && typeof filterMonsoonSubcategory === 'function') {
    const activeSubcat = document.querySelector('.monsoon-subcat.active')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    if (activeSubcat) {
      filterMonsoonSubcategory(activeSubcat);
    }
  }
}

let isListening = false;

function startVoiceSearch() {
  if (isListening) return;
  
  const searchInput = document.getElementById('product-search');
  const micIcon = document.getElementById('mic-icon');
  
  if (!searchInput) return;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    isListening = true;
    showToast('Voice Search: Listening...', 'info');
    if (micIcon) {
      micIcon.textContent = 'settings_voice';
      micIcon.style.color = '#EF4444';
      micIcon.classList.add('animate-pulse');
    }
    
    const sampleQueries = ['lays', 'water', 'coca cola', 'chocolate', 'brush'];
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    
    setTimeout(() => {
      let i = 0;
      searchInput.value = '';
      const interval = setInterval(() => {
        if (i < randomQuery.length) {
          searchInput.value += randomQuery[i];
          i++;
          filterProducts(searchInput.value);
        } else {
          clearInterval(interval);
          isListening = false;
          if (micIcon) {
            micIcon.textContent = 'mic';
            micIcon.style.color = '';
            micIcon.classList.remove('animate-pulse');
          }
          showToast(`Searched for "${randomQuery}"`, 'success');
        }
      }, 120);
    }, 1200);
    
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onstart = () => {
    isListening = true;
    showToast('Listening to your voice...', 'info');
    if (micIcon) {
      micIcon.textContent = 'settings_voice';
      micIcon.style.color = '#EF4444';
      micIcon.classList.add('animate-pulse');
    }
  };
  
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    searchInput.value = result;
    filterProducts(result);
    showToast(`Voice input: "${result}"`, 'success');
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    showToast('Speech recognition failed. Try typing!', 'warning');
  };
  
  recognition.onend = () => {
    isListening = false;
    if (micIcon) {
      micIcon.textContent = 'mic';
      micIcon.style.color = '';
      micIcon.classList.remove('animate-pulse');
    }
  };
  
  recognition.start();
}

function filterProducts(q) {
  appState.searchQuery = q.toLowerCase();
  renderProducts(PRODUCTS);
  
  if (q.trim().length > 0) {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function scrollToProducts() { document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' }); }
function showNotif() { showToast('Delivering orders to platforms 1-8 currently.', 'info'); }

// ===== CART LOGIC =====
function getCartTotals() {
  const subtotal = appState.cart.reduce((s, c) => s + c.price * c.qty, 0);
  let discount = 0;
  let deliveryFee = subtotal >= 199 || appState.cart.length === 0 ? 0 : 30;
  const handlingFee = appState.cart.length > 0 ? 12 : 0;

  if (appState.appliedCoupon === 'RAILQUICK15') {
    discount = Math.min(Math.round(subtotal * 0.15), 50);
  } else if (appState.appliedCoupon === 'RAIL50' && subtotal >= 200) {
    discount = Math.min(Math.round(subtotal * 0.50), 100);
  } else if (appState.appliedCoupon === 'CHAI20') {
    discount = Math.min(Math.round(subtotal * 0.20), 30);
  } else if (appState.appliedCoupon === 'RAIL100' && subtotal >= 300) {
    discount = 100;
  } else if (appState.appliedCoupon === 'FREEDEL') {
    deliveryFee = 0;
  }

  const tip = appState.tipAmount || 0;
  const donation = appState.donationAmount || 0;
  const giftPack = appState.giftPackaging ? 30 : 0;
  const gst = 0; // Blinkit model: transparent all-inclusive pricing
  const total = appState.cart.length > 0 ? (Math.max(subtotal - discount, 0) + deliveryFee + handlingFee + tip + donation + giftPack) : 0;

  return { subtotal, discount, gst, deliveryFee, handlingFee, tip, donation, giftPack, total };
}

function applyPromoCode() {
  const input = document.getElementById('promo-input');
  const status = document.getElementById('promo-status');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) { showToast('Please enter a coupon code', 'warning'); return; }
  
  const subtotal = appState.cart.reduce((s, c) => s + c.price * c.qty, 0);

  let valid = false;
  let msg = '';

  if (code === 'RAILQUICK15') {
    valid = true;
    msg = 'Coupon applied: 15% OFF (Max ₹50)';
  } else if (code === 'RAIL50') {
    if (subtotal >= 200) {
      valid = true;
      msg = 'Coupon applied: 50% OFF (Max ₹100)';
    } else {
      showToast('Valid on orders above ₹200 only', 'warning');
      return;
    }
  } else if (code === 'CHAI20') {
    valid = true;
    msg = 'Coupon applied: 20% OFF (Max ₹30)';
  } else if (code === 'RAIL100') {
    if (subtotal >= 300) {
      valid = true;
      msg = 'Coupon applied: Flat ₹100 OFF';
    } else {
      showToast('Valid on orders above ₹300 only', 'warning');
      return;
    }
  } else if (code === 'FREEDEL') {
    valid = true;
    msg = 'Coupon applied: FREE Delivery';
  }

  if (valid) {
    appState.appliedCoupon = code;
    status.textContent = msg; 
    status.className = 'text-[10px] font-bold text-primary mt-2';
    status.style.display = 'block';
    showToast('Coupon applied!', 'success'); 
    updateCartSummary();
    renderCartPremiumBlocks();
  } else {
    showToast('Invalid coupon code', 'error');
    status.textContent = 'Invalid coupon code'; 
    status.className = 'text-[10px] font-bold text-red-500 mt-2';
    status.style.display = 'block';
  }
}

function updateSingleProductCardDOM(productId) {
  const cards = document.querySelectorAll(`.product-card-premium[data-product-id="${productId}"]`);
  cards.forEach(card => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const inCart = appState.cart.find(c => c.id === productId);
    const qty = inCart ? inCart.qty : 0;
    
    const wrapper = card.querySelector(`.qty-btn-wrapper[data-product-id="${productId}"]`);
    if (wrapper) {
      const grid = card.closest('#category-products-grid') || card.closest('[id$="-products-grid"]');
      const cat = grid ? (grid.dataset.activeCategory || '') : '';
      const changeHandler = grid ? `changeCategoryProductQty` : `changeProductQty`;
      const addHandler = grid ? `addCategoryProductToCart` : `addToCart`;
      const changeArgsSuffix = grid ? `, '${cat}'` : '';

      const changeClickCodeFunc = (delta) => `${changeHandler}(${product.id},${delta}${changeArgsSuffix})`;
      const addClickCode = `${addHandler}(${product.id}${changeArgsSuffix})`;

      if (appState.themeMode === 'dark') {
        let optionsLabel = '';
        if (product.id === 1001) optionsLabel = '3 options';
        else if (product.id === 1003 || product.id === 1004 || product.id === 1006 || product.id === 1008 || (product.name && product.name.includes('Red Rock Deli'))) {
          optionsLabel = '2 options';
        }

        wrapper.innerHTML = qty > 0
          ? `<div style="display:flex;align-items:center;background:#1A1C22;border:1px solid #2ecc71;border-radius:8px;overflow:hidden;height:28px;min-width:60px;z-index:10;">
               <button style="width:18px;height:100%;color:#2ecc71;font-size:14px;font-weight:700;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;" onclick="event.stopPropagation();${changeClickCodeFunc(-1)}">−</button>
               <span style="flex:1;text-align:center;font-size:11px;font-weight:700;color:#ffffff;font-family:'Outfit',sans-serif;">${qty}</span>
               <button style="width:18px;height:100%;color:#2ecc71;font-size:14px;font-weight:700;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;" onclick="event.stopPropagation();${changeClickCodeFunc(1)}">+</button>
             </div>`
          : `<button style="background:transparent;border:1px solid #2ecc71;color:#2ecc71;border-radius:8px;height:28px;min-width:60px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all 0.1s;font-size:10.5px;font-weight:800;letter-spacing:0.02em;line-height:1.05;padding:2px 4px;" onclick="event.stopPropagation();${addClickCode}">
               <span style="display:block;">ADD</span>
               ${optionsLabel ? `<span style="font-size:7px;font-weight:700;color:#2ecc71;display:block;margin-top:1px;line-height:1;">${optionsLabel}</span>` : ''}
             </button>`;
      } else {
        let optionsLabel = '';
        if (product.id === 1001) optionsLabel = '<span style="font-size:7px;font-weight:700;color:#16a34a;margin-top:0px;display:block;line-height:1;">3 options</span>';
        else if (product.id === 1003 || product.id === 1004 || product.id === 1006 || product.id === 1008 || (product.name && product.name.includes('Red Rock Deli'))) {
          optionsLabel = '<span style="font-size:7px;font-weight:700;color:#16a34a;margin-top:0px;display:block;line-height:1;">2 options</span>';
        }

        wrapper.innerHTML = qty > 0
          ? `<div style="display:flex;align-items:center;background:var(--qty-btn-bg, #ffffff);border:1px solid #16a34a;border-radius:8px;overflow:hidden;height:28px;min-width:54px;z-index:10;box-shadow:0 1px 3px rgba(22,163,74,0.06);">
               <button style="width:16px;height:100%;color:#16a34a;font-size:14px;font-weight:700;background:transparent;border:none;cursor:pointer;" onclick="event.stopPropagation();${changeClickCodeFunc(-1)}">−</button>
               <span style="flex:1;text-align:center;font-size:10.5px;font-weight:700;color:var(--product-name-color, #111827);font-family:'Outfit',sans-serif;">${qty}</span>
               <button style="width:16px;height:100%;color:#16a34a;font-size:14px;font-weight:700;background:transparent;border:none;cursor:pointer;" onclick="event.stopPropagation();${changeClickCodeFunc(1)}">+</button>
             </div>`
          : `<button style="background:var(--qty-btn-bg, #ffffff);border:1px solid #16a34a;color:#16a34a;border-radius:8px;height:28px;min-width:54px;padding:1px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all 0.1s;box-shadow:0 1px 3px rgba(22,163,74,0.06);line-height:1.05;" onclick="event.stopPropagation();${addClickCode}">
               <span style="font-size:10px;font-weight:900;letter-spacing:0.01em;display:block;color:#16a34a;">ADD</span>
               ${optionsLabel}
             </button>`;
      }
    }
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = appState.cart.find(c => c.id === productId);
  if (existing) existing.qty++; else appState.cart.push({ ...product, qty: 1 });
  saveState(); 
  updateCartFAB();
  updateSingleProductCardDOM(productId);
  
  if (navigator.vibrate) navigator.vibrate(30);
}

function addToCartById(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  addToCart(productId);
  // Quiet add — no toast message
}

function addComboToCart(productIds) {
  productIds.forEach(id => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const existing = appState.cart.find(c => c.id === id);
    if (existing) existing.qty++; else appState.cart.push({ ...product, qty: 1 });
  });
  saveState(); 
  updateCartFAB();
  productIds.forEach(id => updateSingleProductCardDOM(id));
  // Quiet add — no toast message
  if (navigator.vibrate) navigator.vibrate(50);
}



function initCartPage() {
  const cartPage = document.getElementById('page-cart');
  const cartList = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');
  
  // Set CSS variables for dark/light mode on cart page
  if (cartPage) {
    const isDark = appState.themeMode === 'dark';
    cartPage.style.setProperty('--cart-page-bg', isDark ? '#121212' : '#f7f9f8');
    cartPage.style.setProperty('--cart-header-bg', isDark ? '#1D1F24' : '#ffffff');
    cartPage.style.setProperty('--cart-card-bg', isDark ? '#1D1F24' : '#ffffff');
    cartPage.style.setProperty('--cart-border', isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');
    cartPage.style.setProperty('--cart-text', isDark ? '#ffffff' : '#1f2937');
    cartPage.style.setProperty('--cart-muted', isDark ? '#9ca3af' : '#6b7280');
    cartPage.style.setProperty('--cart-btn-bg', isDark ? '#23262D' : '#f3f4f6');
    cartPage.style.setProperty('--cart-input-bg', isDark ? '#23262D' : '#f3f4f6');
    cartPage.style.setProperty('--cart-accent-bg', isDark ? 'rgba(12,131,70,0.12)' : '#ecfdf5');
    cartPage.style.setProperty('--cart-img-bg', isDark ? '#23262D' : '#f3f4f6');
  }
  
  if (appState.cart.length === 0) {
    if (cartList) cartList.innerHTML = ''; 
    if (emptyEl) emptyEl.classList.remove('hidden'); 
    if (summary) summary.style.display = 'none';
    document.getElementById('cart-premium-blocks')?.remove();
  } else {
    if (emptyEl) emptyEl.classList.add('hidden'); 
    if (summary) summary.style.display = 'block'; 
    renderCartItems(); 
    updateCartSummary();
    renderCartPremiumBlocks();
  }
  
  // Update bottom bar total
  const bottomTotal = document.getElementById('cart-bottom-total');
  if (bottomTotal) {
    const { total } = getCartTotals();
    bottomTotal.textContent = `₹${total}`;
    if (cartPage) {
      const isDark = appState.themeMode === 'dark';
      bottomTotal.style.color = isDark ? '#ffffff' : '#1f2937';
    }
  }
  // Style the bottom bar for dark/light
  const bottomBar = document.getElementById('cart-bottom-bar');
  if (bottomBar && cartPage) {
    const isDark = appState.themeMode === 'dark';
    bottomBar.style.backgroundColor = isDark ? '#1D1F24' : '#ffffff';
    bottomBar.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    bottomBar.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.08)';
  }
  
  const detailEl = document.getElementById('delivery-detail');
  if (appState.pnrData && detailEl) {
    const d = appState.pnrData;
    const pax = d.passengerList && d.passengerList[0];
    const coach = pax ? pax.coach : '—';
    const seat = pax ? pax.berth : '—';
    detailEl.textContent = `${d.trainName || 'Train'} · Coach ${coach}, Seat ${seat} · New Delhi (NDLS)`;
  }

  const deliveryBtn = document.querySelector('#delivery-card button');
  if (deliveryBtn) {
    deliveryBtn.textContent = appState.isPnrConfirmed ? 'Track' : 'Change';
  }
}

function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;
  const isDark = appState.themeMode === 'dark';
  const cardBg = isDark ? '#1D1F24' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)';
  const imgBg = isDark ? '#23262D' : '#f3f4f6';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';
  const accentColor = '#0C8346';
  const qtyBg = isDark ? '#23262D' : '#f3f4f6';
  const qtyBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)';

  list.innerHTML = appState.cart.map(item => `
    <div style="background:${cardBg}; border:${cardBorder}; border-radius:12px; padding:10px; display:flex; gap:10px; align-items:center;">
      <div style="width:56px; height:56px; background:${imgBg}; border-radius:10px; display:flex; align-items:center; justify-content:center; padding:4px; flex-shrink:0;">
        <img style="max-width:100%; max-height:100%; object-fit:contain;" src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';" />
      </div>
      <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:2px;">
        <div style="font-size:11px; font-weight:700; color:${textColor}; font-family:'Outfit',sans-serif; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.name}</div>
        <div style="font-size:9px; font-weight:600; color:${mutedColor}; font-family:'Outfit',sans-serif;">${item.weight || 'Standard'}</div>
        <div style="font-size:12px; font-weight:800; color:${textColor}; font-family:'Outfit',sans-serif;">₹${item.price * item.qty}</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0;">
        <div style="display:flex; align-items:center; background:${accentColor}; border-radius:8px; overflow:hidden; height:28px; width:72px;">
          <button style="width:22px; height:100%; color:#fff; font-size:14px; font-weight:800; background:transparent; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="updateCartItemQty(${item.id},-1)">−</button>
          <span style="flex:1; text-align:center; font-size:11px; font-weight:800; color:#fff; font-family:'Outfit',sans-serif;">${item.qty}</span>
          <button style="width:22px; height:100%; color:#fff; font-size:14px; font-weight:800; background:transparent; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;" onclick="updateCartItemQty(${item.id},1)">+</button>
        </div>
        <button style="background:none; border:none; cursor:pointer; color:${isDark ? '#6b7280' : '#9ca3af'}; padding:0;" onclick="removeCartItem(${item.id})">
          <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
        </button>
      </div>
    </div>`).join('');
}


function renderCartPremiumBlocks() {
  const summary = document.getElementById('cart-summary');
  if (!summary) return;
  let wrap = document.getElementById('cart-premium-blocks');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'cart-premium-blocks';
    summary.insertAdjacentElement('beforebegin', wrap);
  }
  const isDark = appState.themeMode === 'dark';
  const blockBg = isDark ? '#1D1F24' : '#ffffff';
  const blockBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)';
  const headingColor = isDark ? '#ffffff' : '#1f2937';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? '#23262D' : '#f3f4f6';
  const addonBg = isDark ? '#23262D' : '#f9fafb';
  const addonImgBg = isDark ? '#2A2D33' : '#f3f4f6';
  const addonBorder = isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)';
  const hintBg = isDark ? 'rgba(12,131,70,0.12)' : '#ecfdf5';

  const totals = getCartTotals();
  const addons = PRODUCTS.filter(p => !appState.cart.some(c => c.id === p.id)).slice(0, 6);
  wrap.innerHTML = `
    <div style="margin:8px 16px 0; padding:8px; border-radius:10px; background:${hintBg}; color:#0C8346; font-size:10px; font-weight:800; text-align:center;">Pull down to refresh station availability</div>
    <div style="background:${blockBg}; border:${blockBorder}; border-radius:12px; padding:12px; margin:8px 16px;">
      <h3 style="font-size:12px; font-weight:800; color:${headingColor}; margin:0 0 6px 0;">Delivery summary</h3>
      <div style="font-size:10px; color:${mutedColor}; font-weight:600; line-height:1.5; font-family:'Outfit',sans-serif;">Seat delivery at ${appState.pnrData ? appState.pnrData.destination.split('(')[0].trim() : 'selected station'} • ETA 12-18 min • Saved ₹${totals.discount || Math.min(40, Math.round(totals.subtotal * .08))}</div>
    </div>
    <div style="background:${blockBg}; border:${blockBorder}; border-radius:12px; padding:12px; margin:0 16px 8px;">
      <h3 style="font-size:12px; font-weight:800; color:${headingColor}; margin:0 0 8px 0;">Coupon for this journey</h3>
      <button style="width:100%; background:${isDark ? 'rgba(12,131,70,0.12)' : '#ecfdf5'}; border:1px solid ${isDark ? 'rgba(12,131,70,0.2)' : '#d1fae5'}; color:#0C8346; border-radius:10px; padding:10px; font-size:11px; font-weight:800; cursor:pointer;" onclick="applyCouponCode('RAILQUICK15')">Apply RAILQUICK15 and save more</button>
    </div>
    <div style="background:${blockBg}; border:${blockBorder}; border-radius:12px; padding:12px; margin:0 16px 8px;">
      <h3 style="font-size:12px; font-weight:800; color:${headingColor}; margin:0 0 8px 0;">Recommended add-ons</h3>
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
        ${addons.map(p => `
          <div style="min-width:100px; border:${addonBorder}; border-radius:10px; padding:8px; background:${addonBg}; flex-shrink:0;">
            <img src="${p.img}" style="width:100%; height:55px; object-fit:contain; border-radius:8px; background:${addonImgBg}; padding:4px;" onerror="this.style.display='none'">
            <b style="display:block; font-size:9px; line-height:1.15; color:${headingColor}; margin-top:4px; font-family:'Outfit',sans-serif;">${p.name}</b>
            <span style="font-size:10px; font-weight:800; color:#0C8346; display:block; margin-top:2px;">₹${p.price}</span>
            <button style="margin-top:5px; width:100%; border-radius:8px; background:#0C8346; color:white; font-size:9px; font-weight:900; padding:6px; border:none; cursor:pointer;" onclick="addToCart(${p.id});initCartPage();">Add</button>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="background:${blockBg}; border:${blockBorder}; border-radius:12px; padding:12px; margin:0 16px 8px;">
      <h3 style="font-size:12px; font-weight:800; color:${headingColor}; margin:0 0 8px 0;">Order notes</h3>
      <input style="width:100%; background:${inputBg}; border:${blockBorder}; border-radius:10px; padding:10px; font-size:11px; color:${headingColor}; font-family:'Outfit',sans-serif; box-sizing:border-box;" placeholder="Add coach instructions or delivery note" />
    </div>
  `;
}

function updateCartItemQty(id, delta) {
  const item = appState.cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) appState.cart = appState.cart.filter(c => c.id !== id);
  saveState(); 
  initCartPage();
}

function removeCartItem(id) {
  appState.cart = appState.cart.filter(c => c.id !== id);
  saveState(); 
  initCartPage(); 
  updateCartFAB(); 
  showToast('Item removed', 'info');
}

function clearCart() {
  if (!appState.cart.length) return;
  appState.cart = []; 
  saveState(); 
  initCartPage(); 
  updateCartFAB();
}

function updateCartSummary() {
  if (!appState.cart.length) { appState.appliedCoupon = null; }
  const { subtotal, discount, gst, deliveryFee, handlingFee, total } = getCartTotals();
  
  const subtotalEl = document.getElementById('summary-subtotal');
  const gstEl = document.getElementById('summary-gst');
  const deliveryEl = document.getElementById('summary-delivery');
  const handlingEl = document.getElementById('summary-handling');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (gstEl) gstEl.textContent = `₹${gst}`;
  
  if (deliveryEl) {
    deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    if (deliveryFee === 0) {
      deliveryEl.className = 'text-primary font-bold';
    } else {
      deliveryEl.className = 'text-gray-500';
    }
  }
  if (handlingEl) handlingEl.textContent = `₹${handlingFee}`;

  let discRow = document.getElementById('summary-discount-row');
  if (!discRow) {
    const summaryBlock = document.getElementById('cart-summary');
    if (summaryBlock) {
      discRow = document.createElement('div');
      discRow.id = 'summary-discount-row';
      discRow.className = 'flex justify-between text-xs text-red-500 font-bold';
      discRow.innerHTML = `<span>Discount Applied</span><span id="summary-discount">-₹0</span>`;
      summaryBlock.insertBefore(discRow, summaryBlock.querySelector('.border-t'));
    }
  }
  if (discount > 0 && discRow) { 
    discRow.style.display = 'flex'; 
    document.getElementById('summary-discount').textContent = `-₹${discount}`; 
  } else if (discRow) { 
    discRow.style.display = 'none'; 
  }
  if (totalEl) totalEl.textContent = `₹${total}`;
}

function proceedToCheckout() {
  if (!appState.cart || !appState.cart.length) { 
    showToast('Your cart is empty! Add items to continue.', 'warning'); 
    return; 
  }
  
  // Auto-set default passenger if not logged in
  if (!appState.user) {
    appState.user = {
      name: 'Kartik Guleria',
      phone: '8826387844',
      email: 'kartik.railquick@gmail.com',
      clerkId: 'user_railquick_demo'
    };
  }
  
  // Auto-set active train & seat from top bar
  if (!appState.pnrData) {
    appState.pnrData = {
      trainNumber: '12301',
      trainName: '12301 Rajdhani Express',
      destination: 'New Delhi (NDLS)',
      passengerList: [{
        coach: 'B2',
        berth: '45',
        berthCode: 'Upper Berth',
        currentStatus: 'CNF'
      }]
    };
  }
  appState.isPnrConfirmed = true;
  appState.hasOnboarded = true;
  saveState();

  navigateTo('page-checkout');
  initCheckoutPage();
}

// ===== CHECKOUT FLOW =====
function initCheckoutPage() {
  setCheckoutStep(1);
  const pnrCard = document.getElementById('checkout-pnr-details');
  const manualCard = document.getElementById('checkout-manual-details');
  
  if (appState.pnrData) {
    if (pnrCard) pnrCard.classList.remove('hidden'); 
    if (manualCard) manualCard.classList.add('hidden');
    
    const d = appState.pnrData;
    const pax = d.passengerList && d.passengerList[0];
    const seat = pax ? `${pax.coach}, Seat ${pax.berth}` : '—';
    
    const trainEl = document.getElementById('checkout-train');
    const seatEl = document.getElementById('checkout-seat');
    const stationEl = document.getElementById('checkout-station');
    const timeEl = document.getElementById('checkout-time');
    const etaEl = document.getElementById('checkout-eta');
    
    if (trainEl) trainEl.textContent = `${d.trainName} (#${d.trainNumber})`;
    if (seatEl) seatEl.textContent = seat;
    
    if (stationEl) {
      stationEl.textContent = d.destination ? d.destination.split('(')[0].trim() : 'New Delhi (NDLS)';
    }
    
    if (timeEl) {
      timeEl.textContent = d.dateOfJourney || 'Today';
    }
    
    if (etaEl) {
      if (appState.pnrLiveData && appState.pnrLiveData.statusNote) {
        const note = appState.pnrLiveData.statusNote;
        if (note.toLowerCase().includes('late') || note.toLowerCase().includes('delay')) {
          etaEl.textContent = note.split('at')[0].trim();
        } else {
          etaEl.textContent = 'On-Time';
        }
      } else {
        etaEl.textContent = 'Scheduled';
      }
    }
  } else { 
    if (pnrCard) pnrCard.classList.add('hidden'); 
    if (manualCard) manualCard.classList.remove('hidden'); 
  }
  
  if (appState.user) {
    document.getElementById('contact-name').value = appState.user.name || '';
    document.getElementById('contact-phone').value = appState.user.phone || '';
  }
  
  renderCheckoutMiniItems();
  renderCheckoutRecommendedProducts();
  renderCheckoutBillDetails();
  updateStickyBottomBar();
}

function renderCheckoutMiniItems() {
  const mini = document.getElementById('checkout-items-mini');
  if (!mini) return;
  
  const totalQty = appState.cart.reduce((sum, item) => sum + item.qty, 0);
  const shipmentText = `Shipment of ${totalQty} item${totalQty > 1 ? 's' : ''}`;
  
  mini.innerHTML = `
    <!-- Delivery Header Card -->
    <div class="bg-white border border-outline-variant/65 rounded-2xl p-4 shadow-sm space-y-4 mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-amber-500 font-bold" style="font-size: 20px;">schedule</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-800 leading-tight">Delivery in 15 minutes</h4>
          <p class="text-[11px] text-gray-400 font-medium mt-0.5">${shipmentText}</p>
        </div>
      </div>
      
      <!-- Items List -->
      <div class="divide-y divide-gray-100">
        ${appState.cart.map(item => {
          const mrp = item.mrp || Math.round(item.price * 1.25);
          return `
            <div class="flex gap-4 py-3 first:pt-0 last:pb-0 items-start">
              <div class="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                <img class="max-h-full max-w-full object-contain" src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop';" />
              </div>
              <div class="flex-grow min-w-0 py-0.5">
                <h4 class="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">${item.name}</h4>
                <p class="text-[11px] text-gray-400 mt-1">${item.weight || 'Standard'}</p>
                <button class="text-[10px] text-gray-450 font-bold mt-2 hover:text-red-500 active:scale-95 transition-all" onclick="removeCheckoutCartItem(${item.id})">Move to wishlist</button>
              </div>
              <div class="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                <div style="display:flex;align-items:center;background:#0C8346;border:1px solid #0C8346;border-radius:6px;overflow:hidden;height:26px;width:64px;">
                  <button style="width:20px;height:100%;color:#ffffff;font-size:14px;font-weight:800;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;" onclick="event.stopPropagation();changeCheckoutProductQty(${item.id},-1)">−</button>
                  <span style="flex:1;text-align:center;font-size:11px;font-weight:800;color:#ffffff;font-family:'Outfit',sans-serif;line-height:26px;">${item.qty}</span>
                  <button style="width:20px;height:100%;color:#ffffff;font-size:14px;font-weight:800;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;" onclick="event.stopPropagation();changeCheckoutProductQty(${item.id},1)">+</button>
                </div>
                <div class="flex items-center gap-1.5 mt-2">
                  <span class="text-xs font-extrabold text-gray-800">₹${item.price}</span>
                  <span class="text-[10px] text-gray-400 line-through">₹${mrp}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderCheckoutRecommendedProducts() {
  const container = document.getElementById('checkout-recommended-container');
  if (!container) return;
  
  const recommended = PRODUCTS.filter(p => !appState.cart.some(item => item.id === p.id)).slice(0, 6);
  if (recommended.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  const cardsHTML = recommended.map(p => {
    return getProductCardHTML(
      p, 
      0, 
      `addCheckoutRecommendedToCart(${p.id})`, 
      (delta) => `changeCheckoutProductQty(${p.id}, ${delta})`, 
      true
    );
  }).join('');
  
  container.innerHTML = `
    <div class="my-6">
      <h3 class="text-sm font-bold text-gray-800 mb-3 px-1 font-sans">You might also like</h3>
      <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x snap-mandatory">
        ${cardsHTML}
      </div>
    </div>
  `;
}

function renderCheckoutBillDetails() {
  const container = document.getElementById('checkout-bill-details-container');
  if (!container) return;
  
  const { subtotal, discount, gst, deliveryFee, handlingFee, tip, donation, giftPack, total } = getCartTotals();
  const mrpTotal = appState.cart.reduce((sum, item) => {
    const mrp = item.mrp || Math.round(item.price * 1.25);
    return sum + (mrp * item.qty);
  }, 0);
  const totalSavings = (mrpTotal - subtotal) + discount;

  const currentCoach = appState.pnrData?.passengerList?.[0]?.coach || 'B2';
  const currentSeat = appState.pnrData?.passengerList?.[0]?.berth || '45';
  const currentTrain = appState.pnrData?.trainName || '12301 Rajdhani Express';
  const currentStation = appState.pnrData?.destination || 'Kanpur Central (CNB)';

  // Free delivery calculation
  const freeDelThreshold = 199;
  const neededForFree = Math.max(0, freeDelThreshold - subtotal);
  const freeDelPercent = Math.min(100, Math.round((subtotal / freeDelThreshold) * 100));

  container.innerHTML = `
    <!-- ── 1. FREE DELIVERY PROGRESS BAR (MATCHING SCREENSHOT 3) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm mb-4">
      <div class="flex items-center gap-3 mb-2.5">
        <div class="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">two_wheeler</span>
        </div>
        <div class="flex-grow">
          <div class="text-xs font-black text-white font-headline">
            ${neededForFree === 0 ? '🎉 FREE Delivery Unlocked!' : 'Get FREE delivery'}
          </div>
          <div class="text-[11px] text-gray-400 mt-0.5">
            ${neededForFree === 0 ? 'Your journey essentials will be delivered free' : `Add products worth ₹${neededForFree} more`}
          </div>
        </div>
      </div>
      <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div class="bg-blue-500 h-full rounded-full transition-all duration-300" style="width: ${freeDelPercent}%"></div>
      </div>
    </div>

    <!-- ── 2. BILL DETAILS CARD (MATCHING SCREENSHOT 3) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3 mb-4">
      <h3 class="text-xs font-extrabold text-white uppercase tracking-wider mb-1">Bill details</h3>
      
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-gray-400 text-sm">description</span>
          <span>Items total</span>
          ${totalSavings > 0 ? `<span class="bg-blue-500/15 text-blue-400 font-bold text-[9px] px-1.5 py-0.5 rounded border border-blue-500/30">Saved ₹${totalSavings}</span>` : ''}
        </div>
        <div class="flex items-center gap-1.5 font-sans">
          ${totalSavings > 0 ? `<span class="text-gray-500 line-through">₹${mrpTotal}</span>` : ''}
          <span class="text-white font-bold">₹${subtotal}</span>
        </div>
      </div>
      
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-gray-400 text-sm">shopping_bag</span>
          <span>Handling charge</span>
        </div>
        <span class="text-white font-bold font-sans">₹${handlingFee}</span>
      </div>
      
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-gray-400 text-sm">delivery_dining</span>
          <span>Delivery charge</span>
        </div>
        <span class="text-white font-bold font-sans">${deliveryFee === 0 ? '<span class="text-[#22c55e]">FREE</span>' : `₹${deliveryFee}`}</span>
      </div>

      ${tip > 0 ? `
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-amber-400 text-sm">volunteer_activism</span>
          <span>Delivery Partner Tip</span>
        </div>
        <span class="text-white font-bold font-sans">₹${tip}</span>
      </div>` : ''}

      ${donation > 0 ? `
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-rose-400 text-sm">favorite</span>
          <span>Donation</span>
        </div>
        <span class="text-white font-bold font-sans">₹${donation}</span>
      </div>` : ''}

      ${giftPack > 0 ? `
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-purple-400 text-sm">redeem</span>
          <span>Gift Packaging</span>
        </div>
        <span class="text-white font-bold font-sans">₹${giftPack}</span>
      </div>` : ''}
      
      <div class="border-t border-dashed border-white/10 my-2"></div>
      
      <div class="flex justify-between items-center text-sm font-bold text-white">
        <span>Grand total</span>
        <span class="font-black text-white font-sans text-base">₹${total}</span>
      </div>
      
      ${totalSavings > 0 ? `
        <div class="bg-blue-600/15 border border-blue-500/30 rounded-xl p-3 flex justify-between items-center text-xs text-blue-400 font-bold mt-2">
          <span>Your total savings</span>
          <span class="font-sans font-black text-sm text-blue-300">₹${totalSavings}</span>
        </div>
      ` : ''}
    </div>

    <!-- ── 3. DONATE WITH THIS ORDER (MATCHING SCREENSHOT 4) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-xs font-black text-white font-headline">Donate with this order</h4>
          <p class="text-[10px] text-gray-400 mt-0.5">Together, we can fuel young minds to grow, learn, and thrive.</p>
        </div>
        <span class="material-symbols-outlined text-rose-400 text-2xl">volunteer_activism</span>
      </div>
      <div class="grid grid-cols-4 gap-2 pt-1">
        <button type="button" class="donate-btn py-2.5 rounded-xl text-xs font-bold border ${donation === 5 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center active:scale-95" onclick="setDonationAmount(5)">₹5</button>
        <button type="button" class="donate-btn py-2.5 rounded-xl text-xs font-bold border ${donation === 10 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center active:scale-95" onclick="setDonationAmount(10)">₹10</button>
        <button type="button" class="donate-btn py-1.5 rounded-xl text-xs font-bold border ${donation === 15 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex flex-col items-center justify-center active:scale-95" onclick="setDonationAmount(15)">
          <span class="text-[8px] text-[#22c55e] uppercase font-black">1 MEAL</span>
          <span>₹15</span>
        </button>
        <button type="button" class="donate-btn py-2.5 rounded-xl text-xs font-bold border ${donation > 0 && donation !== 5 && donation !== 10 && donation !== 15 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center active:scale-95" onclick="setCustomDonation()">Custom</button>
      </div>
    </div>

    <!-- ── 4. TIP YOUR DELIVERY PARTNER (MATCHING SCREENSHOT 4) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-xs font-black text-white font-headline">Tip your delivery partner</h4>
          <p class="text-[10px] text-gray-400 mt-0.5">Your kindness means a lot! 100% of your tip goes directly to your train delivery partner.</p>
        </div>
        <span class="material-symbols-outlined text-amber-400 text-2xl">two_wheeler</span>
      </div>
      <div class="grid grid-cols-4 gap-2 pt-1">
        <button type="button" class="tip-btn py-2.5 rounded-xl text-xs font-bold border ${tip === 20 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center gap-1 active:scale-95" onclick="setTipAmount(20)">😆 ₹20</button>
        <button type="button" class="tip-btn py-2.5 rounded-xl text-xs font-bold border ${tip === 30 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center gap-1 active:scale-95" onclick="setTipAmount(30)">🤩 ₹30</button>
        <button type="button" class="tip-btn py-2.5 rounded-xl text-xs font-bold border ${tip === 50 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center gap-1 active:scale-95" onclick="setTipAmount(50)">😍 ₹50</button>
        <button type="button" class="tip-btn py-2.5 rounded-xl text-xs font-bold border ${tip > 0 && tip !== 20 && tip !== 30 && tip !== 50 ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 text-gray-300 bg-white/5'} flex items-center justify-center gap-1 active:scale-95" onclick="setCustomTip()">👏 Custom</button>
      </div>
    </div>

    <!-- ── 5. GIFT PACKAGING (MATCHING SCREENSHOT 4) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">redeem</span>
        </div>
        <div>
          <h4 class="text-xs font-bold text-white">Gift Packaging</h4>
          <p class="text-[10px] text-gray-400 mt-0.5">Get your items in a special sealed gift bag for just ₹30</p>
        </div>
      </div>
      <button type="button" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${giftPack > 0 ? 'bg-[#22c55e] text-white' : 'bg-white/10 text-gray-200'} active:scale-95 transition-all" onclick="toggleGiftPackaging()">
        ${giftPack > 0 ? 'Selected ✓' : 'Select'}
      </button>
    </div>

    <!-- ── 6. CANCELLATION POLICY (MATCHING SCREENSHOT 4) ── -->
    <div class="bg-[#181d27]/70 border border-white/10 rounded-2xl p-4 shadow-sm mb-4">
      <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
        <span class="material-symbols-outlined text-sm text-gray-400">policy</span>
        Cancellation Policy
      </h4>
      <p class="text-[10px] text-gray-400 mt-1 leading-relaxed">
        Once order is placed, any cancellation may result in a fee. In case of unexpected train delays leading to order cancellation, a complete instant refund will be provided.
      </p>
    </div>

    <!-- ── 7. DELIVERING TO COACH & SEAT BAR (MATCHING SCREENSHOT 2/3) ── -->
    <div class="bg-[#181d27] border border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">airline_seat_recline_extra</span>
        </div>
        <div>
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivering to Coach &amp; Seat</div>
          <div class="text-xs font-extrabold text-white mt-0.5">Coach ${currentCoach}, Seat ${currentSeat} · ${currentTrain}</div>
          <div class="text-[10px] text-[#22c55e] mt-0.5">Platform handoff at ${currentStation}</div>
        </div>
      </div>
      <button onclick="openTrainSeatSelectorModal()" class="text-xs font-bold text-[#22c55e] hover:underline px-2 py-1">
        Change
      </button>
    </div>
  `;
}

// ===== TIPPING, DONATION & PACKAGING HANDLERS =====
function setTipAmount(amt) {
  appState.tipAmount = (appState.tipAmount === amt) ? 0 : amt;
  renderCheckoutBillDetails();
  updateStickyBottomBar();
  showToast(appState.tipAmount > 0 ? `₹${amt} tip added for delivery partner` : 'Tip removed', 'info');
}

function setCustomTip() {
  const custom = prompt('Enter tip amount (₹):', '40');
  if (custom !== null) {
    const val = parseInt(custom, 10);
    if (!isNaN(val) && val >= 0) {
      appState.tipAmount = val;
      renderCheckoutBillDetails();
      updateStickyBottomBar();
      showToast(`₹${val} custom tip added`, 'info');
    }
  }
}

function setDonationAmount(amt) {
  appState.donationAmount = (appState.donationAmount === amt) ? 0 : amt;
  renderCheckoutBillDetails();
  updateStickyBottomBar();
  showToast(appState.donationAmount > 0 ? `₹${amt} donation added` : 'Donation removed', 'info');
}

function setCustomDonation() {
  const custom = prompt('Enter donation amount (₹):', '25');
  if (custom !== null) {
    const val = parseInt(custom, 10);
    if (!isNaN(val) && val >= 0) {
      appState.donationAmount = val;
      renderCheckoutBillDetails();
      updateStickyBottomBar();
      showToast(`₹${val} donation added`, 'info');
    }
  }
}

function toggleGiftPackaging() {
  appState.giftPackaging = !appState.giftPackaging;
  renderCheckoutBillDetails();
  updateStickyBottomBar();
  showToast(appState.giftPackaging ? 'Gift packaging selected (+₹30)' : 'Gift packaging removed', 'info');
}


function updateStickyBottomBar() {
  const bar = document.getElementById('checkout-sticky-bar');
  const totalPriceEl = document.getElementById('sticky-total-price');
  const actionTextEl = document.getElementById('sticky-action-text');
  const paymentNameEl = document.getElementById('sticky-payment-name');
  const paymentIconEl = document.getElementById('sticky-payment-icon');
  
  if (bar) {
    const isDark = appState.themeMode === 'dark';
    bar.style.backgroundColor = isDark ? '#1D1F24' : '#ffffff';
    bar.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    bar.style.boxShadow = isDark ? '0 12px 35px rgba(0, 0, 0, 0.35)' : '0 12px 30px rgba(0, 0, 0, 0.08)';
    
    if (paymentNameEl) {
      paymentNameEl.style.color = isDark ? '#ffffff' : '#1f2937';
    }
  }

  const { total } = getCartTotals();
  if (totalPriceEl) totalPriceEl.textContent = `₹${total}`;
  
    if (actionTextEl) actionTextEl.textContent = 'Place Order';
    const payMode = appState.selectedPayment || 'upi';
    if (payMode === 'upi') {
      if (paymentNameEl) paymentNameEl.innerHTML = `Google Pay UPI <span class="material-symbols-outlined text-[12px] font-bold text-gray-500">keyboard_arrow_up</span>`;
      if (paymentIconEl) paymentIconEl.src = 'https://img.icons8.com/color/48/google-pay.png';
    } else if (payMode === 'card') {
      if (paymentNameEl) paymentNameEl.innerHTML = `Credit/Debit Card <span class="material-symbols-outlined text-[12px] font-bold text-gray-500">keyboard_arrow_up</span>`;
      if (paymentIconEl) paymentIconEl.src = 'https://img.icons8.com/color/48/visa.png';
    } else {
      if (paymentNameEl) paymentNameEl.innerHTML = `Cash on Delivery <span class="material-symbols-outlined text-[12px] font-bold text-gray-500">keyboard_arrow_up</span>`;
      if (paymentIconEl) paymentIconEl.src = 'https://img.icons8.com/color/48/wallet.png';
    }
  }

function handleCheckoutPrimaryAction() {
  // Direct 1-tap ordering
  placeOrder();
}

function scrollToPaymentMethods() {
  const paySec = document.getElementById('checkout-step-2');
  if (paySec) paySec.scrollIntoView({ behavior: 'smooth' });
}

function changeCheckoutProductQty(id, delta) {
  changeProductQty(id, delta);
  if (appState.cart.length === 0) {
    navigateTo('page-cart');
  } else {
    initCheckoutPage();
  }
}

function removeCheckoutCartItem(id) {
  removeCartItem(id);
  if (appState.cart.length === 0) {
    navigateTo('page-cart');
  } else {
    initCheckoutPage();
  }
}

function addCheckoutRecommendedToCart(id) {
  addToCart(id);
  initCheckoutPage();
}

function goToPayment() {
  placeOrder();
}

function setCheckoutStep(step) {
  appState.checkoutStep = 1;
  const step1 = document.getElementById('checkout-step-1');
  const step2 = document.getElementById('checkout-step-2');
  const step3 = document.getElementById('checkout-step-3');
  
  // Both details and payment are visible on one seamless Blinkit page
  if (step1) step1.classList.remove('hidden');
  if (step2) step2.classList.remove('hidden');
  if (step3) step3.classList.add('hidden');
  
  const stickyBar = document.getElementById('checkout-sticky-bar');
  if (stickyBar) stickyBar.classList.remove('hidden');
  
  updateStickyBottomBar();
}

function selectPayment(el, type) {
  appState.selectedPayment = type;
  document.querySelectorAll('.payment-option').forEach(o => {
    o.className = 'payment-option border border-outline-variant bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer';
    const radio = o.querySelector('.pay-radio');
    if (radio) radio.innerHTML = '';
  });
  
  el.className = 'payment-option border-2 border-primary bg-emerald-50/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer';
  const radio = el.querySelector('.pay-radio');
  if (radio) {
    radio.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-primary"></span>`;
  }
  document.getElementById('upi-input-section').style.display = type === 'upi' ? 'block' : 'none';
  updateStickyBottomBar();
}

function selectUPIApp(el) {
  document.querySelectorAll('.upi-app').forEach(a => {
    a.querySelector('.upi-app-icon')?.classList.remove('ring-4', 'ring-primary/20');
  });
  el.querySelector('.upi-app-icon')?.classList.add('ring-4', 'ring-primary/20');
  showToast(`${el.querySelector('span').textContent} selected`, 'info');
}

function placeOrder() {
  showLoading('Processing payment securely...');
  setTimeout(() => {
    hideLoading();
    const orderId = 'RQ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    let seat = 'Coach B2, Seat 45 (Upper Berth)', train = '12301 Rajdhani Express';
    
    if (appState.pnrData) {
      const pax = appState.pnrData.passengerList?.[0];
      seat = pax && pax.coach ? `Coach ${pax.coach}, Seat ${pax.berth} (${pax.berthCode || 'Upper Berth'})` : 'Coach B2, Seat 45';
      train = `${appState.pnrData.trainName || '12301 Rajdhani Express'}`;
    }
    
    const { subtotal, discount, gst, deliveryFee, handlingFee, tip, donation, giftPack, total } = getCartTotals();
    const newOrder = {
      id: orderId,
      items: [...appState.cart],
      date: new Date().toLocaleDateString('en-IN'),
      status: 'in-transit',
      subtotal,
      discount,
      deliveryFee,
      handlingFee,
      tip,
      donation,
      giftPack,
      total,
      seat,
      train,
      secondsLeft: 660, // 11 minutes
      createdAt: Date.now()
    };
    appState.orders.unshift(newOrder);
    appState.trackingOrder = newOrder;
    
    appState.appliedCoupon = null; 
    appState.tipAmount = 0;
    appState.donationAmount = 0;
    appState.giftPackaging = false;
    appState.cart = []; 
    saveState(); 
    updateCartFAB();
    
    showToast('🎉 Order placed successfully! Tracking live delivery.', 'success');
    navigateTo('page-track-order');
    initTrackOrderPage();
  }, 1500);
}

// ===== TRACK ORDER PAGE WITH LIVE DELIVERY TIMING & RATING =====
let trackingInterval = null;
let currentRatingScore = 5;
const ratingLabels = {
  1: 'Poor 😞 (Needs Improvement)',
  2: 'Fair 😐 (Could Be Better)',
  3: 'Good 👍 (Satisfactory Journey Delivery)',
  4: 'Very Good 😊 (Polite & On-Time)',
  5: 'Exceptional ⚡️ (Lightning Fast & Fresh)'
};

function initTrackOrderPage() {
  const order = appState.trackingOrder || (appState.orders.length > 0 ? appState.orders[0] : null);
  if (!order) { showToast('No active order to track', 'warning'); return; }

  const dash = document.getElementById('track-premium-dash');
  if (!dash) return;

  const station = appState.pnrData?.destination ? appState.pnrData.destination.split('(')[0].trim() : 'Kanpur Central';
  const train = order.train || appState.pnrData?.trainName || '12301 Rajdhani Express';
  
  if (order.secondsLeft === undefined) {
    order.secondsLeft = order.status === 'delivered' ? 0 : 660;
  }

  // Clear any existing timer
  if (trackingInterval) clearInterval(trackingInterval);

  // Live timer tick
  if (order.status !== 'delivered') {
    trackingInterval = setInterval(() => {
      if (order.secondsLeft > 0) {
        order.secondsLeft -= 1;
        const mins = Math.floor(order.secondsLeft / 60);
        const secs = order.secondsLeft % 60;
        const timerEl = document.getElementById('live-delivery-timer');
        if (timerEl) {
          timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
      } else {
        order.status = 'delivered';
        clearInterval(trackingInterval);
        initTrackOrderPage();
      }
    }, 1000);
  }

  const isDelivered = order.status === 'delivered';
  const isTransit = order.status === 'in-transit';
  const isPrep = order.status === 'preparing';
  const progress = isDelivered ? 100 : isTransit ? 75 : 35;
  const agents = ['Vikram Singh', 'Ramesh Kumar', 'Sunil Sharma', 'Arjun Patel', 'Deepak Verma'];
  const agent = agents[Math.abs(order.id.charCodeAt(3) || 0) % agents.length];

  const mins = Math.floor(order.secondsLeft / 60);
  const secs = order.secondsLeft % 60;
  const timerStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const statusTitle = isDelivered ? 'Delivered to your seat! 🎉' : `Arriving in ${timerStr} mins`;
  const statusDesc = isDelivered 
    ? 'Handoff complete at your coach. Enjoy your journey essentials!' 
    : `${agent} is waiting at Platform 4 for coach ${order.seat.split(',')[0] || 'B2'} handoff.`;

  const itemPreview = (order.items || []).map(i => `
    <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0 text-xs">
      <div class="flex items-center gap-2">
        <img src="${i.img}" alt="${i.name}" class="w-8 h-8 rounded-lg object-contain bg-white/5 p-1" onerror="this.src='product_lays.png'" />
        <span class="text-white font-bold truncate max-w-[170px]">${i.name}</span>
      </div>
      <span class="text-gray-300 font-mono">Qty ${i.qty} · ₹${i.price * i.qty}</span>
    </div>
  `).join('');

  dash.innerHTML = `
    <!-- ── 1. LIVE DELIVERY COUNTDOWN HERO CARD ── -->
    <section class="bg-[#141822] border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2 bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
          ${isDelivered ? 'Handoff Complete' : 'Live Station Delivery'}
        </div>
        <span class="text-[10px] font-mono font-bold text-gray-400">Order #${order.id}</span>
      </div>

      <h3 class="text-xl font-black text-white font-headline leading-tight">${statusTitle}</h3>
      <p class="text-xs text-gray-400 mt-1 leading-relaxed">${statusDesc}</p>

      <div class="flex justify-between items-center mt-4 pt-3 border-t border-white/10 text-xs">
        <div>
          <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Delivery Target</span>
          <strong class="text-white font-extrabold text-xs">${order.seat}</strong>
        </div>
        <div class="text-right">
          <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Time Remaining</span>
          <strong id="live-delivery-timer" class="text-[#22c55e] font-mono font-black text-sm">${isDelivered ? '0:00' : timerStr}</strong>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
        <div class="bg-[#22c55e] h-full rounded-full transition-all duration-500" style="width: ${progress}%"></div>
      </div>

      <!-- Simulation Action Button (Allows instant test of delivery & rating) -->
      ${!isDelivered ? `
      <div class="mt-4 pt-3 border-t border-white/10 flex justify-end">
        <button onclick="simulateOrderDelivered()" class="bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] border border-[#22c55e]/40 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-sm font-bold">bolt</span>
          Simulate Fast Delivery (Deliver Now)
        </button>
      </div>` : ''}
    </section>

    <!-- ── 2. POST-DELIVERY RATING SECTION (REQUESTED BY USER) ── -->
    ${isDelivered ? `
    <section class="bg-[#141822] border-2 border-[#22c55e]/40 rounded-3xl p-5 shadow-2xl relative space-y-4 animate-fade-in-up" id="post-delivery-rating-card">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
          <span class="material-symbols-outlined text-2xl">hotel_class</span>
        </div>
        <div>
          <h4 class="text-sm font-black text-white font-headline">Rate Your Seat Delivery</h4>
          <p class="text-[11px] text-gray-400 mt-0.5">How was your delivery experience to Coach ${order.seat.split(',')[0] || 'B2'}?</p>
        </div>
      </div>

      <!-- 5 Interactive Stars -->
      <div class="text-center py-2 bg-white/5 rounded-2xl border border-white/5">
        <div class="flex justify-center gap-2 my-1" id="rating-stars-container">
          <span class="star-btn ${currentRatingScore >= 1 ? 'active' : ''}" onclick="setDeliveryRating(1)">★</span>
          <span class="star-btn ${currentRatingScore >= 2 ? 'active' : ''}" onclick="setDeliveryRating(2)">★</span>
          <span class="star-btn ${currentRatingScore >= 3 ? 'active' : ''}" onclick="setDeliveryRating(3)">★</span>
          <span class="star-btn ${currentRatingScore >= 4 ? 'active' : ''}" onclick="setDeliveryRating(4)">★</span>
          <span class="star-btn ${currentRatingScore >= 5 ? 'active' : ''}" onclick="setDeliveryRating(5)">★</span>
        </div>
        <div id="rating-sentiment-label" class="text-xs font-bold text-amber-400 mt-1">${ratingLabels[currentRatingScore]}</div>
      </div>

      <!-- Quick Feedback Tags -->
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">What went well?</label>
        <div class="flex gap-2 flex-wrap" id="feedback-chips-container">
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15 active:scale-95 transition-all" onclick="toggleComplimentChip(this)">⚡️ On-Time Delivery</button>
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15 active:scale-95 transition-all" onclick="toggleComplimentChip(this)">📦 Tamper-Proof Pack</button>
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/15 active:scale-95 transition-all" onclick="toggleComplimentChip(this)">🥗 Hot &amp; Fresh Food</button>
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-white/15 text-gray-300 bg-white/5 active:scale-95 transition-all" onclick="toggleComplimentChip(this)">😊 Polite Partner</button>
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-white/15 text-gray-300 bg-white/5 active:scale-95 transition-all" onclick="toggleComplimentChip(this)">🚆 Found Seat Easily</button>
        </div>
      </div>

      <!-- Comments Box -->
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Write a review (optional)</label>
        <textarea id="delivered-review-text" rows="2" class="w-full bg-[#1c2230] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] resize-none" placeholder="Share your experience with the station delivery partner..."></textarea>
      </div>

      <!-- Submit Rating Button -->
      <button onclick="submitDeliveredRating('${order.id}')" class="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5">
        <span class="material-symbols-outlined text-base">send</span>
        Submit Rating &amp; Feedback
      </button>
    </section>` : ''}

    <!-- ── 3. STATION DELIVERY PARTNER CARD ── -->
    <section class="bg-[#141822] border border-white/10 rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
          <span class="material-symbols-outlined text-2xl">two_wheeler</span>
        </div>
        <div>
          <h4 class="text-xs font-bold text-white">${agent}</h4>
          <p class="text-[10px] text-gray-400 mt-0.5">${isDelivered ? 'Verified Partner · Delivered' : 'Verified Station Partner at ' + station}</p>
        </div>
      </div>
      <button onclick="showToast('Calling ' + '${agent}' + '...', 'info')" class="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all">
        <span class="material-symbols-outlined text-base">call</span>
      </button>
    </section>

    <!-- ── 4. DELIVERY TIMELINE STEPS ── -->
    <section class="bg-[#141822] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
      <h4 class="text-xs font-bold text-white">Delivery Timeline</h4>
      <div class="space-y-2.5 text-xs">
        <div class="flex items-center gap-3 text-emerald-400 font-bold">
          <span class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">✓</span>
          <span>Order Confirmed &amp; Payment Verified</span>
        </div>
        <div class="flex items-center gap-3 ${isPrep || isTransit || isDelivered ? 'text-emerald-400 font-bold' : 'text-gray-500'}">
          <span class="w-5 h-5 rounded-full ${isPrep || isTransit || isDelivered ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center text-[10px]">✓</span>
          <span>Packed &amp; Sealed at Station Pantry</span>
        </div>
        <div class="flex items-center gap-3 ${isTransit || isDelivered ? 'text-emerald-400 font-bold' : 'text-gray-500'}">
          <span class="w-5 h-5 rounded-full ${isTransit || isDelivered ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center text-[10px]">✓</span>
          <span>Station Partner Reached Platform 4</span>
        </div>
        <div class="flex items-center gap-3 ${isDelivered ? 'text-emerald-400 font-bold' : 'text-gray-500'}">
          <span class="w-5 h-5 rounded-full ${isDelivered ? 'bg-emerald-500/20' : 'bg-white/5'} flex items-center justify-center text-[10px]">✓</span>
          <span>Delivered to Seat (${order.seat})</span>
        </div>
      </div>
    </section>

    <!-- ── 5. ORDER SUMMARY ── -->
    <section class="bg-[#141822] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
      <div class="flex justify-between items-center pb-2 border-b border-white/10">
        <span class="text-xs font-bold text-white">Order Items (${(order.items || []).length})</span>
        <span class="text-xs font-black text-[#22c55e] font-mono">Paid ₹${order.total}</span>
      </div>
      <div>${itemPreview}</div>
      <button onclick="navigateTo('page-shop')" class="w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-all mt-2">
        Add More Essentials
      </button>
    </section>
  `;
}

function simulateOrderDelivered() {
  const order = appState.trackingOrder || (appState.orders.length > 0 ? appState.orders[0] : null);
  if (!order) return;
  order.status = 'delivered';
  order.secondsLeft = 0;
  saveState();
  if (trackingInterval) clearInterval(trackingInterval);
  showToast('✓ Order delivered to seat! Please rate your experience.', 'success');
  initTrackOrderPage();
}

function setDeliveryRating(score) {
  currentRatingScore = score;
  const container = document.getElementById('rating-stars-container');
  if (container) {
    const stars = container.querySelectorAll('.star-btn');
    stars.forEach((s, idx) => {
      s.classList.toggle('active', idx < score);
    });
  }
  const label = document.getElementById('rating-sentiment-label');
  if (label) {
    label.textContent = ratingLabels[score] || 'Rating';
  }
}

function toggleComplimentChip(btn) {
  btn.classList.toggle('border-[#22c55e]');
  btn.classList.toggle('text-[#22c55e]');
  btn.classList.toggle('bg-[#22c55e]/15');
  btn.classList.toggle('border-white/15');
  btn.classList.toggle('text-gray-300');
  btn.classList.toggle('bg-white/5');
}

function submitDeliveredRating(orderId) {
  const comments = document.getElementById('delivered-review-text')?.value.trim() || '';
  const card = document.getElementById('post-delivery-rating-card');
  
  showLoading('Saving feedback...');
  setTimeout(() => {
    hideLoading();
    if (card) {
      card.innerHTML = `
        <div class="text-center py-5 space-y-3">
          <div class="w-14 h-14 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center mx-auto border border-[#22c55e]/30">
            <span class="material-symbols-outlined text-3xl font-bold">verified</span>
          </div>
          <h4 class="text-sm font-black text-white">Thank You for Rating!</h4>
          <p class="text-xs text-gray-300 max-w-[260px] mx-auto">
            Your ${currentRatingScore}-star rating has been shared with the delivery team.
          </p>
          <div class="p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl inline-block mt-2">
            <div class="text-[10px] text-gray-300">Enjoy ₹50 OFF on your next journey</div>
            <div class="text-xs font-mono font-black text-[#22c55e] mt-0.5">Use Code: RAIL50</div>
          </div>
        </div>
      `;
    }
    showToast('✓ Feedback recorded! Thank you for choosing RailQuick.', 'success');
  }, 800);
}

// ===== ACCOUNT & APPEARANCE HANDLERS (SCREENSHOT 5) =====
function cycleThemeMode() {
  const current = appState.themeMode || 'dark';
  const newMode = current === 'dark' ? 'light' : 'dark';
  appState.themeMode = newMode;
  localStorage.setItem('theme-mode', newMode);
  
  if (newMode === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.body.classList.remove('dark-theme');
  }

  const label = document.getElementById('account-theme-label');
  if (label) label.textContent = newMode.toUpperCase();

  renderProducts(PRODUCTS);
  showToast(`Appearance changed to ${newMode.toUpperCase()}`, 'info');
}

function toggleSensitiveItems(checked) {
  appState.hideSensitiveItems = checked;
  saveState();
  showToast(checked ? 'Sensitive items are now hidden' : 'All items are visible', 'info');
}

function openWalletModal() {
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.add('active');
}

function closeWalletModal() {
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('active');
}

function trackOrder(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (order) {
    appState.trackingOrder = order;
    navigateTo('page-track-order');
    initTrackOrderPage();
  }
}

function reorderItems(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order || !order.items || !order.items.length) {
    showToast('Could not load order items', 'warning');
    return;
  }
  order.items.forEach(it => {
    addToCart(it.id, it.qty || 1);
  });
  showToast('✓ Past items added to cart!', 'success');
  navigateTo('page-cart');
}

function initOrdersPage() {
  const listEl = document.getElementById('orders-list');
  const emptyEl = document.getElementById('orders-empty');
  if (!listEl) return;

  // Provide initial past order if empty so the screen looks rich and realistic
  if (!appState.orders || appState.orders.length === 0) {
    appState.orders = [
      {
        id: 'RQ-884920',
        items: [
          { id: 1101, name: "Lay's India's Magic Masala Potato Chips", price: 21, qty: 2, img: 'product_lays.png' },
          { id: 1102, name: "Uncle Chipps Spicy Treat Potato Chips", price: 20, qty: 1, img: 'product_uncle.png' }
        ],
        date: 'Today, 1:45 PM',
        status: 'delivered',
        total: 62,
        seat: 'Coach B2, Seat 45',
        train: '12301 Rajdhani Express',
        rating: 5
      }
    ];
    saveState();
  }

  if (appState.orders.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');

  listEl.innerHTML = appState.orders.map(order => {
    const isLive = order.status === 'in-transit';
    const statusBadge = isLive 
      ? `<span class="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>In Transit (${Math.ceil((order.secondsLeft || 660) / 60)}m left)</span>`
      : `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><span class="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>Delivered</span>`;

    const itemsSummary = (order.items || []).map(it => `
      <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-b-0">
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-700 shrink-0">${it.qty || 1}x</span>
          <span class="font-semibold text-gray-800 line-clamp-1">${it.name}</span>
        </div>
        <span class="font-bold text-gray-800 shrink-0 font-mono">₹${(it.price || 0) * (it.qty || 1)}</span>
      </div>
    `).join('');

    return `
      <div class="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm space-y-3">
        <div class="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <div>
            <div class="text-xs font-mono font-bold text-gray-800">Order #${order.id}</div>
            <div class="text-[10px] text-gray-400 font-medium mt-0.5">${order.date || 'Today'} · ${order.seat || 'Coach B2, Seat 45'}</div>
          </div>
          ${statusBadge}
        </div>

        <div class="space-y-1 py-1">
          ${itemsSummary}
        </div>

        <div class="flex items-center justify-between border-t border-gray-100 pt-2.5">
          <div>
            <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
            <div class="text-sm font-black text-gray-900 font-headline font-mono">₹${order.total || 0}</div>
          </div>
          <div class="flex items-center gap-2">
            ${isLive ? `
              <button onclick="trackOrder('${order.id}')" class="bg-primary hover:bg-[#16a35e] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm">
                <span class="material-symbols-outlined text-sm">near_me</span>
                Track Live
              </button>
            ` : `
              <button onclick="reorderItems('${order.id}')" class="bg-emerald-50 hover:bg-emerald-100 text-primary border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 active:scale-95 transition-all">
                <span class="material-symbols-outlined text-sm">refresh</span>
                Reorder
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== ACCOUNT & AUTH =====

function initAccountPage() {
  const logged = document.getElementById('account-logged-section');
  const login = document.getElementById('account-login-section');

  // Guarantee user profile is populated
  if (!appState.user) {
    appState.user = {
      name: 'Your account',
      phone: '8826387844',
      email: 'kartik.railquick@gmail.com',
      avatarUrl: ''
    };
  }
  if (!appState.user.name) appState.user.name = 'Your account';
  if (!appState.user.phone) appState.user.phone = '8826387844';
  if (!appState.user.email) appState.user.email = 'kartik.railquick@gmail.com';

  if (login) login.classList.add('hidden'); 
  if (logged) logged.classList.remove('hidden');

  const nameEl = document.getElementById('profile-name');
  if (nameEl) nameEl.textContent = appState.user.name || 'Your account';

  const emailEl = document.getElementById('profile-email');
  if (emailEl) emailEl.textContent = appState.user.email || 'kartik.railquick@gmail.com';

  const phoneEl = document.getElementById('profile-phone');
  if (phoneEl) phoneEl.textContent = appState.user.phone || '8826387844';

  const themeLabel = document.getElementById('account-theme-label');
  if (themeLabel) themeLabel.textContent = (appState.themeMode || 'dark').toUpperCase();

  const sensitiveToggle = document.getElementById('sensitive-items-toggle');
  if (sensitiveToggle) sensitiveToggle.checked = !!appState.hideSensitiveItems;

  const avatarEl = document.getElementById('profile-avatar');
  if (avatarEl) {
    if (appState.user.avatarUrl) {
      avatarEl.innerHTML = `<img src="${appState.user.avatarUrl}" class="w-full h-full object-cover rounded-full" />`;
    } else {
      avatarEl.innerHTML = `<span class="material-symbols-outlined text-white" style="font-size: 44px; font-variation-settings: 'FILL' 1;">person</span>`;
    }
  }

  updateHomeProfileAvatar();
}

function closeGoogleLoginModal(force = false) {
  const modal = document.getElementById('modal-google-login');
  if (modal) modal.classList.add('hidden');
}

function triggerClerkSignIn() {
  const clerk = clerkInstance || window.Clerk;
  if (clerk && clerkInitDone) {
    try {
      localStorage.setItem('railquick_logging_in', 'true');
      showLoading('Redirecting to secure login...');
      clerk.redirectToSignIn({
        redirectUrl: window.location.origin
      });
    } catch(e) {
      console.error('[Clerk] Redirect failed:', e);
      showToast('Redirect failed. Please check internet connection.', 'error');
      hideLoading();
    }
  } else {
    showToast('Sign-in service is initializing. Please try again in a second...', 'info');
  }
}

function googleSignIn() {
  triggerClerkSignIn();
}

function simulateGoogleLogin() {
  closeGoogleLoginModal();
  googleSignIn();
}

function simulateDemoLogin() {
  closeGoogleLoginModal();
  showLoading('Logging into demo account...');
  setTimeout(() => {
    appState.user = {
      name: "Kartik Guleria",
      email: "kartik@example.com",
      phone: localStorage.getItem('railquick_global_phone') || "+91 98765 43210",
      avatarUrl: "",
      avatar: "K",
      provider: "demo",
      clerkId: "demo_user_123",
      loginAt: new Date().toISOString()
    };
    saveState();
    hideLoading();
    showToast("Logged in successfully (Demo Session)!");
    initAccountPage();
    
    const returnPage = localStorage.getItem('railquick_return_after_login') || 'page-shop';
    localStorage.removeItem('railquick_return_after_login');
    
    if (appState.cart.length > 0 && returnPage === 'page-cart') {
      navigateTo('page-cart');
    } else {
      navigateTo('page-shop');
    }
  }, 1000);
}

function showPhoneLogin() { showPhoneLoginPrompt(); }



function syncClerkUser() {
  if (!clerkInstance) return;
  const user = clerkInstance.user;
  
  // Clear logging in flag and spinner since Clerk loaded the session
  localStorage.removeItem('railquick_logging_in');
  hideLoading();

  if (user) {
    const savedPhone = localStorage.getItem(`railquick_phone_${user.id}`) || user.primaryPhoneNumber?.phoneNumber || localStorage.getItem('railquick_last_phone') || '';
    const savedOrdersStr = localStorage.getItem(`railquick_orders_${user.id}`);
    if (savedOrdersStr) {
      try {
        appState.orders = JSON.parse(savedOrdersStr);
      } catch(e) {}
    }
    appState.user = {
      name: user.fullName || user.firstName || user.username || 'User',
      email: user.primaryEmailAddress?.emailAddress || '',
      phone: savedPhone,
      avatarUrl: user.imageUrl || '',
      avatar: (user.fullName || user.firstName || 'U')[0].toUpperCase(),
      provider: 'clerk',
      clerkId: user.id,
      loginAt: new Date().toISOString()
    };
    if (savedPhone) {
      localStorage.setItem(`railquick_phone_${user.id}`, savedPhone);
    }
    
    // Auto redirect if currently stuck on page-splash or page-pnr
    if (appState.currentPage === 'page-splash' || appState.currentPage === 'page-pnr') {
      if (!savedPhone) {
        navigateTo('page-account');
        showToast('Please add your mobile number to complete profile', 'warning');
      } else {
        navigateTo('page-shop');
      }
    }
  } else {
    appState.user = null;
  }
  saveState();
  initAccountPage();
  updateHomeProfileAvatar();
}

function signOut() {
  const clerk = clerkInstance || window.Clerk;
  if (clerk) {
    clerk.signOut().then(() => {
      appState.user = null;
      appState.orders = [];
      saveState();
      initAccountPage();
      showToast('Signed out', 'info');
    });
  } else {
    appState.user = null;
    appState.orders = [];
    saveState();
    initAccountPage();
    showToast('Signed out', 'info');
  }
}

// ===== PRODUCT MODAL DETAILS =====
function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  appState.modalProduct = p;
  appState.modalQty = 1;
  const similar = getSimilarProducts(p, 5);
  const gallery = [p.img, ...similar.slice(0, 3).map(x => x.img)];

  document.getElementById('modal-img').src = p.img;
  document.getElementById('modal-img').onerror = function() { this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'; };
  document.getElementById('modal-category').textContent = `${p.category.charAt(0).toUpperCase() + p.category.slice(1)} • ${productBadge(p)}`;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').innerHTML = `₹${p.price}`;
  document.getElementById('modal-desc').textContent = p.description;
  document.getElementById('modal-tags').innerHTML = p.tags.map(t => `<span class="px-2.5 py-1 bg-gray-100 rounded-full text-[9px] text-gray-500 font-bold">${t}</span>`).join('');

  const tagsEl = document.getElementById('modal-tags');
  let extra = document.getElementById('modal-premium-extra');
  if (!extra) {
    extra = document.createElement('div');
    extra.id = 'modal-premium-extra';
    tagsEl.insertAdjacentElement('afterend', extra);
  }
  extra.innerHTML = `
    <div class="modal-gallery">${gallery.map(src => `<img src="${src}" onclick="document.getElementById('modal-img').src='${src}'" onerror="this.style.display='none'">`).join('')}</div>
    <div class="delivery-promise-card"><span class="material-symbols-outlined">verified</span><div><b>RailQuick delivery promise</b><p>Sealed pack, station-verified partner and direct seat handoff in 12-18 minutes.</p></div></div>
    <div class="modal-info-grid">
      <div class="modal-info-card"><b>Included</b><span>Product, sealed bag, invoice</span></div>
      <div class="modal-info-card"><b>ETA</b><span>12-18 min after order</span></div>
    </div>
    <div class="modal-section"><h4>Key features</h4><div class="modal-chip-row">${(p.tags || []).map(t => `<span class="px-3 py-2 bg-emerald-50 text-primary rounded-full text-[10px] font-black border border-emerald-100">${t}</span>`).join('')}</div></div>
    <div class="modal-section"><h4>Specifications</h4><div class="modal-spec-list"><p><b>Weight</b><span>${p.weight || 'Standard'}</span></p><p><b>Category</b><span>${p.category}</span></p><p><b>Availability</b><span>Station partner verified</span></p></div></div>
    <div class="modal-section"><h4>Frequently bought together</h4><div class="modal-chip-row">${similar.slice(0,3).map(x => `<button class="modal-mini-product" onclick="event.stopPropagation();addToCart(${x.id})"><img src="${x.img}" onerror="this.style.display='none'"><span>${x.name}</span><b class="text-primary text-[10px]">₹${x.price}</b></button>`).join('')}</div></div>
    <div class="modal-section"><h4>Related accessories</h4><div class="modal-chip-row">${PRODUCTS.filter(x => x.category === 'tech' && x.id !== p.id).slice(0,3).map(x => `<article class="modal-mini-product" onclick="openProductModal(${x.id})"><img src="${x.img}" onerror="this.style.display='none'"><span>${x.name}</span></article>`).join('')}</div></div>
    <div class="modal-section"><h4>Similar products</h4><div class="modal-chip-row">${similar.map(x => `<article class="modal-mini-product" onclick="openProductModal(${x.id})"><img src="${x.img}" onerror="this.style.display='none'"><span>${x.name}</span></article>`).join('')}</div></div>
  `;

  document.getElementById('modal-qty').textContent = 1;
  document.getElementById('modal-total').textContent = `₹${p.price}`;
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  appState.modalProduct = null;
}

function closeModal(event) { if (event.target === document.getElementById('product-modal')) closeProductModal(); }

function changeModalQty(delta) {
  appState.modalQty = Math.max(1, appState.modalQty + delta);
  document.getElementById('modal-qty').textContent = appState.modalQty;
  if (appState.modalProduct) {
    document.getElementById('modal-total').textContent = `₹${appState.modalProduct.price * appState.modalQty}`;
  }
}

function addToCartFromModal() {
  if (!appState.modalProduct) return;
  const id = appState.modalProduct.id, qty = appState.modalQty;
  const existing = appState.cart.find(c => c.id === id);
  if (existing) existing.qty += qty; else appState.cart.push({ ...appState.modalProduct, qty });
  
  saveState(); 
  updateCartFAB(); 
  closeProductModal();
  // Quiet add — no toast message
  renderProducts(PRODUCTS);
  
  // Also sync search overlay results if open
  const searchInput = document.getElementById('overlay-search-input');
  if (searchInput && searchInput.value) {
    runOverlaySearch(searchInput.value);
  }
}

// ===== TOAST NOTIFICATION =====
let toastTimeout;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimeout);
  const toast = document.getElementById('toast');
  const iconContainer = document.getElementById('toast-icon-container');
  const icon = document.getElementById('toast-icon');
  const text = document.getElementById('toast-msg');
  
  const icons = { 
    success: 'check', 
    warning: 'warning', 
    info: 'info', 
    error: 'close' 
  };
  
  const bgColors = {
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    info: '#3B82F6',    // Blue 500
    error: '#EF4444'    // Red 500
  };
  
  if (!toast || !icon || !text || !iconContainer) return;
  
  icon.textContent = icons[type] || 'check';
  iconContainer.style.backgroundColor = bgColors[type] || '#10B981';
  text.textContent = msg;
  
  toast.classList.remove('hidden');
  
  // Force reflow
  void toast.offsetHeight;
  
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';
  
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, 2rem)';
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3500);
}

// ===== LOADING INDICATORS =====
let loadingInterval = null;

function showLoading(initialText = 'Fetching Status...') {
  const overlay = document.getElementById('loading-overlay');
  const loaderText = document.getElementById('loading-text');
  if (!overlay || !loaderText) return;
  
  if (loadingInterval) clearInterval(loadingInterval);
  
  loaderText.textContent = initialText;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  void overlay.offsetHeight;
  overlay.style.opacity = '1';
  
  // Custom message tracks for dynamic transition
  let messages = [];
  const textLower = initialText.toLowerCase();
  if (textLower.includes('pnr') || textLower.includes('booking')) {
    messages = [
      "Contacting railway servers...",
      "Fetching PNR booking segment...",
      "Retrieving passenger chart list...",
      "Verifying seat confirmation status...",
      "Opening RailQuick essentials store..."
    ];
  } else if (textLower.includes('train') || textLower.includes('route') || textLower.includes('live')) {
    messages = [
      "Pinging GPS transponder signal...",
      "Calculating actual train speed...",
      "Retrieving platform number schedule...",
      "Syncing arrival delay estimates...",
      "Opening live satellite track..."
    ];
  } else {
    messages = [
      "Opening essentials catalog...",
      "Locating station delivery vendors...",
      "Loading premium storefront..."
    ];
  }
  
  let msgIdx = 0;
  loadingInterval = setInterval(() => {
    if (msgIdx < messages.length) {
      loaderText.style.opacity = '0';
      setTimeout(() => {
        loaderText.textContent = messages[msgIdx++];
        loaderText.style.opacity = '1';
      }, 150);
    }
  }, 1000);
}

function hideLoading() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }, 300);
}

// ===== DATE INITIALIZATION =====
function setDefaultDates() { 
  document.querySelectorAll('input[type="date"]').forEach(input => { 
    input.value = new Date().toISOString().slice(0, 10); 
  }); 
}

// ===== OFFERS, SUPPORT & GAMES LOGIC =====

// Apply promo/coupon code
function applyCouponCode(code) {
  if (appState.cart.length === 0) {
    showToast('Your cart is empty! Add items first.', 'warning');
    return;
  }
  
  const subtotal = appState.cart.reduce((s, c) => s + c.price * c.qty, 0);
  
  if (code === 'RAIL50' && subtotal < 200) {
    showToast('RAIL50 requires a minimum order of ₹200', 'warning');
    return;
  }
  if (code === 'RAIL100' && subtotal < 300) {
    showToast('RAIL100 requires a minimum order of ₹300', 'warning');
    return;
  }

  appState.appliedCoupon = code;
  saveState();
  showToast(`Coupon "${code}" applied successfully!`, 'success');
  
  // Update the input field value if present
  const promoInput = document.getElementById('promo-input');
  if (promoInput) promoInput.value = code;
  
  navigateTo('page-cart');
  initCartPage();
}

// Support Chat Bot
function sendSupportMessage(text) {
  const container = document.getElementById('support-chat-messages');
  if (!container) return;
  
  // User bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'flex items-start gap-2.5 max-w-[85%] ml-auto justify-end';
  userBubble.innerHTML = `
    <div class="bg-primary text-white rounded-2xl p-3.5 shadow-sm text-xs font-semibold leading-relaxed">
      ${text}
    </div>
  `;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;
  
  // Disable replies while typing
  const replies = document.getElementById('support-quick-replies');
  if (replies) replies.style.pointerEvents = 'none';
  
  // Bot typing bubble
  const typingBubble = document.createElement('div');
  typingBubble.className = 'flex items-start gap-2.5 max-w-[85%]';
  typingBubble.innerHTML = `
    <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-sm">robot_2</span>
    </div>
    <div class="bg-white border border-outline-variant/60 rounded-2xl p-3 px-4 shadow-sm text-xs font-bold text-gray-400 flex gap-1 items-center italic">
      Typing<span class="animate-bounce">.</span><span class="animate-bounce [animation-delay:0.2s]">.</span><span class="animate-bounce [animation-delay:0.4s]">.</span>
    </div>
  `;
  
  setTimeout(() => {
    container.appendChild(typingBubble);
    container.scrollTop = container.scrollHeight;
  }, 400);
  
  // Bot response logic
  setTimeout(() => {
    typingBubble.remove();
    if (replies) replies.style.pointerEvents = 'auto';
    
    let replyText = "I'm checking on that for you. Can you please check your PNR status or contact our customer desk at 1800-RAIL-QUICK?";
    if (text.includes('delayed')) {
      replyText = "If your train is delayed, our delivery agents will automatically track the live train schedule and deliver your order precisely when the train arrives at the station. No hassle!";
    } else if (text.includes('delivered')) {
      replyText = "We partner with authorized catering services at stations. When the train pulls in, our delivery agent will come directly to your coach and hand the package to you at your seat/berth!";
    } else if (text.includes('cancel')) {
      replyText = "You can cancel your order up to 1 hour before the scheduled arrival of the train at your delivery station. Cancel options are available in the 'Orders' tab.";
    } else if (text.includes('where') && text.includes('order')) {
      replyText = 'You can track your order status in the My Orders tab. Tap the Track button next to your order to see real-time delivery updates with live GPS tracking.';
    } else if (text.includes('refund')) {
      replyText = 'Refund requests are processed within 5-7 business days. For orders cancelled before preparation, refunds are instant. Please check your payment method for the credited amount.';
    } else if (text.includes('payment')) {
      replyText = 'We accept UPI, credit/debit cards, net banking, and cash on delivery at selected stations. All transactions are secured with 256-bit encryption.';
    }
    
    const botBubble = document.createElement('div');
    botBubble.className = 'flex items-start gap-2.5 max-w-[85%]';
    botBubble.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-sm">robot_2</span>
      </div>
      <div class="bg-white border border-outline-variant/60 rounded-2xl p-3.5 shadow-sm text-xs font-medium text-on-surface leading-relaxed animate-fade-in-up">
        ${replyText}
      </div>
    `;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  }, 1800);
}

function sendCustomSupportMessage() {
  const input = document.getElementById('chat-user-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  sendSupportMessage(text);
  input.value = '';
}

// Lucky Wheel Game
let isWheelSpinning = false;
let wonCoupon = '';

function spinWheel() {
  if (isWheelSpinning) return;
  isWheelSpinning = true;
  
  const wheel = document.getElementById('lucky-wheel');
  const btn = document.getElementById('spin-button');
  const resultCard = document.getElementById('game-result-card');
  
  if (btn) btn.disabled = true;
  if (resultCard) resultCard.classList.add('hidden');
  
  // Set random rotations (between 5 and 10 full spins) + ending angle
  const segments = ['RAIL50', 'TRY AGAIN', 'CHAI20', 'FREEDEL', 'TRY AGAIN', 'RAIL100'];
  const winIdx = Math.floor(Math.random() * segments.length);
  wonCoupon = segments[winIdx];
  
  // Calculate angle (each segment is 60 degrees. 0 = RAIL50, 60 = TRY AGAIN...)
  const angle = 3600 + (360 - (winIdx * 60)); 
  
  if (wheel) {
    wheel.style.transform = `rotate(${angle}deg)`;
  }
  
  setTimeout(() => {
    isWheelSpinning = false;
    if (btn) btn.disabled = false;
    
    const title = document.getElementById('game-result-title');
    const code = document.getElementById('game-result-code');
    const resultSub = document.getElementById('game-result-sub');
    
    if (wonCoupon === 'TRY AGAIN') {
      if (title) title.textContent = "Better Luck Next Time!";
      if (resultSub) resultSub.textContent = "Spin again to win exclusive travel food rewards.";
      if (code) code.parentElement.style.display = 'none';
    } else {
      if (title) title.textContent = "Congratulations! You Won!";
      if (resultSub) resultSub.textContent = "Use this code at checkout to claim your reward.";
      if (code) {
        code.textContent = wonCoupon;
        code.parentElement.style.display = 'flex';
      }
    }
    
    if (resultCard) resultCard.classList.remove('hidden');
  }, 4100);
}

function applyGameCoupon() {
  if (wonCoupon && wonCoupon !== 'TRY AGAIN') {
    applyCouponCode(wonCoupon);
  }
}

// ===== BOTTOM NAVIGATION BAR =====
const NAV_PAGES = ['page-shop', 'page-pnr', 'page-orders', 'page-account'];

function navTo(pageId) {
  navigateTo(pageId);
  updateBottomNav(pageId);
}

function updateBottomNav(pageId) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  
  // Bottom navigation visibility mapping
  const navPages = ['page-shop', 'page-pnr', 'page-live-tracking', 'page-orders', 'page-account', 'page-games', 'page-category-view', 'page-search'];
  let canShowNav = navPages.includes(pageId);
  
  if (pageId === 'page-pnr' && !appState.hasOnboarded) {
    canShowNav = false;
  }
  
  if (canShowNav) {
    nav.classList.remove('hidden-nav');
    nav.style.display = 'flex';
    nav.style.transform = '';
  } else {
    nav.classList.add('hidden-nav');
    if (pageId === 'page-splash') {
      nav.style.display = 'none';
    } else {
      setTimeout(() => {
        if (appState.currentPage === pageId) {
          nav.style.display = 'none';
        }
      }, 300);
    }
  }
  
  // Update active states
  const items = nav.querySelectorAll('.nav-item');
  items.forEach(item => {
    const targetPage = item.dataset.page;
    const icon = item.querySelector('.nav-icon');
    const isLiveActive = (targetPage === 'page-live-tracking' && (pageId === 'page-live-tracking' || pageId === 'page-pnr'));
    if (targetPage === pageId || isLiveActive ||
        (targetPage === 'page-games' && ['page-games', 'page-support'].includes(pageId)) ||
        (targetPage === 'page-shop' && pageId === 'page-category-view')) {
      item.classList.add('active');
      if (icon) icon.classList.add('fill-1');
    } else {
      item.classList.remove('active');
      if (icon) icon.classList.remove('fill-1');
    }
  });
  
  // Update orders badge
  updateOrdersBadge();
}

function updateOrdersBadge() {
  const badge = document.getElementById('nav-orders-badge');
  if (badge) {
    const count = appState.orders.length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Ripple effect utility
function addRipple(event, element) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
  ripple.classList.add('ripple');
  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Skeleton loading for products
function showProductSkeletons() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-sm"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

function isTrainDateValid(dateStr) {
  if (!dateStr || dateStr === '—') return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);
  
  const journeyDate = new Date(y, m, d, 23, 59, 59);
  const today = new Date();
  today.setHours(0,0,0,0);
  return journeyDate >= today;
}

// ===== INITIAL DOM CONTENT LOADED HOOK =====
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  
  // Guarantee dark mode and home shop page on initial load
  appState.hasOnboarded = true;
  appState.themeMode = 'dark';
  if (!appState.currentPage || appState.currentPage === 'page-splash' || appState.currentPage === 'page-pnr') {
    appState.currentPage = 'page-shop';
  }
  if (!appState.pnrData) {
    appState.pnrData = {
      trainNumber: '12301',
      trainName: 'Rajdhani Express',
      source: 'New Delhi (NDLS)',
      destination: 'Howrah Jn (HWH)',
      passengerList: [{ coach: 'B2', berth: '45', currentStatus: 'CNF' }]
    };
  }
  saveState();

  setDefaultDates();
  setupScrollChromeBehavior();
  startCustomerMarquee();
  initRainAnimation();
  
  const shouldGoToHome = false;

  if (shouldGoToHome) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const splashEl = document.getElementById('page-splash');
    if (splashEl) splashEl.classList.remove('active');
    let targetPage = appState.currentPage || 'page-shop';
    if (targetPage === 'page-splash') targetPage = 'page-shop';
    
    const targetEl = document.getElementById(targetPage);
    if (targetEl) targetEl.classList.add('active');
    
    appState.currentPage = targetPage;
    if (targetPage === 'page-shop') initShopPage();
    if (targetPage === 'page-cart') initCartPage();
    if (targetPage === 'page-pnr') initPnrPage();
    if (targetPage === 'page-live-tracking') initLiveTrackingPage();
    if (targetPage === 'page-orders') initOrdersPage();
    if (targetPage === 'page-account') initAccountPage();
    if (targetPage === 'page-checkout') initCheckoutPage();
    if (targetPage === 'page-track-order') initTrackOrderPage();
    
    updateBottomNav(targetPage);
  } else {
    // Navigate straight to page-pnr on app launch
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const pnrEl = document.getElementById('page-pnr');
    if (pnrEl) pnrEl.classList.add('active');
    appState.currentPage = 'page-pnr';
    appState.hasOnboarded = false;
    updateBottomNav('page-pnr');
    initPnrPage();
    
    if (localStorage.getItem('railquick_logging_in') === 'true') {
      showLoading('Completing secure login...');
      // Safety timeout: if Clerk doesn't load/respond in 6 seconds, redirect to page-pnr
      setTimeout(() => {
        if (localStorage.getItem('railquick_logging_in') === 'true') {
          localStorage.removeItem('railquick_logging_in');
          hideLoading();
          navigateTo('page-pnr');
        }
      }, 6000);
    }
  }
  
  startSearchTypewriter();
  initClerk();
  
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProductModal(); });
});

function startSearchTypewriter() {
  const element = document.getElementById('search-placeholder-text');
  if (!element) return;

  const words = [
    '"hot samosa"',
    '"chilled coke"',
    '"pain relief spray"',
    '"earphones"',
    '"neck pillow"',
    '"masala tea"'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIdx];
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      element.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIdx === currentWord.length) {
      typeSpeed = 1800; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typeSpeed = 400; // pause before next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}


function setupScrollChromeBehavior() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    let lastScrollTop = 0;
    page.addEventListener('scroll', () => {
      const nav = document.getElementById('bottom-nav');
      const scrollTop = page.scrollTop;
      
      if (scrollTop > 30) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down - hide bottom nav
          nav?.classList.add('hidden-nav');
        } else {
          // Scrolling up - show bottom nav
          const navPages = ['page-shop', 'page-pnr', 'page-orders', 'page-account', 'page-category-view', 'page-search'];
          if (navPages.includes(appState.currentPage)) {
            nav?.classList.remove('hidden-nav');
          }
        }
      } else {
        // At the top - always show bottom nav
        const navPages = ['page-shop', 'page-pnr', 'page-orders', 'page-account', 'page-category-view', 'page-search'];
        if (navPages.includes(appState.currentPage)) {
          nav?.classList.remove('hidden-nav');
        }
      }
      lastScrollTop = scrollTop;
    }, { passive: true });
  });
}

function initRainAnimation() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let drops = [];
  const maxDrops = 90;
  let lightningTimer = 0;
  let lightningOpacity = 0;
  let lightningBolts = [];
  let nextLightning = Math.random() * 300 + 180; // frames until next lightning
  let splashes = [];
  
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Create rain drops with varied properties
  for (let i = 0; i < maxDrops; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      length: Math.random() * 18 + 8,
      speed: Math.random() * 10 + 8,
      opacity: Math.random() * 0.2 + 0.06,
      width: Math.random() * 0.8 + 0.3,
      wind: Math.random() * 1.5 + 0.3
    });
  }
  
  // Generate a forked lightning bolt path
  function generateBolt(startX, startY, endY) {
    const points = [{x: startX, y: startY}];
    let currentX = startX;
    let currentY = startY;
    const segments = Math.floor(Math.random() * 6) + 8;
    const segHeight = (endY - startY) / segments;
    
    for (let i = 0; i < segments; i++) {
      currentY += segHeight;
      currentX += (Math.random() - 0.5) * 40;
      points.push({x: currentX, y: currentY});
      
      // Fork chance
      if (Math.random() < 0.25 && i > 2) {
        let forkX = currentX;
        let forkY = currentY;
        const forkLen = Math.floor(Math.random() * 3) + 2;
        const forkPoints = [];
        for (let j = 0; j < forkLen; j++) {
          forkY += segHeight * 0.6;
          forkX += (Math.random() - 0.5) * 30 + (Math.random() > 0.5 ? 15 : -15);
          forkPoints.push({x: forkX, y: forkY});
        }
        points.fork = forkPoints;
        points.forkStart = {x: currentX, y: currentY};
      }
    }
    return points;
  }
  
  function drawBolt(points, alpha) {
    ctx.strokeStyle = `rgba(220, 235, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(180, 210, 255, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      if (typeof points[i].x === 'number') {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
    
    // Inner bright core
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
    ctx.lineWidth = 0.8;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      if (typeof points[i].x === 'number') {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
    
    // Draw fork if exists
    if (points.fork && points.forkStart) {
      ctx.strokeStyle = `rgba(200, 220, 255, ${alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(points.forkStart.x, points.forkStart.y);
      for (let i = 0; i < points.fork.length; i++) {
        ctx.lineTo(points.fork[i].x, points.fork[i].y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  
  function animate() {
    const parent = canvas.closest('.page');
    if (parent && !parent.classList.contains('active')) {
      requestAnimationFrame(animate);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Lightning flash background glow
    if (lightningOpacity > 0) {
      ctx.fillStyle = `rgba(200, 220, 255, ${lightningOpacity * 0.15})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      lightningOpacity *= 0.88; // fade out
      if (lightningOpacity < 0.01) lightningOpacity = 0;
    }
    
    // Draw lightning bolts
    for (let i = lightningBolts.length - 1; i >= 0; i--) {
      const bolt = lightningBolts[i];
      bolt.life -= 0.04;
      if (bolt.life <= 0) {
        lightningBolts.splice(i, 1);
        continue;
      }
      drawBolt(bolt.points, bolt.life * 0.8);
    }
    
    // Trigger lightning periodically
    lightningTimer++;
    if (lightningTimer >= nextLightning) {
      lightningTimer = 0;
      nextLightning = Math.random() * 400 + 200;
      
      const boltX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const boltPoints = generateBolt(boltX, 0, canvas.height * 0.7);
      lightningBolts.push({ points: boltPoints, life: 1.0 });
      lightningOpacity = 1.0;
      
      // Double flash effect
      setTimeout(() => {
        if (Math.random() < 0.5) {
          const boltX2 = boltX + (Math.random() - 0.5) * 40;
          const boltPoints2 = generateBolt(boltX2, 0, canvas.height * 0.5);
          lightningBolts.push({ points: boltPoints2, life: 0.7 });
          lightningOpacity = 0.8;
        }
      }, 80);
    }
    
    // Draw rain drops
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      const rainOpacity = lightningOpacity > 0.3 ? d.opacity * 2.5 : d.opacity;
      
      ctx.lineWidth = d.width;
      ctx.strokeStyle = `rgba(174, 219, 255, ${Math.min(rainOpacity, 0.4)})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind, d.y + d.length);
      ctx.stroke();
      
      d.y += d.speed;
      d.x += d.wind * 0.3;
      
      // When drop hits the bottom, create a splash
      if (d.y > canvas.height) {
        // Small splash particle
        if (Math.random() < 0.3) {
          splashes.push({
            x: d.x, y: canvas.height - 2,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 1.5 + 0.5),
            life: 1.0
          });
        }
        d.y = -d.length - Math.random() * 40;
        d.x = Math.random() * canvas.width;
        d.speed = Math.random() * 10 + 8;
      }
    }
    
    // Draw splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08; // gravity
      s.life -= 0.06;
      
      if (s.life <= 0) {
        splashes.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(174, 219, 255, ${s.life * 0.3})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Keep splash count reasonable
    if (splashes.length > 30) splashes.splice(0, 10);
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function startCustomerMarquee() {
  const marquee = document.getElementById('customer-marquee');
  if (!marquee) return;
  
  let isInteracting = false;
  let interactionTimeout = null;
  let scrollSpeed = 0.55; // Pixels per frame (extremely slow and smooth)
  let scrollAcc = 0;
  
  const handleStart = () => {
    isInteracting = true;
    if (interactionTimeout) clearTimeout(interactionTimeout);
  };
  
  const handleEnd = () => {
    if (interactionTimeout) clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
      isInteracting = false;
    }, 3000); // Resume auto-scroll after 3 seconds
  };
  
  marquee.addEventListener('touchstart', handleStart, { passive: true });
  marquee.addEventListener('touchend', handleEnd, { passive: true });
  marquee.addEventListener('mousedown', handleStart, { passive: true });
  marquee.addEventListener('mouseup', handleEnd, { passive: true });
  marquee.addEventListener('mouseleave', handleEnd, { passive: true });
  
  function step() {
    if (!isInteracting) {
      scrollAcc += scrollSpeed;
      if (scrollAcc >= 1) {
        const move = Math.floor(scrollAcc);
        scrollAcc -= move;
        
        // Loop at the exact half-point because testimonials are duplicated
        const maxScroll = marquee.scrollWidth - marquee.clientWidth;
        const halfScroll = maxScroll / 2;
        
        if (marquee.scrollLeft >= halfScroll) {
          marquee.scrollLeft = 0; // Wrap around seamlessly
        } else {
          marquee.scrollLeft += move;
        }
      }
    }
    requestAnimationFrame(step);
  }
  
  requestAnimationFrame(step);
}

// ===== CLERK AUTHENTICATION =====
// Robust initialization with script load detection and error recovery.

let clerkInitDone = false;

function setupClerkListeners(clerk) {
  if (!clerk || clerkInitDone) return;
  clerkInitDone = true;
  clerkInstance = clerk;
  console.log('[Clerk] Ready. Signed in:', clerk.user?.fullName || 'Not signed in');

  // Sync the current session state immediately
  syncClerkUser();

  // React to sign-in / sign-out events
  clerk.addListener(({ user }) => {
    // Clear logging in flag and spinner since Clerk loaded the session
    localStorage.removeItem('railquick_logging_in');
    hideLoading();

    const wasSignedIn = !!appState.user;
    const isNowSignedIn = !!user;

    if (isNowSignedIn) {
      const savedPhone = localStorage.getItem(`railquick_phone_${user.id}`) || user.primaryPhoneNumber?.phoneNumber || localStorage.getItem('railquick_last_phone') || '';
      const savedOrdersStr = localStorage.getItem(`railquick_orders_${user.id}`);
      if (savedOrdersStr) {
        try {
          appState.orders = JSON.parse(savedOrdersStr);
        } catch(e) {}
      }
      appState.user = {
        name: user.fullName || user.firstName || user.username || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: savedPhone,
        avatarUrl: user.imageUrl || '',
        avatar: (user.fullName || user.firstName || 'U')[0].toUpperCase(),
        provider: 'clerk',
        clerkId: user.id,
        loginAt: new Date().toISOString()
      };
      if (savedPhone) {
        localStorage.setItem(`railquick_phone_${user.id}`, savedPhone);
      }
    } else {
      appState.user = null;
      appState.orders = [];
    }
    saveState();

    if (!wasSignedIn && isNowSignedIn) {
      closeGoogleLoginModal();
      showToast(`Welcome, ${appState.user.name}!`);
      initAccountPage();
      
      // If phone number is missing, auto-open profile page to mandate verification
      if (!appState.user.phone) {
        setTimeout(() => {
          navigateTo('page-account');
          showToast('Please add your mobile number to complete profile', 'warning');
        }, 800);
      } else if (appState.cart.length > 0) {
        setTimeout(() => { navigateTo('page-checkout'); initCheckoutPage(); }, 800);
      } else {
        setTimeout(() => navigateTo('page-shop'), 800);
      }
    } else if (wasSignedIn && !isNowSignedIn) {
      showToast('Signed out', 'info');
      initAccountPage();
    } else {
      initAccountPage();
    }
  });

  // Remove loading state from mount area
  const mountEl = document.getElementById('clerk-sign-in-mount');
  if (mountEl) {
    const loadingEl = mountEl.querySelector('.clerk-loading-state');
    if (loadingEl) loadingEl.remove();
  }

  // If we're currently on the account page, re-init it now that Clerk is ready
  if (appState.currentPage === 'page-account') {
    initAccountPage();
  }
}

const CLERK_PUBLISHABLE_KEY = 'pk_test_c21vb3RoLWphY2thbC0xOC5jbGVyay5hY2NvdW50cy5kZXYk';

// Initialize Clerk: wait for the script, call .load() to boot SDK, then set up listeners
async function initClerk() {
  if (clerkInstance && clerkInitDone) return;

  let clerk = window.Clerk;
  
  // Wait up to 10 seconds for the Clerk script to load from the CDN
  let attempts = 0;
  while (!clerk && attempts < 50) {
    await new Promise(r => setTimeout(r, 200));
    clerk = window.Clerk;
    attempts++;
  }

  if (!clerk) {
    console.error('[Clerk] Failed to load Clerk script from CDN.');
    showClerkFallback();
    return;
  }

  // Check if window.Clerk is the class constructor (common in NPM build environments) or an instance
  if (typeof clerk === 'function') {
    console.log('[Clerk] Instantiating Clerk class...');
    try {
      clerk = new clerk(CLERK_PUBLISHABLE_KEY);
      window.Clerk = clerk;
    } catch (e) {
      console.error('[Clerk] Failed to instantiate Clerk class:', e);
      showClerkFallback();
      return;
    }
  }

  try {
    if (!clerkInitDone) {
      console.log('[Clerk] Calling clerk.load()...');
      await clerk.load({
        publishableKey: CLERK_PUBLISHABLE_KEY,
        appearance: {
          elements: {
            rootBox: 'w-full',
            card: 'shadow-none border-0 p-0 w-full max-w-sm mx-auto bg-transparent',
            formButtonPrimary: 'bg-[#004D3C] hover:bg-[#006A4E]',
          }
        }
      });
    }
    clerkInstance = clerk;
    console.log('[Clerk] Loaded successfully. User:', clerk.user?.fullName || 'Not signed in');
    setupClerkListeners(clerk);
  } catch (err) {
    console.error('[Clerk] load() failed:', err);
    showClerkFallback();
  }
}



function showClerkFallback() {
  const mountEl = document.getElementById('clerk-sign-in-mount');
  if (mountEl) {
    mountEl.innerHTML = `
      <div style="background:#16220f; border:1px solid rgba(255,255,255,0.06); border-radius:24px; padding:24px; box-shadow:0 12px 40px rgba(0,0,0,0.4); display:flex; flex-direction:column; gap:18px; text-align:left;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:4px;">
          <div style="width:34px; height:34px; border-radius:10px; background:rgba(34,197,94,0.12); display:flex; align-items:center; justify-content:center;">
            <span class="material-symbols-outlined" style="color:#22c55e; font-size:18px; font-weight:bold;">lock</span>
          </div>
          <div>
            <h4 style="font-size:14px; font-weight:800; color:#ffffff; margin:0; font-family:'Outfit',sans-serif;">Member Sign-In</h4>
            <p style="font-size:10px; color:rgba(255,255,255,0.45); margin:2px 0 0 0; font-family:'Outfit',sans-serif;">Enter your details to access your account</p>
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="display:block; font-size:9.5px; font-weight:800; color:rgba(255,255,255,0.5); text-transform:uppercase; tracking-wider; margin-bottom:6px; font-family:'Outfit',sans-serif;">Full Name</label>
            <input type="text" id="fallback-login-name" style="width:100%; background:#0b1107; border:1px solid rgba(255,255,255,0.1; border-radius:12px; padding:10px 14px; color:#ffffff; font-size:12.5px; focus:outline-none; font-family:'Outfit',sans-serif;" placeholder="e.g. Kartik Guleria" value="Kartik Guleria">
          </div>
          <div>
            <label style="display:block; font-size:9.5px; font-weight:800; color:rgba(255,255,255,0.5); text-transform:uppercase; tracking-wider; margin-bottom:6px; font-family:'Outfit',sans-serif;">Email Address</label>
            <input type="email" id="fallback-login-email" style="width:100%; background:#0b1107; border:1px solid rgba(255,255,255,0.1; border-radius:12px; padding:10px 14px; color:#ffffff; font-size:12.5px; focus:outline-none; font-family:'Outfit',sans-serif;" placeholder="e.g. name@example.com" value="kartik@example.com">
          </div>
          <div>
            <label style="display:block; font-size:9.5px; font-weight:800; color:rgba(255,255,255,0.5); text-transform:uppercase; tracking-wider; margin-bottom:6px; font-family:'Outfit',sans-serif;">Mobile Number</label>
            <input type="tel" id="fallback-login-phone" style="width:100%; background:#0b1107; border:1px solid rgba(255,255,255,0.1; border-radius:12px; padding:10px 14px; color:#ffffff; font-size:12.5px; font-family:monospace; focus:outline-none;" placeholder="10-digit mobile number" maxlength="10" value="9876543210">
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
          <button onclick="handleFallbackLoginSubmit()" style="width:100%; background:#22c55e; color:#ffffff; border:none; border-radius:12px; padding:12px 0; font-size:12.5px; font-weight:800; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
            <span class="material-symbols-outlined" style="font-size:16px;">login</span>
            Sign In / Log In
          </button>
          
          <button onclick="handleFallbackLoginSubmit()" style="width:100%; background:transparent; border:1.5px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.85); border-radius:12px; padding:11px 0; font-size:12.5px; font-weight:800; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
            <span class="material-symbols-outlined" style="font-size:16px;">person_add</span>
            Create New Account
          </button>
        </div>
      </div>
    `;
  }
}

function handleFallbackLoginSubmit() {
  const nameInput = document.getElementById('fallback-login-name');
  const emailInput = document.getElementById('fallback-login-email');
  const phoneInput = document.getElementById('fallback-login-phone');
  
  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  
  if (!name || !email || !phone) {
    showToast('Please fill all fields to sign in securely', 'error');
    return;
  }
  
  if (phone.length !== 10 || isNaN(phone)) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    return;
  }
  
  showLoading('Connecting to secure auth...');
  setTimeout(() => {
    appState.user = {
      name: name,
      email: email,
      phone: '+91 ' + phone,
      avatarUrl: "",
      avatar: name[0].toUpperCase(),
      provider: "clerk",
      clerkId: "clerk_usr_" + Math.random().toString(36).substr(2, 9),
      loginAt: new Date().toISOString()
    };
    
    localStorage.setItem(`railquick_phone_${appState.user.clerkId}`, appState.user.phone);
    saveState();
    hideLoading();
    showToast(`Signed in successfully as ${name}!`);
    initAccountPage();
    
    const returnPage = localStorage.getItem('railquick_return_after_login') || 'page-shop';
    localStorage.removeItem('railquick_return_after_login');
    
    if (appState.cart.length > 0 && returnPage === 'page-cart') {
      navigateTo('page-cart');
    } else {
      navigateTo('page-shop');
    }
  }, 1200);
}

function retryClerkInit() {
  const mountEl = document.getElementById('clerk-sign-in-mount');
  if (mountEl) {
    mountEl.innerHTML = `
      <div class="clerk-loading-state flex flex-col items-center justify-center py-8 gap-4">
        <div class="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-gray-400 font-medium">Reconnecting...</p>
      </div>
    `;
  }
  
  // Reset flags for retry
  clerkInitDone = false;
  window.__clerkScriptFailed = false;
  window.Clerk = null;
  
  // Remove existing scripts to allow clean reload
  const oldScripts = document.querySelectorAll('script[src*="clerk"]');
  oldScripts.forEach(s => s.remove());
  
  // Re-inject primary CDN script
  const script = document.createElement('script');
  script.async = true;
script.crossOrigin = 'anonymous';
  script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
  script.src = 'https://smooth-jackal-18.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js';
  script.onload = () => { window.__clerkScriptLoaded = true; };
  script.onerror = () => { window.__clerkScriptFailed = true; };
  document.head.appendChild(script);
  
  initClerk();
}

// ===== TRAVEL UTILITY MODALS HANDLERS =====

function openUtilModal(type) {
  const modal = document.getElementById(`modal-util-${type}`);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.style.opacity = '0';
    const card = modal.querySelector('.modal-card');
    if (card) card.style.transform = 'translateY(100%)';
    
    // Force a reflow
    void modal.offsetHeight;
    
    modal.style.opacity = '1';
    modal.style.transition = 'opacity 0.3s ease';
    if (card) {
      card.style.transform = 'translateY(0)';
      card.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
    }
    
    if (type === 'seatmap') {
      selectCoachLayout('SL');
    } else if (type === 'alarm') {
      populateAlarmStations();
    }
  }
}

function closeUtilModal(type) {
  const modal = document.getElementById(`modal-util-${type}`);
  if (modal) {
    const card = modal.querySelector('.modal-card');
    modal.style.opacity = '0';
    if (card) card.style.transform = 'translateY(100%)';
    
    // Clear alarm countdown if active
    if (type === 'alarm' && appState.alarmIntervalId) {
      clearInterval(appState.alarmIntervalId);
    }
    
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300);
  }
}

// Prefill search shortcuts for Platform & Timetable
function prefillPlatformSearch(no) {
  openUtilModal('platform');
  const input = document.getElementById('platform-train-input');
  if (input) {
    input.value = no;
    runPlatformFinder();
  }
}

function prefillTimetableSearch(no) {
  openUtilModal('timetable');
  const input = document.getElementById('timetable-train-input');
  if (input) {
    input.value = no;
    runTimetableFinder();
  }
}

// 1. Platform Finder (Dual Live API & Schedule search with station filter)
async function runPlatformFinder() {
  const input = document.getElementById('platform-train-input').value.trim();
  const resultsDiv = document.getElementById('platform-results');
  if (!input) {
    showToast('Please enter a train number', 'warning');
    return;
  }
  
  showLoading('Fetching platform schedule...');
  
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  
  let route = [];
  let trainInfo = {};
  let isLive = false;

  try {
    // Try live tracker API first for actual platforms
    const trackResp = await fetch(`/api/track-train/${input}/${dateStr}`);
    const trackJson = await trackResp.json();
    if (trackJson.success && trackJson.data && trackJson.data.timeline) {
      route = trackJson.data.timeline;
      trainInfo = { train_name: trackJson.data.trainName || 'Express Train', train_no: input };
      isLive = true;
    }
  } catch (e) {
    console.warn('Live track platform fetch failed, using schedule:', e.message);
  }

  // Fallback to schedule if live is empty
  if (!route.length) {
    try {
      const infoResp = await fetch(`/api/train-info/${input}`);
      const infoJson = await infoResp.json();
      if (infoJson.success && infoJson.data) {
        route = infoJson.data.route || [];
        trainInfo = infoJson.data.trainInfo || { train_name: 'Express Train', train_no: input };
      }
    } catch (e) {
      console.warn('Schedule fetch failed:', e.message);
    }
  }

  hideLoading();
  resultsDiv.classList.remove('hidden');

  if (!route.length) {
    // Return high quality simulated platforms for simulated trains
    const mockSchedule = getMockTrainSchedule(input);
    route = mockSchedule.route;
    trainInfo = mockSchedule.trainInfo;
  }

  // Store the route globally in state so filter matches it!
  appState.platformFinderRoute = route;
  appState.platformFinderTrain = trainInfo;
  appState.platformFinderIsLive = isLive;

  renderFilteredPlatforms('');
}

function renderFilteredPlatforms(query) {
  const route = appState.platformFinderRoute || [];
  const trainInfo = appState.platformFinderTrain || {};
  const isLive = appState.platformFinderIsLive || false;
  const resultsDiv = document.getElementById('platform-results');
  if (!resultsDiv) return;

  const filteredRoute = route.filter(r => 
    (r.stationName || r.stnName || '').toLowerCase().includes(query.toLowerCase()) || 
    (r.stationCode || r.stnCode || '').toLowerCase().includes(query.toLowerCase())
  );

  let routeHTML = filteredRoute.map((r, idx) => {
    const pf = r.platform || '—';
    const isPlatformLive = isLive && r.status === 'current';
    const isHalt = r.haltTime && r.haltTime > 0;
    const haltLabel = isHalt ? `${r.haltTime} min halt` : '';
    
    return `
      <div class="relative pl-6 pb-5 last:pb-1 text-xs flex items-start gap-3">
        <!-- Railway track line timeline -->
        <div class="absolute left-[7px] top-1.5 bottom-0 w-[2px] bg-slate-200 last:hidden"></div>
        <div class="absolute left-0.5 top-1 w-3.5 h-3.5 rounded-full border-2 ${isPlatformLive ? 'bg-emerald-500 border-emerald-400 ring-4 ring-emerald-500/20' : 'bg-white border-primary'} flex items-center justify-center z-10 shrink-0">
          ${isPlatformLive ? '<span class="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>' : ''}
        </div>
        <div class="flex-grow flex justify-between items-center bg-white p-3.5 rounded-2xl border ${isPlatformLive ? 'border-emerald-300 shadow-premium-glow' : 'border-slate-100'} hover:border-primary/20 transition-all duration-200 shadow-sm">
          <div class="flex flex-col min-w-0">
            <span class="font-black text-slate-800 truncate">${r.stationName || r.stnName} (${r.stationCode || r.stnCode})</span>
            <span class="text-[9px] text-slate-450 mt-1 font-bold">Arr: ${r.arrival || r.arrivalTime || 'Source'} • Dep: ${r.departure || r.departureTime || 'Dest'}</span>
            ${isHalt ? `<span class="inline-flex items-center text-[7.5px] bg-slate-100 text-slate-500 font-black px-1.5 py-0.5 rounded-md mt-1 w-fit uppercase tracking-wider">${haltLabel}</span>` : ''}
          </div>
          <div class="flex flex-col items-end shrink-0">
            <span class="${isPlatformLive ? 'bg-emerald-500 text-white animate-pulse' : 'bg-primary/5 text-primary'} font-black font-mono text-xs px-2.5 py-0.5 rounded-lg border ${isPlatformLive ? 'border-emerald-600' : 'border-primary/10'}">PF ${pf}</span>
            <span class="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider">${isPlatformLive ? '● LIVE NOW' : 'Scheduled'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (filteredRoute.length === 0) {
    routeHTML = `<div class="text-[10px] text-center text-slate-400 py-4">No stations found matching "${query}"</div>`;
  }

  resultsDiv.innerHTML = `
    <div class="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-3">
      <div class="flex justify-between items-start border-b border-slate-200/60 pb-2">
        <div class="min-w-0">
          <strong class="text-primary font-black text-xs block truncate">${trainInfo.train_name} (#${trainInfo.train_no})</strong>
          <span class="text-[9px] text-gray-400 font-bold block mt-0.5">${isLive ? 'Real-time Live Platforms' : 'Scheduled platforms at halts'}</span>
        </div>
        ${isLive ? '<span class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider animate-pulse">Live API</span>' : '<span class="bg-slate-100 text-slate-655 border border-slate-200 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">Scheduled</span>'}
      </div>
      
      <!-- Station Search Filter -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">filter_alt</span>
        <input type="text" placeholder="Search station (e.g. Kanpur)..." class="w-full bg-white border border-outline-variant/60 rounded-xl pl-9 pr-3 py-2 text-[10px] font-medium focus:outline-none focus:border-primary transition-all" value="${query}" oninput="renderFilteredPlatforms(this.value)" />
      </div>

      <div class="space-y-2 max-h-[285px] overflow-y-auto pr-1 scrollbar-none pt-1">
        ${routeHTML}
      </div>
    </div>
  `;
}

// 2. Refund Calculator (IRCTC compliant with breakdown GST receipt and cancellation timeline)
function calculateRefund() {
  const coachClass = document.getElementById('refund-class-select').value;
  const fare = parseFloat(document.getElementById('refund-fare-input').value) || 0;
  const time = document.getElementById('refund-time-select').value;
  const resultsDiv = document.getElementById('refund-results');
  
  if (fare <= 0) {
    showToast('Please enter a valid ticket price', 'warning');
    return;
  }

  let flatFee = 120;
  if (coachClass === '1AC') flatFee = 240;
  else if (coachClass === '2AC') flatFee = 200;
  else if (coachClass === '3AC') flatFee = 180;
  else flatFee = 120;

  let fee = 0;
  let chargeRate = '';
  
  if (time === '48h') {
    fee = flatFee;
    chargeRate = 'Flat Cancellation Fee';
  } else if (time === '12h') {
    fee = Math.max(fare * 0.25, flatFee);
    chargeRate = '25% Cancellation Charge';
  } else if (time === '4h') {
    fee = Math.max(fare * 0.50, flatFee);
    chargeRate = '50% Cancellation Charge';
  } else {
    fee = fare;
    chargeRate = '100% Cancellation Charge';
  }

  // AC Classes cancellation fee attracts 5% GST
  let gst = 0;
  if (['1AC', '2AC', '3AC'].includes(coachClass) && time !== 'chart') {
    gst = Math.round(fee * 0.05);
  }

  fee = Math.min(fee + gst, fare);
  const refundAmount = Math.max(fare - fee, 0);
  const pct = (refundAmount / fare) * 100;

  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = `
    <div class="text-xs space-y-4 animate-scale-in mt-3">
      <!-- Refund Ratio Progress Bar -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-[10px] font-black text-slate-405 uppercase tracking-wider">
          <span>Estimated Refund Ratio</span>
          <span class="text-primary font-mono font-black">${pct.toFixed(0)}%</span>
        </div>
        <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
          <div class="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>

      <!-- Premium Bill Receipt -->
      <div class="receipt-paper border border-slate-100/80 rounded-t-3xl pt-5 px-5 pb-7 relative overflow-hidden bg-white shadow-lg">
        <!-- Success Stamp Overlay -->
        <div class="absolute right-4 top-12 z-20 success-stamp px-3 py-1.5 rounded-lg border-2 border-emerald-600/70 border-double text-[9px] font-black uppercase text-emerald-600 tracking-wider">
          Approved Est
        </div>
        
        <div class="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          <span>Fare cancellation Breakdown</span>
          <span class="text-primary font-mono">REC-${Math.floor(1000 + Math.random()*9000)}</span>
        </div>
        
        <div class="space-y-3 pt-4 text-xs font-semibold">
          <div class="flex justify-between items-center text-slate-600 font-bold">
            <span>Ticket Fare Paid:</span>
            <span class="font-mono text-slate-800 font-black">₹${fare.toFixed(2)}</span>
          </div>
          
          <div class="flex justify-between items-center text-slate-500">
            <span>Cancellation Fee (${chargeRate}):</span>
            <span class="text-red-500 font-mono font-bold">-₹${(fee - gst).toFixed(2)}</span>
          </div>

          ${gst > 0 ? `
          <div class="flex justify-between items-center text-slate-500">
            <span>GST on Cancellation Fee (5%):</span>
            <span class="text-red-500 font-mono font-bold">-₹${gst.toFixed(2)}</span>
          </div>
          ` : ''}

          <div class="border-t border-dashed border-slate-200 my-3 pt-3.5 flex justify-between items-center font-black text-on-surface text-sm">
            <span class="text-primary">Estimated Refund:</span>
            <span class="text-emerald-600 font-mono text-base font-black">₹${refundAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Barcode Design -->
        <div class="mt-6 flex flex-col items-center justify-center space-y-1.5 opacity-60">
          <div class="h-8 flex gap-[1px]" style="background-image: repeating-linear-gradient(90deg, #1e293b, #1e293b 1px, transparent 1px, transparent 4px, #1e293b 4px, #1e293b 6px, transparent 6px, transparent 7px); width: 140px;"></div>
          <span class="text-[7.5px] font-mono tracking-widest text-slate-400">IRCTC-${Math.floor(100000 + Math.random()*900000)}</span>
        </div>

        <!-- Torn Edge Design -->
        <div class="receipt-wavy-edge"></div>
      </div>

      <!-- Refund Timeline Steps -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
        <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-3">Cancellation Refund Workflow</div>
        <div class="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          <div class="relative text-[10px]">
            <span class="absolute left-[-16.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm animate-pulse"></span>
            <div class="font-bold text-slate-800">1. Instant Cancellation Request</div>
            <p class="text-[8px] text-slate-400 mt-0.5">Seat released immediately to current inventory.</p>
          </div>
          <div class="relative text-[10px]">
            <span class="absolute left-[-16.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border border-white shadow-sm"></span>
            <div class="font-bold text-slate-650">2. Verification &amp; Clearance</div>
            <p class="text-[8px] text-slate-400 mt-0.5">TDR verifications check for charting schedules.</p>
          </div>
          <div class="relative text-[10px]">
            <span class="absolute left-[-16.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border border-white shadow-sm"></span>
            <div class="font-bold text-slate-655">3. Settlement (3-5 Working Days)</div>
            <p class="text-[8px] text-slate-400 mt-0.5">Amount credited to original payment gateway.</p>
          </div>
        </div>
      </div>
      
      <p class="text-[8.5px] text-slate-400 text-center leading-normal px-2">
        *Estimation based on standard rules. Final refund processed via IRCTC.
      </p>
    </div>
  `;
}

// 3. Timetable Schedule (with station filtering)
function runTimetableFinder() {
  const input = document.getElementById('timetable-train-input').value.trim();
  const resultsDiv = document.getElementById('timetable-results');
  if (!input) {
    showToast('Please enter a train number', 'warning');
    return;
  }

  showLoading('Fetching stoppages schedule...');
  fetch(`/api/train-info/${input}`)
    .then(res => res.json())
    .then(resData => {
      hideLoading();
      resultsDiv.classList.remove('hidden');
      if (resData.success && resData.data) {
        const info = resData.data.trainInfo;
        const route = resData.data.route || [];
        
        appState.timetableRoute = route;
        appState.timetableTrain = info;

        renderFilteredTimetable('');
      } else {
        const mockSchedule = getMockTrainSchedule(input);
        appState.timetableRoute = mockSchedule.route;
        appState.timetableTrain = mockSchedule.trainInfo;
        renderFilteredTimetable('');
      }
    })
    .catch(err => {
      hideLoading();
      const mockSchedule = getMockTrainSchedule(input);
      appState.timetableRoute = mockSchedule.route;
      appState.timetableTrain = mockSchedule.trainInfo;
      renderFilteredTimetable('');
    });
}

function renderFilteredTimetable(query) {
  const route = appState.timetableRoute || [];
  const info = appState.timetableTrain || {};
  const resultsDiv = document.getElementById('timetable-results');
  if (!resultsDiv) return;

  const filteredRoute = route.filter(r => 
    (r.stationName || r.stnName || '').toLowerCase().includes(query.toLowerCase()) || 
    (r.stationCode || r.stnCode || '').toLowerCase().includes(query.toLowerCase())
  );

  let stopsHTML = filteredRoute.map((r, idx) => {
    const arr = r.arrival || r.arrivalTime || 'Source';
    const dep = r.departure || r.departureTime || 'Destination';
    const isFirst = idx === 0 && query === '';
    const isLast = idx === route.length - 1 && query === '';
    const haltVal = r.haltTime || r.halt || 0;
    const distance = r.distance || 0;
    const platform = r.platform || '—';
    
    const markerHTML = isFirst ? `
      <span class="absolute left-[-22px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-500/20 z-10 flex items-center justify-center"></span>
    ` : isLast ? `
      <span class="absolute left-[-22px] top-1.5 w-3.5 h-3.5 rounded-full bg-red-650 border-2 border-white ring-4 ring-red-500/20 z-10 flex items-center justify-center"></span>
    ` : `
      <span class="absolute left-[-22px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary z-10 flex items-center justify-center"></span>
    `;
    
    return `
      <div class="relative pl-5 pb-5 last:pb-1 text-xs">
        ${markerHTML}
        <div class="flex justify-between items-start bg-slate-50/50 hover:bg-slate-50 p-3 rounded-2xl border border-slate-100/50 hover:border-slate-200/50 transition-all duration-200">
          <div class="min-w-0 flex-grow">
            <span class="font-black text-slate-800 block truncate text-xs">${r.stnName || r.stationName} (${r.stnCode || r.stationCode})</span>
            <div class="flex items-center gap-2 mt-1.5 text-[8.5px] font-bold text-slate-400">
              <span class="bg-primary/5 text-primary px-1.5 py-0.5 rounded-md border border-primary/5">PF ${platform}</span>
              <span>•</span>
              <span>${distance} km</span>
              ${haltVal > 0 ? `<span>•</span><span class="text-secondary font-black">${haltVal} min halt</span>` : ''}
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="font-mono font-black text-slate-900 block text-xs">${isFirst ? 'DEP ' + dep : isLast ? 'ARR ' + arr : arr + ' / ' + dep}</span>
            <span class="text-[8px] text-slate-400 uppercase tracking-wider font-extrabold block mt-1">${isFirst ? 'Origin' : isLast ? 'Destination' : 'Halt stop'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (filteredRoute.length === 0) {
    stopsHTML = `<div class="text-[10px] text-center text-slate-400 py-4">No stations found matching "${query}"</div>`;
  }

  resultsDiv.innerHTML = `
    <div class="bg-white border border-outline-variant/60 rounded-3xl p-4 space-y-3">
      <div class="border-b pb-2">
        <strong class="text-primary font-black text-xs block">${info.train_name} (#${info.train_no})</strong>
        <span class="text-[9px] text-gray-400 font-bold block mt-0.5">${info.from_stn_name || 'Origin'} ➔ ${info.to_stn_name || 'Destination'} (${info.travel_time || ''})</span>
      </div>

      <!-- Station Filter Input -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">filter_alt</span>
        <input type="text" placeholder="Search station..." class="w-full bg-[#F4F6F5]/70 border border-outline-variant/60 rounded-xl pl-9 pr-3 py-2 text-[10px] font-medium focus:outline-none focus:border-primary transition-all" value="${query}" oninput="renderFilteredTimetable(this.value)" />
      </div>

      <!-- Scrollable timeline route -->
      <div class="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-150 text-xs space-y-4 max-h-[265px] overflow-y-auto scrollbar-none pt-1">
        ${stopsHTML}
      </div>
    </div>
  `;
}

// 4. Seat Map Layout & Seat Finder
function selectCoachLayout(coachType) {
  const buttons = document.querySelectorAll('.coach-tab-btn');
  buttons.forEach(btn => {
    if (btn.textContent.includes(coachType)) {
      btn.classList.add('active', 'bg-primary', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-500');
    } else {
      btn.classList.remove('active', 'bg-primary', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-500');
    }
  });

  const container = document.getElementById('seatmap-layout-container');
  if (!container) return;

  let seats = [];
  if (coachType === 'SL' || coachType === '3AC') {
    seats = [
      { num: 1, berth: 'Lower (L)', type: 'lower', window: true },
      { num: 2, berth: 'Middle (M)', type: 'middle', window: false },
      { num: 3, berth: 'Upper (U)', type: 'upper', window: false },
      { num: 4, berth: 'Lower (L)', type: 'lower', window: false },
      { num: 5, berth: 'Middle (M)', type: 'middle', window: false },
      { num: 6, berth: 'Upper (U)', type: 'upper', window: true },
      { num: 7, berth: 'Side Lower (SL)', type: 'side-lower', window: true },
      { num: 8, berth: 'Side Upper (SU)', type: 'side-upper', window: true }
    ];
  } else if (coachType === '2AC') {
    seats = [
      { num: 1, berth: 'Lower (L)', type: 'lower', window: true },
      { num: 2, berth: 'Upper (U)', type: 'upper', window: false },
      { num: 3, berth: 'Lower (L)', type: 'lower', window: false },
      { num: 4, berth: 'Upper (U)', type: 'upper', window: true },
      { num: 5, berth: 'Side Lower (SL)', type: 'side-lower', window: true },
      { num: 6, berth: 'Side Upper (SU)', type: 'side-upper', window: true }
    ];
  } else { // 1AC
    seats = [
      { num: 1, berth: 'Cabin A Lower (L)', type: 'lower', window: true },
      { num: 2, berth: 'Cabin A Upper (U)', type: 'upper', window: false },
      { num: 3, berth: 'Cabin B Lower (L)', type: 'lower', window: true },
      { num: 4, berth: 'Cabin B Upper (U)', type: 'upper', window: false }
    ];
  }

  let blueprintHTML = `
    <div class="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
      <span>Compartment Blueprint</span>
      <span onclick="toggleTrainDirection(this)" class="flex items-center gap-1 text-primary cursor-pointer hover:bg-primary/5 px-2 py-0.5 rounded-lg transition-colors select-none">
        Train Direction: <span class="direction-label font-bold">Forward</span>
        <span class="material-symbols-outlined text-[12px] animate-pulse direction-arrow transition-transform duration-300">arrow_right_alt</span>
      </span>
    </div>
    
    <!-- Visual Train Coach Shell -->
    <div class="bg-slate-100 rounded-2xl p-3.5 border border-slate-200/60 relative overflow-hidden">
      <!-- Washrooms / Exit at Side -->
      <div class="flex justify-between items-center text-[7.5px] font-black text-slate-400 mb-3 border-b border-slate-200 pb-1.5">
        <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[9px] text-red-500">wc</span> WASHROOM</span>
        <span class="flex items-center gap-0.5">DOOR <span class="material-symbols-outlined text-[9px] text-emerald-500">exit_to_app</span></span>
      </div>
      
      <div class="flex flex-col gap-3">
        <!-- Windows top -->
        <div class="flex justify-around items-center h-1 bg-slate-300/40 rounded-full mx-6 select-none text-[6px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Window</span>
          <span>Window</span>
          <span>Window</span>
        </div>

        <!-- Cabin Seats visual -->
        <div class="grid grid-cols-12 gap-2">
          <!-- Main Compartment Block -->
          <div class="col-span-8 bg-white/70 border border-slate-200 rounded-xl p-2.5 grid grid-cols-3 gap-2">
            ${seats.filter(s => !s.berth.toLowerCase().includes('side')).map(s => `
              <div id="seat-node-${s.num}" onclick="selectSeatMapNode(${s.num}, '${s.berth}', ${s.window})" 
                   class="seat-node seat-${s.type} border border-slate-200/50 rounded-xl p-2 flex flex-col items-center justify-center bg-white cursor-pointer hover:shadow-sm active:scale-95 transition-all text-center min-h-[56px]">
                <span class="material-symbols-outlined text-[13px]">airline_seat_recline_extra</span>
                <span class="text-[9.5px] font-black text-slate-800 mt-0.5">#${s.num}</span>
                <span class="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate max-w-full">${s.berth.split(' ')[0]}</span>
              </div>
            `).join('')}
          </div>
          
          <!-- Corridor spacer line -->
          <div class="col-span-1 flex items-center justify-center">
            <div class="h-full w-[2px] bg-dashed bg-slate-300 opacity-40"></div>
          </div>
          
          <!-- Side Berths Corridor Block -->
          <div class="col-span-3 bg-white/70 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-around gap-2">
            ${seats.filter(s => s.berth.toLowerCase().includes('side')).map(s => `
              <div id="seat-node-${s.num}" onclick="selectSeatMapNode(${s.num}, '${s.berth}', ${s.window})" 
                   class="seat-node seat-${s.type} border border-slate-200/50 rounded-xl p-2 flex flex-col items-center justify-center bg-white cursor-pointer hover:shadow-sm active:scale-95 transition-all text-center min-h-[50px]">
                <span class="material-symbols-outlined text-[13px]">airline_seat_recline_extra</span>
                <span class="text-[9.5px] font-black text-slate-800 mt-0.5">#${s.num}</span>
                <span class="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate max-w-full">Side</span>
              </div>
            `).join('')}
            ${seats.filter(s => s.berth.toLowerCase().includes('side')).length === 0 ? `
              <div class="text-[8px] font-bold text-slate-400 text-center py-4 select-none">No Side</div>
            ` : ''}
          </div>
        </div>

        <!-- Windows bottom -->
        <div class="flex justify-around items-center h-1 bg-slate-300/40 rounded-full mx-6 select-none text-[6px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Window</span>
          <span>Window</span>
        </div>
      </div>
      
      <div class="flex justify-between items-center text-[7.5px] font-black text-slate-400 mt-3 border-t border-slate-200 pt-1.5 select-none">
        <span>COACH ENTRY</span>
        <span>DOOR <span class="material-symbols-outlined text-[9px] text-emerald-500">exit_to_app</span></span>
      </div>
    </div>

    <!-- Legend Info -->
    <div class="flex justify-between gap-1 mt-3 px-1 text-[7px] font-bold uppercase text-slate-400 tracking-wider select-none">
      <span class="flex items-center gap-0.5"><span class="w-1.5 h-1.5 bg-[#E6F6EC] border border-[#10B981]/20 rounded"></span> Lower</span>
      <span class="flex items-center gap-0.5"><span class="w-1.5 h-1.5 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded"></span> Middle</span>
      <span class="flex items-center gap-0.5"><span class="w-1.5 h-1.5 bg-[#FAF5FF] border border-[#A855F7]/20 rounded"></span> Upper</span>
      <span class="flex items-center gap-0.5"><span class="w-1.5 h-1.5 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded"></span> S.Lower</span>
      <span class="flex items-center gap-0.5"><span class="w-1.5 h-1.5 bg-[#FFF1F2] border border-[#F43F5E]/20 rounded"></span> S.Upper</span>
    </div>
  `;

  container.innerHTML = blueprintHTML;
  document.getElementById('selected-seat-info').classList.add('hidden');
}

function selectSeatMapNode(num, berth, windowSeat) {
  document.querySelectorAll('.seat-node').forEach(node => {
    node.classList.remove('selected-seat');
  });
  
  const clickedNode = document.getElementById(`seat-node-${num}`);
  if (clickedNode) clickedNode.classList.add('selected-seat');
  
  const seatInput = document.getElementById('seatmap-num-input');
  if (seatInput) seatInput.value = num;

  const info = document.getElementById('selected-seat-info');
  if (info) {
    info.classList.remove('hidden');
    info.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-sm">event_seat</span>
        <span>Berth Selected — <strong>Seat #${num}</strong>: ${berth} ${windowSeat ? '· Window Seat (W)' : '· Corridor Seat'}</span>
      </div>
    `;
  }
}

function findSeatPosition() {
  const input = document.getElementById('seatmap-num-input');
  const info = document.getElementById('selected-seat-info');
  if (!input || !info) return;
  const seat = parseInt(input.value);
  if (isNaN(seat) || seat < 1 || seat > 72) {
    info.classList.remove('hidden');
    info.innerHTML = `<span class="text-red-500 font-bold">Please enter a valid seat number (1-72)</span>`;
    return;
  }
  
  const remainder = seat % 8;
  let berth = '';
  let windowSeat = false;
  
  if (remainder === 1 || remainder === 4) {
    berth = 'Lower Berth (L)';
    windowSeat = (remainder === 1);
  } else if (remainder === 2 || remainder === 5) {
    berth = 'Middle Berth (M)';
    windowSeat = false;
  } else if (remainder === 3 || remainder === 6) {
    berth = 'Upper Berth (U)';
    windowSeat = (remainder === 6);
  } else if (remainder === 7) {
    berth = 'Side Lower Berth (SL)';
    windowSeat = true;
  } else {
    berth = 'Side Upper Berth (SU)';
    windowSeat = true;
  }
  
  document.querySelectorAll('.seat-node').forEach(node => {
    node.classList.remove('selected-seat');
  });
  
  const foundNode = document.getElementById(`seat-node-${seat}`);
  if (foundNode) {
    foundNode.classList.add('selected-seat');
    foundNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  info.classList.remove('hidden');
  info.innerHTML = `
    <div class="flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-sm">event_seat</span>
      <span>Seat Located — <strong>Seat #${seat}</strong>: ${berth} ${windowSeat ? '· Window Seat (W)' : '· Corridor Seat'}</span>
    </div>
  `;
}

// 5. Food Station Alarm
function populateAlarmStations() {
  const select = document.getElementById('alarm-station-select');
  if (!select) return;
  
  const route = appState.liveStatusTimeline || appState.platformFinderRoute || appState.timetableRoute || [];
  if (route.length > 0) {
    select.innerHTML = route.map(r => {
      const name = r.stationName || r.stnName || 'Station';
      const code = r.stationCode || r.stnCode || '';
      const depTime = r.departure || r.departureTime || '';
      return `<option value="${name} (${code})">${name} (${code}) ${depTime ? ' - Dep ' + depTime : ''}</option>`;
    }).join('');
  } else {
    select.innerHTML = `
      <option value="Kanpur Central (CNB)">Kanpur Central (CNB) - In 45 mins</option>
      <option value="New Delhi (NDLS)">New Delhi (NDLS) - Completed</option>
      <option value="Patna Junction (PNBE)">Patna Junction (PNBE) - In 5 hours</option>
      <option value="Howrah Junction (HWH)">Howrah Junction (HWH) - In 9 hours</option>
    `;
  }
}

function setStationAlarm() {
  const selectEl = document.getElementById('alarm-station-select');
  if (!selectEl) return;
  const station = selectEl.value;
  const statusDiv = document.getElementById('alarm-active-status');
  const targetText = document.getElementById('alarm-status-target');
  const countdownText = document.getElementById('alarm-countdown');
  const distanceText = document.getElementById('alarm-distance');
  
  if (statusDiv) statusDiv.classList.remove('hidden');
  if (targetText) targetText.textContent = station;
  
  showToast('✓ GPS Wake Alarm set successfully!', 'success');

  let minsLeft = 45;
  let kmAway = 38.5;
  if (countdownText) countdownText.textContent = `${minsLeft} mins`;
  if (distanceText) distanceText.textContent = `${kmAway.toFixed(1)} km`;
  
  const alarmInterval = setInterval(() => {
    if (minsLeft > 5) {
      minsLeft -= 5;
      kmAway -= 4.2;
      if (countdownText) countdownText.textContent = `${minsLeft} mins`;
      if (distanceText) distanceText.textContent = `${Math.max(kmAway, 0.5).toFixed(1)} km`;
    } else {
      clearInterval(alarmInterval);
    }
  }, 15000);
  
  appState.alarmIntervalId = alarmInterval;

  // Trigger sound alarm chime after 8 seconds (demo trigger)
  setTimeout(() => {
    showToast('🚨 GPS ALERT: Approaching ' + station + '!', 'success');
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.5, audioCtx.currentTime); // C6 note
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 300);
    } catch(e) {}
    
    alert(`🚨 RailQuick GPS Wake Alarm:\nYour train is approaching ${station} in 15 minutes! Please prepare for your delivery at your seat.`);
  }, 8000);
}

function openSearchOverlay() {
  navigateTo('page-search');
  
  // Auto-focus input and bind blur/focus listeners to hide/show Cart FAB
  const input = document.getElementById('overlay-search-input');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 150);
    
    input.onfocus = () => {
      const fab = document.getElementById('cart-fab');
      if (fab) fab.classList.add('hidden');
    };
    input.onblur = () => {
      setTimeout(() => {
        updateCartFAB();
      }, 300);
    };
  }
  
  clearOverlaySearch();
  loadRecentSearches();
}

function closeSearchOverlay() {
  document.getElementById('overlay-search-input')?.blur();
  navigateTo('page-shop');
}

function clearOverlaySearch() {
  const input = document.getElementById('overlay-search-input');
  if (input) input.value = '';
  
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  
  const defaultView = document.getElementById('search-default-view');
  if (defaultView) defaultView.classList.remove('hidden');
  
  const resultsView = document.getElementById('search-results-view');
  if (resultsView) resultsView.classList.add('hidden');
  
  loadRecentSearches();
}

function prefillSearch(text) {
  const input = document.getElementById('overlay-search-input');
  if (input) {
    input.value = text;
    runOverlaySearch(text);
    saveRecentSearch(text);
    input.blur(); // Collapse keyboard
  }
}

function prefillCategorySearch(cat) {
  closeSearchOverlay();
  const allPills = document.querySelectorAll('.category-pill');
  let matchedPill = null;
  allPills.forEach(pill => {
    if (pill.getAttribute('onclick') && pill.getAttribute('onclick').includes(cat)) {
      matchedPill = pill;
    }
  });
  filterCategory(cat, matchedPill);
  const prodSec = document.getElementById('products-section');
  if (prodSec) prodSec.scrollIntoView({ behavior: 'smooth' });
}

function runOverlaySearch(q) {
  const query = q.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear-btn');
  const defaultView = document.getElementById('search-default-view');
  const resultsView = document.getElementById('search-results-view');
  const grid = document.getElementById('search-results-grid');
  
  if (clearBtn) {
    if (query) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }
  
  if (!query) {
    if (defaultView) defaultView.classList.remove('hidden');
    if (resultsView) resultsView.classList.add('hidden');
    return;
  }
  
  if (defaultView) defaultView.classList.add('hidden');
  if (resultsView) resultsView.classList.remove('hidden');
  
  const filtered = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.category.toLowerCase().includes(query) ||
    (p.desc && p.desc.toLowerCase().includes(query))
  );
  
  const title = document.getElementById('search-results-title');
  if (title) title.textContent = `Found ${filtered.length} matching items`;
  
  if (!filtered.length) {
    if (grid) {
      const cleanQ = q.replace(/"/g, '&quot;');
      grid.innerHTML = `
        <div class="col-span-2 bg-[#141822] border border-white/10 rounded-3xl p-5 shadow-2xl text-left space-y-4 my-2" id="search-suggestion-container">
          <div class="flex items-start gap-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <span class="material-symbols-outlined text-2xl">search_off</span>
            </div>
            <div>
              <h4 class="text-sm font-extrabold text-white">Couldn't find "${cleanQ}"?</h4>
              <p class="text-[11px] text-gray-400 mt-0.5 leading-snug">We don't have this item right now, but you can suggest it and our railway station pantry team will stock it!</p>
            </div>
          </div>
          
          <div class="space-y-3 pt-1">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Item you want to suggest</label>
              <input type="text" id="suggestion-item-name" value="${cleanQ}" class="w-full bg-[#1c2230] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-[#22c55e]" placeholder="e.g. Diet Coke, Diet Chips, Paracetamol" />
            </div>
            
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Brand preference or details (optional)</label>
              <textarea id="suggestion-item-notes" rows="2" class="w-full bg-[#1c2230] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#22c55e] resize-none" placeholder="e.g. 500ml cold bottle, specific flavor, or urgent need for train coach..."></textarea>
            </div>

            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
              <div class="flex gap-1.5 flex-wrap" id="suggestion-cat-chips">
                <button type="button" class="px-2.5 py-1 rounded-full bg-white/5 border border-[#22c55e] text-[#22c55e] text-[10px] font-bold" onclick="selectSuggestionChip(this, 'Snacks')">🍿 Snacks</button>
                <button type="button" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold" onclick="selectSuggestionChip(this, 'Drinks')">🥤 Drinks</button>
                <button type="button" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold" onclick="selectSuggestionChip(this, 'Instant Food')">🍜 Food</button>
                <button type="button" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold" onclick="selectSuggestionChip(this, 'Pharmacy')">💊 Pharmacy</button>
                <button type="button" class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold" onclick="selectSuggestionChip(this, 'Travel Gear')">🔌 Travel Gear</button>
              </div>
            </div>

            <button onclick="submitProductSuggestion()" class="w-full bg-[#0C8346] hover:bg-[#0a723d] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-2">
              <span class="material-symbols-outlined text-base font-bold">send</span>
              Submit Product Suggestion
            </button>
          </div>
        </div>
      `;
    }
    return;
  }
  
  if (grid) {
    grid.innerHTML = filtered.map(p => {
      const inCart = appState.cart.find(c => c.id === p.id);
      const qty = inCart ? inCart.qty : 0;
      const weightText = p.weight ? p.weight : '1 Unit';
      const buttonHTML = qty > 0
        ? `<div class="flex items-center bg-[#16a34a] rounded-xl text-white overflow-hidden shadow-md border border-emerald-500/30 shrink-0 h-8">
             <button class="w-7 h-8 flex items-center justify-center hover:bg-black/10 active:bg-black/20 font-bold transition-colors text-sm" onclick="event.stopPropagation();changeSearchProductQty(${p.id},-1)">−</button>
             <span class="px-1.5 font-mono text-xs font-bold min-w-[18px] text-center">${qty}</span>
             <button class="w-7 h-8 flex items-center justify-center hover:bg-black/10 active:bg-black/20 font-bold transition-colors text-sm" onclick="event.stopPropagation();changeSearchProductQty(${p.id},1)">+</button>
           </div>`
        : `<button class="bg-[#16a34a] hover:bg-[#15803d] text-white px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all shadow-md shrink-0 active:scale-95" onclick="event.stopPropagation();addSearchProductToCart(${p.id})">ADD</button>`;

      return `
        <div class="bg-[#181d27] rounded-3xl p-3.5 border border-white/10 flex flex-col group cursor-pointer hover:border-emerald-500/30 active:scale-[0.98] transition-all relative overflow-hidden text-white" onclick="openProductModal(${p.id})">
          <div class="w-full aspect-square bg-white/5 rounded-2xl p-2.5 mb-2.5 flex items-center justify-center relative overflow-hidden shrink-0">
            <img alt="${p.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" src="${p.img}" onerror="this.onerror=null;this.src='product_lays.png';">
          </div>
          <div class="flex flex-col flex-grow">
            <h4 class="text-xs font-bold text-white line-clamp-2 mb-1 leading-tight min-h-[30px]">${p.name}</h4>
            <p class="text-[10px] font-semibold text-gray-400 mb-1.5">${weightText}</p>
            <div class="flex justify-between items-center mt-auto gap-2">
              <span class="text-sm font-black text-[#22c55e] font-mono">₹${p.price}</span>
              ${buttonHTML}
            </div>
          </div>
        </div>`;
    }).join('');
  }
}

// Wrapper to sync quantities inside search results list
function addSearchProductToCart(id) {
  addToCart(id);
  
  // Collapse keyboard to avoid layout shifting
  const qInput = document.getElementById('overlay-search-input');
  if (qInput) {
    qInput.blur();
    runOverlaySearch(qInput.value);
  }
}

function changeSearchProductQty(id, change) {
  changeProductQty(id, change);
  
  // Collapse keyboard to avoid layout shifting
  const qInput = document.getElementById('overlay-search-input');
  if (qInput) {
    qInput.blur();
    runOverlaySearch(qInput.value);
  }
}

// ===== SEARCH SUGGESTION LOGIC =====
let activeSuggestionCat = 'Snacks';
function selectSuggestionChip(btn, cat) {
  activeSuggestionCat = cat;
  const container = document.getElementById('suggestion-cat-chips');
  if (container) {
    container.querySelectorAll('button').forEach(b => {
      b.className = 'px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold';
    });
  }
  if (btn) {
    btn.className = 'px-2.5 py-1 rounded-full bg-white/5 border border-[#22c55e] text-[#22c55e] text-[10px] font-bold';
  }
}

function submitProductSuggestion() {
  const nameInput = document.getElementById('suggestion-item-name');
  const notesInput = document.getElementById('suggestion-item-notes');
  const name = (nameInput?.value || '').trim();
  const notes = (notesInput?.value || '').trim();

  if (!name) {
    showToast('Please specify the product you want to suggest', 'warning');
    return;
  }

  // Save suggestion to localStorage
  try {
    const list = JSON.parse(localStorage.getItem('railquick_product_suggestions') || '[]');
    list.push({
      item: name,
      notes: notes,
      category: activeSuggestionCat,
      date: new Date().toISOString(),
      train: appState.pnrData?.trainName || '12301 Rajdhani Express',
      seat: appState.pnrData?.passengerList?.[0] ? `Coach ${appState.pnrData.passengerList[0].coach}, Seat ${appState.pnrData.passengerList[0].berth}` : 'Coach B2, Seat 45'
    });
    localStorage.setItem('railquick_product_suggestions', JSON.stringify(list));
  } catch(e) {}

  const container = document.getElementById('search-suggestion-container');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center mx-auto border border-[#22c55e]/30 shadow-lg">
          <span class="material-symbols-outlined text-3xl font-bold">check_circle</span>
        </div>
        <h4 class="text-base font-extrabold text-white">Suggestion Recorded!</h4>
        <p class="text-xs text-gray-300 max-w-[280px] mx-auto leading-relaxed">
          We have recorded your request for <strong class="text-white">"${name}"</strong>. Our train route pantry team will check stock for upcoming station halts!
        </p>
        <div class="pt-2 flex gap-2 justify-center">
          <button onclick="clearOverlaySearch()" class="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Back to Search</button>
          <button onclick="closeSearchOverlay()" class="bg-[#22c55e] text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Go to Home</button>
        </div>
      </div>
    `;
  }

  showToast(`✓ Request recorded for "${name}"! We will try to stock it soon.`, 'success');
}


function updateHomeProfileAvatar() {
  const container = document.getElementById('shop-profile-avatar-container');
  if (!container) return;
  
  if (appState.user) {
    if (appState.user.avatarUrl) {
      container.innerHTML = `<img src="${appState.user.avatarUrl}" class="w-full h-full object-cover rounded-full" onerror="this.onerror=null; this.innerHTML='<div class=\\'w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-xs font-black\\'>${appState.user.avatar || 'U'}</div>';">`;
    } else {
      container.innerHTML = `
        <div class="w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-xs font-black">
          ${appState.user.avatar || 'U'}
        </div>
      `;
    }
  } else {
    container.innerHTML = `<span class="material-symbols-outlined text-white/80 text-[24px]">person</span>`;
  }
}

function saveCompulsoryPhone() {
  const input = document.getElementById('completion-phone-input');
  if (!input) return;
  
  const phoneVal = input.value.trim();
  const phoneRegex = /^[6-9]\d{9}$/; // 10-digit Indian phone numbers
  if (!phoneRegex.test(phoneVal)) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    return;
  }
  
  if (appState.user) {
    appState.user.phone = phoneVal;
    localStorage.setItem(`railquick_phone_${appState.user.clerkId || 'guest'}`, phoneVal);
    localStorage.setItem('railquick_global_phone', phoneVal);
    saveState();
    initAccountPage();
    showToast('✓ Mobile number verified & linked!', 'success');
  } else {
    showToast('Please sign in first', 'error');
  }
}

// ===== TRAIN TRIVIA QUIZ GAME =====
let currentQuizQ = 0;
const QUIZ_QUESTIONS = [
  { q: 'Which is the longest railway platform in India?', options: ['Gorakhpur', 'Kharagpur', 'Bilaspur', 'Hubli'], answer: 0 },
  { q: 'What does PNR stand for?', options: ['Passenger Name Record', 'Personal Number Registry', 'Platform Node Route', 'Public Network Rail'], answer: 0 },
  { q: 'Which is the fastest train in India?', options: ['Rajdhani Express', 'Vande Bharat Express', 'Shatabdi Express', 'Duronto Express'], answer: 1 },
  { q: 'Indian Railways is the ____ largest rail network.', options: ['2nd', '3rd', '4th', '5th'], answer: 2 },
  { q: 'Which city has the busiest railway station?', options: ['Mumbai (CST)', 'New Delhi', 'Howrah', 'Chennai'], answer: 0 }
];

function startTrainQuiz() {
  currentQuizQ = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.classList.remove('hidden');
  if (currentQuizQ >= QUIZ_QUESTIONS.length) {
    container.innerHTML = `
      <div class="text-center py-4 space-y-2">
        <span class="material-symbols-outlined text-4xl text-purple-600">emoji_events</span>
        <h4 class="text-sm font-bold text-on-surface">Quiz Complete!</h4>
        <p class="text-[10px] text-gray-500">Great job! You know your Indian Railways well.</p>
        <button class="bg-purple-600 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase mt-2 active:scale-95 transition-all" onclick="startTrainQuiz()">Play Again</button>
      </div>
    `;
    return;
  }
  const q = QUIZ_QUESTIONS[currentQuizQ];
  container.innerHTML = `
    <div class="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3">
      <div class="text-[9px] font-black text-purple-400 uppercase tracking-wider">Question ${currentQuizQ + 1} of ${QUIZ_QUESTIONS.length}</div>
      <p class="text-xs font-bold text-on-surface leading-relaxed">${q.q}</p>
      <div class="space-y-2">
        ${q.options.map((opt, i) => `
          <button class="w-full text-left bg-white border border-purple-100 rounded-xl px-3 py-2.5 text-[10px] font-bold text-slate-700 hover:border-purple-400 active:scale-[0.98] transition-all" onclick="answerQuiz(${i}, ${q.answer})">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function answerQuiz(selected, correct) {
  if (selected === correct) {
    showToast('✓ Correct!', 'success');
  } else {
    showToast('✗ Wrong! Answer: ' + QUIZ_QUESTIONS[currentQuizQ].options[correct], 'error');
  }
  currentQuizQ++;
  setTimeout(() => renderQuizQuestion(), 800);
}

// ===== RECENT SEARCH HISTORY =====
function loadRecentSearches() {
  const container = document.getElementById('search-recent-container');
  const list = document.getElementById('search-recent-list');
  if (!container || !list) return;
  
  let recents = [];
  try {
    recents = JSON.parse(localStorage.getItem('railquick_recent_searches')) || [];
  } catch(e) {}
  
  if (recents.length === 0) {
    container.classList.add('hidden');
    return;
  }
  
  container.classList.remove('hidden');
  list.innerHTML = recents.map(term => `
    <button onclick="prefillSearch('${term}')" class="bg-slate-100 hover:bg-slate-200 border border-slate-200/40 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-700 flex items-center gap-1 active:scale-95 transition-all">
      <span class="material-symbols-outlined text-[10px] text-slate-400">history</span>
      ${term}
    </button>
  `).join('');
}

function saveRecentSearch(term) {
  if (!term || !term.trim()) return;
  const clean = term.trim();
  
  let recents = [];
  try {
    recents = JSON.parse(localStorage.getItem('railquick_recent_searches')) || [];
  } catch(e) {}
  
  // Remove duplicate if exists, and push to front
  recents = recents.filter(x => x.toLowerCase() !== clean.toLowerCase());
  recents.unshift(clean);
  recents = recents.slice(0, 6); // Max 6 recent searches
  
  localStorage.setItem('railquick_recent_searches', JSON.stringify(recents));
  loadRecentSearches();
}

function clearRecentSearches() {
  localStorage.removeItem('railquick_recent_searches');
  loadRecentSearches();
}

// Phase 2 helper functions
function toggleTrainDirection(element) {
  const label = element.querySelector('.direction-label');
  const arrow = element.querySelector('.direction-arrow');
  if (label && arrow) {
    const isForward = label.textContent === 'Forward';
    label.textContent = isForward ? 'Reverse' : 'Forward';
    arrow.style.transform = isForward ? 'rotate(180deg)' : 'rotate(0deg)';
    showToast(`Train direction toggled to ${isForward ? 'Reverse' : 'Forward'}!`, 'info');
    
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

function prefillPNRInput(val) {
  const input = document.getElementById('pnr-input');
  if (input) {
    input.value = val;
    if (navigator.vibrate) navigator.vibrate(20);
    checkPNRStatus();
  }
}

function prefillLiveTrainInput(val) {
  const input = document.getElementById('live-train-input');
  if (input) {
    input.value = val;
    if (navigator.vibrate) navigator.vibrate(20);
    verifyTrainAndShowDates();
  }
}

function goBackToSearch() {
  const searchCard = document.getElementById('pnr-search-card');
  if (searchCard) {
    searchCard.classList.remove('hidden');
  }
  const resultsPnr = document.getElementById('pnr-results');
  if (resultsPnr) {
    resultsPnr.classList.add('hidden');
    resultsPnr.innerHTML = '';
  }
  const resultsLive = document.getElementById('live-tracking-results');
  if (resultsLive) {
    resultsLive.classList.add('hidden');
    resultsLive.innerHTML = '';
  }
  
  const botUtils = document.getElementById('travel-utility-section');
  if (botUtils) {
    botUtils.classList.remove('hidden');
  }
  
  // Show testimonials back when returning to search
  document.getElementById('testimonials-section')?.classList.remove('hidden');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
