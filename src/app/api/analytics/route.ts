import { NextRequest, NextResponse } from 'next/server';

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

// Mock data generator for MVP — replace with real DB queries later
function getMockAnalytics(): AnalyticsData {
  return {
    sections: {
      hero: 145,
      journey: 98,
      competencies: 76,
      opento: 54,
      workshop: 112,
      bossfight: 43,
      implementation: 38,
      writing: 29,
      download: 21,
      contact: 67,
    },
    scrollDepth: {
      avg: 68,
      max: 100,
    },
    ctaClicks: {
      'hero-cta': 23,
      'contact-submit': 18,
      'download-pdf': 34,
      'project-unfurl': 89,
      'blog-readmore': 12,
    },
    paletteUsage: {
      midnight: 234,
      sunset: 89,
      ocean: 145,
      forest: 67,
      cosmic: 98,
      ember: 43,
      arctic: 21,
      dusk: 76,
    },
    visitors: 342,
  };
}

export async function GET() {
  try {
    // In MVP, ignore date range query params and return mock data
    // Future: parse ?range=7d|30d|all from request.nextUrl.searchParams
    const data = getMockAnalytics();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the engagement data (for MVP, no persistent storage)
    console.log('Engagement data received:', {
      timestamp: new Date().toISOString(),
      data: body,
    });

    // Future: store in database
    // await db.engagementEvents.create({ data: body });

    return NextResponse.json(
      { success: true, message: 'Engagement data logged' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to log engagement data' },
      { status: 500 }
    );
  }
}
