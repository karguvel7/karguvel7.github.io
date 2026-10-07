#!/usr/bin/env python3
"""
Build hero loop videos and stills from a source clip (Google Flow export).

Requires: ffmpeg, numpy, Pillow (optional for stills).

Usage:
  python3 scripts/build-hero-assets.py --input path/to/raw.mp4
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "hero"
CHARACTER = ROOT / "public" / "character.jpg"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def crossfade_audio(a: np.ndarray, b: np.ndarray, sr: int, fade_s: float = 0.5) -> np.ndarray:
    fade = int(sr * fade_s)
    if fade <= 0 or len(a) < fade or len(b) < fade:
        return np.concatenate([a, b])
    tail = a[-fade:].astype(np.float64)
    head = b[:fade].astype(np.float64)
    ramp = np.linspace(0.0, 1.0, fade)
    blended = tail * (1.0 - ramp) + head * ramp
    return np.concatenate([a[:-fade], blended, b[fade:]])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Source talking-head video")
    parser.add_argument("--duration", type=float, default=10.0)
    parser.add_argument("--xfade", type=float, default=0.5)
    args = parser.parse_args()

    src = Path(args.input)
    if not src.is_file():
        print(f"Missing input {src}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    trimmed = OUT_DIR / "trimmed.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-vf",
            "crop=iw:ih:0:0,scale=768:-2:flags=lanczos,colorlevels=rimin=0.02:gimin=0.02:bimin=0.02:rimax=0.98:gimax=0.98:bimax=0.98",
            "-t",
            str(args.duration),
            "-an",
            str(trimmed),
        ]
    )

    looped = OUT_DIR / "looped.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(trimmed),
            "-filter_complex",
            f"[0:v]split[v1][v2];[v1]trim=0:{args.duration - args.xfade},setpts=PTS-STARTPTS[a];"
            f"[v2]trim={args.duration - args.xfade}:{args.duration},setpts=PTS-STARTPTS[b];"
            f"[a][b]xfade=transition=fade:duration={args.xfade}:offset={args.duration - args.xfade * 2},format=yuv420p[v]",
            "-map",
            "[v]",
            str(looped),
        ]
    )

    hero_mp4 = OUT_DIR / "hero.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(looped),
            "-c:v",
            "libx264",
            "-crf",
            "24",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            str(hero_mp4),
        ]
    )

    hero_webm = OUT_DIR / "hero.webm"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(looped),
            "-c:v",
            "libvp9",
            "-crf",
            "36",
            "-b:v",
            "0",
            "-an",
            str(hero_webm),
        ]
    )

    if CHARACTER.is_file():
        subprocess.run(
            ["python3", str(ROOT / "scripts" / "generate-static-images.py")],
            check=True,
        )

    print(f"Wrote {hero_mp4} and {hero_webm}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
