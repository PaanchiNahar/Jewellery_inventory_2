"use client"

import { useState, useEffect } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface QrScannerProps {
  onScan: (data: string) => void
}

export function QrScanner({ onScan }: QrScannerProps) {
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize scanner only on client side
    if (typeof window !== "undefined" && !scannerInitialized) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false)

      scanner.render(
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          scanner.clear()
        },
        (errorMessage) => {
          // Error callback
          console.error("QR scan error:", errorMessage)
        },
      )

      setScannerInitialized(true)

      // Cleanup function
      return () => {
        if (scanner) {
          scanner.clear().catch((error) => {
            console.error("Failed to clear scanner", error)
          })
        }
      }
    }
  }, [onScan, scannerInitialized])

  return (
    <div className="flex flex-col items-center">
      {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}
      <div id="qr-reader" style={{ width: "100%", maxWidth: "500px" }}></div>
      <p className="text-sm text-muted-foreground mt-2">
        Allow camera access and position the QR code within the frame
      </p>
    </div>
  )
}
