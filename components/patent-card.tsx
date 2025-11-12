// frontend/components/patent-card.tsx

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatentCardProps {
  patent: {
    id: string
    number: string
    title: string
    abstract: string
    domain: string
    technology: string
    subTechnology: string
    keywords: string[]
  }
}

export default function PatentCard({ patent }: PatentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-500/20 text-blue-300 border-blue-500/40",
      "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      "bg-violet-500/20 text-violet-300 border-violet-500/40",
      "bg-pink-500/20 text-pink-300 border-pink-500/40",
      "bg-green-500/20 text-green-300 border-green-500/40",
      "bg-orange-500/20 text-orange-300 border-orange-500/40",
      "bg-teal-500/20 text-teal-300 border-teal-500/40",
    ]
    return colors[index % colors.length]
  }

  const truncateAbstract = (text: string, length = 250) => {
    return text.length > length ? text.substring(0, length) + "..." : text
  }

  // Helper to split multi-value fields
  const splitValues = (str: string) => {
    return str
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s)
  }

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="relative bg-card border border-primary/20 rounded-lg p-6 md:p-7 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">

        {/* Patent Number */}
        <div className="mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-gradient-to-r from-accent to-primary px-3 py-1 rounded-md text-xs font-semibold text-accent-foreground"
          >
            Patent: {patent.number}
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-5 leading-tight">
          {patent.title}
        </h3>

        {/* Industry Domain */}
        <div className="mb-4">
          <p className="font-semibold text-accent text-sm mb-2">Industry Domain:</p>
          <div className="flex flex-wrap gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(0)}`}
            >
              {patent.domain || "N/A"}
            </motion.div>
          </div>
        </div>

        {/* Technology Area */}
        <div className="mb-4">
          <p className="font-semibold text-accent text-sm mb-2">Technology Area:</p>
          <div className="flex flex-wrap gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(1)}`}
            >
              {patent.technology || "N/A"}
            </motion.div>
          </div>
        </div>

        {/* Sub-Technology Area */}
        <div className="mb-4">
          <p className="font-semibold text-accent text-sm mb-2">Sub-Technology:</p>
          <div className="flex flex-wrap gap-2">
            {splitValues(patent.subTechnology).map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(index + 2)}`}
              >
                {tech}
              </motion.div>
            ))}
            {splitValues(patent.subTechnology).length === 0 && (
              <span className="text-muted-foreground text-xs">N/A</span>
            )}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-5">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {isExpanded ? patent.abstract : truncateAbstract(patent.abstract)}
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <p className="font-semibold text-accent text-sm mb-2">Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {patent.keywords.length > 0 ? (
              patent.keywords.map((keyword, index) => (
                <motion.div
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(index + 5)}`}
                >
                  {keyword}
                </motion.div>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">No keywords</span>
            )}
          </div>
        </div>

        {/* Show More */}
        {patent.abstract.length > 250 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-accent/80 gap-1 px-0"
          >
            {isExpanded ? "Show less" : "Show more"}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>
        )}
      </div>
    </motion.div>
  )
}