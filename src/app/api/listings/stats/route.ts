import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obter estatísticas dos filtros
export async function GET() {
  try {
    // Valores padrão caso não haja dados no banco
    const defaultStats = {
      priceRange: { min: 50000, max: 1000000 },
      yearRange: { min: 2010, max: new Date().getFullYear() },
      mileageRange: { min: 0, max: 500000 },
      totalListings: 0,
      brands: ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'Iveco'],
      fuels: ['Diesel', 'Gasolina', 'Elétrico', 'Híbrido'],
      transmissions: ['Manual', 'Automática', 'Automatizada']
    }

    try {
      // Tentar buscar estatísticas reais do banco
      const stats = await prisma.listing.aggregate({
        where: { status: 'active' },
        _min: { price: true, year: true, mileage: true },
        _max: { price: true, year: true, mileage: true },
        _count: { id: true }
      })

      // Buscar marcas únicas
      const brands = await prisma.listing.findMany({
        where: { status: 'active' },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' }
      })

      // Buscar tipos de combustível únicos
      const fuels = await prisma.listing.findMany({
        where: { status: 'active', fuel: { not: null } },
        select: { fuel: true },
        distinct: ['fuel'],
        orderBy: { fuel: 'asc' }
      })

      // Buscar tipos de transmissão únicos
      const transmissions = await prisma.listing.findMany({
        where: { status: 'active', transmission: { not: null } },
        select: { transmission: true },
        distinct: ['transmission'],
        orderBy: { transmission: 'asc' }
      })

      const result = {
        priceRange: {
          min: stats._min.price || defaultStats.priceRange.min,
          max: stats._max.price || defaultStats.priceRange.max,
        },
        yearRange: {
          min: stats._min.year || defaultStats.yearRange.min,
          max: stats._max.year || defaultStats.yearRange.max,
        },
        mileageRange: {
          min: stats._min.mileage || defaultStats.mileageRange.min,
          max: stats._max.mileage || defaultStats.mileageRange.max,
        },
        totalListings: stats._count.id,
        brands: brands.length > 0 ? brands.map(item => item.brand).filter(Boolean) : defaultStats.brands,
        fuels: fuels.length > 0 ? fuels.map(item => item.fuel).filter(Boolean) : defaultStats.fuels,
        transmissions: transmissions.length > 0 ? transmissions.map(item => item.transmission).filter(Boolean) : defaultStats.transmissions,
      }

      return NextResponse.json(result)
    } catch (dbError) {
      console.warn('Erro ao acessar banco de dados, usando valores padrão:', dbError)
      // Retornar valores padrão se houver erro no banco
      return NextResponse.json(defaultStats)
    }
  } catch (error) {
    console.error('Erro geral ao buscar estatísticas:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        priceRange: { min: 50000, max: 1000000 },
        yearRange: { min: 2010, max: new Date().getFullYear() },
        mileageRange: { min: 0, max: 500000 },
        totalListings: 0,
        brands: ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'Iveco'],
        fuels: ['Diesel', 'Gasolina', 'Elétrico', 'Híbrido'],
        transmissions: ['Manual', 'Automática', 'Automatizada']
      },
      { status: 500 }
    )
  }
}
