"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const colorOptions = [
  { name: "Default", value: "default" },
  { name: "Slate", value: "bg-slate-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Lime", value: "bg-lime-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Violet", value: "bg-violet-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Fuchsia", value: "bg-fuchsia-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Rose", value: "bg-rose-500" },
] as const

type ColorOption = typeof colorOptions[number]["value"]

interface ColorPickerProps {
  selectedColor: ColorOption
  onChange: (color: ColorOption) => void
  className?: string
  disabled?: boolean
}

export function ColorPicker({ selectedColor, onChange, className, disabled = false }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)

  if (disabled) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 border border-input cursor-default",
          selectedColor !== "default" && selectedColor,
          className
        )}
        title={selectedColor === "default" ? "Default" : selectedColor.replace("bg-", "").replace("-500", "")}
        disabled
      />
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-8 w-8 border border-input",
            selectedColor !== "default" && selectedColor,
            className
          )}
          title={selectedColor === "default" ? "Default" : selectedColor.replace("bg-", "").replace("-500", "")}
          onClick={(e) => e.stopPropagation()}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-7 w-7 rounded-md border border-input transition-shadow",
                color.value !== "default" && color.value,
                color.value === selectedColor && "ring-2 ring-primary ring-offset-2",
                color.value === "default" && "bg-background"
              )}
              onClick={() => {
                onChange(color.value)
                setOpen(false)
              }}
              title={color.name}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Tip: choose a color that matches the brand</span>
          <button
            className="underline"
            onClick={() => {
              onChange("default")
              setOpen(false)
            }}
          >
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
