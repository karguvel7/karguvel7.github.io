"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/prefersReducedMotion";

const INTRO_MP4 = "/media/intro.mp4";
const INTRO_POSTER = "/media/intro-poster.webp";

export function HeroMedia() {
  const [wrapRef, inView] = useInView<HTMLDivElement>({ threshold: 0.35, once: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduced = usePrefersReducedMotion();

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      try {
        await v.play();
      } catch {
        v.muted = true;
        setMuted(true);
      }
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (!inView) {
      v.pause();
    } else {
      void v.play().catch(() => undefined);
    }
  }, [inView, reduced]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[768/960] w-full max-w-[min(92vw,520px)] max-h-[min(96svh,1040px)]"
    >
      <p
        className="pointer-events-none absolute inset-x-0 top-[12%] text-center text-[clamp(3rem,14vw,7.5rem)] font-bold tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(13,13,13,.12)" }}
        aria-hidden
      >
        KARGUVEL
      </p>

      {reduced ? (
        <Image
          src={INTRO_POSTER}
          alt="Karguvel K, AI Architect"
          width={480}
          height={600}
          priority
          className="relative z-10 h-full w-full object-contain mix-blend-multiply"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            className="relative z-10 h-full w-full object-contain mix-blend-multiply"
            playsInline
            loop
            muted={muted}
            autoPlay
            preload="metadata"
            poster={INTRO_POSTER}
            aria-label="Introduction video of Karguvel K"
          >
            <source src={INTRO_MP4} type="video/mp4" />
          </video>
          <button
            type="button"
            className="absolute bottom-4 right-0 z-20 flex h-[46px] min-w-[46px] items-center justify-center gap-1 rounded-full bg-ink px-3 text-paper sm:bottom-6"
            aria-label={muted ? "Unmute introduction video" : "Mute introduction video"}
            aria-pressed={!muted}
            onClick={() => void toggleSound()}
          >
            <SoundIcon muted={muted} />
            <span className="text-xs font-semibold">
              {muted ? "Sound on" : "Mute"}
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M18 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}
