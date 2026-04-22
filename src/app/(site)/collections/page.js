'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
// import { products as allProducts, categories } from '@/data/products'; // REMOVED MOCK DATA

const allProducts = []; // PREPARED FOR FRAPPE API
const categories = ['All']; // PREPARED FOR FRAPPE API

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    let list =
      activeCategory === 'All'
        ? allProducts
        : allProducts.filter((p) => p.category === activeCategory);

    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [activeCategory, sortBy]);

  return (
    <div className="collections-page">
      <div className="collections-page__hero">
        <p className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>All Products</p>
        <h1 className="collections-page__title">The Collection</h1>
        <p className="collections-page__sub">
          Built for hustle. Worn with pride. Every piece tells a story — yours.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          maxWidth: 'var(--max-w)',
          margin: '0 auto 2rem',
          padding: '0 1.5rem',
        }}
      >
        <div className="filter-bar" style={{ padding: 0, margin: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
          }}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            marginBottom: '1.5rem',
          }}
        >
          {filtered.length} Product{filtered.length !== 1 ? 's' : ''}
        </p>
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-muted)' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</p>
            <p style={{ fontSize: '0.9rem' }}>Try a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
