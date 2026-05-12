import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const notImpl = (provider: string) => () =>
  toast.info(`${provider} sign-in is a placeholder. Connect Lovable Cloud to enable it.`);

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" className="rounded-full h-11 font-semibold" onClick={notImpl("Google")}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1S8.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
        </svg>
        Google
      </Button>
      <Button type="button" variant="outline" className="rounded-full h-11 font-semibold" onClick={notImpl("Apple")}>
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-2-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.3.9 1.2 1.9 2.6 3.3 2.6 1.3 0 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-3.9zM14 4.7c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"/>
        </svg>
        Apple
      </Button>
    </div>
  );
}

export function OrDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-3 text-muted-foreground font-semibold tracking-wider">{label}</span>
      </div>
    </div>
  );
}
