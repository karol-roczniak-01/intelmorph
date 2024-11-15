import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"
import { Upload } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: any;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  fileName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    label,
    error,
    helperText,
    containerClassName,
    labelClassName,
    errorClassName,
    helperTextClassName,
    fileName,
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
        
        {type === 'file' ? (
          <div className="relative">
            <div className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
              " transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              error && "border-destructive focus-within:ring-destructive",
              className
            )}>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="text-sm">
                  {fileName || "Choose file"}
                </span>
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                ref={ref}
                {...props}
              />
            </div>
          </div>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "text-sm",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
        
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

Input.displayName = "Input"

export { Input }