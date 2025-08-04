import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Brush, Camera, Heart, Sparkles } from 'lucide-react'
import ArtSearch from './ArtSearch'

const ReferenceTab = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Reference Library</h1>
          <p className="text-lg text-gray-600">Search the web for art techniques, artists, movements, and inspiration</p>
        </div>

        {/* ArtSearch Component */}
        <ArtSearch />

        {/* Art Categories Info */}
        <div className="mt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Brush className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Art Techniques</h4>
              <p className="text-sm text-gray-600">Learn painting methods, brush strokes, and artistic processes</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Heart className="w-8 h-8 text-red-500 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Famous Artists</h4>
              <p className="text-sm text-gray-600">Explore the works and lives of master artists</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Camera className="w-8 h-8 text-green-500 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Art Tutorials</h4>
              <p className="text-sm text-gray-600">Step-by-step guides and instructional content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferenceTab 