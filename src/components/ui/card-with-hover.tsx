
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWithHoverProps {
  className?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  gradient?: "blue" | "green" | "mixed" | "none";
}

export function CardWithHover({
  className,
  title,
  description,
  children,
  footer,
  onClick,
  gradient = "none",
}: CardWithHoverProps) {
  return (
    <Card
      className={cn(
        "glass-card overflow-hidden backdrop-blur-md bg-white/30 border border-white/40 shadow-xl",
        gradient === "blue" && "gradient-blue",
        gradient === "green" && "gradient-green",
        gradient === "mixed" && "gradient-mixed",
        onClick && "cursor-pointer transform transition-all hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
