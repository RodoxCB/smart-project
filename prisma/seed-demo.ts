// Seed de demonstração - mostra os dados que seriam inseridos sem precisar de banco
// Para executar o seed real, configure a DATABASE_URL no .env

console.log('🚀 SEED DE DEMONSTRAÇÃO - DADOS QUE SERIAM INSERIDOS:')
console.log('================================================\n')

// Simular dados que seriam inseridos
const mockUsers = [
  { email: 'admin@busmarket.com', name: 'Administrador', role: 'admin' },
  { email: 'usuario@busmarket.com', name: 'João Silva', role: 'user' },
  { email: 'vendedor1@busmarket.com', name: 'Maria Santos', role: 'user' },
  { email: 'vendedor2@busmarket.com', name: 'Carlos Oliveira', role: 'user' },
]

const mockListings = [
  {
    title: 'Mercedes-Benz OF-1721 2019',
    brand: 'Mercedes-Benz',
    model: 'OF-1721',
    year: 2019,
    price: 285000,
    location: 'São Paulo, SP',
    featured: true,
    status: 'active',
  },
  {
    title: 'Volvo B270F 2020',
    brand: 'Volvo',
    model: 'B270F',
    year: 2020,
    price: 420000,
    location: 'Rio de Janeiro, RJ',
    featured: true,
    status: 'active',
  },
  {
    title: 'Scania K310 2018',
    brand: 'Scania',
    model: 'K310',
    year: 2018,
    price: 320000,
    location: 'Belo Horizonte, MG',
    featured: false,
    status: 'active',
  },
  {
    title: 'Marcopolo Paradiso 1200 G7 2021',
    brand: 'Marcopolo',
    model: 'Paradiso 1200 G7',
    year: 2021,
    price: 580000,
    location: 'Curitiba, PR',
    featured: true,
    status: 'active',
  },
  {
    title: 'MAN Lion\'s Coach 2017',
    brand: 'MAN',
    model: 'Lion\'s Coach',
    year: 2017,
    price: 390000,
    location: 'Porto Alegre, RS',
    featured: false,
    status: 'active',
  },
]

const mockSoldListings = [
  {
    title: 'Mercedes-Benz O-400 2010 (VENDIDO)',
    brand: 'Mercedes-Benz',
    model: 'O-400',
    year: 2010,
    price: 75000,
    location: 'São Paulo, SP',
    status: 'sold',
  },
]

console.log('👥 USUÁRIOS A SEREM CRIADOS:')
console.log('----------------------------')
mockUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`)
})

console.log('\n🚌 ANÚNCIOS ATIVOS A SEREM CRIADOS:')
console.log('----------------------------------')
mockListings.forEach((listing, index) => {
  const destaque = listing.featured ? ' ⭐ DESTAQUE' : ''
  console.log(`${index + 1}. ${listing.title}`)
  console.log(`   Marca: ${listing.brand} | Modelo: ${listing.model} | Ano: ${listing.year}`)
  console.log(`   Preço: R$ ${listing.price.toLocaleString('pt-BR')} | Local: ${listing.location}${destaque}`)
  console.log('')
})

console.log('🚫 ANÚNCIOS VENDIDOS A SEREM CRIADOS:')
console.log('------------------------------------')
mockSoldListings.forEach((listing, index) => {
  console.log(`${index + 1}. ${listing.title}`)
  console.log(`   Marca: ${listing.brand} | Modelo: ${listing.model} | Ano: ${listing.year}`)
  console.log(`   Preço: R$ ${listing.price.toLocaleString('pt-BR')} | Local: ${listing.location}`)
  console.log('')
})

console.log('📊 RESUMO DOS DADOS:')
console.log('-------------------')
console.log(`✅ ${mockUsers.length} usuários`)
console.log(`✅ ${mockListings.length} anúncios ativos`)
console.log(`✅ ${mockSoldListings.length} anúncio vendido`)
console.log(`✅ ${mockListings.filter(l => l.featured).length} anúncios em destaque`)
console.log(`✅ ${mockListings.length * 3} imagens de exemplo (para 4 anúncios principais)`)

console.log('\n🎯 MARCAS DE ÔNIBUS INCLUÍDAS:')
const brands = [...new Set(mockListings.map(l => l.brand))]
brands.forEach(brand => {
  const count = mockListings.filter(l => l.brand === brand).length
  console.log(`   - ${brand} (${count} modelo${count > 1 ? 's' : ''})`)
})

console.log('\n💰 FAIXA DE PREÇOS:')
const prices = mockListings.map(l => l.price)
const minPrice = Math.min(...prices)
const maxPrice = Math.max(...prices)
console.log(`   De R$ ${minPrice.toLocaleString('pt-BR')} até R$ ${maxPrice.toLocaleString('pt-BR')}`)

console.log('\n📍 LOCALIZAÇÕES COBERTAS:')
const locations = [...new Set(mockListings.map(l => l.location))]
locations.forEach(location => {
  const count = mockListings.filter(l => l.location === location).length
  console.log(`   - ${location} (${count} anúncio${count > 1 ? 's' : ''})`)
})

console.log('\n✨ ANÚNCIOS EM DESTAQUE:')
const featuredListings = mockListings.filter(l => l.featured)
featuredListings.forEach(listing => {
  console.log(`   ⭐ ${listing.title} - R$ ${listing.price.toLocaleString('pt-BR')}`)
})

console.log('\n🎉 SEED DE DEMONSTRAÇÃO CONCLUÍDO!')
console.log('\nPara executar o seed real:')
console.log('1. Configure a DATABASE_URL no arquivo .env')
console.log('2. Execute: npm run db:seed')
