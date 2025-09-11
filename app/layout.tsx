import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
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
      <body className="bg-background text-foreground">
        <ThemeProvider>
          <header className="p-4 border-b border-border">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <Link href="/" className="font-semibold">CouncilWorks</Link>
              <div className="flex items-center gap-3">
                <nav className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/sign-in"><Button variant="ghost">Log in</Button></Link>
                  <Link href="/auth/register"><Button>Register</Button></Link>
                </nav>
                <ThemeToggle />
              </div>
            </div>
          </header>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
