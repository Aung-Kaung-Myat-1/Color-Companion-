import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, Image, FileImage } from 'lucide-react'

const ImageUpload = ({ onImageUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (file.type.startsWith('image/')) {
        onImageUpload(file)
      }
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  })

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`upload-zone ${isDragActive ? 'dragover' : ''} ${isDragReject ? 'border-red-400 bg-red-50' : ''}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center"
          >
            {isDragActive ? (
              <FileImage className="w-8 h-8 text-primary-600" />
            ) : (
              <Upload className="w-8 h-8 text-primary-600" />
            )}
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isDragActive ? 'Drop your artwork here' : 'Upload your artwork'}
          </h3>
          <p className="text-gray-600">
            {isDragActive 
              ? 'Release to analyze colors' 
              : 'Drag & drop an image, or click to browse'
            }
          </p>
        </div>

        {!isDragActive && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Choose File
          </motion.button>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>Supported formats: JPEG, PNG, GIF, BMP, WebP</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImageUpload 