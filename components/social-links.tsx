"use client";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { buildSocialLinks, type SocialLinkFields } from "@/lib/social-links";
import { cn } from "@/lib/utils";

type Props = {
  fields: SocialLinkFields;
  className?: string;
  iconClassName?: string;
  /** Light icons for primary/dark backgrounds */
  inverted?: boolean;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.186 2.25c-2.917 0-5.21 1.188-6.77 3.45-1.38 1.98-2.07 4.72-2.07 8.16 0 3.44.69 6.18 2.07 8.16 1.56 2.26 3.853 3.45 6.77 3.45 2.917 0 5.21-1.19 6.77-3.45 1.38-1.98 2.07-4.72 2.07-8.16 0-3.44-.69-6.18-2.07-8.16-1.56-2.26-3.853-3.45-6.77-3.45zm0 2.04c2.04 0 3.6.78 4.74 2.34.98 1.26 1.47 3.06 1.47 5.4h-3.36c0-1.56-.3-2.76-.9-3.6-.66-.9-1.68-1.35-3.06-1.35-1.5 0-2.64.54-3.42 1.62-.72 1.02-1.08 2.46-1.08 4.32 0 1.86.36 3.3 1.08 4.32.78 1.08 1.92 1.62 3.42 1.62 1.38 0 2.4-.45 3.06-1.35.6-.84.9-2.04.9-3.6h3.36c0 2.34-.49 4.14-1.47 5.4-1.14 1.56-2.7 2.34-4.74 2.34-2.28 0-4.02-.9-5.22-2.7-1.08-1.62-1.62-3.9-1.62-6.84 0-2.94.54-5.22 1.62-6.84 1.2-1.8 2.94-2.7 5.22-2.7z" />
    </svg>
  );
}

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: XIcon,
  facebook: Facebook,
  linkedin: Linkedin,
  threads: ThreadsIcon,
} as const;

export function SocialLinks({ fields, className, iconClassName = "h-5 w-5", inverted }: Props) {
  const links = buildSocialLinks(fields);
  if (links.length === 0) return null;

  const iconButtonClass = inverted
    ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:border-primary-foreground/40 hover:bg-primary-foreground/20"
    : "border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map(({ platform, href, label }) => {
        const Icon = iconMap[platform];
        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              iconButtonClass,
            )}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
}
