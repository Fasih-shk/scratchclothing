import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AppLoader from '@/components/AppLoader';

export const metadata = {
  title: 'MUNI DRIP® | Worn by Hustlers',
  description: "MUNI DRIP was built from nothing and became something.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
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