"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { PortfolioItem } from "@/lib/types/database"

interface PortfolioCardProps {
  item: PortfolioItem
  onEdit?: (item: PortfolioItem) => void
  showControls?: boolean
  className?: string
  isBeingEdited?: boolean
  customTheme?: boolean // New prop to indicate custom background theme
}

export default function PortfolioCard({ 
  item, 
  onEdit, 
  showControls = false, 
  className = "",
  isBeingEdited = false,
  customTheme = false
}: PortfolioCardProps) {
  const handleClick = () => {
    if (item.project_url && !showControls) {
      const fullUrl = item.project_url.startsWith("http") ? item.project_url : `https://${item.project_url}`
      window.open(fullUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(item)
    }
  }

  return (
    <Card 
      className={`group transition-all duration-200 hover:shadow-lg ${
        customTheme ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:border-white/40' : ''
      } ${
        showControls 
          ? "cursor-default" 
          : item.project_url 
            ? "cursor-pointer hover:scale-[1.02]" 
            : "cursor-default"
      } ${isBeingEdited ? "ring-2 ring-primary" : ""} ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-5">
          {/* Image */}
          {item.image_url ? (
            <div className="relative w-full h-52 bg-muted rounded-lg overflow-hidden mt-2">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-52 bg-muted rounded-lg flex items-center justify-center mt-2">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          
          {/* Content */}
          <div className="space-y-3 min-h-[120px] flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className={`font-semibold text-base leading-tight line-clamp-2 flex-1 pr-2 ${customTheme ? 'text-white' : ''}`}>
                {item.title}
              </h3>
              
              {showControls && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {item.description && (
              <p className={`text-sm line-clamp-3 leading-relaxed flex-1 ${customTheme ? 'text-white/80' : 'text-muted-foreground'}`}>
                {item.description}
              </p>
            )}
            
            {item.project_url && !showControls && (
              <div className={`flex items-center gap-2 text-sm font-medium mt-auto ${customTheme ? 'text-white' : 'text-primary'}`}>
                <ExternalLink className="h-4 w-4" />
                <span>View Project</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
