import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteImage } from '@/lib/cloudinary'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Buscar anúncio específico
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Se não for admin, só mostrar anúncios ativos
    const session = await getServerSession({
      req: request,
      ...authOptions
    })
    if (!session?.user || session.user.role !== 'admin') {
      if (listing.status !== 'active') {
        return NextResponse.json(
          { error: 'Anúncio não encontrado' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar anúncio (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { id } = await params
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
      status,
      featured,
      images,
    } = body

    // Verificar se o anúncio existe
    const existingListing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Se houver novas imagens, excluir as antigas
    if (images && images.length > 0) {
      // Excluir imagens antigas do Cloudinary
      for (const oldImage of existingListing.images) {
        try {
          await deleteImage(oldImage.publicId)
        } catch (error) {
          console.error('Erro ao excluir imagem antiga:', error)
        }
      }

      // Excluir imagens antigas do banco
      await prisma.listingImage.deleteMany({
        where: { listingId: id },
      })
    }

    // Atualizar anúncio
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(brand && { brand }),
        ...(model && { model }),
        ...(year && { year: parseInt(year) }),
        ...(mileage !== undefined && { mileage: mileage ? parseInt(mileage) : null }),
        ...(fuel !== undefined && { fuel }),
        ...(transmission !== undefined && { transmission }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(location !== undefined && { location }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(status && { status }),
        ...(featured !== undefined && { featured }),
        ...(images && {
          images: {
            create: images.map((image: { url: string; publicId: string }, index: number) => ({
              url: image.url,
              publicId: image.publicId,
              order: index,
            })),
          },
        }),
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
    console.error('Erro ao atualizar anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir anúncio (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { id } = await params

    // Buscar anúncio com imagens
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      )
    }

    // Excluir imagens do Cloudinary
    for (const image of listing.images) {
      try {
        await deleteImage(image.publicId)
      } catch (error) {
        console.error('Erro ao excluir imagem:', error)
      }
    }

    // Excluir anúncio
    await prisma.listing.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Anúncio excluído com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
