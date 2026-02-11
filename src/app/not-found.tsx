import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center sm:p-12">
        <p className="font-mono text-7xl font-bold tracking-wider text-accent sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-mono text-lg tracking-wider text-foreground/80 sm:text-xl">
          Page not found
        </h1>
        <p className="mt-2 font-mono text-sm text-foreground/40">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg border border-accent/30 px-6 py-2.5 font-mono text-sm tracking-wider text-accent transition-colors hover:border-accent/60 hover:bg-accent/10"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
