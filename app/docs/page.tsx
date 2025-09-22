import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  FileText,
  History,
  Download,
} from 'lucide-react';
import DocsLayout from '@/components/layout/docs-layout';

export const metadata: Metadata = {
  title: 'Documentation | Aegrid - Intelligent Asset Management',
  description:
    "Complete documentation for Aegrid's intelligent asset management platform. Learn about The Aegrid Rules, implementation guides, and platform features.",
  keywords: [
    'Aegrid documentation',
    'asset management documentation',
    'The Aegrid Rules',
    'intelligent asset management',
    'council asset management',
    'implementation guide',
    'API documentation',
  ],
  openGraph: {
    title: 'Aegrid Documentation',
    description:
      "Complete documentation for Aegrid's intelligent asset management platform.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegrid Documentation',
    description:
      "Complete documentation for Aegrid's intelligent asset management platform.",
  },
  alternates: {
    canonical: 'https://aegrid.au/docs',
  },
};

export default function DocsPage() {
  const docSections = [
    {
      title: 'The Aegrid Rules',
      description:
        'The foundational principles that guide intelligent asset management. Learn about the four core rules that transform how organisations approach asset management.',
      href: '/docs/aegrid-rules',
      icon: BookOpen,
      featured: true,
    },
    {
      title: 'Resilient Asset Management Whitepaper',
      description:
        'Complete whitepaper on building antifragile infrastructure systems using The Aegrid Rules framework.',
      href: '/docs/whitepaper',
      icon: FileText,
      featured: true,
    },
    {
      title: 'Changelog',
      description:
        "Track all notable changes and updates to the Aegrid platform. See what's new and what's coming.",
      href: '/docs/releases/changelog',
      icon: History,
      featured: false,
    },
  ];

  return (
    <DocsLayout>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Aegrid Documentation
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to understand and implement intelligent asset
            management with Aegrid. Start with The Aegrid Rules and explore our
            comprehensive guides.
          </p>
        </div>

        {/* Featured Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Featured Documentation
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {docSections
              .filter(section => section.featured)
              .map(section => {
                const Icon = section.icon;
                return (
                  <Card
                    key={section.href}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">
                          {section.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="group-hover:bg-primary/90">
                        <Link href={section.href}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* All Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            All Documentation
          </h2>
          <div className="grid gap-4">
            {docSections.map(section => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.href}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="group-hover:bg-primary/10"
                      >
                        <Link href={section.href}>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start with The Aegrid Rules to understand our approach, then explore
            the whitepaper for detailed implementation guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/docs/aegrid-rules">
                <BookOpen className="mr-2 h-4 w-4" />
                Read The Aegrid Rules
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/docs/whitepaper">
                <Download className="mr-2 h-4 w-4" />
                Download Whitepaper
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
