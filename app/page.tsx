import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop"
            alt="Australian city council assets and skyline"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Council asset lifecycle intelligence, built for Australia
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              CouncilWorks helps councils manage assets across their lifecycle with GIS visualisation,
              preventive scheduling, mobile inspections, and executive reporting. Secure, multi‑tenant,
              and aligned to Australian standards.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/auth/sign-in"><Button className="">Log in</Button></Link>
              <Link href="/auth/register"><Button variant="secondary">Create account</Button></Link>
              <a href="#features" className="text-sm underline underline-offset-4 text-primary">Explore features</a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Australian English • DD/MM/YYYY • 24‑hour time • Metric units • $AUD
            </p>
          </div>
        </div>
      </section>

      {/* Feature grid mapped to Epics */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need to manage council assets</h2>
          <p className="mt-3 text-muted-foreground">
            CouncilWorks delivers the core capabilities required by modern Australian councils, from secure
            authentication to citizen engagement.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* E1: Foundation & Authentication */}
          <FeatureCard
            title="Secure authentication & RBAC"
            description="NextAuth.js with JWT sessions, bcrypt (12 rounds), role‑based access (ADMIN, MANAGER, SUPERVISOR, CREW, EXEC, CITIZEN)."
            image="https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=1200&auto=format&fit=crop"
          />
          {/* E2: Asset Register & GIS */}
          <FeatureCard
            title="Asset register with GIS"
            description="PostGIS‑powered spatial data, map visualisation, CRUD, attachments, search and filtering for fast operations."
            image="https://images.unsplash.com/photo-1470137430626-983a37b8ea46?q=80&w=1200&auto=format&fit=crop"
          />
          {/* E3: RCM-lite & Scheduling */}
          <FeatureCard
            title="RCM‑lite & scheduling"
            description="Templates for top asset classes, risk scoring, automated work orders and preventive maintenance scheduling."
            image="https://images.unsplash.com/photo-1483097365279-e8ac985230b0?q=80&w=1200&auto=format&fit=crop"
          />
          {/* E4: Mobile Inspections (PWA) */}
          <FeatureCard
            title="Mobile inspections (PWA)"
            description="Offline forms, GPS tagging and photo capture, background sync, and conflict resolution for crews in the field."
            image="https://images.unsplash.com/photo-1538970277800-7f3277a71299?q=80&w=1200&auto=format&fit=crop"
          />
          {/* E5: Dashboards & Reporting */}
          <FeatureCard
            title="Dashboards & reporting"
            description="Executive KPIs and operational dashboards, compliance reports, and export to PDF/Excel."
            image="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop"
          />
          {/* E6: Citizen Integration */}
          <FeatureCard
            title="Citizen integration"
            description="Citizen reporting portal, triage and assignment, status tracking and engagement (\"You said, we did\")."
            image="https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=1200&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Role value propositions mapped to user stories */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Built for every role</h2>
          <p className="mt-3 text-muted-foreground">Value for each user, aligned to your council’s responsibilities.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RoleCard
            role="Admin"
            points={[
              'Set up council organisation and users',
              'Assign roles and enforce security',
              'Audit logging and monitoring'
            ]}
          />
          <RoleCard
            role="Manager"
            points={[
              'Import assets from Excel/ERP',
              'Risk‑based planning and scheduling',
              'Compliance reporting and exports'
            ]}
          />
          <RoleCard
            role="Supervisor"
            points={[
              'View asset details and work orders',
              'Assign tasks to crews',
              'Monitor progress and SLAs'
            ]}
          />
          <RoleCard
            role="Crew"
            points={[
              'Offline inspections and photos',
              'GPS tagging and background sync',
              'Simple mobile UI'
            ]}
          />
          <RoleCard
            role="Executive"
            points={[
              'KPI dashboards for performance',
              'Asset condition trending',
              'Audit‑ready visibility'
            ]}
          />
          <RoleCard
            role="Citizen"
            points={[
              'Report issues easily',
              'Track status and outcomes',
              'Transparent engagement'
            ]}
          />
        </div>
      </section>

      {/* Screens and CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">From intake to insight</h2>
            <p className="mt-3 text-muted-foreground">
              Move from reactive to proactive maintenance. CouncilWorks brings together assets, inspections, and
              reporting so teams can focus on delivering outcomes for communities.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/auth/register"><Button>Get started</Button></Link>
              <Link href="/auth/sign-in"><Button variant="outline">Log in</Button></Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">No credit card required. Cancel anytime.</p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600&auto=format&fit=crop"
              alt="Operational dashboard and field inspections on devices"
              className="w-full rounded-lg border border-border shadow-sm"
            />
          </div>
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

function FeatureCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/9] overflow-hidden">
        <img src={image} alt="Feature visual" className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RoleCard({ role, points }: { role: string; points: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <h3 className="text-base font-semibold">{role}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span aria-hidden>•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
