import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: any;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    containerClassName,
    labelClassName,
    errorClassName,
    helperTextClassName,
    ...props
  }, ref) => {

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label
            className={cn(
              error && "text-destructive",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
        <textarea
          className={cn(
            "flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-base",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "text-sm",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error?.message && (
          <p className={cn(
            "text-sm font-medium text-destructive italic",
            errorClassName
          )}>
            {error.message}
          </p>
        )}
        {helperText && !error?.message && (
          <p className={cn(
            "text-sm text-muted-foreground",
            helperTextClassName
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }