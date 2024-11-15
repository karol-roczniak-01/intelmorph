import * as React from "react"

import { cn } from "@/lib/utils"
import Image from "next/image";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string | null;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, image, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "sm:grid sm:grid-cols-6 flex flex-col gap-4 rounded-lg border bg-card hover:bg-accent/70 transition cursor-pointer text-card-foreground shadow-sm relative p-4",
        className
      )}
      {...props}
    >
      {image && (
        <div className="relative w-full h-fit rounded-md overflow-hidden aspect-square col-span-2">
          <Image
            src={image}
            fill
            alt="Card cover"
            className="object-cover"
            quality={90}
          />
        </div>
      )}
      <div className="col-span-4 w-full">
        {children}
      </div>
    </div>
  )
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "capitalize font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
