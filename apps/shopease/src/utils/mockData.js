// Mock data generator for ShopEase demo app

// Product categories
const categories = [
  'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports', 
  'Books', 'Toys', 'Grocery', 'Jewelry', 'Furniture'
];

// Product brands by category
const brandsByCategory = {
  'Electronics': ['TechPro', 'ElectraSmart', 'GadgetGuru', 'InnovateTech', 'DigitalEdge'],
  'Clothing': ['UrbanStyle', 'FashionForward', 'TrendSetters', 'ClassicWear', 'EcoApparel'],
  'Home & Kitchen': ['HomeEssentials', 'KitchenMaster', 'ComfortLiving', 'CozyCrafts', 'ModernDwelling'],
  'Beauty': ['GlowUp', 'NaturalBeauty', 'SkinEssence', 'LuxeCosmetics', 'PureRadiance'],
  'Sports': ['ActiveLife', 'SportsPeak', 'FitnessPro', 'OutdoorExtreme', 'AthleticEdge'],
  'Books': ['KnowledgeHub', 'StorytellersInc', 'MindWorks', 'LiteraryTreasures', 'ThoughtProvoke'],
  'Toys': ['PlayfulWonders', 'ImaginationStation', 'ToyMaster', 'FunFactory', 'CreativeKids'],
  'Grocery': ['FreshPicks', 'OrganicEssentials', 'PantrySelect', 'NutriDeli', 'GourmetChoice'],
  'Jewelry': ['GlimmerGems', 'PreciousTreasures', 'LuxeAdorn', 'EleganceJewels', 'RadiantCollection'],
  'Furniture': ['ComfortNest', 'ModernLiving', 'HomeDesigner', 'ElegantSpaces', 'TimelessDecor']
};

// Product description templates
const productDescriptions = [
  "Experience the ultimate in performance and style with this premium product, designed to exceed your expectations.",
  "Crafted with precision and care, this high-quality item offers exceptional value and satisfaction.",
  "Discover innovation and excellence in this top-rated product, featuring cutting-edge design and functionality.",
  "Elevate your lifestyle with this expertly designed product, combining aesthetics and practicality.",
  "Indulge in luxury and comfort with this carefully crafted item, perfect for discerning customers.",
  "Transform your everyday experience with this revolutionary product, setting new standards in its category.",
  "Enjoy unparalleled quality and reliability with this customer favorite, backed by outstanding reviews.",
  "Embrace modern living with this thoughtfully designed product, blending form and function seamlessly."
];

// Generate random rating
const generateRating = () => {
  const baseRating = 3.5 + Math.random() * 1.5;
  return parseFloat(baseRating.toFixed(1));
};

// Generate random price
const generatePrice = (category) => {
  const priceRanges = {
    'Electronics': { min: 49.99, max: 1299.99 },
    'Clothing': { min: 12.99, max: 199.99 },
    'Home & Kitchen': { min: 19.99, max: 499.99 },
    'Beauty': { min: 9.99, max: 129.99 },
    'Sports': { min: 14.99, max: 349.99 },
    'Books': { min: 7.99, max: 49.99 },
    'Toys': { min: 9.99, max: 99.99 },
    'Grocery': { min: 2.99, max: 29.99 },
    'Jewelry': { min: 24.99, max: 899.99 },
    'Furniture': { min: 99.99, max: 1499.99 }
  };

  const { min, max } = priceRanges[category] || { min: 9.99, max: 299.99 };
  const price = min + Math.random() * (max - min);
  return parseFloat(price.toFixed(2));
};

// Generate random discount percentage
const generateDiscount = () => {
  const shouldHaveDiscount = Math.random() < 0.4; // 40% chance of having a discount
  if (!shouldHaveDiscount) return 0;
  
  return Math.floor(Math.random() * 4) * 5 + 5; // 5%, 10%, 15%, or 20%
};

// Generate random stock quantity
const generateStock = () => {
  return Math.floor(Math.random() * 100) + 1;
};

// Generate random reviews
const generateReviews = (rating) => {
  const reviewCount = Math.floor(Math.random() * 150) + 5;
  const reviews = [];
  
  const reviewTemplates = [
    "Absolutely love this product! It exceeded my expectations in every way.",
    "Great value for the price. Would definitely recommend to friends and family.",
    "Solid product that does exactly what it's supposed to do. No complaints.",
    "The quality is impressive. I've already ordered another one as a gift.",
    "Works perfectly for my needs. Shipping was fast and packaging was secure.",
    "This has become an essential part of my daily routine. Can't imagine life without it!",
    "Excellent customer service when I had questions. The product itself is fantastic.",
    "Good product overall, but there's room for improvement in some areas."
  ];
  
  const reviewerNames = [
    "Alex Johnson", "Sam Taylor", "Jordan Smith", "Casey Williams", "Morgan Brown",
    "Riley Garcia", "Taylor Martinez", "Jamie Rodriguez", "Avery Lopez", "Dakota Lee"
  ];
  
  for (let i = 0; i < Math.min(5, Math.ceil(reviewCount / 30)); i++) {
    const reviewRating = Math.max(3, Math.min(5, Math.round(rating + (Math.random() * 1.5 - 0.75))));
    
    reviews.push({
      id: i + 1,
      author: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
      rating: reviewRating,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      text: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)]
    });
  }
  
  return {
    average: rating,
    count: reviewCount,
    items: reviews
  };
};

// Generate image URLs (these would be placeholder images in a real app)
const generateImages = (productId, category) => {
  const colors = ['blue', 'red', 'green', 'black', 'white', 'yellow', 'purple'];
  const categorySlug = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return [
    `https://source.unsplash.com/400x400/?${categorySlug},product`,
    `https://source.unsplash.com/400x400/?${categorySlug},closeup`,
    `https://source.unsplash.com/400x400/?${categorySlug},detail`
  ];
};

// Generate product name
const generateProductName = (category, brand) => {
  const adjectives = ['Premium', 'Ultra', 'Pro', 'Elite', 'Signature', 'Essential', 'Classic', 'Deluxe'];
  const categoryNouns = {
    'Electronics': ['Smartphone', 'Laptop', 'Headphones', 'Tablet', 'Speaker', 'Camera', 'Smartwatch'],
    'Clothing': ['Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Hoodie', 'T-Shirt'],
    'Home & Kitchen': ['Blender', 'Coffee Maker', 'Toaster', 'Pan Set', 'Knife Set', 'Cookware'],
    'Beauty': ['Moisturizer', 'Serum', 'Cleanser', 'Makeup Set', 'Shampoo', 'Perfume'],
    'Sports': ['Running Shoes', 'Yoga Mat', 'Fitness Tracker', 'Weights', 'Bicycle', 'Backpack'],
    'Books': ['Novel', 'Cookbook', 'Biography', 'Self-Help Guide', 'Encyclopedia', 'Journal'],
    'Toys': ['Building Set', 'Doll', 'Action Figure', 'Board Game', 'Puzzle', 'Remote Control Car'],
    'Grocery': ['Coffee', 'Tea', 'Chocolate', 'Snack Box', 'Pasta', 'Spice Set'],
    'Jewelry': ['Necklace', 'Bracelet', 'Earrings', 'Ring', 'Watch', 'Pendant'],
    'Furniture': ['Sofa', 'Chair', 'Table', 'Bed Frame', 'Bookshelf', 'Desk', 'Dresser']
  };
  
  const nouns = categoryNouns[category] || ['Product', 'Item', 'Gadget'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const model = Math.floor(Math.random() * 1000) + 100;
  
  return `${brand} ${adjective} ${noun} ${model}`;
};

// Generate a single product
const generateProduct = (id) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brands = brandsByCategory[category];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const name = generateProductName(category, brand);
  const rating = generateRating();
  const price = generatePrice(category);
  const discountPercentage = generateDiscount();
  const discountedPrice = discountPercentage > 0 
    ? parseFloat((price * (1 - discountPercentage / 100)).toFixed(2)) 
    : price;
  
  return {
    id,
    name,
    brand,
    category,
    description: productDescriptions[Math.floor(Math.random() * productDescriptions.length)],
    price,
    discountPercentage,
    discountedPrice,
    rating,
    stock: generateStock(),
    isNewArrival: Math.random() < 0.3,
    isBestSeller: Math.random() < 0.2,
    hasExclusiveOffer: Math.random() < 0.15,
    isFeatured: Math.random() < 0.25,
    specifications: [
      { name: 'Dimensions', value: `${Math.floor(Math.random() * 30) + 10}cm x ${Math.floor(Math.random() * 20) + 5}cm x ${Math.floor(Math.random() * 15) + 2}cm` },
      { name: 'Weight', value: `${(Math.random() * 5 + 0.1).toFixed(1)} kg` },
      { name: 'Material', value: ['Plastic', 'Metal', 'Wood', 'Leather', 'Glass', 'Fabric'][Math.floor(Math.random() * 6)] },
      { name: 'Color', value: ['Black', 'White', 'Silver', 'Blue', 'Red', 'Green'][Math.floor(Math.random() * 6)] }
    ],
    images: generateImages(id, category),
    reviews: generateReviews(rating)
  };
};

// Generate deal/promotion
const generateDeal = (id) => {
  const dealTypes = ['Flash Sale', 'Bundle Discount', 'Clearance', 'Special Offer', 'Limited Edition'];
  const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)];
  
  const discountTypes = ['percentage', 'fixed'];
  const discountType = discountTypes[Math.floor(Math.random() * discountTypes.length)];
  
  let discount, description;
  if (discountType === 'percentage') {
    discount = Math.floor(Math.random() * 6) * 5 + 15; // 15%, 20%, 25%, 30%, 35%, 40%
    description = `${discount}% off on selected items`;
  } else {
    discount = Math.floor(Math.random() * 5) * 10 + 10; // $10, $20, $30, $40, $50 off
    description = `$${discount} off on orders over $${discount * 4}`;
  }
  
  return {
    id,
    title: `${dealType} - ${description}`,
    description: `Limited time offer: ${description}. Don't miss out on these amazing savings!`,
    discountType,
    discountValue: discount,
    expiryHours: Math.floor(Math.random() * 72) + 24, // 24-96 hours
    appliesTo: Math.random() < 0.7 ? 'category' : 'specific',
    categoryOrProducts: Math.random() < 0.7 ? 
      categories[Math.floor(Math.random() * categories.length)] : 
      Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => i + 1)
  };
};

// Generate all products
export const generateProducts = (count = 50) => {
  return Array.from({ length: count }, (_, i) => generateProduct(i + 1));
};

// Generate deals/promotions
export const generateDeals = (count = 5) => {
  return Array.from({ length: count }, (_, i) => generateDeal(i + 1));
};

// Generate categories with images
export const generateCategoriesWithImages = () => {
  return categories.map((category, index) => ({
    id: index + 1,
    name: category,
    image: `https://source.unsplash.com/300x300/?${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  }));
};

// Generate featured collections
export const generateFeaturedCollections = () => {
  const collections = [
    'Summer Essentials', 'Work From Home', 'Outdoor Adventures',
    'Smart Living', 'Fitness Goals', 'Kitchen Innovations',
    'Travel Companions', 'Self-Care Routine'
  ];
  
  return collections.map((collection, index) => ({
    id: index + 1,
    name: collection,
    image: `https://source.unsplash.com/600x400/?${collection.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    description: `Explore our curated selection of ${collection.toLowerCase()} products designed to enhance your lifestyle.`
  }));
};

// Mock user preferences for personalized recommendations
export const generateUserPreferences = () => {
  const viewedCategories = [];
  for (let i = 0; i < 3; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (!viewedCategories.includes(randomCategory)) {
      viewedCategories.push(randomCategory);
    }
  }
  
  return {
    recentlyViewedCategories: viewedCategories,
    preferredPriceRange: {
      min: Math.floor(Math.random() * 50),
      max: Math.floor(Math.random() * 200) + 100
    }
  };
};