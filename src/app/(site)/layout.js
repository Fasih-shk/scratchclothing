import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import NewsletterPopup from '@/components/NewsletterPopup';

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <NewsletterPopup />
      <main id="MainContent">{children}</main>
      <Footer />
    </>
  );
}

