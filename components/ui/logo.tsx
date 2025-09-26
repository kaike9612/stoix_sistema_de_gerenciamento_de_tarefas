"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="/images/stoix-logo.jpg"
          alt="Stoix"
          width={size === "lg" ? 48 : size === "md" ? 32 : 24}
          height={size === "lg" ? 48 : size === "md" ? 32 : 24}
          className="rounded-lg object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-semibold text-foreground",
            size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm",
          )}
        >
          Stoix
        </span>
        {size !== "sm" && <span className="text-xs text-muted-foreground -mt-1">Task Manager</span>}
      </div>
    </div>
  )
}
