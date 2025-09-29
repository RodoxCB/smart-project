"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { Phone, MapPin, Fuel, Settings, Users, ArrowLeft, Calendar } from "lucide-react"
import ImageWithFallback from "@/components/ImageWithFallback"

interface ListingDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  // In a real app, you'd fetch the listing data here
  // For now, we'll use generic metadata
  return {
    title: `Ônibus - BusMarket`,
    description: "Detalhes completos do ônibus incluindo especificações, fotos e informações de contato.",
    openGraph: {
      title: `Ônibus - BusMarket`,
      description: "Detalhes completos do ônibus incluindo especificações, fotos e informações de contato.",
      type: "website",
      url: `https://smart-project-orpin.vercel.app/listings/${params.id}`,
    },
  }
}

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 md:py-6">
            <Link
              href="/listings"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
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
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 overflow-hidden border border-gray-200 dark:border-slate-700">
              {listing.images.length > 0 ? (
                <>
                  <div className="relative">
                    <ImageWithFallback
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-96 object-cover"
                    />
                    {listing.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium">
                        DESTAQUE
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {listing.images.length > 1 && (
                    <div className="p-4 flex space-x-2 overflow-x-auto pb-safe">
                      {listing.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-colors touch-manipulation ${
                            index === currentImageIndex
                              ? 'border-blue-500 dark:border-blue-400'
                              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                          }`}
                        >
                          <ImageWithFallback
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
                <div className="w-full h-96 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500 text-lg">Sem imagens disponíveis</span>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Anúncio */}
          <div className="space-y-6">
            {/* Título e Preço */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {listing.title}
              </h1>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-500">
                {formatPrice(listing.price)}
              </p>
            </div>

            {/* Botão WhatsApp */}
            {listing.whatsapp && (
              <button
                onClick={() => openWhatsApp(listing.whatsapp!, listing.title)}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-4 px-6 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center text-lg font-medium shadow-sm touch-manipulation"
              >
                <Phone className="h-6 w-6 mr-3" />
                Falar no WhatsApp
              </button>
            )}

            {/* Especificações */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Especificações</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ano</p>
                    <p className="font-medium text-gray-900 dark:text-gray-300">{listing.year}</p>
                  </div>
                </div>

                {listing.mileage && (
                  <div className="flex items-center">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">🚗</span>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quilometragem</p>
                      <p className="font-medium text-gray-900 dark:text-gray-300">{listing.mileage.toLocaleString('pt-BR')} km</p>
                    </div>
                  </div>
                )}

                {listing.fuel && (
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Combustível</p>
                      <p className="font-medium text-gray-900 dark:text-gray-300">{listing.fuel}</p>
                    </div>
                  </div>
                )}

                {listing.transmission && (
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Câmbio</p>
                      <p className="font-medium text-gray-900 dark:text-gray-300">{listing.transmission}</p>
                    </div>
                  </div>
                )}

                {listing.capacity && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Capacidade</p>
                      <p className="font-medium text-gray-900 dark:text-gray-300">{listing.capacity} lugares</p>
                    </div>
                  </div>
                )}

                {listing.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Localização</p>
                      <p className="font-medium text-gray-900 dark:text-gray-300">{listing.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            {listing.description && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Descrição</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Data do anúncio */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Anúncio publicado em {new Date(listing.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
