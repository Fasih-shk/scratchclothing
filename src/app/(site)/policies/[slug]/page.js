// import { policies } from '@/data/policies'; // REMOVED MOCK DATA
import { notFound } from 'next/navigation';
import Link from 'next/link';

const policies = {}; // PREPARED FOR FRAPPE API

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = policies[slug];
  
  if (!policy) return { title: 'Policy Not Found' };
  
  return {
    title: `${policy.title} | MUNI DRIP`,
    description: `Read our ${policy.title.toLowerCase()} to understand how we operate at MUNI DRIP.`,
  };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policy = policies[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="section" style={{ paddingTop: 'calc(var(--header-height) + 4rem)', minHeight: '60vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
          <Link href="/" style={{ hover: 'text-white' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>/</span>
          <span>Policies</span>
        </nav>
        
        <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, marginBottom: '3rem', lineHeight: 1.1 }}>
          {policy.title}
        </h1>
        
        <div 
          className="policy-content"
          style={{ 
            color: 'var(--color-muted)', 
            lineHeight: 1.8, 
            fontSize: '1rem' 
          }}
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .policy-content h2 {
          color: var(--color-white);
          font-family: var(--font-accent);
          font-size: 1.5rem;
          margin: 3rem 0 1rem;
        }
        .policy-content p {
          margin-bottom: 1.5rem;
        }
      `}} />
    </div>
  );
}
