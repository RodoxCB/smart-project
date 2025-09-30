import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Listar anúncios (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const minYear = searchParams.get('minYear') || ''
    const maxYear = searchParams.get('maxYear') || ''
    const minMileage = searchParams.get('minMileage') || ''
    const maxMileage = searchParams.get('maxMileage') || ''
    const fuel = searchParams.get('fuel') || ''
    const transmission = searchParams.get('transmission') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured') === 'true'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: {
      status: string
      OR?: Array<Record<string, any>>
      title?: Record<string, any>
      description?: Record<string, any>
      brand?: Record<string, any>
      model?: Record<string, any>
      location?: Record<string, any>
      price?: Record<string, any>
      year?: Record<string, any>
      mileage?: Record<string, any>
      fuel?: Record<string, any>
      transmission?: Record<string, any>
      featured?: boolean
    } = {
      status: 'active',
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { location: { contains: search } },
      ]
    }

    if (brand) {
      where.brand = { contains: brand }
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) }
    }

    if (minYear) {
      where.year = { ...where.year, gte: parseInt(minYear) }
    }

    if (maxYear) {
      where.year = { ...where.year, lte: parseInt(maxYear) }
    }

    if (minMileage) {
      where.mileage = { ...where.mileage, gte: parseInt(minMileage) }
    }

    if (maxMileage) {
      where.mileage = { ...where.mileage, lte: parseInt(maxMileage) }
    }

    if (fuel) {
      where.fuel = { contains: fuel }
    }

    if (transmission) {
      where.transmission = { contains: transmission }
    }

    if (featured) {
      where.featured = true
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1, // Apenas a primeira imagem
          },
        },
        orderBy: [
          { featured: 'desc' },
          { [sortBy]: sortOrder },
        ],
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo anúncio (apenas admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession({
      req: request,
      ...authOptions
    })
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      brand,
      model,
      year,
      mileage,
      fuel,
      transmission,
      capacity,
      location,
      whatsapp,
      featured = false,
      images = [],
    } = body

    // Validação básica
    if (!title || !price || !brand || !model || !year) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, price, brand, model, year' },
        { status: 400 }
      )
    }

    // Criar anúncio
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        brand,
        model,
        year: parseInt(year),
        mileage: mileage ? parseInt(mileage) : null,
        fuel,
        transmission,
        capacity: capacity ? parseInt(capacity) : null,
        location,
        whatsapp,
        featured,
        images: {
          create: images.map((image: { url: string; publicId: string }, index: number) => ({
            url: image.url,
            publicId: image.publicId,
            order: index,
          })),
        },
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error('Erro ao criar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
