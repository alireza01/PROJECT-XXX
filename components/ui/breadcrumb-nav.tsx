import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && <ChevronLeft className="h-4 w-4 mx-2" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
} 