import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">CouncilWorks</h1>
      <p className="text-muted-foreground mt-2">
        Council Asset Lifecycle Intelligence Platform
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  );
}
