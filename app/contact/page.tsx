"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactDetailsCards, ContactMapSection } from "@/components/contact-details";
import { useSiteSettings } from "@/components/site-settings-provider";
import { submitContactMessage } from "@/lib/contact-api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  guest_name: z
    .string()
    .trim()
    .min(1, "Enter your full name")
    .max(120, "Name must be 120 characters or less"),
  guest_email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address")
    .max(200, "Email must be 200 characters or less"),
  guest_phone: z
    .string()
    .trim()
    .max(30, "Phone must be 30 characters or less")
    .refine((value) => !value || /^[\d\s+\-().]+$/.test(value), {
      message: "Enter a valid phone number",
    }),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message must be 2000 characters or less"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function fieldClass(invalid: boolean) {
  return cn("h-11", invalid && "border-destructive focus-visible:ring-destructive/30");
}

export default function ContactPage() {
  const { phone } = useSiteSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      message: "",
    },
  });

  const messageValue = watch("message") ?? "";

  async function onSubmit(values: ContactFormValues) {
    try {
      await submitContactMessage({
        guest_name: values.guest_name,
        guest_email: values.guest_email,
        guest_phone: values.guest_phone?.trim() || undefined,
        message: values.message,
      });
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            CONTACT
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Let&apos;s <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">talk.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Questions about a room, pricing, or your stay? We typically reply within a few hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 pb-12 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
        <div className="space-y-5">
          <ContactDetailsCards />
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full min-h-0 flex-col gap-6 rounded-3xl border-2 bg-card p-8 shadow-[var(--shadow-card)]"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest_name" className="text-sm font-bold">
                Full name
              </Label>
              <Input
                id="guest_name"
                autoComplete="name"
                placeholder="Aarav Mehta"
                aria-invalid={Boolean(errors.guest_name)}
                className={fieldClass(Boolean(errors.guest_name))}
                {...register("guest_name")}
              />
              {errors.guest_name && (
                <p className="text-xs text-destructive font-medium">{errors.guest_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest_email" className="text-sm font-bold">
                Email
              </Label>
              <Input
                id="guest_email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                aria-invalid={Boolean(errors.guest_email)}
                className={fieldClass(Boolean(errors.guest_email))}
                {...register("guest_email")}
              />
              {errors.guest_email && (
                <p className="text-xs text-destructive font-medium">{errors.guest_email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest_phone" className="text-sm font-bold">
              Phone <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="guest_phone"
              type="tel"
              autoComplete="tel"
              placeholder={phone}
              aria-invalid={Boolean(errors.guest_phone)}
              className={fieldClass(Boolean(errors.guest_phone))}
              {...register("guest_phone")}
            />
            {errors.guest_phone && (
              <p className="text-xs text-destructive font-medium">{errors.guest_phone.message}</p>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="message" className="text-sm font-bold">
                Message
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">{messageValue.length}/2000</span>
            </div>
            <Textarea
              id="message"
              className={cn(
                "min-h-[10rem] flex-1 h-full resize-none py-3",
                errors.message && "border-destructive focus-visible:ring-destructive/30",
              )}
              placeholder="Tell us what you're looking for…"
              aria-invalid={Boolean(errors.message)}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive font-medium">{errors.message.message}</p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-auto shrink-0 rounded-full font-bold w-full sm:w-auto px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </section>

      <section className="container mx-auto px-4 pb-20 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ContactMapSection />
      </section>

      <SiteFooter />
    </div>
  );
}
