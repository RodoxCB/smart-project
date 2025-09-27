"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Phone, MapPin, Fuel, Settings, Users, ArrowLeft, Calendar } from "lucide-react"

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

export default function ListingDetailPage() {
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setListing(data)
      } else {
        console.error('Anúncio não encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar anúncio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      setLoading(true)
      fetchListing()
    }
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const openWhatsApp = (whatsapp: string, title: string) => {
    const message = `Olá! Tenho interesse no ônibus ${title} que vi no BusMarket.`
    const url = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Anúncio não encontrado</h1>
          <Link href="/listings" className="text-blue-600 hover:text-blue-800">
            ← Voltar para anúncios
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/listings"
              className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {listing.images.length > 0 ? (
                <>
                  <div className="relative">
                    <img
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-96 object-cover"
                    />
                    {listing.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium">
                        DESTAQUE
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {listing.images.length > 1 && (
                    <div className="p-4 flex space-x-2 overflow-x-auto">
                      {listing.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${listing.title} - Imagem ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Sem imagens disponíveis</span>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Anúncio */}
          <div className="space-y-6">
            {/* Título e Preço */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h1>
              <p className="text-4xl font-bold text-blue-600">
                {formatPrice(listing.price)}
              </p>
            </div>

            {/* Botão WhatsApp */}
            {listing.whatsapp && (
              <button
                onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-lg font-medium"
              >
                <Phone className="h-6 w-6 mr-3" />
                Falar no WhatsApp
              </button>
            )}

            {/* Especificações */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificações</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Ano</p>
                    <p className="font-medium">{listing.year}</p>
                  </div>
                </div>

                {listing.mileage && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">🚗</span>
                    <div>
                      <p className="text-sm text-gray-600">Quilometragem</p>
                      <p className="font-medium">{listing.mileage.toLocaleString('pt-BR')} km</p>
                    </div>
                  </div>
                )}

                {listing.fuel && (
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Combustível</p>
                      <p className="font-medium">{listing.fuel}</p>
                    </div>
                  </div>
                )}

                {listing.transmission && (
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Câmbio</p>
                      <p className="font-medium">{listing.transmission}</p>
                    </div>
                  </div>
                )}

                {listing.capacity && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Capacidade</p>
                      <p className="font-medium">{listing.capacity} lugares</p>
                    </div>
                  </div>
                )}

                {listing.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Localização</p>
                      <p className="font-medium">{listing.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            {listing.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Data do anúncio */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Anúncio publicado em {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
