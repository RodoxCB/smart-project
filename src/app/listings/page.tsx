"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, MapPin, Fuel, ArrowLeft, Filter, X } from "lucide-react"
import RangeSlider from "@/components/RangeSlider"
import ListingCardSkeleton from "@/components/ListingCardSkeleton"
import SmartFilters from "@/components/SmartFilters"
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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<FilterStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
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

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/listings/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        // Atualizar filtros com os valores reais do banco
        setFilters(prev => ({
          ...prev,
          minPrice: data.priceRange.min,
          maxPrice: data.priceRange.max,
          minYear: data.yearRange.min,
          maxYear: data.yearRange.max,
          minMileage: data.mileageRange.min,
          maxMileage: data.mileageRange.max,
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchListings = useCallback(async () => {
    try {
      let url = '/api/listings'

      // Build query params only if filters have values
      const queryParams = []

      if (filters.search && filters.search.trim()) {
        queryParams.push(`search=${encodeURIComponent(filters.search.trim())}`)
      }
      if (filters.brand && filters.brand.trim()) {
        queryParams.push(`brand=${encodeURIComponent(filters.brand.trim())}`)
      }
      if (filters.minPrice > 0) {
        queryParams.push(`minPrice=${filters.minPrice}`)
      }
      if (filters.maxPrice < 10000000) { // Valor muito alto para indicar "sem limite superior"
        queryParams.push(`maxPrice=${filters.maxPrice}`)
      }
      if (filters.minYear > 0) {
        queryParams.push(`minYear=${filters.minYear}`)
      }
      if (filters.maxYear < 9999) {
        queryParams.push(`maxYear=${filters.maxYear}`)
      }
      if (filters.minMileage > 0) {
        queryParams.push(`minMileage=${filters.minMileage}`)
      }
      if (filters.maxMileage < 9999999) {
        queryParams.push(`maxMileage=${filters.maxMileage}`)
      }
      if (filters.fuel && filters.fuel.trim()) {
        queryParams.push(`fuel=${encodeURIComponent(filters.fuel.trim())}`)
      }
      if (filters.transmission && filters.transmission.trim()) {
        queryParams.push(`transmission=${encodeURIComponent(filters.transmission.trim())}`)
      }
      if (filters.sortBy && filters.sortBy !== 'createdAt') {
        queryParams.push(`sortBy=${filters.sortBy}`)
      }
      if (filters.sortOrder && filters.sortOrder !== 'desc') {
        queryParams.push(`sortOrder=${filters.sortOrder}`)
      }
      if (filters.featured) {
        queryParams.push('featured=true')
      }

      // Add query params if any exist
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&')
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      } else {
        console.error('Erro na resposta da API:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.brand, filters.minPrice, filters.maxPrice, filters.minYear, filters.maxYear, filters.minMileage, filters.maxMileage, filters.fuel, filters.transmission, filters.sortBy, filters.sortOrder, filters.featured])

  // Load initial data on mount
  useEffect(() => {
    fetchStats()
    setLoading(true)
    fetchListings()
  }, [fetchStats, fetchListings])

  // Debounce dos filtros para evitar múltiplas requisições
  const debouncedFilters = useDebounce(filters, 300)

  useEffect(() => {
    setLoading(true)
    fetchListings()
  }, [debouncedFilters, fetchListings])

  const handleFilterChange = (key: string, value: string | boolean | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    console.log('Price range change:', { min, max })
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

  const handleSortChange = (sortBy: string, sortOrder: string = 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      minMileage: 0,
      maxMileage: 1000000,
      fuel: '',
      transmission: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      featured: false,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const openWhatsApp = (whatsapp: string, title: string) => {
    const message = `Olá! Tenho interesse no ônibus ${title}.`
    const url = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
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
          {/* Filtros Inteligentes */}
          <div className="lg:block">
            <SmartFilters
              filters={filters}
              stats={stats}
              statsLoading={statsLoading}
              onFilterChange={handleFilterChange}
              onPriceRangeChange={handlePriceRangeChange}
              onYearRangeChange={handleYearRangeChange}
              onMileageRangeChange={handleMileageRangeChange}
              onSortChange={handleSortChange}
              onClearAllFilters={clearAllFilters}
              activeFiltersCount={
                (filters.search ? 1 : 0) +
                (filters.brand ? 1 : 0) +
                (filters.fuel ? 1 : 0) +
                (filters.transmission ? 1 : 0) +
                (filters.featured ? 1 : 0) +
                (filters.minPrice > (stats?.priceRange.min || 50000) || filters.maxPrice < (stats?.priceRange.max || 1000000) ? 1 : 0) +
                (filters.minYear > (stats?.yearRange.min || 2010) || filters.maxYear < (stats?.yearRange.max || new Date().getFullYear()) ? 1 : 0) +
                (filters.minMileage > (stats?.mileageRange.min || 0) || filters.maxMileage < (stats?.mileageRange.max || 500000) ? 1 : 0)
              }
            />
          </div>

          {/* Lista de Anúncios */}
          <div className="col-span-1 lg:col-span-3">
            {/* Contador de Resultados */}
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {loading ? (
                    <span>Carregando...</span>
                  ) : (
                    <span>
                      {listings.length === 0
                        ? 'Nenhum anúncio encontrado'
                        : `${listings.length} anúncio${listings.length !== 1 ? 's' : ''} encontrado${listings.length !== 1 ? 's' : ''}`
                      }
                      {stats && (
                        <span className="ml-2 text-xs">
                          (de {stats.totalListings} total${stats.totalListings !== 1 ? 'is' : ''})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {/* Espaço para futuros controles de paginação */}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListingCardSkeleton key={index} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum anúncio encontrado.</p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Tente ajustar os filtros de busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/70 transition-shadow border border-gray-200 dark:border-slate-700">
                    {/* Imagem */}
                    <div className="relative">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          width={400}
                          height={192}
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
                            className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center font-medium"
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
