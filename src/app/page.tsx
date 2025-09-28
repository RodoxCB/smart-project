"use client"

import Link from "next/link"
import { Search, Phone, Shield, Truck, Menu } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 dark:text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BusMarket</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/listings" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Ver Anúncios
              </Link>
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Admin
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/listings"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ver Anúncios
                </Link>
                <Link
                  href="/admin"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Compre e Venda Ônibus
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            A maior plataforma online especializada na compra e venda de ônibus novos e usados.
            Encontre o veículo ideal para seu negócio.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo ou localização..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md sm:rounded-l-md sm:rounded-r-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-500 mb-4">
              <Truck className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ampla Variedade</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Diversas marcas e modelos disponíveis para todos os tipos de necessidade.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-500 mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Compra Segura</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Processo transparente e seguro com verificação de todos os anúncios.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <div className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-500 mb-4">
              <Phone className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Contato Direto</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Entre em contato diretamente com os vendedores via WhatsApp.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            href="/listings"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
          >
            Ver Todos os Anúncios
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 mt-16 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; 2024 BusMarket. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
