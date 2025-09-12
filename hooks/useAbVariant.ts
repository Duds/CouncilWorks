"use client";

import { useEffect, useState } from "react";

export type AbKey = "hero" | "global";
export type AbVariant = "A" | "B";

export function useAbVariant(key: AbKey): AbVariant {
  const storageKey = `cw-ab-${key}`;
  const [variant, setVariant] = useState<AbVariant>("A");

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(storageKey) as AbVariant | null;
      if (existing === "A" || existing === "B") {
        setVariant(existing);
        return;
      }
      const assigned: AbVariant = Math.random() < 0.5 ? "A" : "B";
      window.localStorage.setItem(storageKey, assigned);
      setVariant(assigned);
    } catch {
      setVariant(Math.random() < 0.5 ? "A" : "B");
    }
  }, [storageKey]);

  return variant;
}
