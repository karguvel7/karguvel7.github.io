"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/content";

type ProfilePhotoProps = {
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function ProfilePhoto({
  priority = false,
  className = "",
  sizes = "(max-width: 1024px) 220px, 320px",
}: ProfilePhotoProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (document.documentElement.dataset.motion !== "on") return;
    const node = frameRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(px * 7).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const node = frameRef.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <figure
      className={`profile-photo group ${className}`.trim()}
    >
      <div
        ref={frameRef}
        className="profile-photo-tilt"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="profile-photo-frame">
          <div className="profile-photo-scan" aria-hidden="true" />
          <div className="profile-photo-ring" aria-hidden="true" />
          <Image
            src={site.profileImage}
            alt={site.profileImageAlt}
            width={968}
            height={1162}
            priority={priority}
            sizes={sizes}
            className="profile-photo-image"
          />
        </div>
      </div>
      <figcaption className="mt-4 space-y-1">
        <p className="text-sm font-medium text-ink">{site.name}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          {site.jobTitle}
        </p>
      </figcaption>
    </figure>
  );
}
