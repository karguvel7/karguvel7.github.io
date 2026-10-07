"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/prefersReducedMotion";

const VIDEO_MP4 = "/hero/hero.mp4";
const VIDEO_WEBM = "/hero/hero.webm";

export function HeroMedia() {
  const [wrapRef, inView] = useInView<HTMLDivElement>({ threshold: 0.35, once: false });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [muted, setMuted] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    fetch(VIDEO_MP4, { method: "HEAD" })
      .then((r) => setHasVideo(r.ok))
      .catch(() => setHasVideo(false));
  }, []);

  const tryUnmute = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    try {
      await v.play();
      setMuted(false);
      setSoundBlocked(false);
    } catch {
      v.muted = true;
      setMuted(true);
      setSoundBlocked(true);
      void v.play();
    }
  }, []);

  useEffect(() => {
    const unlock = () => {
      void tryUnmute();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [tryUnmute]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo) return;
    if (!inView || reduced) {
      v.pause();
      setPlaying(false);
    } else if (playing) {
      void v.play();
    }
  }, [inView, hasVideo, playing, reduced]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[768/960] w-full max-w-[min(92vw,520px)]"
      style={{ minHeight: "min(96svh, 1040px)" }}
    >
      <p
        className="pointer-events-none absolute inset-x-0 top-[12%] text-center text-[clamp(3rem,14vw,7.5rem)] font-bold tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(13,13,13,.12)" }}
        aria-hidden
      >
        KARGUVEL
      </p>

      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            className="relative z-10 h-full w-full object-contain mix-blend-multiply"
            playsInline
            loop
            muted={muted}
            autoPlay
            poster="/character.jpg"
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>
          <button
            type="button"
            className={`absolute bottom-6 right-0 z-20 grid h-[46px] w-[46px] place-items-center rounded-full bg-ink text-paper ${
              soundBlocked ? "animate-ping-slow" : ""
            }`}
            aria-label={playing ? "Pause hero video" : "Play hero video"}
            onClick={togglePlay}
          >
            {playing ? (
              <span className="text-xs font-bold tracking-widest">‖</span>
            ) : (
              <span className="ml-0.5 text-sm">▶</span>
            )}
          </button>
        </>
      ) : (
        <Image
          src="/character.jpg"
          alt="3D illustration of Karguvel K"
          width={768}
          height={960}
          priority
          className="relative z-10 h-full w-full object-contain mix-blend-multiply"
        />
      )}
    </div>
  );
}
