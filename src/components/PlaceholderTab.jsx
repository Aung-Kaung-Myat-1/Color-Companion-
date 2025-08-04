import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock } from 'lucide-react'

const PlaceholderTab = ({ title, description, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mb-4"
        >
          <BookOpen className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-gray-500" />
          <h3 className="text-2xl font-semibold text-gray-900">Coming Soon</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          This feature is currently under development. Check back soon for exciting new functionality!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
          {colors.slice(0, 4).map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 shadow-md opacity-50"
            >
              <div
                className="w-12 h-12 rounded-lg mx-auto mb-2 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs font-mono text-gray-600">{color.hex}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default PlaceholderTab 