import * as React from "react";
import { Textarea as BaseTextarea } from "@/components/ui/textarea-base";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<typeof BaseTextarea> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <BaseTextarea
          className={cn(
            "w-full",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; 