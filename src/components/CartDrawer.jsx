'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="mobile-drawer mobile-drawer--open" style={{ zIndex: 300 }}>
      {/* Overlay */}
      <div 
        className="mobile-drawer__backdrop" 
        onClick={() => setIsCartOpen(false)} 
        style={{ opacity: 1, pointerEvents: 'all' }}
      />
      
      {/* Panel (using same CSS classes as mobile menu for consistency) */}
      <div className="mobile-drawer__panel" style={{ transform: 'translateX(0)', left: 'auto', right: 0, borderRight: 'none', borderLeft: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', fontWeight: 700 }}>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--color-muted)' }}>
            <svg viewBox="0 0 14 14" fill="none" width="20" height="20">
              <path d="M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Your cart is empty</p>
              <Link href="/collections" onClick={() => setIsCartOpen(false)} className="btn btn-secondary">
                Start Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '100px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative' }}>
                  <Image src={item.images[0]} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>Size: {item.variant}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.currency}{item.price.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                        style={{ padding: '4px 8px', color: 'var(--color-white)' }}
                      >-</button>
                      <span style={{ fontSize: '0.8rem', padding: '0 8px' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                        style={{ padding: '4px 8px', color: 'var(--color-white)' }}
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant)}
                      style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textDecoration: 'underline' }}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>£{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}>
              Checkout
            </button>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: '1rem' }}>
              Shipping and taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
