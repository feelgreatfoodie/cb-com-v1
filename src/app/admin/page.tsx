import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getActivePaletteId } from '@/lib/edge-config';
import { getAllPalettes } from '@/config/palettes';
import { PaletteGrid } from './PaletteGrid';
import { AdminTabs } from './AdminTabs';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/api/auth/signin?callbackUrl=/admin');

  const activePaletteId = await getActivePaletteId();
  const palettes = getAllPalettes();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 font-mono text-sm text-foreground/50">
              {session.user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-foreground/15 px-4 py-2 font-mono text-sm text-foreground/60 transition-colors hover:border-accent/30 hover:text-accent"
            >
              Back to Site
            </Link>
            <Link
              href="/api/auth/signout"
              className="rounded-lg border border-accent/30 px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent/10"
            >
              Sign Out
            </Link>
          </div>
        </div>
        <AdminTabs>
          <PaletteGrid palettes={palettes} activePaletteId={activePaletteId} />
        </AdminTabs>
      </div>
    </div>
  );
}
