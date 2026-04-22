'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP ALL', href: '/collections' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          {/* Mobile menu button */}
          <button
            className="header__menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Logo */}
          <Link href="/" className="header__logo">
            <span className="header__logo-text">MUNI DRIP®</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="header__nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="header__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="header__actions">
            <button className="header__icon-btn" aria-label="Search">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <circle cx="9" cy="9" r="4.75" stroke="currentColor" strokeWidth="1.5"/>
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12.5 12.5 3.25 3.25"/>
              </svg>
            </button>
            <button 
              className="header__icon-btn header__cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="header__cart-count">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${isMobileMenuOpen ? 'mobile-drawer--open' : ''}`}
      >
        <div className="mobile-drawer__backdrop" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="mobile-drawer__panel">
          <button
            className="mobile-drawer__close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 14 14" fill="none" width="16" height="16">
              <path d="M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12L2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <nav className="mobile-drawer__nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-drawer__link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-drawer__footer">
            <p className="mobile-drawer__tagline">MUNI DRIP.<br />Worn by Hustlers.</p>
          </div>
        </div>
      </div>
    </>
  );
}
