"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  disabled?: boolean
  className?: string
}

export function ThemeToggle({ disabled = false, className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
    
    setTheme(initialTheme)
    updateTheme(initialTheme)
  }, [])

  const updateTheme = (newTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  const toggleTheme = () => {
    if (disabled) return
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateTheme(newTheme)
  }

  if (disabled) {
    return null // Hide the toggle when disabled
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative ${className || ''}`}
      disabled={disabled}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
