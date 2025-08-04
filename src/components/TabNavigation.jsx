import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Palette, Sparkles, BookOpen } from 'lucide-react'

const TabNavigation = ({ activeTab, setActiveTab, hasUploadedImage }) => {
  const tabs = [
    {
      id: 'upload',
      name: 'Upload Art',
      icon: Upload,
      description: 'Upload your artwork to get started'
    },
    {
      id: 'references',
      name: 'References',
      icon: BookOpen,
      description: 'Art reference and search tools',
      disabled: false // References tab is always accessible
    },
    {
      id: 'palette',
      name: 'Color Palette',
      icon: Palette,
      description: 'View extracted colors, hex codes, and harmony suggestions',
      disabled: !hasUploadedImage
    },
    {
      id: 'inspiration',
      name: 'Inspiration',
      icon: Sparkles,
      description: 'Get inspired by color combinations',
      disabled: !hasUploadedImage
    }
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled

          return (
            <motion.button
              key={tab.id}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => {
                if (!isDisabled) {
                  setActiveTab(tab.id)
                  // Smooth scroll to top when switching tabs
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              disabled={isDisabled}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary-600 text-white shadow-md'
                : isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 hover:shadow-md'
            }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation 