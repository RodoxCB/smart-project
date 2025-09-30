"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, SlidersHorizontal, X, MapPin, Fuel, Settings, Users, Calendar, ArrowUpDown, Star, Heart, ChevronDown, Loader2, MessageCircle, Gauge } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

interface Listing {
  id: string
  title: string
  description: string | null
  price: number
  brand: string
  model: string
  year: number
  mileage: number | null
  fuel: string | null
  transmission: string | null
  capacity: number | null
  location: string | null
  whatsapp: string | null
  featured: boolean
  status: string
  createdAt: string
  images: Array<{
    id: string
    url: string
    order: number
  }>
}

interface FilterStats {
  priceRange: { min: number; max: number }
  yearRange: { min: number; max: number }
  brands: string[]
  fuels: string[]
  transmissions: string[]
  totalListings: number
}

type SortOption = 'createdAt-desc' | 'createdAt-asc' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc' | 'mileage-desc'

function ListingsPageContent() {
  // Estados básicos
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<FilterStats | null>(null)

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [yearRange, setYearRange] = useState<[number, number]>([2010, new Date().getFullYear()])
  const [selectedFuel, setSelectedFuel] = useState('')
  const [selectedTransmission, setSelectedTransmission] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('createdAt-desc')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Carregar estatísticas dos filtros
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/listings/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        // Inicializar ranges com dados reais
        setPriceRange([data.priceRange.min, data.priceRange.max])
        setYearRange([data.yearRange.min, data.yearRange.max])
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }, [])

  // Carregar anúncios
  const fetchListings = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(priceRange[0] > 0 && { minPrice: priceRange[0].toString() }),
        ...(priceRange[1] < 10000000 && { maxPrice: priceRange[1].toString() }),
        ...(yearRange[0] > 0 && { minYear: yearRange[0].toString() }),
        ...(yearRange[1] < 9999 && { maxYear: yearRange[1].toString() }),
        ...(selectedFuel && { fuel: selectedFuel }),
        ...(selectedTransmission && { transmission: selectedTransmission }),
        ...(showFeaturedOnly && { featured: 'true' }),
        sortBy: sortBy.split('-')[0],
        sortOrder: sortBy.split('-')[1]
      })

      const response = await fetch(`/api/listings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings || [])
        setTotalPages(data.pagination?.pages || 1)
        setCurrentPage(page)
      } else {
        throw new Error('Erro ao carregar anúncios')
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error)
      setError('Erro ao carregar anúncios. Tente novamente.')
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm, selectedBrand, priceRange, yearRange, selectedFuel, selectedTransmission, sortBy, showFeaturedOnly])

  // Inicializar dados
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchListings(1)
  }, [fetchListings])

  // Handlers básicos
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedBrand('')
    setSelectedFuel('')
    setSelectedTransmission('')
    setShowFeaturedOnly(false)
    setPriceRange([stats?.priceRange.min || 0, stats?.priceRange.max || 1000000])
    setYearRange([stats?.yearRange.min || 2010, stats?.yearRange.max || new Date().getFullYear()])
    setCurrentPage(1)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Anúncios de Ônibus
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {loading ? 'Carregando...' : `${listings.length} anúncio${listings.length !== 1 ? 's' : ''} encontrado${listings.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Busca e Filtros Rápidos */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campo de Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por marca, modelo ou localização..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Filtros Rápidos */}
            <div className="flex items-center space-x-3">
              {/* Marca */}
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[140px]"
              >
                <option value="">Todas as marcas</option>
                {stats?.brands.slice(0, 5).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* Botão Filtros Avançados */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtros Avançados */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sticky top-6">
              {/* Header dos Filtros */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filtros Avançados
                  </h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Faixa de Preço */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Faixa de Preço (R$)
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Mínimo</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Máximo</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        placeholder="1000000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Valores: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                </div>
              </div>

              {/* Ano */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ano de Fabricação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">De</label>
                    <input
                      type="number"
                      value={yearRange[0]}
                      onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                      placeholder="2010"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Até</label>
                    <input
                      type="number"
                      value={yearRange[1]}
                      onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                      placeholder="2025"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Combustível */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Combustível
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transmissão
                </label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Todas as transmissões</option>
                  {stats?.transmissions.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destaques */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Apenas anúncios em destaque
                  </span>
                </label>
              </div>

              {/* Botão Limpar */}
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                🧹 Limpar Todos os Filtros
              </button>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="lg:col-span-3">
            {/* Barra de Controle Superior */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Ordenação */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">📅 Mais recentes</option>
                  <option value="createdAt-asc">📅 Mais antigos</option>
                  <option value="price-asc">💰 Menor preço</option>
                  <option value="price-desc">💰 Maior preço</option>
                  <option value="year-desc">📆 Ano mais recente</option>
                  <option value="year-asc">📆 Ano mais antigo</option>
                  <option value="mileage-asc">🛣️ Menor quilometragem</option>
                  <option value="mileage-desc">🛣️ Maior quilometragem</option>
                </select>
              </div>

              {/* Toggle Visualização */}
              <div className="flex items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                  title="Visualização em grade"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                    <div className="w-2 h-2 bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                  title="Visualização em lista"
                >
                  <div className="flex flex-col space-y-0.5">
                    <div className="w-4 h-0.5 bg-current rounded"></div>
                    <div className="w-4 h-0.5 bg-current rounded"></div>
                    <div className="w-4 h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Lista de Anúncios */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-300 dark:bg-slate-600"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded flex-1"></div>
                        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
                  <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
                    Erro ao carregar anúncios
                  </h3>
                  <p className="text-red-600 dark:text-red-300 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => fetchListings(currentPage)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🔄 Tentar Novamente
                  </button>
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8 max-w-md mx-auto">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum anúncio encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Tente ajustar os filtros ou fazer uma busca diferente.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🧹 Limpar Filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {listings.map((listing) => (
                  <article
                    key={listing.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 group"
                  >
                    {/* Imagem */}
                    <div className="relative aspect-video overflow-hidden">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <div className="text-4xl mb-2">🚌</div>
                            <p className="text-sm">Sem imagem</p>
                          </div>
                        </div>
                      )}

                      {/* Badge Destaque */}
                      {listing.featured && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                          <Star className="h-3 w-3 fill-current" />
                          <span>DESTAQUE</span>
                        </div>
                      )}

                      {/* Overlay WhatsApp */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-lg"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {listing.title}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                        {formatPrice(listing.price)}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{listing.year}</span>
                        </div>

                        {listing.mileage && (
                          <div className="flex items-center space-x-1">
                            <Gauge className="h-4 w-4 text-gray-400" />
                            <span>{listing.mileage.toLocaleString('pt-BR')} km</span>
                          </div>
                        )}

                        {listing.fuel && (
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-4 w-4 text-gray-400" />
                            <span>{listing.fuel}</span>
                          </div>
                        )}

                        {listing.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{listing.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
                        >
                          📋 Ver Detalhes
                        </Link>

                        {listing.whatsapp && (
                          <button
                            onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => fetchListings(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-l-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchListings(pageNum)}
                        className={`px-3 py-2 text-sm font-medium border transition-colors ${
                          pageNum === currentPage
                            ? 'text-blue-600 bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
                            : 'text-gray-500 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => fetchListings(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-r-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima →
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return <ListingsPageContent />
}