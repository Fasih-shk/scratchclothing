'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductDetailClient({ product, relatedProducts }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="product-detail">
      <div className="product-detail__grid">
        {/* Gallery */}
        <div className="product-detail__gallery">
          <div 
            className="product-detail__main-img"
            style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <Image
              src={product.images[selectedImage]?.url || product.images[0]?.url || '/placeholder.jpg'}
              alt={product.images[selectedImage]?.alt || product.name}
              fill
              sizes="(max-width: 900px) 92vw, 42vw"
              priority
              style={isZooming ? {
                transform: 'scale(2.2)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: 'transform 0.1s ease-out'
              } : {
                transition: 'transform 0.3s ease-out'
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="product-detail__thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-detail__thumb ${selectedImage === i ? 'product-detail__thumb--active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image 
                    src={img.url} 
                    alt={img.alt || `${product.name} view ${i + 1}`} 
                    width={72} 
                    height={72} 
                    className="product-detail__thumb-img"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          {/* Breadcrumb */}
          <nav className="product-detail__breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/collections">Collections</Link>
            <span>›</span>
            <span style={{ color: 'var(--color-white)' }}>{product.name}</span>
          </nav>

          {product.badge && (
            <span className="product-detail__badge">{product.badge}</span>
          )}

          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">
            {product.currency}{product.price.toFixed(2)}
          </p>

          <p className="product-detail__desc">{product.description}</p>

          {/* Size Selector */}
          <p className="product-detail__size-label">
            Select Size{' '}
            {selectedSize && (
              <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>
                — {selectedSize}
              </span>
            )}
          </p>
          <div className="product-detail__sizes">
            {product.variants?.[0]?.options?.length > 0 ? (
              product.variants[0].options.map((opt) => (
                <button
                  key={opt.value}
                  className={`size-btn ${selectedSize === opt.value ? 'size-btn--selected' : ''}`}
                  onClick={() => setSelectedSize(opt.value)}
                  aria-label={`Size ${opt.value}`}
                >
                  {opt.value}
                </button>
              ))
            ) : (
              ['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'size-btn--selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  aria-label={`Size ${size}`}
                >
                  {size}
                </button>
              ))
            )}
          </div>

          {/* Add to Cart */}
          <button
            className="product-detail__add-btn"
            onClick={handleAddToCart}
            id={`add-to-cart-${product.slug}`}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          <Link
            href="/collections"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            Continue Shopping
          </Link>

          {/* Meta */}
          <div className="product-detail__meta">
            <span>🚀 Free shipping on orders over £150</span>
            <span>♻️ Ethically produced and sourced</span>
            <span>🔒 Secure checkout guaranteed</span>
            <span>📦 Category: {product.category?.name || 'Uncategorized'}</span>
            {product.sku && <span>🆔 SKU: {product.sku}</span>}
            {product.tags?.length > 0 && (
              <span>🏷️ {product.tags.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section" style={{ paddingTop: '5rem' }}>
          <div className="section-header">
            <div>
              <p className="section-eyebrow">More Like This</p>
              <h2 className="section-title">Related Products</h2>
            </div>
            <Link href="/collections" className="btn btn-secondary">
              View All
            </Link>
          </div>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <Link key={p._id} href={`/products/${p.slug}`} className="product-card">
                <div className="product-card__image-wrapper">
                  <Image
                    src={p.images[0]?.url || '/placeholder.jpg'}
                    alt={p.images[0]?.alt || p.name}
                    className="product-card__image"
                    fill
                    sizes="(max-width: 600px) 90vw, (max-width: 1200px) 45vw, 25vw"
                  />
                  {p.badge && <span className="product-card__badge">{p.badge}</span>}
                  <div className="product-card__overlay">
                    <span className="product-card__quick-view">Quick View</span>
                  </div>
                </div>
                <div className="product-card__info">
                  <h3 className="product-card__name">{p.name}</h3>
                  <p className="product-card__price">
                    {p.currency}{p.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
