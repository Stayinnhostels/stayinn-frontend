import { apiFetch } from "@/lib/api-client";

export type SubmitContactInput = {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  message: string;
};

export async function submitContactMessage(input: SubmitContactInput): Promise<void> {
  await apiFetch<{ success: boolean; message?: string }>("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify({
      guest_name: input.guest_name.trim(),
      guest_email: input.guest_email.trim(),
      guest_phone: input.guest_phone?.trim() || "",
      message: input.message.trim(),
    }),
  });
}
