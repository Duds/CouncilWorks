import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AuthSessionProvider from '@/components/providers/session-provider';
import ConditionalHeader from '@/components/layout/conditional-header';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Aegrid — Asset lifecycle management software (Australia)',
  description: 'GIS‑powered asset lifecycle management for Australian organisations. Mobile inspections (offline), scheduling, dashboards, and audit‑ready reporting. $AUD pricing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aegrid',
  },
  openGraph: {
    title: 'Aegrid — Asset lifecycle management software (Australia)',
    description: 'GIS‑powered asset lifecycle management for Australian organisations. Mobile inspections (offline), scheduling, dashboards, and audit‑ready reporting. $AUD pricing.',
    images: [{ url: '/images/og-card.svg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegrid — Asset lifecycle management software (Australia)',
    description: 'GIS‑powered asset lifecycle management for Australian organisations.',
    images: ['/images/og-card.svg']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#059669',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-foreground">
        <AuthSessionProvider>
          <ThemeProvider>
            <ConditionalHeader>
              {/* Structured data for SEO */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'Aegrid',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web',
                    offers: { '@type': 'Offer', priceCurrency: 'AUD', price: '0', availability: 'https://schema.org/InStock' },
                    featureList: [
                      'GIS asset register',
                      'Mobile inspections (offline)',
                      'Scheduling and work orders',
                      'Dashboards and reporting'
                    ]
                  })
                }}
              />
              {children}
            </ConditionalHeader>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
