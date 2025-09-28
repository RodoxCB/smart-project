const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    // Verificar se há listings
    const listings = await prisma.listing.findMany({
      where: { status: 'active' },
      take: 5
    })

    console.log('Listings encontrados:', listings.length)
    console.log('Primeiro listing:', listings[0])

    // Testar aggregate
    const stats = await prisma.listing.aggregate({
      where: { status: 'active' },
      _min: { price: true, year: true, mileage: true },
      _max: { price: true, year: true, mileage: true },
      _count: { id: true }
    })

    console.log('Stats:', stats)

    // Testar distinct
    const brands = await prisma.listing.findMany({
      where: { status: 'active', brand: { not: null } },
      select: { brand: true },
      distinct: ['brand']
    })

    console.log('Brands:', brands)

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
