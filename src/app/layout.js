import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AppLoader from '@/components/AppLoader';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-bricolage',
});

export const metadata = {
  title: 'MUNI DRIP® | Worn by Hustlers',
  description: "MUNI DRIP was built from nothing and became something.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body className={`${inter.variable} ${bricolage.variable} ${inter.className}`} suppressHydrationWarning>
        <AppLoader />
        <ThemeProvider>
          <div className="snow-overlay" />
          <div className="sun-flare" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
