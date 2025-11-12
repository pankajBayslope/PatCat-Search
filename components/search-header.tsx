"use client"
import { motion } from "framer-motion"

export default function SearchHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-12 md:pt-24 pb-8 text-center px-4"
    >
      <motion.h1
        className="text-5xl md:text-7xl font-bold mb-6 text-foreground text-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        PatCat Search
      </motion.h1>
      <motion.p
        className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        PatCat (Patent + Categorization) Search with intelligence.
      </motion.p>
    </motion.header>
  )
}
