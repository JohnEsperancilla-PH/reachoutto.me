"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Type, RotateCcw } from "lucide-react"

interface FontPickerProps {
  currentFont?: string | null
  useCustomFont: boolean
  onFontChange: (font: string | null, useCustom: boolean) => void
}

// Curated font options including your custom fonts
const FONT_OPTIONS = [
  {
    id: 'bricolage-regular',
    name: 'Bricolage Grotesque',
    fontFamily: '"Bricolage Grotesque", ui-sans-serif, system-ui',
    preview: 'font-bricolage',
    description: 'Clean and modern (Default)'
  },
  {
    id: 'bricolage-condensed',
    name: 'Bricolage Condensed',
    fontFamily: '"Bricolage Grotesque Condensed", ui-sans-serif, system-ui',
    preview: 'font-bricolage-condensed',
    description: 'Space-efficient and elegant'
  },
  {
    id: 'bricolage-semicondensed',
    name: 'Bricolage SemiCondensed',
    fontFamily: '"Bricolage Grotesque SemiCondensed", ui-sans-serif, system-ui',
    preview: 'font-bricolage-semicondensed',
    description: 'Balanced width and readability'
  },
  {
    id: 'system-sans',
    name: 'System Sans',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    preview: 'font-sans',
    description: 'Native system font'
  },
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    preview: 'font-inter',
    description: 'Optimized for screens'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    preview: 'font-serif',
    description: 'Classic serif elegance'
  }
]

export function FontPicker({ currentFont, useCustomFont, onFontChange }: FontPickerProps) {
  const [selectedFont, setSelectedFont] = useState<string | null>(currentFont || null)

  const handleFontSelect = (font: string) => {
    setSelectedFont(font)
    onFontChange(font, true)
  }

  const handleToggleCustom = (enabled: boolean) => {
    if (enabled) {
      // If enabling custom font but no font is selected, use the first one
      const fontToUse = selectedFont || FONT_OPTIONS[0].fontFamily
      setSelectedFont(fontToUse)
      onFontChange(fontToUse, true)
    } else {
      onFontChange(null, false)
    }
  }

  const handleReset = () => {
    setSelectedFont(null)
    onFontChange(null, false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground font-medium px-3">FONT CUSTOMIZATION</span>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <Label htmlFor="use-custom-font" className="font-medium">Custom Font</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Use a custom font family for your profile
          </p>
        </div>
        <Switch
          id="use-custom-font"
          checked={useCustomFont}
          onCheckedChange={handleToggleCustom}
        />
      </div>

      {/* Font Options */}
      {useCustomFont && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Choose Font</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 px-3 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="grid gap-3">
            {FONT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFontSelect(option.fontFamily)}
                className={`relative group rounded-lg p-4 border-2 transition-all hover:scale-[1.02] text-left ${
                  selectedFont === option.fontFamily
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Font Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{option.name}</h3>
                    {selectedFont === option.fontFamily && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  
                  <p 
                    className="text-xl font-medium leading-tight"
                    style={{ fontFamily: option.fontFamily }}
                  >
                    The quick brown fox jumps
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
