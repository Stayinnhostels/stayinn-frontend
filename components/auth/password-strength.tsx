interface Props {
  password: string;
}

export function getPasswordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
const colors = [
  "bg-destructive",
  "bg-destructive",
  "bg-[var(--accent)]",
  "bg-[var(--secondary)]",
  "bg-[var(--primary)]",
];

export function PasswordStrength({ password }: Props) {
  const score = getPasswordScore(password);
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-colors ${
              i < score ? colors[score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-xs text-muted-foreground">
          Strength: <span className="font-semibold text-foreground">{labels[score]}</span>
        </p>
      )}
    </div>
  );
}
