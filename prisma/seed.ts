import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuários de teste
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@busmarket.com' },
    update: {},
    create: {
      email: 'admin@busmarket.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'admin',
    },
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'usuario@busmarket.com' },
    update: {},
    create: {
      email: 'usuario@busmarket.com',
      name: 'João Silva',
      password: userPassword,
      role: 'user',
    },
  })

  const vendedor1 = await prisma.user.upsert({
    where: { email: 'vendedor1@busmarket.com' },
    update: {},
    create: {
      email: 'vendedor1@busmarket.com',
      name: 'Maria Santos',
      password: userPassword,
      role: 'user',
    },
  })

  const vendedor2 = await prisma.user.upsert({
    where: { email: 'vendedor2@busmarket.com' },
    update: {},
    create: {
      email: 'vendedor2@busmarket.com',
      name: 'Carlos Oliveira',
      password: userPassword,
      role: 'user',
    },
  })

  console.log('Usuários criados:')
  console.log('- Admin:', admin.email)
  console.log('- Teste:', testUser.email)
  console.log('- Vendedor 1:', vendedor1.email)
  console.log('- Vendedor 2:', vendedor2.email)

  // Criar anúncios de exemplo variados
  const listings = [
    // Ônibus Executivos e Rodoviários
    {
      title: 'Mercedes-Benz OF-1721 2019',
      description: 'Ônibus executivo com ar condicionado, 46 lugares, motor OM-924 LA, câmbio manual. Excelente estado de conservação, revisões em dia.',
      price: 285000,
      brand: 'Mercedes-Benz',
      model: 'OF-1721',
      year: 2019,
      mileage: 150000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 46,
      location: 'São Paulo, SP',
      whatsapp: '+5511999999999',
      featured: true,
      status: 'active',
    },
    {
      title: 'Volvo B270F 2020',
      description: 'Ônibus urbano articulado, 180 lugares, motor D9B 270cv, câmbio automático. Ideal para transporte público municipal.',
      price: 420000,
      brand: 'Volvo',
      model: 'B270F',
      year: 2020,
      mileage: 80000,
      fuel: 'Diesel',
      transmission: 'Automático',
      capacity: 180,
      location: 'Rio de Janeiro, RJ',
      whatsapp: '+5521999999999',
      featured: true,
      status: 'active',
    },
    {
      title: 'Scania K310 2018',
      description: 'Ônibus rodoviário com 44 lugares, WC, ar condicionado, som ambiente. Perfeito para viagens interestaduais.',
      price: 320000,
      brand: 'Scania',
      model: 'K310',
      year: 2018,
      mileage: 220000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 44,
      location: 'Belo Horizonte, MG',
      whatsapp: '+5531999999999',
      featured: false,
      status: 'active',
    },
    {
      title: 'Marcopolo Paradiso 1200 G7 2021',
      description: 'Ônibus rodoviário premium, 46 lugares, ar condicionado digital, WC, geladeira, som premium. Estado impecável.',
      price: 580000,
      brand: 'Marcopolo',
      model: 'Paradiso 1200 G7',
      year: 2021,
      mileage: 45000,
      fuel: 'Diesel',
      transmission: 'Automático',
      capacity: 46,
      location: 'Curitiba, PR',
      whatsapp: '+5541999999999',
      featured: true,
      status: 'active',
    },
    {
      title: 'MAN Lion\'s Coach 2017',
      description: 'Ônibus rodoviário de luxo, 50 lugares, motor MAN D26 440cv, câmbio automatizado. Excelente para turismo.',
      price: 390000,
      brand: 'MAN',
      model: 'Lion\'s Coach',
      year: 2017,
      mileage: 180000,
      fuel: 'Diesel',
      transmission: 'Automatizado',
      capacity: 50,
      location: 'Porto Alegre, RS',
      whatsapp: '+5551999999999',
      featured: false,
      status: 'active',
    },
    {
      title: 'Comil Campione 2016',
      description: 'Ônibus urbano convencional, 44 lugares, motor Cummins ISF 3.8, câmbio manual. Ideal para fretamento.',
      price: 185000,
      brand: 'Comil',
      model: 'Campione',
      year: 2016,
      mileage: 120000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 44,
      location: 'Salvador, BA',
      whatsapp: '+5571999999999',
      featured: false,
      status: 'active',
    },

    // Ônibus Urbanos e de Transporte Público
    {
      title: 'Mercedes-Benz O-500 2015',
      description: 'Ônibus urbano, 80 lugares, motor OM-457 LA, câmbio automático. Pronto para operação em linhas municipais.',
      price: 220000,
      brand: 'Mercedes-Benz',
      model: 'O-500',
      year: 2015,
      mileage: 200000,
      fuel: 'Diesel',
      transmission: 'Automático',
      capacity: 80,
      location: 'Recife, PE',
      whatsapp: '+5581999999999',
      featured: false,
      status: 'active',
    },
    {
      title: 'Volvo B340M 2019',
      description: 'Ônibus articulado, 160 lugares, motor Volvo D11C 340cv, câmbio automático. Perfeito para BRT.',
      price: 480000,
      brand: 'Volvo',
      model: 'B340M',
      year: 2019,
      mileage: 95000,
      fuel: 'Diesel',
      transmission: 'Automático',
      capacity: 160,
      location: 'Brasília, DF',
      whatsapp: '+5561999999999',
      featured: true,
      status: 'active',
    },
    {
      title: 'Caio Apache VIP 2018',
      description: 'Micro-ônibus executivo, 32 lugares, ar condicionado, motor Cummins, ideal para turismo e transfers.',
      price: 165000,
      brand: 'Caio',
      model: 'Apache VIP',
      year: 2018,
      mileage: 85000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 32,
      location: 'Fortaleza, CE',
      whatsapp: '+5585999999999',
      featured: false,
      status: 'active',
    },
    {
      title: 'Scania K250 2014',
      description: 'Ônibus escolar, 44 lugares, motor DC09 250cv, câmbio manual. Atende normas de segurança escolar.',
      price: 145000,
      brand: 'Scania',
      model: 'K250',
      year: 2014,
      mileage: 180000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 44,
      location: 'Manaus, AM',
      whatsapp: '+5592999999999',
      featured: false,
      status: 'active',
    },

    // Ônibus Semi-novos
    {
      title: 'Mercedes-Benz O-500R 2020',
      description: 'Ônibus rodoviário seminovo, 46 lugares, motor OM-457 LA, câmbio automático. Único dono, todas as revisões.',
      price: 410000,
      brand: 'Mercedes-Benz',
      model: 'O-500R',
      year: 2020,
      mileage: 65000,
      fuel: 'Diesel',
      transmission: 'Automático',
      capacity: 46,
      location: 'Goiânia, GO',
      whatsapp: '+5562999999999',
      featured: true,
      status: 'active',
    },
    {
      title: 'Marcopolo Viaggio 2019',
      description: 'Ônibus fretamento, 48 lugares, ar condicionado, DVD, geladeira. Excelente para excursões e turismo.',
      price: 295000,
      brand: 'Marcopolo',
      model: 'Viaggio',
      year: 2019,
      mileage: 95000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 48,
      location: 'Campo Grande, MS',
      whatsapp: '+5567999999999',
      featured: false,
      status: 'active',
    },

    // Ônibus mais antigos (bom custo-benefício)
    {
      title: 'Volvo B10M 2012',
      description: 'Ônibus urbano reformado, 80 lugares, motor Volvo, câmbio manual. Motor retificado, pintura nova.',
      price: 95000,
      brand: 'Volvo',
      model: 'B10M',
      year: 2012,
      mileage: 350000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 80,
      location: 'João Pessoa, PB',
      whatsapp: '+5583999999999',
      featured: false,
      status: 'active',
    },
    {
      title: 'Mercedes-Benz OF-1418 2013',
      description: 'Ônibus escolar, 44 lugares, motor OM-904 LA, câmbio manual. Ideal para transporte de estudantes.',
      price: 85000,
      brand: 'Mercedes-Benz',
      model: 'OF-1418',
      year: 2013,
      mileage: 280000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 44,
      location: 'Natal, RN',
      whatsapp: '+5584999999999',
      featured: false,
      status: 'active',
    },

    // Ônibus de luxo (top de linha)
    {
      title: 'Scania K440 2022',
      description: 'Ônibus rodoviário de luxo, 44 lugares, motor Scania 440cv, câmbio automatizado, suspensão a ar, full LED.',
      price: 720000,
      brand: 'Scania',
      model: 'K440',
      year: 2022,
      mileage: 25000,
      fuel: 'Diesel',
      transmission: 'Automatizado',
      capacity: 44,
      location: 'Florianópolis, SC',
      whatsapp: '+5548999999999',
      featured: true,
      status: 'active',
    },

    // Ônibus para fretamento
    {
      title: 'Comil Versatile 2017',
      description: 'Ônibus fretamento, 50 lugares, ar condicionado, banheiro, cozinha. Perfeito para viagens em grupo.',
      price: 195000,
      brand: 'Comil',
      model: 'Versatile',
      year: 2017,
      mileage: 140000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 50,
      location: 'Vitória, ES',
      whatsapp: '+5527999999999',
      featured: false,
      status: 'active',
    }
  ]

  for (const listingData of listings) {
    const listing = await prisma.listing.upsert({
      where: { id: listingData.title.replace(/\s+/g, '-').toLowerCase() },
      update: {},
      create: listingData,
    })

    console.log('Anúncio criado:', listing.title)

    // Adicionar imagens de exemplo para alguns anúncios
    if (['Mercedes-Benz OF-1721 2019', 'Volvo B270F 2020', 'Scania K310 2018', 'Marcopolo Paradiso 1200 G7 2021'].includes(listingData.title)) {
      const sampleImages = [
        {
          url: `https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=800&fit=crop&auto=format`,
          publicId: `sample-bus-${listing.id}-1`,
          order: 0,
        },
        {
          url: `https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=1200&h=800&fit=crop&auto=format`,
          publicId: `sample-bus-${listing.id}-2`,
          order: 1,
        },
        {
          url: `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop&auto=format`,
          publicId: `sample-bus-${listing.id}-3`,
          order: 2,
        }
      ]

      for (const imageData of sampleImages) {
        // Verificar se a imagem já existe
        const existingImage = await prisma.listingImage.findFirst({
          where: {
            listingId: listing.id,
            url: imageData.url
          }
        })

        if (!existingImage) {
          await prisma.listingImage.create({
            data: {
              listingId: listing.id,
              ...imageData,
            },
          })
        }
      }

      console.log(`  - ${sampleImages.length} imagens adicionadas`)
    }
  }

  // Adicionar alguns anúncios inativos/vendidos para demonstração
  const soldListings = [
    {
      title: 'Mercedes-Benz O-400 2010 (VENDIDO)',
      description: 'Ônibus urbano vendido, 75 lugares, motor Mercedes, câmbio manual. Foi um excelente veículo.',
      price: 75000,
      brand: 'Mercedes-Benz',
      model: 'O-400',
      year: 2010,
      mileage: 400000,
      fuel: 'Diesel',
      transmission: 'Manual',
      capacity: 75,
      location: 'São Paulo, SP',
      whatsapp: '+5511999999999',
      featured: false,
      status: 'sold',
    }
  ]

  for (const listingData of soldListings) {
    const listing = await prisma.listing.upsert({
      where: { id: listingData.title.replace(/\s+/g, '-').toLowerCase() },
      update: {},
      create: listingData,
    })

    console.log('Anúncio vendido criado:', listing.title)
  }

  console.log('\n=== RESUMO DO SEED ===')
  console.log(`✅ ${listings.length} anúncios ativos criados`)
  console.log(`✅ ${soldListings.length} anúncio vendido criado`)
  console.log(`✅ ${listings.filter(l => l.featured).length} anúncios em destaque`)
  console.log(`✅ ${listings.length * 3} imagens de exemplo adicionadas`)
  console.log(`✅ 4 usuários criados (1 admin + 3 usuários)`)
  console.log('\n🎉 Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
