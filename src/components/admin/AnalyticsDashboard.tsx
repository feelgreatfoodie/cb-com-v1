'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface AnalyticsData {
  sections: Record<string, number>;
  scrollDepth: {
    avg: number;
    max: number;
  };
  ctaClicks: Record<string, number>;
  paletteUsage: Record<string, number>;
  visitors: number;
}

type DateRange = '7d' | '30d' | 'all';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics?range=${range}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [range]);

  if (loading && !data) {
    return (
      <div className="text-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="glass rounded-lg p-8 text-center">
            <div className="text-xl text-foreground/60">Loading analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="glass rounded-lg p-8 text-center">
            <div className="text-xl text-red-400">Failed to load analytics</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

          {/* Date Range Filter */}
          <div className="flex gap-2" role="group" aria-label="Date range filter">
            {(['7d', '30d', 'all'] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-label={`Show ${r === '7d' ? '7 days' : r === '30d' ? '30 days' : 'all time'} data`}
                aria-pressed={range === r}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  range === r
                    ? 'bg-[var(--accent)] text-foreground'
                    : 'bg-foreground/10 text-foreground/80 hover:bg-foreground/20'
                )}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Visitors Count */}
        <div className="glass mb-6 rounded-lg p-6">
          <div className="text-sm font-medium uppercase tracking-wider text-foreground/60">
            Total Visitors
          </div>
          <div className="mt-2 text-4xl font-bold">{data.visitors.toLocaleString()}</div>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Time per Section */}
          <div className="glass rounded-lg p-6">
            <h2 className="mb-6 text-xl font-semibold">Time per Section</h2>
            <SectionTimeChart sections={data.sections} />
          </div>

          {/* Scroll Depth */}
          <div className="glass rounded-lg p-6">
            <h2 className="mb-6 text-xl font-semibold">Scroll Depth</h2>
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2 text-sm font-medium text-foreground/60">Average Depth</div>
                <div className="text-5xl font-bold">{data.scrollDepth.avg}%</div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-foreground/60">Max Depth</div>
                <div className="text-3xl font-semibold text-[var(--accent)]">
                  {data.scrollDepth.max}%
                </div>
              </div>
            </div>
          </div>

          {/* CTA Click-Through */}
          <div className="glass rounded-lg p-6">
            <h2 className="mb-6 text-xl font-semibold">CTA Click-Through</h2>
            <CtaTable ctaClicks={data.ctaClicks} />
          </div>

          {/* Palette Popularity */}
          <div className="glass rounded-lg p-6">
            <h2 className="mb-6 text-xl font-semibold">Palette Popularity</h2>
            <PaletteDonutChart paletteUsage={data.paletteUsage} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Time Chart (Horizontal Bar Chart)
function SectionTimeChart({ sections }: { sections: Record<string, number> }) {
  const entries = Object.entries(sections).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="space-y-4">
      {entries.map(([section, views]) => {
        const percentage = (views / maxValue) * 100;
        return (
          <div key={section}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium capitalize text-foreground/80">{section}</span>
              <span className="text-foreground/60">{views} views</span>
            </div>
            <svg width="100%" height="24" role="img" aria-label={`${section}: ${views} views`}>
              <rect
                x="0"
                y="0"
                width="100%"
                height="24"
                fill="color-mix(in srgb, var(--foreground) 10%, transparent)"
                rx="4"
              />
              <rect
                x="0"
                y="0"
                width={`${percentage}%`}
                height="24"
                fill="var(--accent)"
                rx="4"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// CTA Table
function CtaTable({ ctaClicks }: { ctaClicks: Record<string, number> }) {
  const entries = Object.entries(ctaClicks).sort((a, b) => b[1] - a[1]);
  const totalClicks = entries.reduce((sum, [, clicks]) => sum + clicks, 0);

  return (
    <div className="overflow-hidden rounded-lg border border-foreground/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-foreground/10 bg-foreground/5">
            <th className="px-4 py-3 font-medium text-foreground/60">CTA</th>
            <th className="px-4 py-3 text-right font-medium text-foreground/60">Clicks</th>
            <th className="px-4 py-3 text-right font-medium text-foreground/60">Share</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([cta, clicks]) => {
            const share = ((clicks / totalClicks) * 100).toFixed(1);
            return (
              <tr key={cta} className="border-b border-foreground/5 last:border-0">
                <td className="px-4 py-3 font-medium text-foreground/80">{cta}</td>
                <td className="px-4 py-3 text-right text-foreground/60">{clicks}</td>
                <td className="px-4 py-3 text-right text-[var(--accent)]">{share}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Palette Donut Chart
function PaletteDonutChart({ paletteUsage }: { paletteUsage: Record<string, number> }) {
  const entries = Object.entries(paletteUsage).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#6366f1',
    '#f97316',
  ];

  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const innerRadius = 50;

  // Pre-compute cumulative angles to avoid mutable state during render
  const cumulativeAngles = entries.reduce<number[]>((acc, [, count]) => {
    const prevAngle = acc.length > 0 ? acc[acc.length - 1] : -90;
    acc.push(prevAngle + (count / total) * 360);
    return acc;
  }, []);

  const paths = entries.map(([palette, count], index) => {
    const percentage = (count / total) * 100;
    const angle = (count / total) * 360;
    const startAngle = index === 0 ? -90 : cumulativeAngles[index - 1];
    const endAngle = startAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return {
      palette,
      count,
      percentage: percentage.toFixed(1),
      pathData,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        role="img"
        aria-label="Palette usage distribution"
      >
        {paths.map(({ palette, pathData, color }) => (
          <path key={palette} d={pathData} fill={color} opacity="0.9" />
        ))}
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="rgba(0,0,0,0.3)" />
      </svg>

      <div className="flex-1 space-y-2">
        {paths.map(({ palette, count, percentage, color }) => (
          <div key={palette} className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <div className="flex-1 text-sm">
              <span className="font-medium capitalize text-foreground/80">{palette}</span>
            </div>
            <div className="text-sm text-foreground/60">{count}</div>
            <div className="w-12 text-right text-sm font-medium text-[var(--accent)]">
              {percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
