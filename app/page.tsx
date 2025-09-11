"use client";

import Link from 'next/link';
import Image from 'next/image';
import CTAs from '@/components/marketing/CTAs';
import DemoCarousel from '@/components/marketing/DemoCarousel';
import { useAbVariant } from '@/hooks/useAbVariant';
import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function HomePage() {
  const variant = useAbVariant('hero');

  const heroRef = useRef<HTMLElement | null>(null);
  const proofRef = useRef<HTMLElement | null>(null);
  const howRef = useRef<HTMLElement | null>(null);
  const personasRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    trackEvent('page_view', { page: 'landing' });

    const map = new Map<HTMLElement, string>();
    if (heroRef.current) map.set(heroRef.current, 'hero');
    if (proofRef.current) map.set(proofRef.current, 'proof');
    if (howRef.current) map.set(howRef.current, 'how');
    if (personasRef.current) map.set(personasRef.current, 'personas');
    if (faqRef.current) map.set(faqRef.current, 'faqs');

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.target instanceof HTMLElement) {
          const key = map.get(e.target);
          if (key) trackEvent('section_view', { key });
        }
      });
    }, { threshold: 0.4 });

    map.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const headline = variant === 'A'
    ? 'Modern asset management for Australian councils'
    : 'From reactive maintenance to predictable outcomes';

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section ref={heroRef} className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-dashboard.svg"
              alt="Asset dashboard preview"
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{headline}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Reduce downtime, lift compliance, and see everything in one place. GIS‑powered asset lifecycle
              management built for Australian councils — DD/MM/YYYY, 24‑hour time, and local support.
            </p>
            <CTAs location="hero" variant={variant} />
            <p className="mt-2 text-xs text-muted-foreground">No credit card. $AUD pricing.</p>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section ref={proofRef} className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 text-sm text-muted-foreground">Trusted by local governments across Australia</div>
        <div className="flex flex-wrap items-center gap-6 opacity-80">
          <Image src="/images/logos/city-of-melbourne.svg" alt="City of Melbourne" width={160} height={48} />
          <Image src="/images/logos/city-of-sydney.svg" alt="City of Sydney" width={160} height={48} />
          <Image src="/images/logos/brisbane-city-council.svg" alt="Brisbane City Council" width={160} height={48} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-md border border-border p-3">↓ 32% unplanned outages</div>
          <div className="rounded-md border border-border p-3">↑ 21% SLA compliance</div>
          <div className="rounded-md border border-border p-3">Audit‑ready in minutes</div>
        </div>
      </section>

      {/* How it works */}
      <section ref={howRef} className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three steps to proactive, predictable maintenance.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold">1) Unified asset register</h3>
              <p className="mt-2 text-sm text-muted-foreground">GIS‑powered register with attachments, search, and spatial context.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">2) Mobile inspections (offline)</h3>
              <p className="mt-2 text-sm text-muted-foreground">Simple field forms with GPS tagging, photos, and background sync.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">3) Scheduling & reporting</h3>
              <p className="mt-2 text-sm text-muted-foreground">Automated work orders, KPIs, and audit‑ready reporting.</p>
            </div>
            <CTAs location="how_it_works" variant={variant} />
          </div>
          <DemoCarousel />
        </div>
      </section>

      {/* Condensed persona value */}
      <section ref={personasRef} className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Built for every role</h2>
          <p className="mt-3 text-muted-foreground">Value for each user, aligned to your council’s responsibilities.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ValueCard role="Managers" bullets={["↓ downtime with risk‑based plans", "↑ SLA compliance", "Clean audits"]} />
          <ValueCard role="Supervisors" bullets={["Assign and track work", "Live status & SLAs", "Map context"]} />
          <ValueCard role="Crews" bullets={["Offline inspections", "GPS + photos", "Fast mobile UI"]} />
          <ValueCard role="Executives" bullets={["Performance KPIs", "Condition trends", "$AUD budget views"]} />
          <ValueCard role="Admins" bullets={["SSO & RBAC", "Audit logging", "Organisation setup"]} />
          <ValueCard role="Citizens" bullets={["Report issues", "Track outcomes", "Transparent updates"]} />
        </div>
      </section>

      {/* FAQs */}
      <section ref={faqRef} className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know before you get started.</p>
        </div>
        <div className="space-y-3">
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">Where is our data stored?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Data residency is in Australia with strict access controls and audit logging.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">Does it work offline for field crews?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Yes — inspections run offline with background sync when connectivity returns.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">How long does implementation take?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Most councils start in weeks using our templates and guided onboarding.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">Can we integrate with our ERP/GIS/SSO?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Yes — we support common ERPs, GIS layers, and SSO for secure access.</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} CouncilWorks. All rights reserved.</div>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/docs">Docs</Link>
              <Link href="/changelog">Changelog</Link>
              <a href="mailto:support@councilworks.au">Support</a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ValueCard({ role, bullets }: { role: string; bullets: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <h3 className="text-base font-semibold">{role}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span aria-hidden>•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
