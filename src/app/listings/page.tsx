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
  console.log('ListingsPageContent component rendered')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Teste - Listagens Temporariamente Indisponíveis</h1>
        <p className="text-gray-600 dark:text-gray-400">Estamos trabalhando para resolver o problema. Volte em breve!</p>
        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  )
}

function OldListingsPageContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
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

  const fetchListings = async () => {
    try {
      setLoading(true)
      console.log('Starting fetchListings...')
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

      console.log('Fetching from URL:', url)
      const response = await fetch(url)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Received data:', data)
        setListings(data.listings || [])
        setError(null)
      } else {
        console.error('Erro na resposta da API:', response.status, response.statusText)
        setError(`Erro ao carregar anúncios: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
      setError('Erro de conexão. Tente novamente mais tarde.')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  // Get URL parameters
  const urlSearch = searchParams?.get('search') || ''
  const urlBrand = searchParams?.get('brand') || ''

  // Initialize filters with URL parameters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: urlSearch,
      brand: urlBrand,
    }))
  }, [urlSearch, urlBrand])

  // Debounce dos filtros para evitar múltiplas requisições
  const debouncedFilters = useDebounce(filters, 300)

  useEffect(() => {
    fetchListings()
  }, [debouncedFilters])

  // Load initial data on mount
  useEffect(() => {
    fetchStats()
    fetchListings()
  }, [])

  const handleFilterChange = (key: string, value: string | boolean) => {
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
    try {
      // Clean phone number (remove all non-digits)
      const cleanNumber = whatsapp.replace(/\D/g, '')

      // Validate phone number length
      if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        alert('Número do WhatsApp inválido. Entre em contato diretamente com o vendedor.')
        return
      }

      const message = `Olá! Tenho interesse no ônibus ${title} que encontrei no BusMarket.`
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

      // Track WhatsApp click (if analytics is available)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'click_whatsapp', {
          'event_category': 'engagement',
          'event_label': title
        })
      }

      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error)
      alert('Erro ao abrir WhatsApp. Tente novamente ou entre em contato diretamente.')
    }
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
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Filtros */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Busca */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Marca, modelo, localização..."
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                />
              </div>

              {/* Marca */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marca
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                >
                  <option value="">Todas as marcas</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Scania">Scania</option>
                  <option value="MAN">MAN</option>
                  <option value="Iveco">Iveco</option>
                  <option value="Marcopolo">Marcopolo</option>
                  <option value="Caio">Caio</option>
                  <option value="Busscar">Busscar</option>
                </select>
              </div>

              {/* Preço */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Faixa de Preço
                </label>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-500"></div>
                  </div>
                ) : stats ? (
                  <div>
                    <RangeSlider
                      minValue={stats.priceRange.min}
                      maxValue={stats.priceRange.max}
                      currentMin={filters.minPrice}
                      currentMax={filters.maxPrice}
                      onChange={handlePriceRangeChange}
                      formatValue={(value) => new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)}
                      step={1000}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Valores: min={filters.minPrice}, max={filters.maxPrice}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Erro ao carregar faixa de preço
                  </div>
                )}
              </div>

              {/* Ano */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ano de Fabricação
                </label>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-500"></div>
                  </div>
                ) : stats ? (
                  <RangeSlider
                    minValue={stats.yearRange.min}
                    maxValue={stats.yearRange.max}
                    currentMin={filters.minYear}
                    currentMax={filters.maxYear}
                    onChange={handleYearRangeChange}
                    step={1}
                  />
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Erro ao carregar faixa de ano
                  </div>
                )}
              </div>

              {/* Quilometragem */}
              <div className="mb-4 lg:mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quilometragem
                </label>
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-500"></div>
                  </div>
                ) : stats ? (
                  <RangeSlider
                    minValue={stats.mileageRange.min}
                    maxValue={stats.mileageRange.max}
                    currentMin={filters.minMileage}
                    currentMax={filters.maxMileage}
                    onChange={handleMileageRangeChange}
                    formatValue={(value) => `${value.toLocaleString('pt-BR')} km`}
                    step={5000}
                  />
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Erro ao carregar faixa de quilometragem
                  </div>
                )}
              </div>

              {/* Combustível */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Combustível
                </label>
                <select
                  value={filters.fuel}
                  onChange={(e) => handleFilterChange('fuel', e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                >
                  <option value="">Todos os combustíveis</option>
                  {stats?.fuels.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmissão */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transmissão
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                >
                  <option value="">Todas as transmissões</option>
                  {stats?.transmissions.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    handleSortChange(sortBy, sortOrder)
                  }}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                >
                  <option value="createdAt-desc">Mais recentes</option>
                  <option value="createdAt-asc">Mais antigos</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="year-desc">Ano mais recente</option>
                  <option value="year-asc">Ano mais antigo</option>
                  <option value="mileage-asc">Menor quilometragem</option>
                  <option value="mileage-desc">Maior quilometragem</option>
                </select>
              </div>

              {/* Destaques */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Apenas destaques</span>
                </label>
              </div>

              {/* Botão Limpar Filtros */}
              <div className="mb-4">
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            </div>
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
            ) : error ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    setLoading(true)
                    fetchListings()
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Tentar Novamente
                </button>
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
