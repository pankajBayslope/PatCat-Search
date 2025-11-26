// components/analytics-modal.tsx
"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnalyticsDashboard from "./analytics-dashboard"
import { useEffect } from "react"

interface Patent {
  domain: string
  technology: string
  subTechnology: string
  keywords: string[]
}

export default function AnalyticsModal({ 
  results, 
  open, 
  onOpenChange 
}: { 
  results: Patent[]
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => onOpenChange(false)} />

      {/* Main Modal - 90% width, almost full height, centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl shadow-4xl w-full max-w-none"
          style={{ 
            width: "90vw", 
            height: "94vh",
            maxHeight: "94vh"
          }}
        >
          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="absolute right-6 top-6 z-10 rounded-full bg-white/90 hover:bg-white shadow-xl border border-gray-300 hover:scale-110 transition-all"
            size="icon"
          >
            <X className="w-8 h-8" />
          </Button>

          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-3xl">
            <div className="p-8 pt-24 pb-16">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#398AE6] via-[#f05e22] to-[#703412] bg-clip-text text-transparent">
                  Patent Analytics Dashboard
                </h1>
                <p className="text-2xl text-gray-700 mt-6 font-medium">
                  Deep insights from <span className="text-[#f05e22] font-bold">{results.length}</span> processed patents
                </p>
              </div>

              {/* Dashboard Content */}
              <AnalyticsDashboard results={results} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}