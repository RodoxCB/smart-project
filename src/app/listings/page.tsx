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
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        console.log('Data loaded:', data.listings?.length || 0)
        setListings(data.listings || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  console.log('Rendering with listings:', listings.length)

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

  const filteredListings = listings // Temporarily remove filtering to debug

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Anúncios de Ônibus</h1>
      <p className="mb-4">Status: {loading ? 'Carregando...' : `Encontrados ${listings.length} anúncios`}</p>

      {loading ? (
        <div>Carregando anúncios...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing, index) => (
            <div key={listing.id} className="border p-4 rounded">
              <h3 className="font-bold">{index + 1}. {listing.title}</h3>
              <p>Preço: R$ {listing.price.toLocaleString('pt-BR')}</p>
              <p>{listing.brand} - {listing.model}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return <ListingsPageContent />
}