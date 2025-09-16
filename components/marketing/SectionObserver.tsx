"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  sectionIds: string[];
}

export default function SectionObserver({ sectionIds }: Props) {
  useEffect(() => {
    trackEvent("page_view", { page: "landing" });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target instanceof HTMLElement) {
            const key = e.target.id || "unknown";
            trackEvent("section_view", { key });
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, [sectionIds]);

  return null;
}


