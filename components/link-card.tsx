"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check, X } from "lucide-react"
import type { Link as LinkType } from "@/lib/types/database"
import { IconPicker } from "@/components/icon-picker"
import { ColorPicker } from "@/components/color-picker"

interface LinkCardProps {
  link: LinkType
  onClick?: () => void
  onEdit?: (link: LinkType) => void
  showControls?: boolean
  className?: string
  isBeingEdited?: boolean
  customTheme?: boolean // New prop to indicate custom background theme
}

export function LinkCard({ link, onClick, onEdit, showControls = false, className, isBeingEdited = false, customTheme = false }: LinkCardProps) {

  const iconName = link.icon || "Link"
  const IconComponent = (Icons[iconName as keyof typeof Icons] ?? Icons.Link) as any
  const currentColor = link.color
  const isDefaultColor = !currentColor || currentColor === "default"

  const handleStartEdit = () => {
    if (onEdit) {
      onEdit(link)
    }
  }

  // Color mapping for proper Tailwind classes
  const getColorClasses = (color: string) => {
    if (customTheme) {
      // For custom background themes, use glass morphism styling
      return {
        background: "bg-white/10 backdrop-blur-sm border-white/20",
        text: "text-white",
        icon: "text-white",
        border: "hover:border-white/40"
      }
    }

    if (!color || color === "default") {
      return {
        background: "",
        text: "text-foreground",
        icon: "text-primary",
        border: "hover:border-primary/20"
      }
    }

    const colorName = color.replace("bg-", "").replace("-500", "")
    return {
      background: `bg-${colorName}-500`,
      text: "text-white",
      icon: "text-white",
      border: `border-${colorName}-500/50 hover:border-${colorName}-500`
    }
  }

  const colors = getColorClasses(currentColor)

  return (
    <Card
      onClick={!isBeingEdited ? onClick : undefined}
      className={cn(
        "group p-0 overflow-hidden transition-all duration-200 hover:shadow-lg border-2",
        colors.background,
        colors.border,
        !isBeingEdited && "cursor-pointer",
        isBeingEdited && "ring-2 ring-primary/50",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <IconComponent className={cn("h-5 w-5", colors.icon)} />
          <div className={cn("font-medium text-sm sm:text-base", colors.text)}>
            {link.title}
          </div>
        </div>

        {showControls ? (
          <div className="flex items-center gap-2">
            {isBeingEdited ? (
              <div className="text-xs text-muted-foreground">
                Edit in form above
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartEdit}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icons.Settings className="h-4 w-4" />
                </Button>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </>
            )}
          </div>
        ) : (
          <ExternalLink className={`h-4 w-4 group-hover:text-primary transition-colors flex-shrink-0 ${customTheme ? 'text-white/70 group-hover:text-white' : 'text-muted-foreground'}`} />
        )}
      </div>
    </Card>
  )
}

export default LinkCard


