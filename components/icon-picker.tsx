"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"

// Common icons that might be useful for links
const commonIcons = [
  "Link",
  "Globe",
  "Twitter",
  "Instagram",
  "Facebook",
  "Youtube",
  "Linkedin",
  "Github",
  "Mail",
  "Phone",
  "Calendar",
  "Music",
  "Video",
  "Image",
  "FileText",
  "Bookmark",
  "Heart",
  "Star",
  "Store",
  "ShoppingBag",
  "Coffee",
  "Camera",
  "Gamepad2",
  "Newspaper",
  "Palette",
  "Code",
  "BookOpen",
  "Rocket",
  "MapPin",
  "Gift",
] as const

type IconName = typeof commonIcons[number]

interface IconPickerProps {
  selectedIcon?: IconName | string
  onChange: (icon: IconName | string) => void
  className?: string
  disabled?: boolean
}

const RECENT_KEY = "reachoutto.me:recent-icons"

export function IconPicker({ selectedIcon, onChange, className, disabled = false }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [recents, setRecents] = React.useState<IconName[]>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecents(JSON.parse(raw))
    } catch {}
  }, [])

  const commit = (name: IconName) => {
    onChange(name)
    setOpen(false)
    // store as recent (dedupe)
    try {
      const next = [name, ...recents.filter((n) => n !== name)].slice(0, 6)
      setRecents(next)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {}
  }

  const IconComponent = selectedIcon && Icons[selectedIcon as keyof typeof Icons]
    ? (Icons[selectedIcon as keyof typeof Icons] as any)
    : Icons.Link

  const filtered = commonIcons.filter((n) => n.toLowerCase().includes(searchQuery.toLowerCase()))

  if (disabled) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("h-8 w-8 border border-input cursor-default", className)}
        title={String(selectedIcon || "Link")}
        disabled
      >
        <IconComponent className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("h-8 w-8 border border-input", className)}
          title={String(selectedIcon || "Link")}
          onClick={(e) => e.stopPropagation()}
        >
          <IconComponent className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <Command>
            <CommandInput
              placeholder="Search icons..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-8"
            />
          </Command>
          
          {recents.length > 0 && searchQuery.length === 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Recent</p>
              <div className="grid grid-cols-8 gap-1">
                {recents.map((name) => {
                  const Icon = Icons[name]
                  return (
                    <button
                      key={`recent-${name}`}
                      onClick={() => commit(name)}
                      className={cn(
                        "h-8 w-8 rounded-md border border-input flex items-center justify-center transition-all hover:bg-accent",
                        selectedIcon === name && "ring-2 ring-primary ring-offset-2"
                      )}
                      title={name}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : "All icons"}
            </p>
            <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              {filtered.map((name) => {
                const Icon = Icons[name]
                return (
                  <button
                    key={name}
                    onClick={() => commit(name)}
                    className={cn(
                      "h-8 w-8 rounded-md border border-input flex items-center justify-center transition-all hover:bg-accent",
                      selectedIcon === name && "ring-2 ring-primary ring-offset-2"
                    )}
                    title={name}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            <span>Choose an icon that represents your link</span>
            <button
              className="underline"
              onClick={() => commit("Link")}
            >
              Reset
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
