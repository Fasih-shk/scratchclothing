'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MyGooglePayButton from './GooglePayButton';
import MyPayPalButton from './PayPalButton';
import MyShopifyButton from './ShopifyButton';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity, updateCustomText } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  });

  const paymentGateways = [
    { id: 'paypal', name: 'PayPal', icon: 'PP', bg: '#003087', color: '#ffffff' },
    { id: 'applepay', name: 'Apple Pay', icon: '[A]', bg: '#111111', color: '#ffffff' },
    { id: 'googlepay', name: 'Google Pay', icon: 'G', bg: '#ffffff', color: '#1f1f1f', border: '1px solid #dadce0' },
    { id: 'shopify', name: 'Shopify', icon: 'S', bg: '#95bf47', color: '#ffffff' },
  ];

  const handleCheckoutStart = () => {
    setCheckoutStep('payment');
    setSelectedGateway(null);
  };

  const handleGatewaySelect = (gatewayId) => {
    setSelectedGateway(gatewayId);
    setCheckoutStep('billing');
  };

  const handleBillingInput = (field, value) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  if (!isCartOpen) return null;

  return (
    <div className="mobile-drawer mobile-drawer--open" style={{ zIndex: 300 }}>
      <div
        className="mobile-drawer__backdrop"
        onClick={() => setIsCartOpen(false)}
        style={{ opacity: 1, pointerEvents: 'all' }}
      />

      <div className="mobile-drawer__panel" style={{ width: '100%', maxWidth: '450px', transform: 'translateX(0)', left: 'auto', right: 0, borderRight: 'none', borderLeft: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.5rem', fontWeight: 700 }}>
            {checkoutStep === 'cart' && 'Your Cart'}
            {checkoutStep === 'payment' && 'Choose Payment'}
            {checkoutStep === 'billing' && 'Billing Details'}
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--color-muted)' }}>
            <svg viewBox="0 0 14 14" fill="none" width="20" height="20">
              <path d="M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.length === 0 && checkoutStep === 'cart' ? (
            <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Your cart is empty</p>
              <Link href="/collections" onClick={() => setIsCartOpen(false)} className="btn btn-secondary">
                Start Shopping
              </Link>
            </div>
          ) : checkoutStep === 'cart' ? (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '100px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative' }}>
                  <Image 
                    src={item.selectedImageUrl || item.images[0]?.url || '/placeholder.jpg'} 
                    alt={item.images[0]?.alt || item.name} 
                    fill 
                    sizes="80px" 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>Size: {item.variant}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.currency}{item.price.toFixed(2)}</p>
                  </div>
                    {item.customText && (
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        Custom Print: {item.customText}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
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
              ))
          ) : checkoutStep === 'payment' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                Demo mode: choose a gateway to continue to billing.
              </p>
              {paymentGateways.map((gateway) => (
                <button
                  key={gateway.id}
                  onClick={() => handleGatewaySelect(gateway.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-white)',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      width: '38px',
                      height: '24px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: gateway.bg,
                      color: gateway.color,
                      border: gateway.border || 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {gateway.icon}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{gateway.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0.5rem 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <input
                  className="billing-input"
                  value={billingDetails.fullName}
                  onChange={(e) => handleBillingInput('fullName', e.target.value)}
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  className="billing-input"
                  value={billingDetails.email}
                  onChange={(e) => handleBillingInput('email', e.target.value)}
                  placeholder="Email"
                />
              </div>
              
              <input
                className="billing-input"
                value={billingDetails.address}
                onChange={(e) => handleBillingInput('address', e.target.value)}
                placeholder="Street Address"
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '0.6rem' }}>
                <input
                  className="billing-input"
                  value={billingDetails.city}
                  onChange={(e) => handleBillingInput('city', e.target.value)}
                  placeholder="City"
                />
                <input
                  className="billing-input"
                  value={billingDetails.zipCode}
                  onChange={(e) => handleBillingInput('zipCode', e.target.value)}
                  placeholder="ZIP"
                />
                <input
                  className="billing-input"
                  value={billingDetails.country}
                  onChange={(e) => handleBillingInput('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--color-muted)' }}>Total</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>GBP {cartTotal.toFixed(2)}</span>
            </div>
            {checkoutStep === 'cart' && (
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }} onClick={handleCheckoutStart}>
                Checkout
              </button>
            )}
            {checkoutStep === 'payment' && (
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }} onClick={() => setCheckoutStep('cart')}>
                Back To Cart
              </button>
            )}
            {checkoutStep === 'billing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedGateway === 'googlepay' ? (
                  <div style={{ width: '100%', height: '48px' }}>
                    <MyGooglePayButton totalPrice={cartTotal} />
                  </div>
                ) : selectedGateway === 'paypal' ? (
                  <div style={{ width: '100%', zIndex: 1, position: 'relative' }}>
                    <MyPayPalButton totalPrice={cartTotal} />
                  </div>
                ) : selectedGateway === 'shopify' ? (
                  <div style={{ width: '100%', zIndex: 1, position: 'relative' }}>
                    <MyShopifyButton totalPrice={cartTotal} cartItems={cartItems} />
                  </div>
                ) : (
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}>
                    Place Demo Order
                  </button>
                )}
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }} onClick={() => setCheckoutStep('payment')}>
                  Change Gateway
                </button>
              </div>
            )}
            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: '1rem' }}>
              Demo checkout flow. Gateway integration comes next.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
