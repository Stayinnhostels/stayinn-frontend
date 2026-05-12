/**
 * When the marketing site and dashboard/admin app are on different origins,
 * set NEXT_PUBLIC_DASHBOARD_ORIGIN and NEXT_PUBLIC_ADMIN_ORIGIN (no trailing slash).
 */
export function dashboardHref(path = "/dashboard") {
  const o = process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN?.replace(/\/$/, "");
  return o ? `${o}${path}` : path;
}

export function adminHref(path = "/admin") {
  const o = process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, "");
  return o ? `${o}${path}` : path;
}
