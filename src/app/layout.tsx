import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getActivePaletteId } from '@/lib/edge-config';
import { getPalette, type PaletteColors } from '@/config/palettes';
import { ThemeProvider } from '@/lib/palette-context';
import { WebVitals } from '@/components/layout/WebVitals';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://christianbourlier.com'),
  title: 'Christian Bourlier | Solutions Architect & Data Engineer',
  description:
    'Solutions Architect, Data Engineer, AI/ML Engineer & Technical Account Manager. 8+ years data engineering on GCP, 20 years enterprise sales.',
  keywords: [
    'Christian Bourlier',
    'Solutions Architect',
    'Data Engineer',
    'AI/ML Engineer',
    'Technical Account Manager',
    'Technical Solutions Partner',
    'Technical Engineering',
    'Solutions Architecture',
    'GCP Professional Data Engineer',
    'GCP Professional Cloud Architect',
    'BigQuery',
    'Vertex AI',
    'LangChain',
    'Python',
    'TypeScript',
    'Enterprise Sales',
    'Cloud Architecture',
    'Machine Learning',
  ],
  alternates: {
    canonical: 'https://christianbourlier.com',
  },
  authors: [{ name: 'Christian Bourlier', url: 'https://christianbourlier.com' }],
  creator: 'Christian Bourlier',
  category: 'Technology',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Christian Bourlier | Solutions Architect & Data Engineer',
    description:
      'Solutions Architect, Data Engineer, AI/ML Engineer & Technical Account Manager. 8+ years data engineering on GCP, 20 years enterprise sales.',
    type: 'website',
    url: 'https://christianbourlier.com',
    siteName: 'Christian Bourlier',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Christian Bourlier | Solutions Architect & Data Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christian Bourlier | Solutions Architect & Data Engineer',
    description:
      'Solutions Architect, Data Engineer, AI/ML Engineer & Technical Account Manager. 8+ years data engineering on GCP, 20 years enterprise sales.',
    images: ['/twitter-image'],
  },
};

function cssVarsFromPalette(colors: PaletteColors): Record<string, string> {
  return {
    '--background': colors.background,
    '--background-light': colors.backgroundLight,
    '--accent': colors.accent,
    '--cta': colors.cta,
    '--foreground': colors.foreground,
    '--stream1': colors.stream1,
    '--stream2': colors.stream2,
    '--stream3': colors.stream3,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paletteId = await getActivePaletteId();
  const palette = getPalette(paletteId);

  return (
    <html
      lang="en"
      className="scroll-smooth"
      style={cssVarsFromPalette(palette.colors) as React.CSSProperties}
    >
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://cdn-images-1.medium.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://cdn-images-1.medium.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://christianbourlier.com/#person',
                  name: 'Christian Bourlier',
                  givenName: 'Christian',
                  familyName: 'Bourlier',
                  description:
                    'Solutions Architect, Data Engineer, AI/ML Engineer & Technical Account Manager with 8+ years data engineering on GCP and 20 years enterprise sales.',
                  jobTitle: [
                    'Solutions Architect',
                    'Data Engineer',
                    'AI/ML Engineer',
                    'Technical Account Manager',
                    'Technical Solutions Partner',
                  ],
                  url: 'https://christianbourlier.com',
                  image: 'https://christianbourlier.com/opengraph-image',
                  sameAs: [
                    'https://linkedin.com/in/christianbourlier',
                    'https://medium.com/@christianbourlier',
                  ],
                  knowsAbout: [
                    'Technical Engineering',
                    'Solutions Architecture',
                    'AI/ML',
                    'Machine Learning',
                    'GCP',
                    'Google Cloud Platform',
                    'BigQuery',
                    'Vertex AI',
                    'LangChain',
                    'Python',
                    'TypeScript',
                    'Enterprise Sales',
                    'Cloud Architecture',
                    'Data Pipelines',
                    'ETL',
                    'SQL',
                    'Terraform',
                    'Next.js',
                    'Technical Account Management',
                  ],
                  hasCredential: [
                    {
                      '@type': 'EducationalOccupationalCredential',
                      credentialCategory: 'certification',
                      name: 'Google Cloud Professional Data Engineer',
                      recognizedBy: {
                        '@type': 'Organization',
                        name: 'Google Cloud',
                      },
                    },
                    {
                      '@type': 'EducationalOccupationalCredential',
                      credentialCategory: 'certification',
                      name: 'Google Cloud Professional Cloud Architect',
                      recognizedBy: {
                        '@type': 'Organization',
                        name: 'Google Cloud',
                      },
                    },
                  ],
                  hasOccupation: [
                    {
                      '@type': 'Occupation',
                      name: 'Solutions Architect',
                      occupationLocation: {
                        '@type': 'Country',
                        name: 'US',
                      },
                      skills:
                        'Cloud Architecture, GCP, Vertex AI, BigQuery, Terraform, Python, TypeScript',
                    },
                    {
                      '@type': 'Occupation',
                      name: 'Data Engineer',
                      occupationLocation: {
                        '@type': 'Country',
                        name: 'US',
                      },
                      skills:
                        'Data Pipelines, ETL, BigQuery, SQL, Python, GCP, Machine Learning',
                    },
                  ],
                },
                {
                  '@type': 'WebSite',
                  name: 'Christian Bourlier',
                  description:
                    'Personal portfolio of Christian Bourlier — Solutions Architect, Data Engineer, AI/ML Engineer & Technical Account Manager.',
                  url: 'https://christianbourlier.com',
                  publisher: {
                    '@id': 'https://christianbourlier.com/#person',
                  },
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://christianbourlier.com' },
                    { '@type': 'ListItem', position: 2, name: 'Journey', item: 'https://christianbourlier.com/#journey' },
                    { '@type': 'ListItem', position: 3, name: 'Competencies', item: 'https://christianbourlier.com/#competencies' },
                    { '@type': 'ListItem', position: 4, name: 'Open To', item: 'https://christianbourlier.com/#opento' },
                    { '@type': 'ListItem', position: 5, name: 'Workshop', item: 'https://christianbourlier.com/#workshop' },
                    { '@type': 'ListItem', position: 6, name: 'Writing', item: 'https://christianbourlier.com/#writing' },
                    { '@type': 'ListItem', position: 7, name: 'Contact', item: 'https://christianbourlier.com/#contact' },
                  ],
                },
                {
                  '@type': 'Review',
                  author: { '@type': 'Person', name: 'Brianna Mersey' },
                  reviewBody: 'A highly skilled senior data engineer with strong expertise in pipelining complex data sources, GCP, BQML and the broader Google ecosystem. He consistently delivered scalable, efficient solutions while making collaboration easy and enjoyable.',
                  itemReviewed: { '@id': 'https://christianbourlier.com/#person' },
                },
                {
                  '@type': 'Review',
                  author: { '@type': 'Person', name: 'Craig Quincy' },
                  reviewBody: 'A naturally curious and technically adept person. Christian is a natural leader who motivates his team to accomplish their goals and have fun doing it. He is an exceptional individual who functions well in both the technical and people realms.',
                  itemReviewed: { '@id': 'https://christianbourlier.com/#person' },
                },
                {
                  '@type': 'Review',
                  author: { '@type': 'Person', name: 'Eric Budd' },
                  reviewBody: 'Christian has been terrific to work with. I value his energy for learning, teaching others, and creating an environment where everyone has fun. His thoroughness and attention to detail were key to making a great product.',
                  itemReviewed: { '@id': 'https://christianbourlier.com/#person' },
                },
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <WebVitals />
        <CookieConsent />
        <ThemeProvider paletteId={paletteId} colors={palette.colors}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
