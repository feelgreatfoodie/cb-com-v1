'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';

const AnalyticsDashboard = dynamic(
  () => import('@/components/admin/AnalyticsDashboard'),
  { loading: () => <div className="p-8 text-center text-foreground/50">Loading analytics...</div> }
);

type Tab = 'palettes' | 'analytics';

export function AdminTabs({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('palettes');

  return (
    <div>
      <div className="mb-8 flex gap-2" role="tablist" aria-label="Admin sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'palettes'}
          aria-controls="panel-palettes"
          onClick={() => setActiveTab('palettes')}
          className={cn(
            'rounded-lg px-4 py-2 font-mono text-sm transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            activeTab === 'palettes'
              ? 'bg-accent text-background'
              : 'border border-accent/30 text-accent hover:bg-accent/10'
          )}
        >
          Palettes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'analytics'}
          aria-controls="panel-analytics"
          onClick={() => setActiveTab('analytics')}
          className={cn(
            'rounded-lg px-4 py-2 font-mono text-sm transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            activeTab === 'analytics'
              ? 'bg-accent text-background'
              : 'border border-accent/30 text-accent hover:bg-accent/10'
          )}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'palettes' && (
        <div id="panel-palettes" role="tabpanel">
          {children}
        </div>
      )}
      {activeTab === 'analytics' && (
        <div id="panel-analytics" role="tabpanel">
          <AnalyticsDashboard />
        </div>
      )}
    </div>
  );
}
