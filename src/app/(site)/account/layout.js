"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Customer account layout: uses same Header/Footer as other pages
export default function AccountLayout({ children }) {
  const router = useRouter();
  const { user, logout, isInitialized, initialize } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [user, isInitialized, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-black)' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e5e5', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const initials = (user?.firstName?.[0] ?? 'U') + (user?.lastName?.[0] ?? 'A');

  return (
    <>
      <Header />
      <main id="MainContent" style={{ background: 'var(--color-black)', minHeight: '100vh', paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, padding: '40px 24px' }}>
          {/* Left Sidebar */}
          <aside style={{ background: 'var(--color-surface)', borderRadius: 16, padding: 24, height: 'fit-content', position: 'sticky', top: 100 }}>
            {/* User Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-white)', color: 'var(--color-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-white)' }}>{user.firstName} {user.lastName}</div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{user.email}</div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link href="/account" style={{ padding: '12px 16px', borderRadius: 8, color: 'var(--color-white)', fontWeight: 500, textDecoration: 'none', background: 'var(--color-surface-2)' }}>Dashboard</Link>
              <Link href="/account/orders" style={{ padding: '12px 16px', borderRadius: 8, color: 'var(--color-muted)', fontWeight: 500, textDecoration: 'none' }}>Orders</Link>
              <button onClick={handleLogout} style={{ padding: '12px 16px', borderRadius: 8, color: '#ef4444', fontWeight: 500, textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14 }}>Logout</button>
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ minHeight: '60vh' }}>
            {children}
          </main>
        </div>
      </main>
      <Footer />
    </>
  );
}
