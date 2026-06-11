import { getApiBaseUrl } from "@/lib/api-client";

export type PublicFacility = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
};

type FacilitiesResponse = {
  success?: boolean;
  facilities?: PublicFacility[];
};

export async function fetchPublicFacilities(): Promise<PublicFacility[]> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/v1/facilities`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as FacilitiesResponse;
    if (!data.success || !Array.isArray(data.facilities)) return [];
    return data.facilities
      .filter((f) => f.title?.trim() && f.description?.trim())
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch {
    return [];
  }
}
