"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin, Fuel, ArrowLeft, Filter, X } from "lucide-react"
import RangeSlider from "@/components/RangeSlider"
import ListingCardSkeleton from "@/components/ListingCardSkeleton"
import ImageWithFallback from "@/components/ImageWithFallback"
import { useDebounce } from "@/hooks/useDebounce"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  brand: string
  model: string
  year: number
  mileage?: number
  fuel?: string
  transmission?: string
  capacity?: number
  location?: string
  whatsapp?: string
  featured: boolean
  createdAt: string
  images: Array<{
    id: string
    url: string
    order: number
  }>
}

interface FilterStats {
  priceRange: {
    min: number
    max: number
  }
  yearRange: {
    min: number
    max: number
  }
  mileageRange: {
    min: number
    max: number
  }
  brands: string[]
  fuels: string[]
  transmissions: string[]
  totalListings: number
}

function ListingsPageContent() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState<FilterStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [searchParamsResolved, setSearchParamsResolved] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: 50000,
    maxPrice: 1000000,
    minYear: 2010,
    maxYear: new Date().getFullYear(),
    minMileage: 0,
    maxMileage: 500000,
    fuel: '',
    transmission: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    featured: false,
  })

  // Initialize with some test data
  useEffect(() => {
    console.log('Component mounted, setting test data')
    setListings([
      {
        id: 'test-1',
        title: 'Mercedes-Benz OF-1721 2019',
        description: 'Ônibus executivo com ar condicionado, 46 lugares',
        price: 285000,
        brand: 'Mercedes-Benz',
        model: 'OF-1721',
        year: 2019,
        mileage: 150000,
        fuel: 'Diesel',
        transmission: 'Manual',
        capacity: 46,
        location: 'São Paulo, SP',
        whatsapp: '+5511999999999',
        featured: true,
        createdAt: new Date().toISOString(),
        images: [{ id: 'img-1', url: 'https://picsum.photos/400/300?random=1', order: 0 }]
      }
    ])
    setLoading(false)
    setStats({
      priceRange: { min: 50000, max: 1000000 },
      yearRange: { min: 2010, max: 2025 },
      mileageRange: { min: 0, max: 500000 },
      brands: ['Mercedes-Benz', 'Volvo', 'Scania'],
      fuels: ['Diesel', 'Gasolina'],
      transmissions: ['Manual', 'Automático'],
      totalListings: 1
    })
      setStatsLoading(false)
    setSearchParamsResolved(true)
  }, [])

  console.log('ListingsPageContent rendered, listings:', listings.length, 'loading:', loading)

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }))
  }

  const handleYearRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minYear: min,
      maxYear: max,
    }))
  }

  const handleMileageRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minMileage: min,
      maxMileage: max,
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const openWhatsApp = (whatsapp: string, title: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '')
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      alert('Número do WhatsApp inválido.')
      return
    }
    const message = `Olá! Tenho interesse no ônibus ${title} que encontrei no BusMarket.`
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (!searchParamsResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Voltar ao início</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Anúncios de Ônibus</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Filtros */}
          <div className="lg:block">
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtros temporariamente desabilitados</p>
            </div>
          </div>

          {/* Lista de Anúncios */}
          <div className="col-span-1 lg:col-span-3">
            {/* Contador de Resultados */}
            <div className="mb-4 lg:mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {listings.length} anúncio{listings.length !== 1 ? 's' : ''} encontrado{listings.length !== 1 ? 's' : ''}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum anúncio encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/70 transition-shadow border border-gray-200 dark:border-slate-700">
                    {/* Imagem */}
                    <div className="relative">
                      {listing.images[0] ? (
                        <ImageWithFallback
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500">Sem imagem</span>
                        </div>
                      )}
                      {listing.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 dark:bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
                          DESTAQUE
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {listing.title}
                      </h3>

                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-500 mb-3">
                        {formatPrice(listing.price)}
                      </p>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <span className="font-medium w-20 text-gray-500 dark:text-gray-500">Ano:</span>
                          <span className="text-gray-900 dark:text-gray-300">{listing.year}</span>
                        </div>

                        {listing.mileage && (
                          <div className="flex items-center">
                            <span className="font-medium w-20 text-gray-500 dark:text-gray-500">KM:</span>
                            <span className="text-gray-900 dark:text-gray-300">{listing.mileage.toLocaleString('pt-BR')}</span>
                          </div>
                        )}

                        {listing.fuel && (
                          <div className="flex items-center">
                            <Fuel className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-500" />
                            <span className="text-gray-900 dark:text-gray-300">{listing.fuel}</span>
                          </div>
                        )}

                        {listing.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-500" />
                            <span className="text-gray-900 dark:text-gray-300">{listing.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
                        >
                          Ver Detalhes
                        </Link>

                        {listing.whatsapp && (
                          <button
                            onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                            className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center font-medium touch-manipulation"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  }
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  )
}
