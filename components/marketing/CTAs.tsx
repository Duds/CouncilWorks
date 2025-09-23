"use client";

import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface Props {
  location: string;
  variant?: string;
}

export default function CTAs({ location, variant }: Props) {
  // Different CTAs based on location
  const getCTAs = () => {
    switch (location) {
      case "hero":
        return {
          primary: {
            text: "Explore a Pilot Partnership",
            href: "/contact",
            tracking: "cta_pilot_partnership"
          },
          secondary: {
            text: "Learn about the Aegrid Rules",
            href: "/docs/aegrid-rules",
            tracking: "cta_aegrid_rules"
          }
        };
      case "how_it_works":
        return {
          primary: {
            text: "Let's Start Your Pilot Journey",
            href: "/contact",
            tracking: "cta_pilot_journey"
          },
          secondary: {
            text: "Book a Discovery Call",
            href: "/contact",
            tracking: "cta_discovery_call"
          }
        };
      case "contact":
        return {
          primary: {
            text: "Get in Touch",
            href: "/contact",
            tracking: "cta_contact_page"
          },
          secondary: {
            text: "Read the Whitepaper",
            href: "/docs/whitepaper",
            tracking: "cta_whitepaper"
          }
        };
      default:
        return {
          primary: {
            text: "Explore a Pilot Partnership",
            href: "/contact",
            tracking: "cta_pilot_partnership"
          },
          secondary: {
            text: "Learn about the Aegrid Rules",
            href: "/docs/aegrid-rules",
            tracking: "cta_aegrid_rules"
          }
        };
    }
  };

  const ctas = getCTAs();

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={ctas.primary.href}
        onClick={() => trackEvent(ctas.primary.tracking, { location, variant })}
      >
        <Button>{ctas.primary.text}</Button>
      </a>
      <a
        href={ctas.secondary.href}
        onClick={() => trackEvent(ctas.secondary.tracking, { location, variant })}
      >
        <Button variant="secondary">{ctas.secondary.text}</Button>
      </a>
    </div>
  );
}
