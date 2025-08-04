import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Sparkles, Lightbulb, Palette, TrendingUp, Plus, X } from 'lucide-react'

const ColorPalette = ({ colors }) => {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('complementary')
  const [additionalColors, setAdditionalColors] = useState({
    complementary: [],
    analogous: [],
    triadic: [],
    monochromatic: []
  })

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Helper function to convert HSL to Hex
  const hslToHex = (h, s, l) => {
    s /= 100
    l /= 100
    
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
    let r = 0, g = 0, b = 0
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }
    
    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Generate harmony suggestions based on actual extracted colors
  const generateHarmonySuggestions = (baseColors) => {
    if (!baseColors || baseColors.length === 0) return {}
    
    const harmonies = {
      complementary: [],
      analogous: [],
      triadic: [],
      monochromatic: []
    }
    
    // Generate harmonies for each extracted color
    baseColors.forEach((color, index) => {
      const [h, s, l] = color.hsl
      
      // Complementary color (opposite on color wheel)
      const complementaryHue = (h + 180) % 360
      harmonies.complementary.push({
        hex: hslToHex(complementaryHue, s, l),
        name: `Complement ${index + 1}`,
        originalColor: color.hex
      })
      
      // Analogous colors (adjacent on color wheel)
      const analogous1 = {
        hex: hslToHex((h + 30) % 360, s, l),
        name: `Analogous ${index + 1}-1`,
        originalColor: color.hex
      }
      const analogous2 = {
        hex: hslToHex((h - 30 + 360) % 360, s, l),
        name: `Analogous ${index + 1}-2`,
        originalColor: color.hex
      }
      harmonies.analogous.push(analogous1, analogous2)
      
      // Triadic colors (120° apart)
      const triadic1 = {
        hex: hslToHex((h + 120) % 360, s, l),
        name: `Triadic ${index + 1}-1`,
        originalColor: color.hex
      }
      const triadic2 = {
        hex: hslToHex((h + 240) % 360, s, l),
        name: `Triadic ${index + 1}-2`,
        originalColor: color.hex
      }
      harmonies.triadic.push(triadic1, triadic2)
      
      // Monochromatic variations
      const monochrome1 = {
        hex: hslToHex(h, s, Math.max(0, l - 20)),
        name: `Darker ${index + 1}`,
        originalColor: color.hex
      }
      const monochrome2 = {
        hex: hslToHex(h, s, Math.min(100, l + 20)),
        name: `Lighter ${index + 1}`,
        originalColor: color.hex
      }
      harmonies.monochromatic.push(monochrome1, monochrome2)
    })
    
    return harmonies
  }
  
  const harmonyTypes = generateHarmonySuggestions(colors)

  const getHarmonyColors = () => {
    const harmonies = generateHarmonySuggestions(colors)
    const baseColors = harmonies[activeTab] || []
    const extraColors = additionalColors[activeTab] || []
    return [...baseColors, ...extraColors]
  }

  const addNewColor = () => {
    if (!colors || colors.length === 0) return
    
    // Use the first extracted color as base for new harmonies
    const primaryColor = colors[0]
    const [h, s, l] = primaryColor.hsl
    
    let newColor
    const currentCount = getHarmonyColors().length
    
    switch (activeTab) {
      case 'complementary':
        // Add split complementary variations
        const angles = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        const angle = angles[currentCount % angles.length]
        newColor = {
          hex: hslToHex((h + angle) % 360, s, l),
          name: `Complement ${currentCount + 1}`,
          originalColor: primaryColor.hex
        }
        break
        
      case 'analogous':
        // Add more analogous colors
        const analogousAngles = [45, 60, 75, 90, 105, 120, 135, 150, 165, 180]
        const analogousAngle = analogousAngles[currentCount % analogousAngles.length]
        newColor = {
          hex: hslToHex((h + analogousAngle) % 360, s, l),
          name: `Analogous ${currentCount + 1}`,
          originalColor: primaryColor.hex
        }
        break
        
      case 'triadic':
        // Add more triadic variations
        const triadicAngles = [60, 120, 180, 240, 300]
        const triadicAngle = triadicAngles[currentCount % triadicAngles.length]
        newColor = {
          hex: hslToHex((h + triadicAngle) % 360, s, l),
          name: `Triadic ${currentCount + 1}`,
          originalColor: primaryColor.hex
        }
        break
        
      case 'monochromatic':
        // Add more monochromatic variations
        const lightnessVariations = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        const saturationVariations = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        const variation = currentCount % 9
        const newL = Math.max(0, Math.min(100, l + (variation - 4) * 10))
        const newS = Math.max(0, Math.min(100, s + (variation - 4) * 10))
        newColor = {
          hex: hslToHex(h, newS, newL),
          name: `Mono ${currentCount + 1}`,
          originalColor: primaryColor.hex
        }
        break
        
      default:
        return
    }
    
    setAdditionalColors(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newColor]
    }))
  }

  const deleteColor = (indexToDelete) => {
    const harmonies = generateHarmonySuggestions(colors)
    const baseColorsCount = harmonies[activeTab]?.length || 0
    
    // If it's a base color, we can't delete it
    if (indexToDelete < baseColorsCount) return
    
    // Calculate the index in the additional colors array
    const additionalIndex = indexToDelete - baseColorsCount
    
    setAdditionalColors(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, index) => index !== additionalIndex)
    }))
  }

  return (
    <div className="space-y-6">
      {/* All Hex Codes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">All Hex Codes</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-lg p-4 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => copyToClipboard(color.hex, index)}
            >
              <div
                className="w-16 h-16 rounded-lg mx-auto mb-3 shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-base font-mono font-bold text-gray-900">{color.hex}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Color Theory Harmony Suggestions */}
      {colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="space-y-4"
        >
          {/* Harmony Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'complementary', title: 'Complementary', description: 'Colors opposite on the color wheel for high contrast' },
              { key: 'analogous', title: 'Analogous', description: 'Colors next to each other on the color wheel for harmony' },
              { key: 'triadic', title: 'Triadic', description: 'Three colors equally spaced on the color wheel' },
              { key: 'monochromatic', title: 'Monochromatic', description: 'Different shades and tints of the same color' }
            ].map((type) => (
              <motion.button
                key={type.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(type.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeTab === type.key
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.title}
              </motion.button>
            ))}
          </div>

          {/* Active Harmony Description */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {activeTab === 'complementary' && 'Complementary Harmony'}
                  {activeTab === 'analogous' && 'Analogous Harmony'}
                  {activeTab === 'triadic' && 'Triadic Harmony'}
                  {activeTab === 'monochromatic' && 'Monochromatic Harmony'}
                </h4>
                <p className="text-sm text-gray-600">
                  {activeTab === 'complementary' && 'Colors opposite on the color wheel for high contrast'}
                  {activeTab === 'analogous' && 'Colors next to each other on the color wheel for harmony'}
                  {activeTab === 'triadic' && 'Three colors equally spaced on the color wheel'}
                  {activeTab === 'monochromatic' && 'Different shades and tints of the same color'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Suggested Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">Suggested Colors</h4>
                {additionalColors[activeTab]?.length > 0 && (
                  <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                    +{additionalColors[activeTab].length}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addNewColor}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-full hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="w-3 h-3" />
                Add Color
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {getHarmonyColors().map((color, index) => {
                const harmonies = generateHarmonySuggestions(colors)
                const baseColorsCount = harmonies[activeTab]?.length || 0
                const isAdditionalColor = index >= baseColorsCount
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 relative"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{color.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                    </div>
                    
                    {/* Delete button for additional colors only */}
                    {isAdditionalColor && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteColor(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-all duration-200 z-10"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-gradient-to-r from-accent-50 to-purple-50 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pro Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use complementary colors for high-impact designs</li>
                  <li>• Analogous colors create peaceful, comfortable designs</li>
                  <li>• Triadic harmonies offer vibrant yet balanced palettes</li>
                  <li>• Monochromatic schemes are perfect for elegant, sophisticated looks</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Color Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-gray-50 rounded-lg p-4 space-y-2"
      >
        <h4 className="text-sm font-medium text-gray-900">Palette Analysis</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-600">Colors extracted:</p>
            <p className="font-semibold text-gray-900">{colors.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Dominant hue:</p>
            <p className="font-semibold text-gray-900">
              {colors[0]?.hsl[0] ? `${Math.round(colors[0].hsl[0])}°` : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ColorPalette 