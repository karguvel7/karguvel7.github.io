#!/usr/bin/env python3
"""Generate portrait-bust.webp and og.jpg from public/character.jpg."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHARACTER = ROOT / "public" / "character.jpg"
PORTRAIT = ROOT / "public" / "portrait-bust.webp"
OG = ROOT / "public" / "og.jpg"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def main() -> int:
    if not CHARACTER.is_file():
        print(f"Missing {CHARACTER}", file=sys.stderr)
        return 1

    # Bust crop: upper ~62% of frame, scale to 480x600
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(CHARACTER),
            "-vf",
            "crop=iw:ih*0.62:0:ih*0.02,scale=480:600:force_original_aspect_ratio=increase,crop=480:600",
            "-q:v",
            "85",
            str(PORTRAIT),
        ]
    )

    # OG: paper field + character on the right
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "color=c=0xf4f2ee:s=1200x630",
            "-i",
            str(CHARACTER),
            "-filter_complex",
            "[1:v]scale=520:-1[fg];[0:v][fg]overlay=(W-w)/2+180:(H-h)/2:format=auto",
            "-frames:v",
            "1",
            "-update",
            "1",
            "-q:v",
            "3",
            str(OG),
        ]
    )

    print(f"Wrote {PORTRAIT} and {OG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
