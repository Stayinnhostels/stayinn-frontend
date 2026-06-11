import { Card, CardContent } from "@/components/ui/card";
import { resolveFacilityIcon } from "@/lib/resolve-facility-icon";

type Props = {
  title: string;
  description: string;
  icon: string;
};

export function FacilityCard({ title, description, icon }: Props) {
  const Icon = resolveFacilityIcon(icon);

  return (
    <Card className="rounded-3xl border-2 transition-all hover:-translate-y-1 hover:border-primary/40">
      <CardContent className="space-y-3 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-extrabold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
