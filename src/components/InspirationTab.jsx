import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, X, ExternalLink } from 'lucide-react'
import { generateArtworkDatabase, findMatchingArtworks } from '../utils/colorExtractor'

const InspirationTab = ({ colors }) => {
  const [inspirationArtworks, setInspirationArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Generate database and find matches whenever colors change
  useEffect(() => {
    if (colors && colors.length > 0) {
      setIsLoading(true)
      
      const findMatches = async () => {
        try {
          console.log('InspirationTab: Starting match search for new colors...')
          console.log('InspirationTab: Uploaded colors:', colors.map(c => c.hex))
          
          // Generate fresh database for each new image to ensure randomization
          console.log('InspirationTab: Generating fresh database with randomization...')
          const freshDatabase = await generateArtworkDatabase()
          console.log('InspirationTab: Database loaded:', Object.keys(freshDatabase).length, 'artists')
          
          const matches = await findMatchingArtworks(colors, freshDatabase)
          console.log('InspirationTab: Found matches:', matches.length)
          
          setInspirationArtworks(matches)
          console.log('InspirationTab: Set inspiration artworks:', matches)
        } catch (error) {
          console.error('InspirationTab: Error finding matches:', error)
          setInspirationArtworks([])
        } finally {
          setIsLoading(false)
        }
      }
      
      // Add a small delay to prevent too frequent database generation
      setTimeout(findMatches, 100)
    } else {
      console.log('InspirationTab: No colors provided')
      setInspirationArtworks([])
    }
  }, [colors]) // Only depend on colors, not artworkDatabase

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedArtwork(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Inspiration</h1>
            <p className="text-lg text-gray-600">Discover artworks with similar color palettes from master artists throughout history.</p>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding matching artworks...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!inspirationArtworks || inspirationArtworks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Inspiration</h1>
            <p className="text-lg text-gray-600">Discover artworks with similar color palettes from master artists throughout history.</p>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
              <p className="text-gray-600">Try uploading a different image or check back later for more inspiration.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Inspiration</h1>
          <p className="text-lg text-gray-600">Discover artworks with similar color palettes from master artists throughout history.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirationArtworks.map((artwork, index) => (
            <motion.div
              key={`${artwork.artist}-${artwork.artwork}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="relative">
                <img
                  src={artwork.image}
                  alt={`${artwork.artwork} by ${artwork.artist}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Artwork'
                  }}
                />
                
                {/* Color Palette Preview - Show colors from UPLOADED image */}
                <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                  {colors.slice(0, 4).map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded-full shadow-sm border border-white"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{artwork.artwork}</h3>
                <p className="text-sm text-gray-600 mb-2">{artwork.artist}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{artwork.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Image Modal */}
      {showModal && selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden relative"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Image */}
            <div className="relative">
              <img
                src={selectedArtwork.image}
                alt={`${selectedArtwork.artwork} by ${selectedArtwork.artist}`}
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Artwork'
                }}
              />
            </div>
            
            {/* Artwork Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedArtwork.artwork}</h2>
                  <p className="text-lg text-gray-600 mb-1">{selectedArtwork.artist}</p>
                  <p className="text-sm text-gray-500">{selectedArtwork.year} • {selectedArtwork.genre}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                    Color Match
                  </span>
                </div>
              </div>
              
              {/* Color Palette */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Extracted Color Palette</p>
                <div className="flex gap-2">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Colors extracted from your uploaded artwork
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default InspirationTab 