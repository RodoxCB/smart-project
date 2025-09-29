import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const listings = await prisma.listing.findMany()
    console.log('Listings in database:', listings.length)
    listings.forEach(listing => {
      console.log(`ID: ${listing.id}, Title: ${listing.title}, Status: ${listing.status}`)
    })

    // Check if the specific ID exists
    const specificListing = await prisma.listing.findUnique({
      where: { id: 'cmg30tx8j000x9jq80zbn2o60' }
    })
    console.log('Specific listing exists:', !!specificListing)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()