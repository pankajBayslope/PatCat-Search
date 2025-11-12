// frontend/app/page.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SearchHeader from "@/components/search-header"
import SearchInput from "@/components/search-input"
import ResultsDisplay from "@/components/results-display"
import Footer from "@/components/footer"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setHasSearched(true)
    setResults([])
    setKeywords([])

    try {
      const res = await fetch("https://pat-cat-backend-search.vercel.app/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setKeywords(data.keywords)
      setTotalResults(data.total)

      // Map backend fields to frontend
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

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

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

        {results.length > 0 && <ResultsDisplay results={results} />}
        <Footer />
      </div>
    </main>
  )
}