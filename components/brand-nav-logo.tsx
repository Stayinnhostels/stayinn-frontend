import { NAV_LOGO_CLASS, NAV_LOGO_SRC } from "@/lib/brand-assets";

type Props = {
  alt: string;
  className?: string;
};

/** Local static asset — plain img for predictable width/height scaling. */
export function BrandNavLogo({ alt, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={NAV_LOGO_SRC} alt={alt} className={className ?? NAV_LOGO_CLASS} decoding="async" />
  );
}
