import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
export default function SiteLayout({ children }) {
  return (
    <CartProvider>
      <Header />
      <CartDrawer />
      <main id="MainContent">{children}</main>
      <Footer />
    </CartProvider>
  );
}
