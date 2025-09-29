"use client"

import { useState, useEffect } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc = "/placeholder-bus.jpg"
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  useEffect(() => {
    setImageSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      />
    </div>
  )
}
