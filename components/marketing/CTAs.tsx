"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface Props {
  location: string;
  variant?: string;
}

export default function CTAs({ location, variant }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="mailto:sales@councilworks.au?subject=Book%20a%20demo"
        onClick={() => trackEvent("cta_book_demo", { location, variant })}
      >
        <Button>Book a 30‑minute demo</Button>
      </a>
      <Link
        href="/auth/register"
        onClick={() => trackEvent("cta_get_sandbox", { location, variant })}
      >
        <Button variant="secondary">Get a sandbox</Button>
      </Link>
    </div>
  );
}
