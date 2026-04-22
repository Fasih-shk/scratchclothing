import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code" aria-hidden="true">404</div>
      <h1 className="not-found__title">Page Not Found</h1>
      <p className="not-found__body">
        The page you&apos;re looking for doesn&apos;t exist — but the collection does.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
