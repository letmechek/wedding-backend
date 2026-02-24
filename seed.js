import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from './src/config/db.js';
import { Booking } from './src/models/Booking.js';
import { Category } from './src/models/Category.js';
import { Review } from './src/models/Review.js';
import { Saved } from './src/models/Saved.js';
import { ServiceListing } from './src/models/ServiceListing.js';
import { TrendPost } from './src/models/TrendPost.js';
import { User } from './src/models/User.js';
import { VendorProfile } from './src/models/VendorProfile.js';

const img = {
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
  candle: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
  car: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
  grandPlaza: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
  flowers: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=1200',
  photoMain: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
  ring: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200',
  couple: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200',
  makeup: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200',
  band: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200',
  venue: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
  cater: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200',
  trend: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'
};

const categories = [
  { slug: 'venues', name: 'Venues', image: img.venue },
  { slug: 'entertainment', name: 'Entertainment', image: img.band },
  { slug: 'hair-beauty', name: 'Hair & Beauty', image: img.makeup },
  { slug: 'photography-videography', name: 'Photographer/Videography', image: img.photoMain },
  { slug: 'decor', name: 'Decor', image: img.candle },
  { slug: 'florists', name: 'Florists', image: img.flowers },
  { slug: 'transport', name: 'Transport', image: img.car },
  { slug: 'caterers', name: 'Caterers', image: img.cater }
];

const seed = async () => {
  await connectDb();

  await Promise.all([
    Booking.deleteMany({}),
    Saved.deleteMany({}),
    Review.deleteMany({}),
    ServiceListing.deleteMany({}),
    VendorProfile.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    TrendPost.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const client = await User.create({
    role: 'client',
    name: 'Demo Client',
    email: 'client@luxe.com',
    passwordHash,
    avatarUrl: img.avatar
  });

  const vendorUser1 = await User.create({
    role: 'vendor',
    name: 'Grand Plaza Team',
    email: 'vendor1@luxe.com',
    passwordHash,
    avatarUrl: img.avatar
  });

  const vendorUser2 = await User.create({
    role: 'vendor',
    name: 'Royal Blooms Team',
    email: 'vendor2@luxe.com',
    passwordHash,
    avatarUrl: img.avatar
  });

  const partnerUser1 = await User.create({
    role: 'vendor',
    name: 'Celestial Team',
    email: 'partner1@luxe.com',
    passwordHash
  });

  const partnerUser2 = await User.create({
    role: 'vendor',
    name: 'Prestige Team',
    email: 'partner2@luxe.com',
    passwordHash
  });

  const entertainmentUser = await User.create({
    role: 'vendor',
    name: 'Velvet Ensemble Team',
    email: 'entertainment@luxe.com',
    passwordHash
  });

  const beautyUser = await User.create({
    role: 'vendor',
    name: 'Atelier Beauty Team',
    email: 'beauty@luxe.com',
    passwordHash
  });

  const caterUser = await User.create({
    role: 'vendor',
    name: 'Maison Catering Team',
    email: 'cater@luxe.com',
    passwordHash
  });

  const grandPlaza = await VendorProfile.create({
    userId: vendorUser1._id,
    brandName: 'The Grand Plaza Estate',
    bio: 'European-inspired estate venue with world-class concierge service.',
    categories: ['Venues'],
    location: 'Beverly Hills, CA',
    priceTier: '$$$$',
    verifiedPremium: true,
    heroImage: img.grandPlaza,
    gallery: [img.grandPlaza, img.candle, img.venue],
    ratingAvg: 4.9,
    ratingCount: 128
  });

  const royalBlooms = await VendorProfile.create({
    userId: vendorUser2._id,
    brandName: 'Royal Blooms',
    bio: 'High-fashion floral studio with editorial wedding designs.',
    categories: ['Florists'],
    location: 'Manhattan, NY',
    priceTier: '$$$',
    verifiedPremium: false,
    heroImage: img.flowers,
    gallery: [img.flowers, img.couple],
    ratingAvg: 4.8,
    ratingCount: 94
  });

  const celestial = await VendorProfile.create({
    userId: partnerUser1._id,
    brandName: 'Celestial Events Decor',
    bio: 'Luxury decor styling and candlelit receptions.',
    categories: ['Decor'],
    location: 'Los Angeles, CA',
    priceTier: '$$$',
    verifiedPremium: false,
    heroImage: img.candle,
    gallery: [img.candle],
    ratingAvg: 5.0,
    ratingCount: 36,
    isSponsored: true
  });

  const prestige = await VendorProfile.create({
    userId: partnerUser2._id,
    brandName: 'Prestige Auto Concierge',
    bio: 'VIP wedding-day transportation and chauffeur service.',
    categories: ['Transport'],
    location: 'Beverly Hills, CA',
    priceTier: '$$$',
    verifiedPremium: false,
    heroImage: img.car,
    gallery: [img.car],
    ratingAvg: 4.9,
    ratingCount: 51,
    isSponsored: true
  });

  const velvet = await VendorProfile.create({
    userId: entertainmentUser._id,
    brandName: 'Velvet Ensemble',
    bio: 'Live wedding band and curated entertainment direction.',
    categories: ['Entertainment'],
    location: 'Nashville, TN',
    priceTier: '$$$',
    verifiedPremium: false,
    heroImage: img.band,
    gallery: [img.band],
    ratingAvg: 4.8,
    ratingCount: 67
  });

  const atelierBeauty = await VendorProfile.create({
    userId: beautyUser._id,
    brandName: 'Atelier Bridal Beauty',
    bio: 'Luxury bridal makeup and hair styling for modern weddings.',
    categories: ['Hair & Beauty'],
    location: 'Beverly Hills, CA',
    priceTier: '$$$',
    verifiedPremium: false,
    heroImage: img.makeup,
    gallery: [img.makeup],
    ratingAvg: 4.9,
    ratingCount: 52
  });

  const maisonCatering = await VendorProfile.create({
    userId: caterUser._id,
    brandName: 'Maison Noir Catering',
    bio: 'Chef-led tasting menus and plated fine dining experiences.',
    categories: ['Caterers'],
    location: 'San Francisco, CA',
    priceTier: '$$$$',
    verifiedPremium: true,
    heroImage: img.cater,
    gallery: [img.cater],
    ratingAvg: 4.9,
    ratingCount: 83
  });

  const photographerListing = await ServiceListing.create({
    vendorId: grandPlaza._id,
    title: 'The Luxe Photography Package',
    category: 'Photographer/Videography',
    description:
      'Capturing timeless moments with an editorial touch. Our luxe package is designed for couples who value artistry and elevated storytelling.',
    images: [img.photoMain, img.ring, img.couple],
    packages: [
      {
        name: 'Luxe Package',
        subtitle: 'Wedding Day Full Coverage • 10 Hours',
        price: 2500,
        hours: 10,
        inclusions: [
          'Up to 10 Hours of Coverage',
          'Second Professional Photographer',
          'Personalized Full-Sized Luxury Album',
          'Online Gallery with VIP Hosting'
        ]
      },
      {
        name: 'Gold Signature',
        subtitle: '8 Hours • Engagement Session',
        price: 1900,
        hours: 8,
        inclusions: ['8 Hours Coverage', 'Engagement Session', 'Online Gallery']
      }
    ],
    addOns: [{ name: 'Drone Coverage', price: 400 }],
    basePrice: 2500,
    durationHours: 10,
    location: 'Beverly Hills, CA',
    tags: ['luxury', 'photography', 'wedding'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: grandPlaza._id,
    title: 'Grand Heritage Ballroom Full Venue Package',
    category: 'Venues',
    description: 'Historic ballroom with modern luxury amenities.',
    images: [img.grandPlaza, img.venue],
    packages: [
      {
        name: 'Full Venue Package',
        subtitle: 'Reception + Ceremony',
        price: 7500,
        hours: 12,
        inclusions: ['Ballroom Rental', 'Bridal Suite', 'Concierge']
      }
    ],
    addOns: [],
    basePrice: 7500,
    durationHours: 12,
    location: 'Beverly Hills, CA',
    tags: ['venue', 'estate'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: royalBlooms._id,
    title: 'Royal Blooms Signature Florals',
    category: 'Florists',
    description: 'Bespoke floral art direction for luxury weddings.',
    images: [img.flowers],
    packages: [
      {
        name: 'Signature Floral Design',
        subtitle: 'Ceremony + Reception florals',
        price: 3200,
        hours: 1,
        inclusions: ['Bridal Bouquet', 'Centerpieces', 'Installation']
      }
    ],
    addOns: [],
    basePrice: 3200,
    durationHours: 1,
    location: 'Manhattan, NY',
    tags: ['florals', 'premium'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: celestial._id,
    title: 'Celestial Events Decor Signature Styling',
    category: 'Decor',
    description: 'Candlelit luxury tablescapes and custom decor direction.',
    images: [img.candle],
    packages: [
      {
        name: 'Signature Decor',
        subtitle: 'Reception decor + installation',
        price: 4200,
        hours: 6,
        inclusions: ['Moodboard', 'Tablescape', 'On-site Styling']
      }
    ],
    addOns: [],
    basePrice: 4200,
    durationHours: 6,
    location: 'Los Angeles, CA',
    tags: ['decor', 'candles'],
    status: 'active',
    isSponsored: true,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: prestige._id,
    title: 'Prestige Auto Concierge Wedding Fleet',
    category: 'Transport',
    description: 'Luxury sedans and chauffeur service for wedding day arrivals.',
    images: [img.car],
    packages: [
      {
        name: 'VIP Fleet',
        subtitle: '8-hour chauffeur service',
        price: 1800,
        hours: 8,
        inclusions: ['Chauffeur', 'Vehicle Styling', 'Guest Transfer']
      }
    ],
    addOns: [],
    basePrice: 1800,
    durationHours: 8,
    location: 'Beverly Hills, CA',
    tags: ['transport', 'vip'],
    status: 'active',
    isSponsored: true,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: velvet._id,
    title: 'Velvet Ensemble Live Wedding Entertainment',
    category: 'Entertainment',
    description: 'Live band, MC support, and curated music journey for your celebration.',
    images: [img.band],
    packages: [
      {
        name: 'Live Reception Experience',
        subtitle: '5-piece band • 4 hours',
        price: 3600,
        hours: 4,
        inclusions: ['5-piece live band', 'MC support', 'Playlist curation']
      }
    ],
    addOns: [{ name: 'Ceremony Strings', price: 900 }],
    basePrice: 3600,
    durationHours: 4,
    location: 'Nashville, TN',
    tags: ['music', 'entertainment', 'live band'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: atelierBeauty._id,
    title: 'Atelier Bridal Hair & Makeup Signature',
    category: 'Hair & Beauty',
    description: 'On-site beauty glam for bride and bridal party.',
    images: [img.makeup],
    packages: [
      {
        name: 'Bridal Signature Glam',
        subtitle: 'Bride + Trial + Touchups',
        price: 1450,
        hours: 6,
        inclusions: ['Consultation', 'Trial session', 'Wedding day glam']
      }
    ],
    addOns: [{ name: 'Bridesmaid Glam (per person)', price: 220 }],
    basePrice: 1450,
    durationHours: 6,
    location: 'Beverly Hills, CA',
    tags: ['beauty', 'bridal', 'makeup'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await ServiceListing.create({
    vendorId: maisonCatering._id,
    title: 'Maison Noir Chef Tasting Reception',
    category: 'Caterers',
    description: 'Fine dining wedding catering with custom seasonal menus.',
    images: [img.cater],
    packages: [
      {
        name: 'Chef Tasting Reception',
        subtitle: '100 guests • plated service',
        price: 9800,
        hours: 8,
        inclusions: ['Chef tasting', 'Plated service', 'Premium staffing']
      }
    ],
    addOns: [{ name: 'Late Night Dessert Bar', price: 1200 }],
    basePrice: 9800,
    durationHours: 8,
    location: 'San Francisco, CA',
    tags: ['catering', 'fine dining', 'wedding reception'],
    status: 'active',
    isSponsored: false,
    isActive: true
  });

  await Category.insertMany(categories);

  await TrendPost.create({
    title: 'Minimalist Chic: 2024 Guide',
    excerpt: 'How less is becoming more in the luxury wedding space this season.',
    image: img.trend
  });

  await Review.insertMany([
    {
      targetType: 'listing',
      targetId: photographerListing._id,
      userId: client._id,
      rating: 5,
      comment:
        'The entire experience was seamless. They captured every elegant detail beautifully.'
    },
    {
      targetType: 'listing',
      targetId: photographerListing._id,
      userId: client._id,
      rating: 5,
      comment:
        'Professional, discreet, and absolutely stunning final imagery.'
    }
  ]);

  const pkg = photographerListing.packages[0];

  await Booking.create({
    clientId: client._id,
    vendorId: photographerListing.vendorId,
    listingId: photographerListing._id,
    packageId: pkg._id,
    eventDate: new Date('2026-10-12T00:00:00.000Z'),
    hours: 10,
    totalAmount: 2500,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    confirmationCode: 'W-928374',
    paymentId: 'pay_seed_001'
  });

  console.log('Seed complete');
  console.log('Client login: client@luxe.com / Password123!');
  console.log('Vendor login: vendor1@luxe.com / Password123!');

  await mongoose.connection.close();
};

seed().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});
