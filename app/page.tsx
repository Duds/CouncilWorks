import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import type { Metadata } from 'next';
import CTAs from '@/components/marketing/CTAs';
import DemoCarousel from '@/components/marketing/DemoCarousel';
import SectionObserver from '@/components/marketing/SectionObserver';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title:
    'Aegrid: Intelligent Asset Management for Visionary Councils | Pilot Partnership',
  description:
    "Partner with Aegrid to transform your council's asset management. Service designer-led platform built on revolutionary Aegrid Rules. Explore pilot partnerships for innovative councils.",
  keywords: [
    'asset management',
    'council asset management',
    'pilot partnership',
    'Aegrid Rules',
    'intelligent asset management',
    'service design',
    'Australian councils',
    'asset lifecycle management',
    'maintenance strategy',
    'risk-based maintenance',
    'Dale Rogers',
    'council technology',
    'asset intelligence',
    'proactive maintenance',
    'asset criticality',
  ],
  authors: [
    { name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' },
  ],
  creator: 'Dale Rogers',
  publisher: 'Aegrid',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Aegrid: Intelligent Asset Management for Visionary Councils',
    description:
      "Partner with Aegrid to transform your council's asset management. Service designer-led platform built on revolutionary Aegrid Rules.",
    url: 'https://aegrid.au',
    siteName: 'Aegrid',
    images: [
      {
        url: '/images/CouncilWorks_HERO.png',
        width: 1200,
        height: 630,
        alt: 'Aegrid dashboard interface showing intelligent asset management',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegrid: Intelligent Asset Management for Visionary Councils',
    description:
      "Partner with Aegrid to transform your council's asset management. Service designer-led platform built on revolutionary Aegrid Rules.",
    images: ['/images/CouncilWorks_HERO.png'],
    creator: '@aegrid_au',
  },
  alternates: {
    canonical: 'https://aegrid.au',
  },
  category: 'Technology',
  classification: 'Asset Management Software',
  other: {
    'geo.region': 'AU',
    'geo.country': 'Australia',
    'geo.placename': 'Australia',
    'DC.title': 'Aegrid: Intelligent Asset Management for Visionary Councils',
    'DC.creator': 'Dale Rogers',
    'DC.subject': 'Asset Management, Council Technology, Service Design',
    'DC.description':
      "Partner with Aegrid to transform your council's asset management. Service designer-led platform built on revolutionary Aegrid Rules.",
    'DC.publisher': 'Aegrid',
    'DC.contributor': 'Dale Rogers',
    'DC.type': 'Website',
    'DC.format': 'text/html',
    'DC.identifier': 'https://aegrid.au',
    'DC.source': 'https://aegrid.au',
    'DC.language': 'en-AU',
    'DC.coverage': 'Australia',
    'DC.rights': 'Copyright Aegrid',
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const variant = cookieStore.get('cw-ab-hero')?.value === 'B' ? 'B' : 'A';
  const headline =
    variant === 'A'
      ? "The Future of Asset Management Isn't More Maintenance. It's a New Approach."
      : 'Partner with us to build the future of asset management for your council.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aegrid',
    description: 'Intelligent Asset Management for Visionary Councils',
    url: 'https://aegrid.au',
    logo: 'https://aegrid.au/images/logos/Aegrid.svg',
    founder: {
      '@type': 'Person',
      name: 'Dale Rogers',
      jobTitle: 'Founder & Service Designer',
      url: 'https://linkedin.com/in/dale-rogers',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'dale@aegrid.au',
      contactType: 'Business Inquiry',
    },
    sameAs: [
      'https://linkedin.com/company/aegrid',
      'https://twitter.com/aegrid_au',
    ],
    offers: {
      '@type': 'Offer',
      name: 'Pilot Partnership',
      description:
        "Explore a pilot partnership to transform your council's asset management",
      category: 'Asset Management Software',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section
          id="hero"
          className="relative isolate"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0">
              <Image
                src="/images/CouncilWorks_HERO.png"
                alt="Aegrid dashboard interface showing intelligent asset management capabilities"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-25"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
          </div>
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 lg:py-32">
            <div className="max-w-3xl">
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {headline}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Aegrid is a service designer-led platform that helps innovative
                councils move from reactive maintenance to predictable outcomes.
                We&apos;re looking for visionary partners to pilot a new
                approach to asset management, built on the &apos;Aegrid
                Rules&apos; – a revolutionary framework for intelligent asset
                management.
              </p>
              <CTAs location="hero" variant={variant} />
            </div>
          </div>
        </section>

        {/* Founder & Aegrid Rules */}
        <section
          id="founder"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="founder-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="founder-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Built by a Service Designer Who&apos;s Lived the Problem
            </h2>
            <p className="mt-3 text-muted-foreground">
              Meet Dale Rogers, the founder behind Aegrid&apos;s revolutionary
              approach to asset management.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  From the Trenches to a New Philosophy
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Dale Rogers brings over 15 years of experience in service
                  design and asset management. Having worked directly with
                  councils across Australia, Dale witnessed firsthand the
                  challenges of reactive maintenance and fragmented systems.
                  This experience led to the development of the Aegrid Rules –
                  four fundamental principles that transform how organisations
                  approach asset management.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-base font-semibold">The Aegrid Rules</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </span>
                    <div>
                      <h5 className="font-medium">Every Asset Has a Purpose</h5>
                      <p className="text-sm text-muted-foreground">
                        Structure assets around what they do, not just where
                        they are.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </span>
                    <div>
                      <h5 className="font-medium">Match Maintenance to Risk</h5>
                      <p className="text-sm text-muted-foreground">
                        Right-size your maintenance effort based on criticality
                        and risk.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </span>
                    <div>
                      <h5 className="font-medium">Protect the Critical Few</h5>
                      <p className="text-sm text-muted-foreground">
                        Surface your most critical assets so you can focus on
                        what matters most.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </span>
                    <div>
                      <h5 className="font-medium">Plan for Tomorrow, Today</h5>
                      <p className="text-sm text-muted-foreground">
                        Build a flexible, future-proof asset model that adapts
                        to change.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <a
                  href="/docs/whitepaper"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                >
                  Read the Whitepaper: The Aegrid Rules - Resilient Asset
                  Management for Critical Control →
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/dale-portrait.png"
                alt="Dale Rogers, Founder of Aegrid, professional headshot"
                width={400}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Pilot Partnership Journey */}
        <section
          id="how"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="pilot-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="pilot-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Our Pilot Partnership Journey
            </h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;ll work with you every step of the way to ensure a
              successful pilot and a smooth transition to a new way of working.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold">
                  1) Discovery & Goal Setting
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll start by understanding your unique challenges and
                  goals. Together, we&apos;ll define what success looks like for
                  your pilot.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold">
                  2) Rapid Prototyping & Configuration
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll quickly configure a prototype of Aegrid that&apos;s
                  tailored to your specific needs. You&apos;ll get to see your
                  data in a new light and experience the power of the Aegrid
                  Rules firsthand.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold">3) Pilot & Iterate</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll work closely with your team to pilot Aegrid in a
                  real-world setting. We&apos;ll gather feedback, iterate on the
                  solution, and ensure that it&apos;s delivering real value.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold">4) Scale & Sustain</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once the pilot is complete, we&apos;ll help you scale the
                  solution across your organisation and embed a new culture of
                  proactive, intelligent asset management.
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Let&apos;s Start Your Pilot Journey
                </a>
              </div>
            </div>
            <DemoCarousel />
          </div>
        </section>

        {/* Value for every stakeholder */}
        <section
          id="personas"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="stakeholder-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="stakeholder-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Value for Every Stakeholder
            </h2>
            <p className="mt-3 text-muted-foreground">
              From the front line to the executive suite, Aegrid delivers
              tangible benefits that align with your council&apos;s strategic
              objectives.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard
              role="For Executives"
              bullets={[
                'Drive strategic outcomes with a clear line of sight from assets to service delivery',
                'Performance KPIs',
                'Condition trends',
                '$AUD budget views',
              ]}
            />
            <ValueCard
              role="For Managers"
              bullets={[
                'Optimize resource allocation and make data-driven decisions with confidence',
                '↓ downtime with risk‑based plans',
                '↑ SLA compliance',
                'Clean audits',
              ]}
            />
            <ValueCard
              role="For Crews"
              bullets={[
                'Simplify your work and focus on what matters most with a user-friendly mobile app',
                'Offline inspections',
                'GPS + photos',
                'Fast mobile UI',
              ]}
            />
            <ValueCard
              role="For Citizens"
              bullets={[
                'Improve community satisfaction with more reliable services and greater transparency',
                'Report issues',
                'Track outcomes',
                'Transparent updates',
              ]}
            />
            <ValueCard
              role="For Supervisors"
              bullets={[
                'Assign and track work',
                'Live status & SLAs',
                'Map context',
              ]}
            />
            <ValueCard
              role="For Admins"
              bullets={['SSO & RBAC', 'Audit logging', 'Organisation setup']}
            />
          </div>
        </section>

        {/* Pilot-Focused FAQ */}
        <section
          id="faqs"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="faq-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="faq-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Your Pilot Partnership Questions, Answered
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about partnering with Aegrid for a
              pilot project.
            </p>
          </div>
          <div className="space-y-3">
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                What are the benefits of a pilot partnership?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                A pilot partnership gives you early access to innovative asset
                management approaches, reduced risk through phased
                implementation, direct input into product development, and the
                opportunity to be a leader in your sector. You&apos;ll also
                benefit from our expertise in service design and change
                management.
              </p>
            </details>
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                What&apos;s the time commitment for a pilot?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Most pilots run for 3-6 months, with initial setup taking 2-4
                weeks. We work around your schedule and can adapt the timeline
                to fit your operational requirements. The key is finding the
                right balance between thorough testing and minimal disruption to
                your current operations.
              </p>
            </details>
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                What happens after the pilot?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                After a successful pilot, we&apos;ll work with you to develop a
                full implementation plan. This includes scaling across your
                organisation, training your team, and establishing ongoing
                support. Pilot partners receive preferential pricing and
                priority support for full implementation.
              </p>
            </details>
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                How much does a pilot cost?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilot partnerships are designed to be low-risk investments. We
                offer flexible pricing models that can include reduced rates,
                success-based pricing, or even no-cost pilots for the right
                partners. The goal is mutual success, not immediate revenue.
              </p>
            </details>
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                What if the pilot doesn&apos;t work for us?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                That&apos;s exactly why we do pilots! If the pilot doesn&apos;t
                deliver the expected value, we&apos;ll work together to
                understand why and either adjust the approach or part ways
                amicably. There are no long-term commitments or penalties for
                ending a pilot early.
              </p>
            </details>
            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer font-medium">
                How do we get started with a pilot?
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">
                Start by reaching out to discuss your specific challenges and
                goals. We&apos;ll schedule a discovery call to understand your
                needs, then develop a tailored pilot proposal. The entire
                process typically takes 1-2 weeks from initial contact to pilot
                kickoff.
              </p>
            </details>
          </div>
        </section>

        {/* Security & Compliance Framing */}
        <section
          id="security-compliance"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="security-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="security-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Security You Can Count On
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built on Australian standards with enterprise-grade security and
              compliance built-in from day one.
            </p>
          </div>

          {/* Security Badges */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-6 opacity-80">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Essential 8 Compliant
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                ISO 27001 Ready
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Australian Sovereign
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                SOC 2 Ready
              </span>
            </div>
          </div>

          {/* Concise Security Features */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-6 rounded-lg border border-border bg-background">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Essential 8 Aligned
              </h3>
              <p className="text-sm text-muted-foreground">
                Level 3 compliance across all Australian Cyber Security Centre
                strategies.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-background">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Enterprise Security
              </h3>
              <p className="text-sm text-muted-foreground">
                MFA, RBAC, AES-256 encryption, and comprehensive audit logging.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-border bg-background">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Australian Sovereign
              </h3>
              <p className="text-sm text-muted-foreground">
                Data sovereignty guarantees and compliance with Australian
                privacy laws.
              </p>
            </div>
          </div>
        </section>

        {/* Our Security Commitment */}
        <section
          id="security-commitment"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20 bg-muted/30"
          aria-labelledby="commitment-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="commitment-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Our Security Commitment
            </h2>
            <p className="mt-3 text-muted-foreground">
              Compliance backed by evidence. We don&apos;t just meet standards –
              we exceed them with continuous monitoring and improvement.
            </p>
          </div>

          {/* Compliance Logos */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-8 opacity-70">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Essential 8
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                ISO 27001
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Data Sovereignty
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                SOC 2
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                GDPR Ready
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  100%
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Essential 8 Compliance
              </h3>
              <p className="text-sm text-muted-foreground">
                Level 3 (Fully Aligned) across all eight strategies
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  24/7
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Security Monitoring
              </h3>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring and automated threat detection
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  AES-256
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Military-grade encryption for data at rest and in transit
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ISO
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Standards Compliant
              </h3>
              <p className="text-sm text-muted-foreground">
                ISO 27001/27002 certified security management
              </p>
            </div>
          </div>
        </section>

        {/* Enterprise-Level Credentials */}
        <section
          id="enterprise-credentials"
          className="mx-auto max-w-6xl px-6 py-16 sm:py-20"
          aria-labelledby="credentials-heading"
        >
          <div className="mb-10 max-w-3xl">
            <h2
              id="credentials-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Enterprise-Level Credentials
            </h2>
            <p className="mt-3 text-muted-foreground">
              Designed for government and enterprise with the security,
              compliance, and reliability you need.
            </p>
          </div>

          {/* Concise Credentials Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-lg border border-border bg-background">
              <h3 className="text-lg font-semibold mb-4">Security Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Multi-Factor Authentication
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Role-Based Access Control
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Application Whitelisting
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Automated Patch Management
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <h3 className="text-lg font-semibold mb-4">
                Compliance Standards
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Essential Eight Maturity Model
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    ISO 27001/27002
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Australian Privacy Principles
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Data Sovereignty Compliance
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <h3 className="text-lg font-semibold mb-4">
                Monitoring & Assurance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Real-time Security Monitoring
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Comprehensive Audit Logging
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Automated Vulnerability Scanning
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Backup Integrity Verification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  Aegrid: Intelligent Asset Management for Visionary Councils
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Partner with us to transform your asset management approach
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Aegrid. All rights reserved.
                </div>
                <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link href={'/docs' as Route}>Docs</Link>
                  <Link href={'/docs/aegrid-rules' as Route}>
                    The Aegrid Rules
                  </Link>
                  <Link href={'/changelog' as Route}>Changelog</Link>
                  <a
                    href="https://www.linkedin.com/company/aegrid/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a href="mailto:support@aegrid.au">Support</a>
                </nav>
              </div>
            </div>
          </div>
        </footer>
        <SectionObserver
          sectionIds={[
            'hero',
            'founder',
            'how',
            'personas',
            'faqs',
            'security-compliance',
            'security-commitment',
            'enterprise-credentials',
          ]}
        />
      </main>
    </>
  );
}

function ValueCard({ role, bullets }: { role: string; bullets: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <h3 className="text-base font-semibold">{role}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {bullets.map(b => (
          <li key={b} className="flex items-start gap-2">
            <span aria-hidden>•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
