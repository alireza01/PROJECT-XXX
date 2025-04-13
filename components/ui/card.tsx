import { ReactNode, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export default function Card({ children, className, hover = true, animate = false }: CardProps) {
  const classes = clsx(
    'bg-white rounded-2xl shadow-card p-6',
    hover && 'transition-all duration-300 hover:shadow-card-hover',
    animate && 'animate-fade-in',
    className
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
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
