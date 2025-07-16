import { cn } from "@/app/lib/utils";

interface ComingSoonOverlayProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ComingSoonOverlay({
  title = "Coming Soon",
  description = "This feature is currently under development",
  className,
}: ComingSoonOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "rounded-lg",
        className,
      )}
    >
      <div className="text-center space-y-2 p-6">
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{description}</p>
      </div>
    </div>
  );
}
