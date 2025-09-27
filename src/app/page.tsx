import Link from "next/link"
import { Search, Phone, Shield, Truck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">BusMarket</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/listings" className="text-gray-700 hover:text-blue-600 transition-colors">
                Ver Anúncios
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Compre e Venda Ônibus
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A maior plataforma online especializada na compra e venda de ônibus novos e usados.
            Encontre o veículo ideal para seu negócio.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo ou localização..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-blue-600">
              <Truck className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Ampla Variedade</h3>
            <p className="mt-2 text-gray-600">
              Diversas marcas e modelos disponíveis para todos os tipos de necessidade.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-blue-600">
              <Shield className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Compra Segura</h3>
            <p className="mt-2 text-gray-600">
              Processo transparente e seguro com verificação de todos os anúncios.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-blue-600">
              <Phone className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Contato Direto</h3>
            <p className="mt-2 text-gray-600">
              Entre em contato diretamente com os vendedores via WhatsApp.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/listings"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Ver Todos os Anúncios
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 BusMarket. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
