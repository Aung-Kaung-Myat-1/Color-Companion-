import React from 'react'
import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect border-b border-white/20 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Color Companion</h1>
              <p className="text-xs text-gray-500">Art Color Analysis</p>
            </div>
          </motion.div>

          {/* Author Name */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 font-medium">Aung Kaung Myat</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 