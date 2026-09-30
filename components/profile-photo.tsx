import Image from "next/image";
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
  return (
    <figure
      className={`profile-photo group ${className}`.trim()}
      aria-label={site.profileImageAlt}
    >
      <div className="profile-photo-frame">
        <div className="profile-photo-scan" aria-hidden="true" />
        <Image
          src={site.profileImage}
          alt={site.profileImageAlt}
          width={484}
          height={630}
          priority={priority}
          sizes={sizes}
          className="profile-photo-image"
        />
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
