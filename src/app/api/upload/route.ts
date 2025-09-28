import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST - Upload de imagem
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Converter Buffer para base64
    const base64String = buffer.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64String}`

    // Upload para Cloudinary
    const result = await uploadImage(dataUrl, 'busmarket/listings', {
      width: 1200,
      height: 800,
      quality: 80,
      format: 'jpg',
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir imagem
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'ID público da imagem não fornecido' },
        { status: 400 }
      )
    }

    // Excluir do Cloudinary
    await deleteImage(publicId)

    return NextResponse.json({
      success: true,
      message: 'Imagem excluída com sucesso',
    })
  } catch (error) {
    console.error('Erro ao excluir imagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
