"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode, Download, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

interface ProfileQRCodeProps {
  profileUrl: string
  username: string
  className?: string
  customTheme?: boolean
}

export function ProfileQRCode({ profileUrl, username, className = "", customTheme = false }: ProfileQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        })
        setQrCodeUrl(qrDataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [profileUrl])

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
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      
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
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 ${
              customTheme 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm' 
                : ''
            }`}
          >
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code for {username}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center p-6 bg-white rounded-lg border">
              {qrCodeUrl && (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-64 h-64"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to visit the profile
            </p>
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={downloadQR} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={copyQRCode} className="flex-1">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
