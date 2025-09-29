"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, MapPin, Fuel, ArrowLeft, Filter, Search, Star, Calendar, Gauge } from "lucide-react"
import ImageWithFallback from "@/components/ImageWithFallback"

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

function ListingsPageContent() {
  console.log('ListingsPageContent rendering - START')

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  console.log('State initialized, current listings:', listings.length)

  useEffect(() => {
    console.log('useEffect triggered')
    const loadData = async () => {
      console.log('Starting data load')
      try {
        console.log('Fetching listings...')
        const response = await fetch('/api/listings')
        console.log('Response received:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('Data parsed:', data)
          setListings(data.listings || [])
          console.log('Listings set to state')
        } else {
          console.error('API Error')
          setError('Erro ao carregar anúncios')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Erro de conexão')
      } finally {
        setLoading(false)
        console.log('Loading set to false')
      }
    }
    loadData()
  }, [])

  console.log('Component rendering with listings:', listings.length, 'loading:', loading)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const openWhatsApp = (whatsapp: string, title: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '')
    const message = `Olá! Tenho interesse no ônibus ${title} que encontrei no BusMarket.`
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (listing.location && listing.location.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Anúncios de Ônibus</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filteredListings.length} anúncios encontrados
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Busca
                </h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buscar anúncios
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Marca, modelo, localização..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">💡 <strong>Dica:</strong></p>
                <p>Busque por marca, modelo ou localização para encontrar exatamente o que procura.</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                Mostrar Filtros
              </button>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">{error}</p>
                <button
                  onClick={() => fetchListings()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum anúncio encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tente ajustar sua busca ou filtros.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Limpar Busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative w-full h-48">
                      {listing.images[0] ? (
                        <ImageWithFallback
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500 text-lg">Sem imagem</span>
                        </div>
                      )}
                      {listing.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          ⭐ Destaque
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {listing.brand} • {listing.model}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(listing.price)}
                          </p>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{listing.year}</span>
                        </div>
                        {listing.mileage && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Gauge className="h-4 w-4 mr-2" />
                            <span>{listing.mileage.toLocaleString('pt-BR')} km</span>
                          </div>
                        )}
                        {listing.fuel && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Fuel className="h-4 w-4 mr-2" />
                            <span>{listing.fuel}</span>
                          </div>
                        )}
                        {listing.location && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{listing.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                        >
                          Ver Detalhes
                        </Link>
                        {listing.whatsapp && (
                          <button
                            onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center text-sm font-medium touch-manipulation"
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
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return <ListingsPageContent />
}