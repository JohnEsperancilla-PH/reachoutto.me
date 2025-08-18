"use client"

import { Button } from "@/components/ui/button"
import { Coffee } from "lucide-react"

interface BuyMeCoffeeButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function BuyMeCoffeeButton({ 
  className = "", 
  variant = "outline",
  size = "sm"
}: BuyMeCoffeeButtonProps) {
  const handleClick = () => {
    window.open('https://www.buymeacoffee.com/johnesperancilla', '_blank')
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      <Coffee className="h-4 w-4" />
      <span className="hidden sm:inline">Buy me a coffee</span>
    </Button>
  )
}
