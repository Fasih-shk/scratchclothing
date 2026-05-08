import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import SummerProducts from '@/components/SummerProducts';
// import { products } from '@/data/products'; // REMOVED MOCK DATA

import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const metadata = {
  title: 'Scratch® | Started from Scratch, Worn by Hustlers',
  description:
    'Scratch was built from nothing and became something. Premium streetwear for those who came from nothing and built their empire.',
};

const marqueeItems = [
  'NEW ARRIVALS', 'UAE to UK', 'PREMIUM STREETWEAR', 'FREE SHIPPING OVER £150',
  'MUNI ISLAND COLLECTION', 'MADE FOR THE CULTURE', 'LIMITED DROPS',
];

export default async function HomePage() {
  let featuredProducts = [];
  let allProducts = [];
  let errorMsg = null;

  try {
    await connectDB();
    
    // Fetch featured products
    const featuredProductsRaw = await Product.find({ isFeatured: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    
    featuredProducts = JSON.parse(JSON.stringify(featuredProductsRaw));

    // Fetch recent products for full collection
    const allProductsRaw = await Product.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(16)
      .lean();

    allProducts = JSON.parse(JSON.stringify(allProductsRaw));
  } catch (error) {
    console.error('Database connection error:', error);
    errorMsg = 'Unable to connect to the database. Please check your connection and IP whitelist.';
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__noise" />

        <div className="hero__content">
          <span className="hero__eyebrow">Premium Streetwear — UK</span>
          <h1 className="hero__title">
            BUILT DIFFERENT<br />MUNI DRIP.
          </h1>
          <p className="hero__subtitle">
            MORE MUNI MORE FREEDOM.
          </p>
          <div className="hero__cta-group">
            <Link href="/collections" className="btn btn-primary">
              Shop Now
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Our Story
            </Link>
          </div>
        </div>

        <div className="hero__scroll-hint" aria-hidden="true">
          <span>SCROLL</span>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2v12M3 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURE STRIP ===== */}
      <div className="feature-strip">
        <div className="feature-strip__inner">
          {[
            { icon: '🚀', label: 'Fast Dispatch', desc: 'Orders shipped within 48hrs' },
            { icon: '🌍', label: 'Worldwide Shipping', desc: 'We ship to 50+ countries' },
            { icon: '♻️', label: 'Sustainable', desc: 'Ethically produced pieces' },
            { icon: '🔒', label: 'Secure Checkout', desc: 'Payment with SSL encryption' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="feature-strip__item">
              <span className="feature-strip__icon">{icon}</span>
              <div>
                <p className="feature-strip__label">{label}</p>
                <p className="feature-strip__desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SummerProducts />

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Latest Drops</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link href="/collections" className="btn btn-secondary">
            View All
          </Link>
        </div>

        {errorMsg && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '8px', margin: '2rem 0' }}>
            {errorMsg}
          </div>
        )}

        <div className="product-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : !errorMsg && (
            <p className="admin-text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              No featured products found.
            </p>
          )}
        </div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <div className="about-strip">
        <div className="about-strip__inner">
          <div className="about-strip__text-block">
            <p className="section-eyebrow">Our Story</p>
            <h2 className="about-strip__title">
              We all started<br />from Zero.
            </h2>
            <p className="about-strip__body">
              MUNI DRIP was built from nothing and became something — for the brothers and
              sisters who came from the same. This is more than fashion. Every stitch, every
              drop, every colourway carries the energy of those who refused to quit.
              <br /><br />
              Welcome to the family.
            </p>
            <Link href="/about" className="btn btn-primary">
              Read Our Story
            </Link>
          </div>
          <div className="about-strip__image">
            <Image
              src="https://scratchclothing.co.uk/cdn/shop/files/BF747829-B5D3-4CF4-B01C-D6EC8F023868.jpg?v=1772337286&width=800"
              alt="MUNI DRIP"
              className="about-strip__img"
              fill
              sizes="(max-width: 900px) 0vw, 40vw"
            />
          </div>
        </div>
      </div>

      {/* ===== MORE PRODUCTS ===== */}
      <section className="section">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">The Full Collection</p>
            <h2 className="section-title">More From MUNI</h2>
          </div>
        </div>
        <div className="product-grid">
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : !errorMsg && (
            <p className="admin-text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              Collection coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
