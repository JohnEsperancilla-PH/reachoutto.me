"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Palette, RotateCcw } from "lucide-react"

interface BackgroundPickerProps {
  currentBackground?: string | null
  useCustomBackground: boolean
  onBackgroundChange: (background: string | null, useCustom: boolean) => void
}

// Curated backgrounds that work well for profiles
const BACKGROUND_OPTIONS = [
  {
    id: 'gradient-blue',
    name: 'Ocean Blue',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'from-blue-400 to-purple-500'
  },
  {
    id: 'gradient-purple',
    name: 'Purple Dream',
    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    preview: 'from-purple-500 to-blue-500'
  },
  {
    id: 'gradient-pink',
    name: 'Sunset Pink',
    background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    preview: 'from-pink-500 to-orange-500'
  },
  {
    id: 'gradient-green',
    name: 'Forest Green',
    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    preview: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'gradient-dark',
    name: 'Dark Elegant',
    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    preview: 'from-gray-800 to-gray-700'
  },
  {
    id: 'gradient-warm',
    name: 'Warm Earth',
    background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    preview: 'from-amber-500 to-red-600'
  }
]

export function BackgroundPicker({ currentBackground, useCustomBackground, onBackgroundChange }: BackgroundPickerProps) {
  const [selectedBackground, setSelectedBackground] = useState<string | null>(currentBackground || null)

  const handleBackgroundSelect = (background: string) => {
    setSelectedBackground(background)
    onBackgroundChange(background, true)
  }

  const handleToggleCustom = (enabled: boolean) => {
    if (enabled) {
      // If enabling custom background but no background is selected, use the first one
      const backgroundToUse = selectedBackground || BACKGROUND_OPTIONS[0].background
      setSelectedBackground(backgroundToUse)
      onBackgroundChange(backgroundToUse, true)
    } else {
      onBackgroundChange(null, false)
    }
  }

  const handleReset = () => {
    setSelectedBackground(null)
    onBackgroundChange(null, false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground font-medium px-3">BACKGROUND CUSTOMIZATION</span>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Warning Alert */}
      <div className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
        <p className="text-orange-800 dark:text-orange-200 text-sm">
          Custom backgrounds will override your theme (light/dark mode) on your public profile. 
          Choose colors that work well with your content.
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <Label htmlFor="use-custom-bg" className="font-medium">Custom Background</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Use a custom background instead of the default theme
          </p>
        </div>
        <Switch
          id="use-custom-bg"
          checked={useCustomBackground}
          onCheckedChange={handleToggleCustom}
        />
      </div>

      {/* Background Options */}
      {useCustomBackground && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Choose Background</Label>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BACKGROUND_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleBackgroundSelect(option.background)}
                className={`relative group rounded-lg p-3 border-2 transition-all hover:scale-105 ${
                  selectedBackground === option.background
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Preview */}
                <div 
                  className={`w-full h-16 rounded-md bg-gradient-to-br ${option.preview} mb-2`}
                  style={{ 
                    background: option.background.includes('gradient') ? option.background : option.background 
                  }}
                />
                
                {/* Name */}
                <p className="text-xs font-medium text-center">{option.name}</p>
                
                {/* Selected Indicator */}
                {selectedBackground === option.background && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <div className="w-2 h-2 bg-current rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
