'use client';

import { useTheme } from '@/context/ThemeContext';
import ProductCard from '@/components/ProductCard';

const winterImages = [
  "WhatsApp Image 2026-04-23 at 12.37.18 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.18 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.19 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.19 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.20 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.20 AM (2).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.20 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.21 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.21 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.22 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.22 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.23 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.23 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.24 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.24 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.25 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.25 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.26 AM (1).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.26 AM (2).jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.26 AM.jpeg",
  "WhatsApp Image 2026-04-23 at 12.37.27 AM.jpeg"
];

const winterProducts = winterImages.map((img, index) => ({
  id: `winter-${index}`,
  name: `Winter Collection Item ${index + 1}`,
  slug: `winter-collection-item-${index + 1}`,
  price: 40.00,
  currency: '$',
  images: [`/products/winter/${encodeURIComponent(img)}`],
  badge: 'Winter Exclusive'
}));

export default function WinterProducts() {
  const { theme } = useTheme();

  if (theme !== 'summer') return null;

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Winter Exclusive</p>
          <h2 className="section-title">Winter Collection</h2>
        </div>
      </div>
      <div className="product-grid">
        {winterProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
