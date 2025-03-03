
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-base sm:text-lg max-w-prose">{description}</p>
      )}
    </div>
  );
}
