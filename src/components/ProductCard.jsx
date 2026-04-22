import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}
        <div className="product-card__overlay">
          <span className="product-card__quick-view">Quick View</span>
        </div>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">
          {product.currency}{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
