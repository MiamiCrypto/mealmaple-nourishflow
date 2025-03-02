
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-lg sm:text-xl max-w-prose">{description}</p>
      )}
    </div>
  );
}
