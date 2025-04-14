import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardHeaderProps) {
  return (
    <h3 className={clsx('text-xl font-serif text-dark', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('text-dark/80', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-beige-dark', className)}>
      {children}
    </div>
  );
}
