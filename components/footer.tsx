"use client"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="border-t border-primary/20 py-8 px-4 mt-auto"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">Powered by BBS PVT LTD.</p>
      </div>
    </motion.footer>
  )
}
