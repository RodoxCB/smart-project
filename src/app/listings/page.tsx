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
  console.log('ListingsPageContent is rendering!')
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Teste - Página de Listagens</h1>
      <p>Se você vê esta mensagem, o componente está funcionando!</p>
      <p>Agora podemos restaurar a funcionalidade completa.</p>
    </div>
  )
}

export default function ListingsPage() {
  return <ListingsPageContent />
}
