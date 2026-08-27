"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AccountCard, AccountPage, AccountPageHeader } from "@/components/account/account-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

const schema = z.object({
  fullName: z.string().trim().min(1, "Enter your name").max(120, "Name is too long"),
});
type FormValues = z.infer<typeof schema>;

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.fullName ?? "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const next = await updateProfile(values.fullName);
      reset({ fullName: next.fullName });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update profile");
    }
  };

  return (
    <AccountPage>
      <AccountPageHeader
        title="Profile"
        description="This is the name on your Stay Inn account."
      />

      <AccountCard className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="fullName" className="mb-2 block text-sm">
              Full name
            </Label>
            <Input id="fullName" maxLength={120} {...register("fullName")} />
            {errors.fullName ? (
              <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 block text-sm">
              Email
            </Label>
            <Input id="email" value={user?.email ?? ""} disabled />
            <p className="mt-1.5 text-sm text-muted-foreground">
              Used to sign in. Contact the hostel if you need to change it.
            </p>
          </div>
          <Button type="submit" className="rounded-full" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </form>
      </AccountCard>
    </AccountPage>
  );
}
