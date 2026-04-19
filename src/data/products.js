export const CATEGORIES = [
  { id: 'fashion',     label: 'Fashion',     icon: '👗', color: '#FF6B2B' },
  { id: 'electronics', label: 'Electronics', icon: '📱', color: '#3B82F6' },
  { id: 'home',        label: 'Home & Living', icon: '🏠', color: '#10B981' },
  { id: 'beauty',      label: 'Beauty',      icon: '✨', color: '#EC4899' },
  { id: 'sports',      label: 'Sports',      icon: '⚡', color: '#F59E0B' },
]

export const PRODUCTS = [
  // Fashion
  { id: 1,  category: 'fashion',     name: 'Classic White Sneakers',        price: 3200,  originalPrice: 4500,  rating: 4.5, reviews: 128, stock: 45, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', badge: 'Sale', description: 'Premium leather white sneakers with cushioned sole. Perfect for everyday wear. Available in sizes 36-46.' },
  { id: 2,  category: 'fashion',     name: 'Oversized Graphic Tee',         price: 1200,  originalPrice: null,  rating: 4.2, reviews: 89,  stock: 120, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', badge: null, description: 'Relaxed fit cotton graphic tee. Breathable 100% cotton. Machine washable.' },
  { id: 3,  category: 'fashion',     name: 'Slim Fit Chino Pants',          price: 2800,  originalPrice: 3500,  rating: 4.6, reviews: 204, stock: 60, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80', badge: 'Bestseller', description: 'Modern slim-fit chinos in stretch cotton. Wrinkle-resistant. Sizes 28-40.' },
  { id: 4,  category: 'fashion',     name: 'Leather Crossbody Bag',         price: 4500,  originalPrice: 5800,  rating: 4.8, reviews: 67,  stock: 30, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80', badge: 'Sale', description: 'Genuine leather crossbody bag with adjustable strap. Multiple compartments. Available in black and tan.' },
  { id: 5,  category: 'fashion',     name: 'Floral Wrap Dress',             price: 2200,  originalPrice: null,  rating: 4.4, reviews: 156, stock: 80, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', badge: 'New', description: 'Elegant wrap dress in floral print chiffon. Midi length. Sizes XS-XL.' },
  { id: 6,  category: 'fashion',     name: 'Denim Jacket Classic',          price: 3800,  originalPrice: 4800,  rating: 4.3, reviews: 93,  stock: 55, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80', badge: 'Sale', description: 'Classic denim jacket with button closure. Medium wash. Unisex sizing S-XXL.' },

  // Electronics
  { id: 7,  category: 'electronics', name: 'Wireless Earbuds Pro',          price: 8500,  originalPrice: 12000, rating: 4.7, reviews: 312, stock: 90, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80', badge: 'Hot', description: 'Active noise cancellation, 24hr battery life, IPX5 waterproof. Bluetooth 5.3. Includes charging case.' },
  { id: 8,  category: 'electronics', name: 'Smart Watch Series 5',          price: 15000, originalPrice: 20000, rating: 4.6, reviews: 189, stock: 40, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', badge: 'Sale', description: 'Health monitoring, GPS, water resistant 50m. 7-day battery. Compatible with iOS and Android.' },
  { id: 9,  category: 'electronics', name: 'USB-C Fast Charger 65W',        price: 2200,  originalPrice: null,  rating: 4.4, reviews: 445, stock: 200, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', badge: null, description: 'GaN technology 65W fast charger. Compatible with laptops, phones, tablets. 1.5m cable included.' },
  { id: 10, category: 'electronics', name: 'Bluetooth Speaker Mini',        price: 4500,  originalPrice: 5500,  rating: 4.5, reviews: 234, stock: 75, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', badge: null, description: '360-degree sound, waterproof IPX7, 12hr playtime. Compact and portable.' },
  { id: 11, category: 'electronics', name: 'Phone Gimbal Stabilizer',       price: 6800,  originalPrice: 9000,  rating: 4.3, reviews: 78,  stock: 35, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80', badge: 'Sale', description: '3-axis stabilization. Works with all smartphones. 8hr battery. Foldable design.' },
  { id: 12, category: 'electronics', name: 'Mechanical Keyboard TKL',       price: 9500,  originalPrice: null,  rating: 4.8, reviews: 156, stock: 50, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80', badge: 'New', description: 'Tenkeyless layout, RGB backlit, brown switches. USB-C connection. Windows/Mac compatible.' },

  // Home
  { id: 13, category: 'home',        name: 'Boho Throw Pillow Set',         price: 1800,  originalPrice: 2400,  rating: 4.6, reviews: 203, stock: 150, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80', badge: 'Sale', description: 'Set of 2 decorative pillows with inserts. 45x45cm. Machine washable covers.' },
  { id: 14, category: 'home',        name: 'LED Strip Lights 5M',           price: 1200,  originalPrice: null,  rating: 4.4, reviews: 567, stock: 300, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', badge: 'Bestseller', description: 'RGB color changing, app controlled, music sync. 5 meters, includes remote.' },
  { id: 15, category: 'home',        name: 'Ceramic Pour-Over Coffee Set',  price: 3200,  originalPrice: 4000,  rating: 4.7, reviews: 112, stock: 60, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80', badge: null, description: 'Hand-crafted ceramic pour-over dripper with matching mug and wooden stand. Capacity 400ml.' },
  { id: 16, category: 'home',        name: 'Woven Storage Basket Set',      price: 2600,  originalPrice: 3200,  rating: 4.5, reviews: 88,  stock: 70, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&q=80', badge: 'Sale', description: 'Set of 3 handwoven seagrass baskets in graduated sizes. Natural, durable, eco-friendly.' },

  // Beauty
  { id: 17, category: 'beauty',      name: 'Vitamin C Glow Serum',          price: 2800,  originalPrice: null,  rating: 4.8, reviews: 389, stock: 180, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', badge: 'Bestseller', description: '20% Vitamin C, Hyaluronic Acid, Niacinamide. 30ml. For all skin types. Dermatologist tested.' },
  { id: 18, category: 'beauty',      name: 'Argan Oil Hair Mask',           price: 1600,  originalPrice: 2000,  rating: 4.5, reviews: 234, stock: 120, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', badge: 'Sale', description: 'Deep conditioning treatment with pure argan oil. 250ml. For dry and damaged hair.' },
  { id: 19, category: 'beauty',      name: 'Rose Oud Perfume 50ml',         price: 4200,  originalPrice: 5500,  rating: 4.6, reviews: 145, stock: 80, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80', badge: 'Sale', description: 'Long-lasting oriental fragrance. Notes of rose, oud, and amber. 8-10 hour longevity.' },
  { id: 20, category: 'beauty',      name: 'Men\'s Grooming Kit',           price: 3500,  originalPrice: null,  rating: 4.4, reviews: 97,  stock: 55, image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80', badge: 'New', description: '7-piece set including trimmer, razor, aftershave, beard oil, and styling wax. Gift-ready box.' },

  // Sports
  { id: 21, category: 'sports',      name: 'Premium Yoga Mat 6mm',          price: 2400,  originalPrice: 3000,  rating: 4.7, reviews: 278, stock: 95, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80', badge: null, description: 'Anti-slip natural rubber base, alignment lines, eco-friendly TPE. 183x61cm. Includes carry strap.' },
  { id: 22, category: 'sports',      name: 'Resistance Band Set (5 pcs)',   price: 1800,  originalPrice: null,  rating: 4.5, reviews: 456, stock: 200, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80', badge: 'Bestseller', description: 'Progressive resistance from 5-50lbs. Latex-free, includes handles, door anchor, and ankle straps.' },
  { id: 23, category: 'sports',      name: 'Insulated Water Bottle 1L',     price: 1500,  originalPrice: 1800,  rating: 4.6, reviews: 612, stock: 250, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80', badge: 'Sale', description: '24hr cold, 12hr hot. 316 stainless steel, leak-proof lid. BPA-free. 5 color options.' },
  { id: 24, category: 'sports',      name: 'Jump Rope Speed Cable',         price: 1200,  originalPrice: null,  rating: 4.3, reviews: 189, stock: 160, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80', badge: null, description: 'Steel cable with ball bearings, adjustable length, foam handles. For all fitness levels.' },
]

export const BANNERS = [
  {
    id: 1,
    headline: 'New Season Arrivals',
    subtext: 'Up to 40% off on trending fashion picks',
    cta: 'Shop Fashion',
    link: '/products?category=fashion',
    bg: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E44 50%, #FF6B2B 100%)',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    accent: '#FF6B2B',
  },
  {
    id: 2,
    headline: 'Tech Essentials',
    subtext: 'Gadgets that keep you ahead of the curve',
    cta: 'Shop Electronics',
    link: '/products?category=electronics',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    accent: '#3B82F6',
  },
  {
    id: 3,
    headline: 'Glow Up Season',
    subtext: 'Premium beauty & skincare, delivered to you',
    cta: 'Shop Beauty',
    link: '/products?category=beauty',
    bg: 'linear-gradient(135deg, #1f0a1e 0%, #3d1246 50%, #EC4899 100%)',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    accent: '#EC4899',
  },
]

export const TESTIMONIALS = [
  { id: 1, name: 'Amina W.', location: 'Nairobi', rating: 5, comment: 'Delivery was super fast – got my order in 2 days! The sneakers look exactly like the photos. Will definitely shop again.' },
  { id: 2, name: 'Brian K.', location: 'Mombasa', rating: 5, comment: 'M-Pesa checkout is seamless. I bought the earbuds and the sound quality is amazing. Great value for money!' },
  { id: 3, name: 'Faith M.', location: 'Kisumu', rating: 4, comment: 'Love the variety of products. The skincare serum is working wonders for my skin. Packaging was also very nice.' },
  { id: 4, name: 'James O.', location: 'Nakuru', rating: 5, comment: 'Best online shopping experience in Kenya. Customer support was very helpful when I needed to exchange sizes.' },
]

export function formatKES(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`
}

export function getDiscount(price, originalPrice) {
  if (!originalPrice) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
