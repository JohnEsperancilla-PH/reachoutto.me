"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Download, QrCode, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  profileUrl: string
  username: string
}

export function QRCodeGenerator({ profileUrl, username }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [customText, setCustomText] = useState(`Visit ${username}'s Profile`)
  const [includeText, setIncludeText] = useState(true)
  const [qrSize, setQrSize] = useState(300)
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateQRCode = async () => {
    setLoading(true)
    try {
      // Generate QR code with custom styling
      const qrOptions = {
        width: qrSize,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: 'M' as const
      }

      const qrDataUrl = await QRCode.toDataURL(profileUrl, qrOptions)
      
      if (includeText) {
        // Create canvas to add custom text below QR code
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // Set canvas size (QR code + text area)
        canvas.width = qrSize
        canvas.height = qrSize + 60
        
        // Fill background
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Load QR code image
        const qrImage = new Image()
        qrImage.onload = () => {
          // Draw QR code
          ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)
          
          // Add text with Grotesque font
          ctx.fillStyle = foregroundColor
          ctx.font = '16px "Bricolage Grotesque", Arial, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(customText, qrSize / 2, qrSize + 35)
          
          setQrCodeUrl(canvas.toDataURL())
        }
        qrImage.src = qrDataUrl
      } else {
        setQrCodeUrl(qrDataUrl)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [profileUrl, qrSize, foregroundColor, backgroundColor, includeText, customText])

  const downloadQR = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.download = `${username}-qr-code.png`
    link.href = qrCodeUrl
    link.click()
  }

  const copyQRCode = async () => {
    if (!qrCodeUrl) return
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy QR code:', error)
      // Fallback: copy the profile URL
      try {
        await navigator.clipboard.writeText(profileUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Failed to copy URL:', fallbackError)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate a QR code for your profile that people can scan to visit your page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Preview */}
        <div className="flex justify-center">
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="border rounded-lg shadow-sm"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button onClick={downloadQR} disabled={!qrCodeUrl || loading}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={copyQRCode} disabled={!qrCodeUrl || loading}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Customization Options */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Customization</h4>
          
          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="qr-size">Size: {qrSize}px</Label>
            <input
              id="qr-size"
              type="range"
              min="200"
              max="500"
              step="50"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fg-color">QR Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="fg-color"
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Text Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-text">Include custom text</Label>
              <Switch
                id="include-text"
                checked={includeText}
                onCheckedChange={setIncludeText}
              />
            </div>
            {includeText && (
              <div className="space-y-2">
                <Label htmlFor="custom-text">Custom text</Label>
                <Input
                  id="custom-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter text to display below QR code"
                />
              </div>
            )}
          </div>
        </div>

        {/* Profile URL Display */}
        <div className="space-y-2 pt-4 border-t">
          <Label>QR Code links to:</Label>
          <div className="bg-muted p-3 rounded-lg">
            <code className="text-sm break-all">{profileUrl}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
