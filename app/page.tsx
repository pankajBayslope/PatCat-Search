// app/page.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SearchHeader from "@/components/search-header"
import SearchInput from "@/components/search-input"
import ResultsDisplay from "@/components/results-display"
import Footer from "@/components/footer"
import AnalyticsModal from "@/components/analytics-modal"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"   // ← YE NAYA ADD KIYA

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setHasSearched(true)
    setResults([])
    setKeywords([])
    setShowAnalytics(false)

    try {
      const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setKeywords(data.keywords)
      setTotalResults(data.total)

      const formatted = data.results.map((p: any) => ({
        id: p["Patent Number"] || p["Patent_Number"],
        number: p["Patent Number"] || p["Patent_Number"],
        title: p["Title"],
        abstract: p["Abstract"],
        domain: p["Industry Domain"] || p["Industry_Domain"],
        technology: p["Technology Area"] || p["Technology_Area"],
        subTechnology: p["Sub-Technology Area"] || p["Sub_Technology_Area"],
        keywords: p["Keywords"]?.split(", ").map((k: string) => k.trim().toLowerCase()) || []
      }))

      setResults(formatted)
    } catch (err) {
      console.error(err)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // ← YE NAYA FUNCTION ADD KIYA (Excel Download)
  const downloadExcel = () => {
    const excelData = results.map((patent, index) => ({
      "S.No": index + 1,
      "Patent Number": patent.number,
      "Title": patent.title,
      "Domain": patent.domain,
      "Technology Area": patent.technology,
      "Sub-Technology": patent.subTechnology,
      "Abstract": patent.abstract,
      "Keywords": patent.keywords?.join(", ") || "",
    }))

    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Column width perfect kar diya
    ws["!cols"] = [
      { wch: 6 },   // S.No
      { wch: 16 },  // Patent Number
      { wch: 60 },  // Title
      { wch: 22 },  // Domain
      { wch: 28 },  // Technology Area
      { wch: 35 },  // Sub-Technology
      { wch: 90 },  // Abstract
      { wch: 50 },  // Keywords
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Patents")
    
    const fileName = searchQuery 
      ? `${searchQuery.replace(/[^a-zA-Z0-9]/g, "_")}_patents.xlsx`
      : `patent_results_${new Date().toISOString().slice(0,10)}.xlsx`
    
    XLSX.writeFile(wb, fileName)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* VIEW ANALYTICS BUTTON */}
      {results.length > 0 && (
        <div className="fixed left-2 top-10 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
          <Button
            onClick={() => setShowAnalytics(true)}
            size="lg"
            className="rounded-full px-10 py-7 text-xl font-bold shadow-2xl
                       bg-gradient-to-r from-[#492b4e] via-[#10182d] to-[#213e6e]
                       hover:from-[#492b4e] hover:via-[#10182d] hover:to-[#213e6e]
                       text-white transform hover:scale-110 active:scale-95
                       transition-all duration-500 animate-pulse shadow-orange-500/50
                       border-2 border-white/20"
          >
            View Analytics
          </Button>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <SearchHeader />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 py-12 md:py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />

            <motion.div animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 space-y-3">
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    {[0, 0.1, 0.2].map((d, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                        className="w-2 h-2 bg-accent rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-sm">Understanding your query…</span>
                </motion.div>
              )}

              {hasSearched && keywords.length > 0 && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground">
                  Showing results for: <span className="text-accent font-semibold">{keywords.join(", ")}</span>
                </motion.div>
              )}

              {hasSearched && totalResults > 0 && !isLoading && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-lg">Success</span>
                  <span className="text-sm font-medium text-green-400">Found {totalResults} matching patents</span>
                </motion.div>
              )}

              {hasSearched && totalResults === 0 && !isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">
                  No patents found for: {keywords.join(", ")}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* RESULTS */}
        {results.length > 0 && <ResultsDisplay results={results} searchKeywords={keywords} />}

        {/* ← YE NAYA DOWNLOAD BUTTON ADD KIYA */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto my-16 text-center px-4">
            <Button
              onClick={downloadExcel}
              size="lg"
              className="rounded-full px-12 py-8 text-xl font-bold shadow-2xl
                         bg-gradient-to-r from-emerald-600 to-green-700 
                         hover:from-emerald-700 hover:to-green-800
                         text-white transform hover:scale-105 active:scale-95
                         transition-all duration-300 animate-pulse"
            >
              Download All {results.length} Patents as Excel
            </Button>
          </div>
        )}

        <Footer />
      </div>

      {/* ANALYTICS MODAL */}
      <AnalyticsModal 
        results={results} 
        open={showAnalytics} 
        onOpenChange={setShowAnalytics} 
      />
    </main>
  )
}