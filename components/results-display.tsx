// components/results-display.tsx
"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import PatentCard from "./patent-card"
import Pagination from "./pagination"

interface Patent {
  id: string
  number: string
  title: string
  abstract: string
  domain: string
  technology: string
  subTechnology: string
  keywords: string[]
}

interface ResultsDisplayProps {
  results: Patent[]
  searchKeywords: string[]
}

const ITEMS_PER_PAGE = 6

export default function ResultsDisplay({ results, searchKeywords }: ResultsDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedResults = results.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="w-[90%] mx-auto">
          <motion.div className="flex flex-col gap-8">
            {paginatedResults.map((patent, index) => (
              <motion.div
                key={patent.id}
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PatentCard patent={patent} searchKeywords={searchKeywords} />
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}