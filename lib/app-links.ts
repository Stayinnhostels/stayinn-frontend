/**
 * Guest account lives on this website. Admin console may be on another origin.
 * Set NEXT_PUBLIC_ADMIN_ORIGIN (no trailing slash) when the dashboard app is separate.
 */
export function dashboardHref(path = "/account") {
  return path.startsWith("/") ? path : `/${path}`;
}

export function adminHref(path = "/admin") {
  const o = process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, "");
  return o ? `${o}${path}` : path;
}
