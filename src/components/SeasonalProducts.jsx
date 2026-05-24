'use client';

import { useTheme } from '@/context/ThemeContext';
import ProductCard from '@/components/ProductCard';

export default function SeasonalProducts({ winterProducts = [], summerProducts = [] }) {
  const { theme } = useTheme();

  // Only show if theme matches and products exist
  const isWinter = theme === 'winter' && winterProducts.length > 0;
  const isSummer = theme === 'summer' && summerProducts.length > 0;

  if (!isWinter && !isSummer) return null;

  const currentProducts = isWinter ? winterProducts : summerProducts;
  const title = isWinter ? 'Winter Collection' : 'Summer Collection';
  const eyebrow = isWinter ? 'Winter Exclusive' : 'Summer Exclusive';

  return (
    <section className="section seasonal-products-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>

      <div className="product-grid">
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <style jsx>{`
        .seasonal-products-section {
          background: var(--color-surface-1);
          position: relative;
          z-index: 1;
        }
      `}</style>
    </section>
  );
}
