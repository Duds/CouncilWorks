"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  { src: "/images/demo-1.svg", alt: "Map and asset register" },
  { src: "/images/demo-2.svg", alt: "Work orders and scheduling" },
  { src: "/images/demo-3.svg", alt: "Dashboards and reporting" },
];

export default function DemoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <div className="relative aspect-[16/10] w-full">
        <Image
          key={index}
          src={IMAGES[index].src}
          alt={IMAGES[index].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={false}
          className="object-cover transition-opacity duration-500"
        />
      </div>
    </div>
  );
}
