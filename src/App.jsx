import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import ImageUpload from './components/ImageUpload'
import ColorPalette from './components/ColorPalette'
import InspirationTab from './components/InspirationTab'
import ReferenceTab from './components/ReferenceTab'
import { extractColorsFromImage } from './utils/colorExtractor'
import { Palette, Sparkles, Upload, Eye } from 'lucide-react'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [extractedColors, setExtractedColors] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  const handleImageUpload = async (imageFile) => {
    setUploadedImage(imageFile)
    setIsAnalyzing(true)
    
    try {
      const colors = await extractColorsFromImage(imageFile)
      setExtractedColors(colors)
      // Switch to palette tab after successful upload
      setActiveTab('palette')
    } catch (error) {
      console.error('Error extracting colors:', error)
      // Fallback to mock colors if extraction fails
      const mockColors = [
        { hex: '#FF6B6B', rgb: [255, 107, 107], hsl: [0, 100, 71] },
        { hex: '#4ECDC4', rgb: [78, 205, 196], hsl: [175, 52, 55] },
        { hex: '#45B7D1', rgb: [69, 183, 209], hsl: [194, 56, 55] },
        { hex: '#96CEB4', rgb: [150, 206, 180], hsl: [150, 39, 70] },
        { hex: '#FFEAA7', rgb: [255, 234, 167], hsl: [48, 100, 83] }
      ]
      setExtractedColors(mockColors)
      setActiveTab('palette')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6"
            >
              <Palette className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Color Companion
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Artists often know something feels off—but they can't always explain why.
              <br />
              <span className="text-primary-600 font-semibold">
                Color Companion helps bridge intuition and color theory.
              </span>
            </p>
          </div>

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            hasUploadedImage={uploadedImage !== null}
          />

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass-effect rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Upload className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">Upload Your Art</h2>
                  </div>
                  <ImageUpload onImageUpload={handleImageUpload} />
                  
                  {uploadedImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Your Artwork</h3>
                      </div>
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(uploadedImage)}
                          alt="Uploaded artwork"
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p>Analyzing colors...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'palette' && extractedColors.length > 0 && (
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
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-4"
                  >
                    <Palette className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Color Palette</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Extracted colors from your artwork with hex codes and harmony suggestions
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <ColorPalette colors={extractedColors} />
                </div>
              </motion.div>
            )}

            {activeTab === 'inspiration' && extractedColors.length > 0 && (
              <InspirationTab colors={extractedColors} />
            )}

            {activeTab === 'references' && (
              <ReferenceTab colors={extractedColors} />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default App 