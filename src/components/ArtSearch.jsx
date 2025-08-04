import React, { useState, useEffect } from 'react'
import { Search, ExternalLink, Loader, AlertCircle, Heart, ChevronDown } from 'lucide-react'

const ArtSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showAllResults, setShowAllResults] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [saveNotification, setSaveNotification] = useState('')

  // Load favorites and view state from localStorage on component mount
  useEffect(() => {
    console.log('🔄 Component mounted, loading from localStorage...')
    
    // Load favorites
    const savedFavorites = localStorage.getItem('artSearchFavorites')
    console.log('🔍 Raw savedFavorites from localStorage:', savedFavorites)
    
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        console.log('✅ Successfully parsed favorites:', parsedFavorites)
        setFavorites(parsedFavorites)
        console.log('✅ Loaded favorites from localStorage:', parsedFavorites.length, 'items')
        console.log('📋 Favorites loaded:', parsedFavorites)
      } catch (error) {
        console.error('❌ Error loading favorites from localStorage:', error)
        console.error('❌ Raw data that caused error:', savedFavorites)
        localStorage.removeItem('artSearchFavorites') // Clear corrupted data
      }
    } else {
      console.log('📝 No saved favorites found in localStorage')
    }

    // Load favorites view state
    const savedShowFavorites = localStorage.getItem('artSearchShowFavorites')
    console.log('🔍 Raw savedShowFavorites from localStorage:', savedShowFavorites)
    
    if (savedShowFavorites) {
      try {
        const parsedShowFavorites = JSON.parse(savedShowFavorites)
        setShowFavorites(parsedShowFavorites)
        console.log('📱 Loaded favorites view state:', parsedShowFavorites)
      } catch (error) {
        console.error('❌ Error loading favorites view state from localStorage:', error)
        localStorage.removeItem('artSearchShowFavorites') // Clear corrupted data
      }
    } else {
      console.log('📝 No saved favorites view state found in localStorage')
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length === 0) {
      console.log('📝 Skipping save - favorites array is empty')
      return
    }
    
    try {
      const favoritesToSave = JSON.stringify(favorites)
      console.log('💾 About to save favorites to localStorage:', favoritesToSave)
      localStorage.setItem('artSearchFavorites', favoritesToSave)
      console.log('✅ Successfully saved favorites to localStorage:', favorites.length, 'items')
      console.log('📋 Favorites saved:', favorites)
      
      // Verify the save worked
      const verifySave = localStorage.getItem('artSearchFavorites')
      console.log('🔍 Verification - what was actually saved:', verifySave)
    } catch (error) {
      console.error('❌ Error saving favorites to localStorage:', error)
    }
  }, [favorites])

  // Save favorites view state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('artSearchShowFavorites', JSON.stringify(showFavorites))
      console.log('💾 Saved favorites view state to localStorage:', showFavorites)
    } catch (error) {
      console.error('❌ Error saving favorites view state to localStorage:', error)
    }
  }, [showFavorites])

  // Google Custom Search API configuration
  const GOOGLE_API_KEY = 'AIzaSyAzuyvI1-sbccTCkRfOtIzEubjhBbtNfNI'
  const SEARCH_ENGINE_ID = '51cac77ad21b54a49'

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setSearchResults([])
    setShowFavorites(false) // Exit favorites view when searching

    try {
      // Generate curated art-focused results instead of API calls
      const results = generateArtSearchResults(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const generateArtSearchResults = (query) => {
    const lowerQuery = query.toLowerCase()
    
    // Create art-focused search results based on the query
    const artResults = [
      {
        title: `${query} - Art Techniques & Tutorials`,
        snippet: `Discover professional ${query} techniques used by master artists. Learn step-by-step methods and tips for improving your artistic skills.`,
        url: `https://www.artstation.com/search?q=${encodeURIComponent(query)}`,
        displayLink: 'artstation.com'
      },
      {
        title: `${query} in Art History`,
        snippet: `Explore how ${query} has influenced art throughout history. From classical to contemporary, see how artists have interpreted this concept.`,
        url: `https://www.metmuseum.org/search-results?q=${encodeURIComponent(query)}`,
        displayLink: 'metmuseum.org'
      },
      {
        title: `Famous Artists and ${query}`,
        snippet: `Discover how renowned artists have incorporated ${query} into their masterpieces. Study their techniques and artistic vision.`,
        url: `https://www.artsy.net/search?q=${encodeURIComponent(query)}`,
        displayLink: 'artsy.net'
      },
      {
        title: `${query} - Digital Art Tutorials`,
        snippet: `Master ${query} in digital art with comprehensive tutorials. Perfect for digital artists and illustrators.`,
        url: `https://www.behance.net/search/projects?search=${encodeURIComponent(query)}`,
        displayLink: 'behance.net'
      },
      {
        title: `${query} - Art Gallery Collections`,
        snippet: `Browse curated collections featuring ${query} from world-renowned galleries and museums.`,
        url: `https://www.guggenheim.org/search?q=${encodeURIComponent(query)}`,
        displayLink: 'guggenheim.org'
      }
    ]

    // Add some variety based on query type
    if (lowerQuery.includes('pose') || lowerQuery.includes('figure')) {
      artResults.push({
        title: `${query} - Figure Drawing References`,
        snippet: `Professional figure drawing references and pose libraries for artists. Perfect for anatomy studies and character design.`,
        url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
        displayLink: 'pinterest.com'
      })
    }

    if (lowerQuery.includes('color') || lowerQuery.includes('palette')) {
      artResults.push({
        title: `${query} - Color Theory Guide`,
        snippet: `Comprehensive color theory resources and palette creation tools for artists. Learn about color harmony and composition.`,
        url: `https://coolors.co/search?q=${encodeURIComponent(query)}`,
        displayLink: 'coolors.co'
      })
    }

    return artResults
  }

  const toggleFavorite = (result) => {
    const isFavorite = favorites.some(fav => fav.url === result.url)
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.url !== result.url)
      setFavorites(newFavorites)
      setSaveNotification('Removed from favorites!')
      console.log('🗑️ Removed from favorites:', result.title)
      console.log('📊 Total favorites now:', newFavorites.length)
    } else {
      const newFavorites = [...favorites, result]
      setFavorites(newFavorites)
      setSaveNotification('Added to favorites!')
      console.log('❤️ Added to favorites:', result.title)
      console.log('📊 Total favorites now:', newFavorites.length)
    }
    
    // Clear notification after 2 seconds
    setTimeout(() => setSaveNotification(''), 2000)
  }

  const isFavorite = (result) => {
    return favorites.some(fav => fav.url === result.url)
  }

  const displayedResults = showAllResults ? searchResults : searchResults.slice(0, 3)
  const hasMoreResults = searchResults.length > 3

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="max-w-2xl mx-auto">
          {showFavorites && (
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Viewing Your Favorites</span>
              </div>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder={showFavorites ? "Search will return to favorites view..." : "Search for art techniques, poses, color palettes..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
            >
              {isSearching ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Notification */}
      {saveNotification && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-500 fill-current" />
              <p className="text-green-600 font-medium">{saveNotification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching art resources...</p>
        </div>
      )}

              {/* Search Results */}
        {!isSearching && searchResults.length > 0 && !showFavorites && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Search Results for "{searchQuery}"
              </h2>
              {favorites.length > 0 && (
                <button
                  onClick={() => {
                    console.log('View Favorites clicked. Current showFavorites:', showFavorites)
                    setShowFavorites(true)
                    console.log('Setting showFavorites to: true')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Your Favorites ({favorites.length})</span>
                </button>
              )}
            </div>
            
            {/* Search Results */}
            <div className="grid gap-4">
              {displayedResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors line-clamp-2"
                      >
                        {result.title}
                      </a>
                      <p className="text-sm text-gray-500 mt-1 mb-3">
                        {result.displayLink}
                      </p>
                      <p className="text-gray-700 line-clamp-3">
                        {result.snippet}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleFavorite(result)}
                        className={`transition-colors ${
                          isFavorite(result) 
                            ? 'text-red-500 hover:text-red-700' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={isFavorite(result) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(result) ? 'fill-current' : ''}`} />
                      </button>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tap for More Button */}
            {hasMoreResults && !showAllResults && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllResults(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <span>Tap for More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dedicated Favorites Section */}
        {showFavorites && (
          <div className="space-y-4">
            {console.log('Rendering favorites section. showFavorites:', showFavorites, 'favorites count:', favorites.length)}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
                Your Favorites
              </h2>
              <button
                onClick={() => {
                  setShowFavorites(false)
                  setSearchResults([])
                  setSearchQuery('')
                  setShowAllResults(false)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Search
              </button>
            </div>
            
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Favorites Yet</h3>
                <p className="text-gray-600">Search for art resources and click the heart to add them to your favorites!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {favorites.map((result, index) => (
                  <div
                    key={`fav-${index}`}
                    className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors line-clamp-2"
                        >
                          {result.title}
                        </a>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                          {result.displayLink}
                        </p>
                        <p className="text-gray-700 line-clamp-3">
                          {result.snippet}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleFavorite(result)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Remove from favorites"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* No Results */}
      {!isSearching && searchQuery && searchResults.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600">Try searching for different art-related terms.</p>
        </div>
      )}

      {/* Default State */}
      {!isSearching && searchResults.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Art Search</h3>
          <p className="text-gray-600 mb-6">Search for art techniques, poses, color palettes, and more.</p>
          
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">You have {favorites.length} favorited items</p>
                    <p className="text-xs text-gray-500">Click to view your saved art resources • Auto-saved</p>
                  </div>
                  <button
                    onClick={() => setShowFavorites(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Your Favorites</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Art Techniques</h4>
              <p className="text-sm text-gray-600">"oil painting", "watercolor", "digital art"</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Poses & Composition</h4>
              <p className="text-sm text-gray-600">"dynamic poses", "figure drawing", "composition"</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-1">Color & Style</h4>
              <p className="text-sm text-gray-600">"color palettes", "art styles", "lighting"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtSearch 