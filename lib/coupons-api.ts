import { apiFetch } from "@/lib/api-client";

export type CouponPreview = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  description?: string;
};

export type ValidateCouponInput = {
  code: string;
  room_id: string;
  seats_booked: number;
  months: number;
};

export type ValidateCouponResult = {
  valid: true;
  coupon: CouponPreview;
  list_total: number;
  discount_amount: number;
  total_amount: number;
};

type ValidateResponse = {
  success: boolean;
  message?: string;
} & ValidateCouponResult;

export async function validateCouponApi(input: ValidateCouponInput): Promise<ValidateCouponResult> {
  const data = await apiFetch<ValidateResponse>("/api/v1/coupons/validate", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!data.success || !data.valid) {
    throw new Error(data.message ?? "Invalid coupon");
  }
  return data;
}
