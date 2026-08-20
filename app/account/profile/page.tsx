"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="container mx-auto px-4 py-10 pb-20">
      <Badge variant="outline" className="mb-3 rounded-full border-primary/30 font-bold text-primary">
        PROFILE
      </Badge>
      <h1 className="text-4xl font-extrabold tracking-tight">Your details</h1>
      <p className="mt-2 text-muted-foreground">This is the name on your Stay Inn account.</p>

      <Card className="mt-8 max-w-xl rounded-3xl border-2 p-6">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="mb-2 block font-bold">
                Full name
              </Label>
              <Input id="fullName" maxLength={120} {...register("fullName")} />
              {errors.fullName ? (
                <p className="mt-1 text-sm font-medium text-destructive">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div>
              <Label className="mb-2 block font-bold">Email</Label>
              <Input value={user?.email ?? ""} disabled />
              <p className="mt-1 text-xs text-muted-foreground">Email is used to sign in and cannot be changed here.</p>
            </div>
            <Button type="submit" disabled={isSubmitting || !isDirty} className="rounded-full font-bold">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
