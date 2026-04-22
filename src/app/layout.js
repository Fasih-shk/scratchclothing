import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { FrappeAppProvider } from '@/context/FrappeContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'MUNI DRIP® | Worn by Hustlers',
  description: "MUNI DRIP was built from nothing and became something.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <FrappeAppProvider>
          <ThemeProvider>
            <div className="snow-overlay" />
            <div className="sun-flare" />
            {children}
          </ThemeProvider>
        </FrappeAppProvider>
      </body>
    </html>
  );
}
