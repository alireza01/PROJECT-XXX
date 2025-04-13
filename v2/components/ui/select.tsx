import * as React from "react";
import { Select as BaseSelect } from "@/components/ui/select-base";
import { cn } from "@/lib/utils";

interface SelectProps extends Omit<React.ComponentProps<typeof BaseSelect>, 'ref'> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <BaseSelect
          className={cn(
            "w-full",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </BaseSelect>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select }; 