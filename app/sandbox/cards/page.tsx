"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function Variant({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">{name}</div>
      {children}
    </div>
  );
}

export default function CardsSandboxPage() {
  return (
    <div className="p-6 space-y-12">
      <h1 className="text-2xl font-semibold">Cards Sandbox — Muted Grey Options</h1>
      <p className="text-sm text-muted-foreground">Preview alternative muted greys and nested card patterns. Each section scopes a different grey option.</p>

      {/* Grey Option A */}
      <section className="muted-grey-1 space-y-6">
        <h2 className="text-xl font-semibold">Grey Option A (muted-grey-1)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Variant name="Neutral Left Border">
            <Card className="border border-border border-l-2 border-l-primary">
              <CardHeader>
                <CardTitle>Left Border Accent</CardTitle>
                <CardDescription>Neutral card with primary left border and no green fill.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3">Muted section content</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Top Accent Bar">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-accent" />
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Top Accent</CardTitle>
                  <CardDescription>Subtle top bar; surface stays neutral.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-3">Muted section content</div>
                </CardContent>
              </Card>
            </div>
          </Variant>

          <Variant name="Badge Accent">
            <Card className="border border-border">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Badge Accent</CardTitle>
                  <CardDescription>Status conveys colour via badge, not background.</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary text-primary">Healthy</Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3">Muted section content</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Dashed Outline (Inner)">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Dashed Inner Outline</CardTitle>
                <CardDescription>Hierarchy via outline instead of fill.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-border p-3 bg-background">Inner group</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Inset Shadow Cue">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Inset Shadow</CardTitle>
                <CardDescription>Very light inset to imply grouping.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-background p-3 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.02)]">Inset highlight group</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Nested Subcard">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Parent Card</CardTitle>
                <CardDescription>Nested card stays neutral with accent border.</CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="border border-border border-l-2 border-l-secondary">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Nested Card</CardTitle>
                    <CardDescription>Secondary accent, no tinted fill.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-md bg-muted p-3">Muted section content</div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Variant>
        </div>
      </section>

      {/* Grey Option B */}
      <section className="muted-grey-2 space-y-6">
        <h2 className="text-xl font-semibold">Grey Option B (muted-grey-2)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Variant name="Neutral Left Border">
            <Card className="border border-border border-l-2 border-l-primary">
              <CardHeader>
                <CardTitle>Left Border Accent</CardTitle>
                <CardDescription>Using muted-grey-2 token.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3">Muted section content</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Top Accent Bar">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-accent" />
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Top Accent</CardTitle>
                  <CardDescription>Using muted-grey-2 token.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-3">Muted section content</div>
                </CardContent>
              </Card>
            </div>
          </Variant>
        </div>
      </section>

      {/* Grey Option C */}
      <section className="muted-grey-3 space-y-6">
        <h2 className="text-xl font-semibold">Grey Option C (muted-grey-3)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Variant name="Badge Accent">
            <Card className="border border-border">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Badge Accent</CardTitle>
                  <CardDescription>Using muted-grey-3 token.</CardDescription>
                </div>
                <Badge variant="outline" className="border-primary text-primary">Healthy</Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3">Muted section content</div>
              </CardContent>
            </Card>
          </Variant>

          <Variant name="Nested Subcard">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Parent Card</CardTitle>
                <CardDescription>Using muted-grey-3 token.</CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="border border-border border-l-2 border-l-secondary">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Nested Card</CardTitle>
                    <CardDescription>Secondary accent.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-md bg-muted p-3">Muted section content</div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Variant>
        </div>
      </section>
    </div>
  );
}


