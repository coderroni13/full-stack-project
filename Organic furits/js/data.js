/* ==========================================================================
   PUREHARVEST ORGANICS - PRODUCT & FARM DATA ENGINE
   ========================================================================== */

const PRODUCTS_DATA = [
  {
    id: "fruit-01",
    name: "Wild Mountain Blueberries",
    category: "berries",
    price: 6.99,
    unit: "pint (12 oz)",
    rating: 4.9,
    reviewsCount: 142,
    badge: "organic",
    stock: 24,
    tastes: ["Sweet", "Antioxidant-Rich", "Juicy"],
    diets: ["keto", "detox", "low-sugar"],
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
    description: "Hand-picked high-elevation organic blueberries boasting deep indigo skin, crisp snap, and concentrated antioxidant potency.",
    nutrition: {
      calories: "84 kcal",
      vitaminC: "24% DV",
      fiber: "3.6g",
      sugars: "14.7g",
      antioxidantScore: "9,621 ORAC",
      potassium: "114mg"
    },
    farm: {
      batchId: "OR-9428-BLU",
      name: "Misty Pine Organic Farm",
      location: "Hood River Valley, Oregon",
      farmer: "Elena & Marcus Vance",
      certId: "USDA-NOP-78401",
      harvestedDate: "Yesterday, 6:00 AM",
      soilHealth: "98/100 (Regenerative Organic)"
    }
  },
  {
    id: "fruit-02",
    name: "Heritage Rainier Sweet Cherries",
    category: "berries",
    price: 8.99,
    unit: "lb",
    rating: 5.0,
    reviewsCount: 98,
    badge: "seasonal",
    stock: 15,
    tastes: ["Ultra-Sweet", "Crisp", "Floral"],
    diets: ["detox", "vit-c"],
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
    description: "Sun-blushed golden and ruby Rainier cherries with exceptionally high natural Brix sugar levels and dense, juicy flesh.",
    nutrition: {
      calories: "90 kcal",
      vitaminC: "18% DV",
      fiber: "2.5g",
      sugars: "19.0g",
      antioxidantScore: "4,873 ORAC",
      potassium: "260mg"
    },
    farm: {
      batchId: "WA-7829-RAINIER",
      name: "Yakima Sunstone Orchards",
      location: "Yakima Valley, Washington",
      farmer: "Arthur Campbell",
      certId: "USDA-NOP-99120",
      harvestedDate: "Today, 5:30 AM",
      soilHealth: "95/100 (Volcanic Loam)"
    }
  },
  {
    id: "fruit-03",
    name: "Sicilian Moro Blood Oranges",
    category: "citrus",
    price: 5.49,
    unit: "2 lbs bag",
    rating: 4.8,
    reviewsCount: 84,
    badge: "organic",
    stock: 30,
    tastes: ["Tangy", "Berry-like", "Zesty"],
    diets: ["vit-c", "detox", "low-sugar"],
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    description: "Deep crimson anthocyanin-packed citrus offering an exquisite raspberry-undertone citrus explosion.",
    nutrition: {
      calories: "70 kcal",
      vitaminC: "120% DV",
      fiber: "3.2g",
      sugars: "12.0g",
      antioxidantScore: "7,100 ORAC",
      potassium: "240mg"
    },
    farm: {
      batchId: "CA-4102-BLOOD",
      name: "Ojai Citrus Sol Bio-Groves",
      location: "Ojai Valley, California",
      farmer: "Sofia Morales",
      certId: "USDA-NOP-33019",
      harvestedDate: "2 days ago",
      soilHealth: "94/100 (Biodynamic Compost)"
    }
  },
  {
    id: "fruit-04",
    name: "Crisp Honeycrisp Orchard Apples",
    category: "orchard",
    price: 4.99,
    unit: "3 lbs tote",
    rating: 4.9,
    reviewsCount: 210,
    badge: "organic",
    stock: 45,
    tastes: ["Crisp", "Sweet-Tart", "Refreshing"],
    diets: ["low-sugar", "detox"],
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    description: "Tree-ripened organic Honeycrisp apples with explosive crunch, balancing honeycomb sweetness with mild acidity.",
    nutrition: {
      calories: "95 kcal",
      vitaminC: "14% DV",
      fiber: "4.4g",
      sugars: "19.0g",
      antioxidantScore: "3,890 ORAC",
      potassium: "195mg"
    },
    farm: {
      batchId: "NY-6601-HONEY",
      name: "Hudson River Valley Biodynamic Orchard",
      location: "Hudson Valley, New York",
      farmer: "David & Laura Sterling",
      certId: "USDA-NOP-11928",
      harvestedDate: "Yesterday",
      soilHealth: "96/100 (Glacial Till)"
    }
  },
  {
    id: "fruit-05",
    name: "Tropical Red Dragon Fruit (Pitaya)",
    category: "tropical",
    price: 7.49,
    unit: "each (approx 1 lb)",
    rating: 4.7,
    reviewsCount: 65,
    badge: "rare",
    stock: 12,
    tastes: ["Mild Sweet", "Kiwi-Texture", "Earthy"],
    diets: ["keto", "detox", "low-sugar"],
    image: "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant magenta-fleshed Pitaya loaded with prebiotics, betalain pigments, and edible crunchy omega-3 seeds.",
    nutrition: {
      calories: "60 kcal",
      vitaminC: "34% DV",
      fiber: "3.0g",
      sugars: "8.0g",
      antioxidantScore: "5,400 ORAC",
      potassium: "290mg"
    },
    farm: {
      batchId: "HI-8831-PITAYA",
      name: "Volcano Flora Organics",
      location: "Big Island, Hawaii",
      farmer: "Kai Kealoha",
      certId: "USDA-NOP-55410",
      harvestedDate: "Yesterday, Shipped Cold",
      soilHealth: "99/100 (Porous Volcanic Ash)"
    }
  },
  {
    id: "fruit-06",
    name: "Golden Maracuyá Passionfruit",
    category: "tropical",
    price: 9.99,
    unit: "6-pack",
    rating: 4.9,
    reviewsCount: 53,
    badge: "rare",
    stock: 18,
    tastes: ["Aromatic", "Intense Tart", "Tropical"],
    diets: ["vit-c", "detox"],
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80",
    description: "Intensely fragrant purple and gold passionfruit with tangy gelatinous pulp overflowing with vitamins A & C.",
    nutrition: {
      calories: "17 kcal / fruit",
      vitaminC: "50% DV",
      fiber: "1.9g",
      sugars: "4.2g",
      antioxidantScore: "6,100 ORAC",
      potassium: "63mg"
    },
    farm: {
      batchId: "FL-5110-PASSION",
      name: "Sunshine Tropics Permaculture",
      location: "Homestead, Florida",
      farmer: "Mateo Cruz",
      certId: "USDA-NOP-44290",
      harvestedDate: "2 days ago",
      soilHealth: "93/100 (Coral Lime Soil)"
    }
  },
  {
    id: "fruit-07",
    name: "Sweet Black Mission Organic Figs",
    category: "orchard",
    price: 7.99,
    unit: "basket (1 lb)",
    rating: 4.8,
    reviewsCount: 76,
    badge: "seasonal",
    stock: 10,
    tastes: ["Jammy", "Caramel-Sweet", "Rich"],
    diets: ["detox"],
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80",
    description: "Velvety dark purple skin with strawberry-pink honeyed interior. Irresistibly decadent and high in dietary fiber.",
    nutrition: {
      calories: "74 kcal",
      vitaminC: "4% DV",
      fiber: "2.9g",
      sugars: "16.0g",
      antioxidantScore: "3,200 ORAC",
      potassium: "232mg"
    },
    farm: {
      batchId: "CA-9041-FIG",
      name: "San Joaquin Fig Sanctuary",
      location: "Fresno, California",
      farmer: "Dmitri & Nina Ross",
      certId: "USDA-NOP-67120",
      harvestedDate: "Yesterday",
      soilHealth: "95/100"
    }
  },
  {
    id: "fruit-08",
    name: "Meyer Lemons (Heirloom Thin-Skin)",
    category: "citrus",
    price: 4.49,
    unit: "1.5 lbs mesh",
    rating: 4.9,
    reviewsCount: 115,
    badge: "organic",
    stock: 40,
    tastes: ["Sweet Citrus", "Floral", "Low Acidity"],
    diets: ["keto", "detox", "vit-c", "low-sugar"],
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    description: "A natural hybrid of lemon and mandarin with soft edible zest, intoxicating floral perfume, and mellowed sweet juice.",
    nutrition: {
      calories: "29 kcal",
      vitaminC: "88% DV",
      fiber: "2.8g",
      sugars: "2.5g",
      antioxidantScore: "4,150 ORAC",
      potassium: "138mg"
    },
    farm: {
      batchId: "AZ-2219-MEYER",
      name: "Sonoran Oasis Citrus Grove",
      location: "Yuma, Arizona",
      farmer: "Claire Sterling",
      certId: "USDA-NOP-88210",
      harvestedDate: "3 days ago",
      soilHealth: "91/100"
    }
  },
  {
    id: "fruit-09",
    name: "Wild Organic Coastal Strawberries",
    category: "berries",
    price: 5.99,
    unit: "1 lb clamshell",
    rating: 4.9,
    reviewsCount: 310,
    badge: "organic",
    stock: 50,
    tastes: ["Fragrant", "Honey Sweet", "Juicy"],
    diets: ["keto", "detox", "vit-c", "low-sugar"],
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
    description: "Ripened under cool Pacific breezes to allow natural sugars and aromatic esters to develop deep, authentic flavor.",
    nutrition: {
      calories: "32 kcal",
      vitaminC: "99% DV",
      fiber: "2.0g",
      sugars: "4.9g",
      antioxidantScore: "5,465 ORAC",
      potassium: "153mg"
    },
    farm: {
      batchId: "CA-1029-STRAW",
      name: "Watsonville Eco-Berry Fields",
      location: "Monterey Bay, California",
      farmer: "Gabriel Fernandez",
      certId: "USDA-NOP-44910",
      harvestedDate: "This Morning, 5:00 AM",
      soilHealth: "97/100 (Living Soil Culture)"
    }
  },
  {
    id: "fruit-10",
    name: "Sun-Gold Tropical Papaya",
    category: "tropical",
    price: 4.99,
    unit: "each (approx 2 lbs)",
    rating: 4.8,
    reviewsCount: 88,
    badge: "organic",
    stock: 22,
    tastes: ["Buttery", "Musky Sweet", "Enzyme-Rich"],
    diets: ["detox", "vit-c"],
    image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
    description: "Silky, melt-in-the-mouth orange flesh packed with digestive enzyme papain, carotenoids, and tropical aroma.",
    nutrition: {
      calories: "59 kcal",
      vitaminC: "103% DV",
      fiber: "2.5g",
      sugars: "11.0g",
      antioxidantScore: "3,300 ORAC",
      potassium: "264mg"
    },
    farm: {
      batchId: "HI-3310-PAPAYA",
      name: "Kona Coast Agroforest",
      location: "Kona, Hawaii",
      farmer: "Leilani Akana",
      certId: "USDA-NOP-99430",
      harvestedDate: "2 days ago",
      soilHealth: "98/100"
    }
  },
  {
    id: "fruit-11",
    name: "Immunity Boost Seasonal Fruit Box",
    category: "bundles",
    price: 39.99,
    unit: "Curated 10 lbs Box",
    rating: 5.0,
    reviewsCount: 175,
    badge: "seasonal",
    stock: 20,
    tastes: ["Balanced", "High-Vitamin", "Diverse"],
    diets: ["vit-c", "detox"],
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
    description: "Doctor & nutritionist curated blend of Blood Oranges, Meyer Lemons, Wild Blueberries, and Strawberries for peak immune vitality.",
    nutrition: {
      calories: "Avg 60 kcal/serving",
      vitaminC: "320% DV daily value",
      fiber: "High Soluble Fiber",
      sugars: "100% Unrefined",
      antioxidantScore: "18,400 Total ORAC",
      potassium: "Essential Electrolytes"
    },
    farm: {
      batchId: "BOX-IMMUNE-2026",
      name: "PureHarvest Collective Hub",
      location: "Multi-Farm Regional Blend",
      farmer: "Certified Regenerative Network",
      certId: "USDA-NOP-ALL-100",
      harvestedDate: "Packed Daily at 4:00 AM",
      soilHealth: "97/100 Aggregate"
    }
  },
  {
    id: "fruit-12",
    name: "Exotic Tropics Connoisseur Box",
    category: "bundles",
    price: 49.99,
    unit: "Curated 12 lbs Box",
    rating: 4.9,
    reviewsCount: 92,
    badge: "rare",
    stock: 15,
    tastes: ["Exotic", "Sweet & Tart", "Aromatic"],
    diets: ["detox", "vit-c"],
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
    description: "An extraordinary sensory journey: Red Dragon Fruit, Golden Passionfruit, Sun-Gold Papaya, and Sweet Black Mission Figs.",
    nutrition: {
      calories: "Avg 70 kcal/serving",
      vitaminC: "250% DV daily value",
      fiber: "Prebiotic Rich",
      sugars: "Pure Natural Nectar",
      antioxidantScore: "15,200 Total ORAC",
      potassium: "Rich in Micronutrients"
    },
    farm: {
      batchId: "BOX-EXOTIC-2026",
      name: "Hawaiian & Florida Permaculture Guild",
      location: "Pacific & Gulf Agroforests",
      farmer: "Artisanal Tropics Guild",
      certId: "USDA-NOP-ALL-200",
      harvestedDate: "Direct Air-Chilled Transit",
      soilHealth: "99/100 Aggregate"
    }
  }
];

const PROMO_CODES = {
  "FRESH20": { discountPercent: 20, description: "20% Off Entire Order" },
  "ORGANIC10": { discountFixed: 10, description: "$10 Off Any Order" },
  "FREESHIP": { freeShipping: true, description: "Complimentary Expedited Cold-Chain Shipping" }
};

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Dr. Genevieve Vance",
    role: "Integrative Nutritionist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    comment: "The brix levels and freshness of the Rainier cherries and blueberries are unmatched. You can taste the volcanic living soil in every single bite!",
    verified: true,
    location: "Seattle, WA"
  },
  {
    id: 2,
    name: "Chef Julian Laurent",
    role: "Michelin-Star Pastry Chef",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    comment: "I source blood oranges and passionfruit for my dessert menu exclusively from PureHarvest. Their 24-hour cold-chain guarantees peak aromatics.",
    verified: true,
    location: "San Francisco, CA"
  },
  {
    id: 3,
    name: "Samantha & Ethan Reed",
    role: "Weekly Harvest Subscribers",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    comment: "The custom box builder is brilliant. We select what our kids love every Tuesday and by Thursday morning it arrives on our doorstep in 100% compostable boxes.",
    verified: true,
    location: "Austin, TX"
  }
];
