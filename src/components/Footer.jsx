import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <h2 className="footer__logo">MUNI DRIP®</h2>
            <p className="footer__tagline">
              MORE MUNI MORE DRIP.<br />Worn by Hustlers.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-heading">SHOP</h4>
              <Link href="/collections" className="footer__link">All Products</Link>
              <Link href="/collections?cat=Tracksuits" className="footer__link">Tracksuits</Link>
              <Link href="/collections?cat=Sets" className="footer__link">Sets</Link>
              <Link href="/collections?cat=Tops" className="footer__link">Tops</Link>
              <Link href="/collections?cat=Bottoms" className="footer__link">Bottoms</Link>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-heading">COMPANY</h4>
              <Link href="/about" className="footer__link">About Us</Link>
              <Link href="/contact" className="footer__link">Contact</Link>
              <Link href="/policies/privacy-policy" className="footer__link">Privacy Policy</Link>
              <Link href="/policies/refund-policy" className="footer__link">Refund Policy</Link>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-heading">FOLLOW</h4>
              <a href="https://instagram.com/munidrip" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram</a>
              <a href="https://tiktok.com/@munidrip" target="_blank" rel="noopener noreferrer" className="footer__link">TikTok</a>
              <a href="https://twitter.com/munidrip" target="_blank" rel="noopener noreferrer" className="footer__link">Twitter / X</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} MUNI DRIP. All rights reserved.
          </p>
          <div className="footer__payment-icons">
            <span className="payment-icon">VISA</span>
            <span className="payment-icon">MC</span>
            <span className="payment-icon">AMEX</span>
            <span className="payment-icon">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
