"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tag, ExternalLink, Settings, Trash2 } from "lucide-react"
import type { ShopItem } from "@/lib/types/database"

interface ShopItemCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    image_url: string | null;
    product_url: string | null;
  }
  onEdit?: (item: {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    image_url: string | null;
    product_url: string | null;
  }) => void;
  onDelete?: (item: {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    image_url: string | null;
    product_url: string | null;
  }) => void;
  showControls?: boolean
  className?: string
  isBeingEdited?: boolean
  customTheme?: boolean
}

function ShopItemCard({ 
  item, 
  onEdit, 
  onDelete,
  showControls = false, 
  className, 
  isBeingEdited = false,
  customTheme = false 
}: ShopItemCardProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);

  const handleStartEdit = () => {
    if (onEdit) {
      onEdit(item)
    }
  }

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  // Color mapping for proper Tailwind classes based on theme
  const getColorClasses = () => {
    if (customTheme) {
      return {
        background: "bg-white/10 backdrop-blur-sm border-white/20",
        text: "text-white",
        icon: "text-white",
        border: "hover:border-white/40",
        button: "text-white/70 hover:text-white border-white/20 hover:border-white/40",
        price: "text-white/90"
      }
    }

    return {
      background: "bg-card",
      text: "text-card-foreground",
      icon: "text-muted-foreground",
      border: "border-border hover:border-border/80",
      button: "text-muted-foreground hover:text-foreground border-muted/20 hover:border-border",
      price: "text-foreground"
    }
  }

  const colors = getColorClasses()

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-200 hover:shadow-lg border-2",
          colors.background,
          colors.border,
          isBeingEdited && "ring-2 ring-primary/50",
          className
        )}
      >
        <div className="flex items-start gap-4 p-6">
          <div className="h-24 w-24 relative flex-shrink-0 bg-muted/20 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => item.image_url && setShowImageDialog(true)}
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Tag className={cn("h-10 w-10 opacity-50", colors.icon)} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 py-1">
            <h3 className={cn("font-semibold text-lg mb-2 line-clamp-2", colors.text)}>
              {item.title}
            </h3>
            {item.description && (
              <p className={cn("text-sm line-clamp-3 mb-3", colors.icon)}>
                {item.description}
              </p>
            )}
            {formatPrice(item.price, item.currency) && (
              <div className={cn("text-lg font-bold", colors.price)}>
                {formatPrice(item.price, item.currency)}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {showControls ? (
              <div className="flex items-center gap-2">
                {!isBeingEdited && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStartEdit}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : item.product_url && (
              <a
                href={item.product_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  className={cn(
                    "gap-2",
                    customTheme 
                      ? "bg-white text-black hover:bg-white/90" 
                      : ""
                  )}
                >
                  Buy Now
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
          </DialogHeader>
          {item.image_url && (
            <div className="relative w-full aspect-video">
              <Image
                src={item.image_url}
                alt={item.title || 'Product image'}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ShopItemCard }
export default ShopItemCard