'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/context/AuthContext';

export default function NewsletterPopup() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Don't show if auth is not yet initialized
    if (!isInitialized) return;

    // Check localStorage flags
    const dismissed = localStorage.getItem('scratch_newsletter_dismissed');
    const subscribed = localStorage.getItem('scratch_newsletter_subscribed');

    // If user is logged in or has already interacted, do not show
    if (user || dismissed || subscribed) {
      return;
    }

    // Delay popup by 2 seconds for a premium and non-intrusive feel
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Disable background scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [mounted, isInitialized, user]);

  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = '';
    localStorage.setItem('scratch_newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!firstName.trim()) {
      setError('First name is required');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setCouponCode(data.couponCode || 'WELCOME10');
      setSuccess(true);
      localStorage.setItem('scratch_newsletter_subscribed', 'true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isVisible) return null;

  return (
    <div className="newsletter-overlay">
      <div className="newsletter-modal">
        {/* Close Button */}
        <button
          className="newsletter-close"
          onClick={handleClose}
          aria-label="Close newsletter popup"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!success ? (
          <>
            <h2 className="newsletter-title">10% OFF!</h2>
            <p className="newsletter-subtitle">
              DISCOUNT CODES, EXCLUSIVE PREVIEWS, AND MORE ✂️🏷️
            </p>

            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="newsletter-input-wrapper">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="newsletter-input"
                  disabled={loading}
                />
              </div>

              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  disabled={loading}
                />
              </div>

              {error && <div className="newsletter-error">{error}</div>}

              <button
                type="submit"
                className="newsletter-button"
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join The Club'}
              </button>
            </form>

            <p className="newsletter-disclaimer">
              By signing up, you agree to receive marketing emails. View our{' '}
              <a href="/policies/privacy-policy" onClick={handleClose}>
                privacy policy
              </a>{' '}
              and{' '}
              <a href="/policies/terms-of-service" onClick={handleClose}>
                terms of service
              </a>{' '}
              for more info.
            </p>
          </>
        ) : (
          <div className="newsletter-success">
            <div className="newsletter-success-icon">🎉</div>
            <h2 className="newsletter-title">WELCOME TO THE CLUB!</h2>
            <p className="newsletter-success-msg">
              Thank you for subscribing. Here is your 10% discount code for your first purchase. We've also emailed it to you!
            </p>
            <div className="newsletter-coupon-box">
              <div className="newsletter-coupon-label">Your Discount Code</div>
              <div className="newsletter-coupon-code">{couponCode}</div>
            </div>
            <button
              className="newsletter-button"
              onClick={() => {
                setIsVisible(false);
                document.body.style.overflow = '';
              }}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
