"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { loginHref, readReturnPathFromSearch, safeReturnPath } from "@/lib/auth-redirect";

function WelcomeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const returnTo = useMemo(
    () => safeReturnPath(readReturnPathFromSearch(searchParams), "/account"),
    [searchParams],
  );

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(loginHref(returnTo));
      return;
    }
    router.replace(returnTo);
  }, [loading, user, returnTo, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <WelcomeRedirect />
    </Suspense>
  );
}
