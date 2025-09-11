"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop", alt: "GIS map and asset register interface" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop", alt: "Work orders and scheduling dashboard" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop", alt: "Analytics dashboards and reporting" },
];

export default function DemoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  if (IMAGES.length === 0) return null;

  const idx = IMAGES.length > 0 ? index % IMAGES.length : 0;
  const current = IMAGES.at(idx);
  if (!current) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <div className="relative aspect-[16/10] w-full">
        <Image
          key={index}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={false}
          className="object-cover transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
