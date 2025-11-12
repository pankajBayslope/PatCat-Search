"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchInputProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full"
    >
      <div
        className={`relative rounded-lg border-2 transition-all duration-300 ${
          isFocused
            ? "border-accent bg-card glow-pulse shadow-lg shadow-accent/20"
            : "border-primary/30 bg-card/50 hover:border-primary/50"
        }`}
      >
        <div className="flex items-center px-4 py-3 md:py-4">
          <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your query (e.g., Show me patents related to 3D imaging)"
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base md:text-lg"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 md:px-8 rounded-md transition-all duration-200"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
              />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  )
}
