require("dotenv").config()
const mongoose = require("mongoose");
const Product = require("./src/model/products");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/productsdb";

const mockProducts = [
  // ── Electronics ────────────────────────────────────────────────────────────
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship Android smartphone with 200MP camera, S Pen, and 5000mAh battery.",
    price: 1299.99,
    discountPrice: 1149.99,
    brand: "Samsung",
    category: "electronics",
    tags: ["smartphone", "android", "5g", "camera"],
    stock: 45,
    images: ["galaxy-s24-ultra.jpg"],
    rating: 4.8,
    numReviews: 312,
    isActive: true,
  },
  {
    name: "Apple MacBook Pro 14-inch M3",
    description: "Professional laptop with Apple M3 chip, 16GB RAM, 512GB SSD, Liquid Retina XDR display.",
    price: 1999.99,
    discountPrice: null,
    brand: "Apple",
    category: "electronics",
    tags: ["laptop", "macbook", "m3", "professional"],
    stock: 22,
    images: ["macbook-pro-14.jpg"],
    rating: 4.9,
    numReviews: 189,
    isActive: true,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancelling wireless headphones with 30-hour battery life.",
    price: 399.99,
    discountPrice: 329.99,
    brand: "Sony",
    category: "electronics",
    tags: ["headphones", "wireless", "noise-cancelling", "audio"],
    stock: 78,
    images: ["sony-wh1000xm5.jpg"],
    rating: 4.7,
    numReviews: 541,
    isActive: true,
  },
  {
    name: "LG C3 55-inch OLED TV",
    description: "4K OLED evo display with a9 AI Processor Gen6, Dolby Vision IQ, and webOS 23.",
    price: 1499.99,
    discountPrice: 1199.99,
    brand: "LG",
    category: "electronics",
    tags: ["tv", "oled", "4k", "smart-tv"],
    stock: 14,
    images: ["lg-c3-oled.jpg"],
    rating: 4.8,
    numReviews: 228,
    isActive: true,
  },
  {
    name: "iPad Air 11-inch M2",
    description: "Powerful and versatile tablet with M2 chip, 11-inch Liquid Retina display, and USB-C.",
    price: 749.99,
    discountPrice: null,
    brand: "Apple",
    category: "electronics",
    tags: ["tablet", "ipad", "m2", "apple"],
    stock: 33,
    images: ["ipad-air-m2.jpg"],
    rating: 4.7,
    numReviews: 175,
    isActive: true,
  },

  // ── Fashion ─────────────────────────────────────────────────────────────────
  {
    name: "Nike Air Max 270",
    description: "Lifestyle sneakers with the largest Max Air unit for all-day comfort and iconic style.",
    price: 150.00,
    discountPrice: 119.99,
    brand: "Nike",
    category: "fashion",
    tags: ["sneakers", "shoes", "lifestyle", "air-max"],
    stock: 120,
    images: ["nike-air-max-270.jpg"],
    rating: 4.5,
    numReviews: 893,
    isActive: true,
  },
  {
    name: "Adidas Ultraboost 23",
    description: "High-performance running shoes with Boost midsole and Primeknit+ upper for ultimate energy return.",
    price: 190.00,
    discountPrice: 159.99,
    brand: "Adidas",
    category: "fashion",
    tags: ["sneakers", "running", "boost", "performance"],
    stock: 88,
    images: ["adidas-ultraboost-23.jpg"],
    rating: 4.6,
    numReviews: 672,
    isActive: true,
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: "Classic slim fit jeans crafted from stretch denim for a modern, tailored look.",
    price: 69.99,
    discountPrice: null,
    brand: "Levi's",
    category: "fashion",
    tags: ["jeans", "denim", "slim-fit", "casual"],
    stock: 200,
    images: ["levis-511.jpg"],
    rating: 4.4,
    numReviews: 1204,
    isActive: true,
  },
  {
    name: "The North Face Thermoball Eco Jacket",
    description: "Lightweight, packable jacket with ThermoBall Eco insulation made from recycled materials.",
    price: 229.99,
    discountPrice: 179.99,
    brand: "The North Face",
    category: "fashion",
    tags: ["jacket", "outdoor", "insulated", "eco"],
    stock: 55,
    images: ["tnf-thermoball.jpg"],
    rating: 4.6,
    numReviews: 341,
    isActive: true,
  },
  {
    name: "Ray-Ban Aviator Classic Sunglasses",
    description: "Iconic metal frame aviator sunglasses with crystal green lenses and 100% UV protection.",
    price: 161.00,
    discountPrice: null,
    brand: "Ray-Ban",
    category: "fashion",
    tags: ["sunglasses", "aviator", "uv-protection", "classic"],
    stock: 67,
    images: ["rayban-aviator.jpg"],
    rating: 4.5,
    numReviews: 758,
    isActive: true,
  },

  // ── Home & Kitchen ──────────────────────────────────────────────────────────
  {
    name: "Dyson V15 Detect Absolute",
    description: "Cord-free vacuum with laser dust detection, HEPA filtration, and up to 60 min run time.",
    price: 749.99,
    discountPrice: 649.99,
    brand: "Dyson",
    category: "home",
    tags: ["vacuum", "cordless", "cleaning", "hepa"],
    stock: 29,
    images: ["dyson-v15.jpg"],
    rating: 4.7,
    numReviews: 407,
    isActive: true,
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-use pressure cooker: slow cooker, rice cooker, steamer, sauté pan, yogurt maker & warmer.",
    price: 99.99,
    discountPrice: 79.99,
    brand: "Instant Pot",
    category: "home",
    tags: ["kitchen", "pressure-cooker", "multi-cooker", "appliance"],
    stock: 145,
    images: ["instant-pot-duo.jpg"],
    rating: 4.7,
    numReviews: 2351,
    isActive: true,
  },
  {
    name: "Philips Hue White & Color Ambiance Starter Kit",
    description: "Smart lighting starter kit with 4 A19 bulbs and Hue Bridge. 16 million colors via app.",
    price: 199.99,
    discountPrice: 169.99,
    brand: "Philips",
    category: "home",
    tags: ["smart-home", "lighting", "rgb", "wifi"],
    stock: 61,
    images: ["philips-hue-starter.jpg"],
    rating: 4.5,
    numReviews: 884,
    isActive: true,
  },
  {
    name: "Nespresso Vertuo Next Coffee Machine",
    description: "Single-serve coffee maker with Centrifusion technology, 5 cup sizes, and Wi-Fi connectivity.",
    price: 179.99,
    discountPrice: 139.99,
    brand: "Nespresso",
    category: "home",
    tags: ["coffee", "espresso", "kitchen", "appliance"],
    stock: 38,
    images: ["nespresso-vertuo-next.jpg"],
    rating: 4.4,
    numReviews: 619,
    isActive: true,
  },

  // ── Sports & Fitness ────────────────────────────────────────────────────────
  {
    name: "Peloton Bike+",
    description: "Premium indoor cycling bike with rotating 23.8-inch HD touchscreen and auto-resistance.",
    price: 2499.00,
    discountPrice: 2199.00,
    brand: "Peloton",
    category: "sports",
    tags: ["fitness", "cycling", "indoor-bike", "smart"],
    stock: 8,
    images: ["peloton-bike-plus.jpg"],
    rating: 4.6,
    numReviews: 293,
    isActive: true,
  },
  {
    name: "Garmin Forerunner 265 GPS Watch",
    description: "Running smartwatch with AMOLED display, training readiness, HRV status, and 15-day battery.",
    price: 449.99,
    discountPrice: null,
    brand: "Garmin",
    category: "sports",
    tags: ["smartwatch", "gps", "running", "fitness"],
    stock: 42,
    images: ["garmin-forerunner-265.jpg"],
    rating: 4.7,
    numReviews: 218,
    isActive: true,
  },
  {
    name: "Bowflex SelectTech 552 Dumbbells (Pair)",
    description: "Adjustable dumbbells that replace 15 sets of weights, ranging from 5 to 52.5 lbs each.",
    price: 549.00,
    discountPrice: 429.00,
    brand: "Bowflex",
    category: "sports",
    tags: ["dumbbells", "weights", "home-gym", "fitness"],
    stock: 17,
    images: ["bowflex-552.jpg"],
    rating: 4.8,
    numReviews: 1467,
    isActive: true,
  },

  // ── Beauty & Personal Care ──────────────────────────────────────────────────
  {
    name: "Dyson Airwrap Multi-Styler",
    description: "Complete hair styler using air to curl, wave, smooth, and dry without extreme heat.",
    price: 599.99,
    discountPrice: 549.99,
    brand: "Dyson",
    category: "beauty",
    tags: ["hair", "styler", "curl", "blow-dry"],
    stock: 24,
    images: ["dyson-airwrap.jpg"],
    rating: 4.6,
    numReviews: 1083,
    isActive: true,
  },
  {
    name: "Oral-B iO Series 9 Electric Toothbrush",
    description: "Smart electric toothbrush with AI-powered guidance, 7 brushing modes, and color display.",
    price: 249.99,
    discountPrice: 199.99,
    brand: "Oral-B",
    category: "beauty",
    tags: ["oral-care", "toothbrush", "electric", "smart"],
    stock: 53,
    images: ["oralb-io9.jpg"],
    rating: 4.5,
    numReviews: 476,
    isActive: true,
  },
  {
    name: "Theragun PRO Gen 6 Massage Gun",
    description: "Professional-grade percussive therapy device with 6 attachments, smart app & OLED screen.",
    price: 599.00,
    discountPrice: 499.00,
    brand: "Therabody",
    category: "beauty",
    tags: ["massage", "recovery", "percussive", "wellness"],
    stock: 31,
    images: ["theragun-pro-6.jpg"],
    rating: 4.7,
    numReviews: 339,
    isActive: true,
  },

  // ── Books ───────────────────────────────────────────────────────────────────
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. #1 NYT bestseller.",
    price: 27.00,
    discountPrice: 18.99,
    brand: "Penguin Random House",
    category: "books",
    tags: ["self-help", "habits", "productivity", "bestseller"],
    stock: 500,
    images: ["atomic-habits.jpg"],
    rating: 4.9,
    numReviews: 8421,
    isActive: true,
  },
  {
    name: "The Pragmatic Programmer 20th Anniversary Edition",
    description: "Classic software development guide updated for modern practices. A must-read for developers.",
    price: 49.99,
    discountPrice: 39.99,
    brand: "Addison-Wesley",
    category: "books",
    tags: ["programming", "software", "engineering", "technical"],
    stock: 182,
    images: ["pragmatic-programmer.jpg"],
    rating: 4.8,
    numReviews: 2193,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert mock data
    const inserted = await Product.insertMany(mockProducts);
    console.log(`🌱 Seeded ${inserted.length} products successfully\n`);

    // Summary by category
    const summary = mockProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    console.log("📦 Products by category:");
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(12)} → ${count} products`);
    });

  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
  }
};

seedDatabase();