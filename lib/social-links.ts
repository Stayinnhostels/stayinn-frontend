export type SocialLinkFields = {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  threads?: string;
};

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "threads";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
  label: string;
};

function isUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

function stripAt(handle: string) {
  return handle.trim().replace(/^@/, "");
}

function resolveUrl(value: string, build: (handle: string) => string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (isUrl(v)) return v;
  const handle = stripAt(v);
  return handle ? build(handle) : null;
}

export function resolveInstagramUrl(value: string) {
  return resolveUrl(value, (h) => `https://instagram.com/${h}`);
}

export function resolveYoutubeUrl(value: string) {
  const v = value.trim();
  if (!v) return null;
  if (isUrl(v)) return v;
  const handle = stripAt(v);
  if (!handle) return null;
  if (handle.startsWith("channel/") || handle.startsWith("c/") || handle.startsWith("user/")) {
    return `https://youtube.com/${handle}`;
  }
  return `https://youtube.com/@${handle}`;
}

export function resolveTwitterUrl(value: string) {
  return resolveUrl(value, (h) => `https://x.com/${h}`);
}

export function resolveFacebookUrl(value: string) {
  return resolveUrl(value, (h) => `https://facebook.com/${h}`);
}

export function resolveLinkedinUrl(value: string) {
  const v = value.trim();
  if (!v) return null;
  if (isUrl(v)) return v;
  const path = stripAt(v);
  if (!path) return null;
  if (path.includes("/")) return `https://linkedin.com/${path}`;
  return `https://linkedin.com/in/${path}`;
}

export function resolveThreadsUrl(value: string) {
  return resolveUrl(value, (h) => `https://threads.net/@${h}`);
}

export function resolveWebsiteUrl(value: string) {
  const v = value.trim();
  if (!v) return null;
  if (isUrl(v)) return v;
  return `https://${v}`;
}

export function buildSocialLinks(fields: SocialLinkFields): SocialLink[] {
  const links: SocialLink[] = [];

  const add = (platform: SocialPlatform, label: string, href: string | null) => {
    if (href) links.push({ platform, label, href });
  };

  add("instagram", "Instagram", resolveInstagramUrl(fields.instagram ?? ""));
  add("youtube", "YouTube", resolveYoutubeUrl(fields.youtube ?? ""));
  add("twitter", "X", resolveTwitterUrl(fields.twitter ?? ""));
  add("facebook", "Facebook", resolveFacebookUrl(fields.facebook ?? ""));
  add("linkedin", "LinkedIn", resolveLinkedinUrl(fields.linkedin ?? ""));
  add("threads", "Threads", resolveThreadsUrl(fields.threads ?? ""));

  return links;
}
