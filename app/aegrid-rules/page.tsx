import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './aegrid-rules.css';

export const metadata: Metadata = {
  title:
    'The Aegrid Rules: Resilient Asset Management for Critical Control | Aegrid',
  description:
    'A summary of the Aegrid Rules - four principles that transform asset management from reactive maintenance to proactive risk management discipline.',
  keywords: [
    'Aegrid Rules',
    'asset management',
    'resilient asset management',
    'critical control',
    'risk-based maintenance',
    'operational resilience',
    'antifragile systems',
    'Dale Rogers',
    'asset management philosophy',
  ],
  authors: [
    { name: 'Dale Rogers', url: 'https://linkedin.com/in/dalerogers' },
  ],
  creator: 'Dale Rogers',
  publisher: 'Aegrid',
  openGraph: {
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description:
      'A summary of the Aegrid Rules - four principles that transform asset management from reactive maintenance to proactive risk management discipline.',
    url: 'https://aegrid.au/aegrid-rules',
    siteName: 'Aegrid',
    images: [
      {
        url: '/images/aegrid-hero.png',
        width: 1200,
        height: 630,
        alt: 'The Aegrid Rules summary cover',
      },
    ],
    locale: 'en_AU',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description:
      'A summary of the Aegrid Rules - four principles that transform asset management from reactive maintenance to proactive risk management discipline.',
    images: ['/images/aegrid-hero.png'],
    creator: '@aegrid_au',
  },
  alternates: {
    canonical: 'https://aegrid.au/aegrid-rules',
  },
};

async function getMarkdownContent(): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    'public',
    'documents',
    'The Aegrid Rules_ Resilient Asset Management for Critical Control.md'
  );
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

export default async function AegridRulesPage() {
  const markdownContent = await getMarkdownContent();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                The Aegrid Rules Summary
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/aegrid-rules/pdf" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold tracking-tight mb-8 text-foreground border-b border-border pb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-6 text-foreground border-b border-border pb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4 text-foreground">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold tracking-tight mt-6 mb-3 text-foreground">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-semibold tracking-tight mt-4 mb-2 text-foreground">
                  {children}
                </h5>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-7 mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <div className="text-muted-foreground ml-4">• {children}</div>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-muted/50 rounded-r-md">
                  <div className="text-muted-foreground italic">{children}</div>
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  );
                }
                return <code className={className}>{children}</code>;
              },
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-border rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 text-muted-foreground">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-8 border-border" />,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href?.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-muted-foreground">{children}</em>
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Aegrid. All rights reserved.</p>
              <p>Written by Dale Rogers, Founder of Aegrid</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/aegrid-rules/pdf" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
