import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'CouncilWorks',
  description: 'Council Asset Lifecycle Intelligence Platform'
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
