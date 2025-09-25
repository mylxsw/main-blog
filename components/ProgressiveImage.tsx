"use client";

import { useState } from "react";
import clsx from "clsx";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ProgressiveImage({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <span className="block overflow-hidden rounded-2xl bg-slate-800/50">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={clsx(
          "h-auto w-full scale-105 rounded-2xl object-cover opacity-0 blur-sm transition-all duration-700 ease-out",
          loaded && "scale-100 opacity-100 blur-0",
          className
        )}
      />
    </span>
  );
}
