"use client"

import { useEffect, useRef } from 'react'

interface BuyMeCoffeeProps {
  className?: string
}

export function BuyMeCoffee({ className = "" }: BuyMeCoffeeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create the script element
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js')
    script.setAttribute('data-name', 'bmc-button')
    script.setAttribute('data-slug', 'johnesperancilla')
    script.setAttribute('data-color', '#FFDD00')
    script.setAttribute('data-emoji', '')
    script.setAttribute('data-font', 'Cookie')
    script.setAttribute('data-text', 'Buy me a coffee')
    script.setAttribute('data-outline-color', '#000000')
    script.setAttribute('data-font-color', '#000000')
    script.setAttribute('data-coffee-color', '#ffffff')

    // Append script to the container
    containerRef.current.appendChild(script)

    // Cleanup function
    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      // Also remove any BMC buttons that might have been created
      const bmcButtons = document.querySelectorAll('#bmc-wbtn')
      bmcButtons.forEach(button => button.remove())
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
