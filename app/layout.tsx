import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AuthSessionProvider from '@/components/providers/session-provider';
import ConditionalHeader from '@/components/layout/conditional-header';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'CouncilWorks — Council asset management software (Australia)',
  description: 'GIS‑powered asset lifecycle management for Australian councils. Mobile inspections (offline), scheduling, dashboards, and audit‑ready reporting. $AUD pricing.',
  openGraph: {
    title: 'CouncilWorks — Council asset management software (Australia)',
    description: 'GIS‑powered asset lifecycle management for Australian councils. Mobile inspections (offline), scheduling, dashboards, and audit‑ready reporting. $AUD pricing.',
    images: [{ url: '/images/og-card.svg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CouncilWorks — Council asset management software (Australia)',
    description: 'GIS‑powered asset lifecycle management for Australian councils.',
    images: ['/images/og-card.svg']
  }
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
                    name: 'CouncilWorks',
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
