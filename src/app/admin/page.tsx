"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, ArrowLeft, Menu } from "lucide-react"
import { AdminGuard } from "@/components/AdminGuard"

// Forçar renderização dinâmica para evitar problemas com useSession durante build
export const dynamic = 'force-dynamic'

// Componente interno que é executado apenas no cliente
function AdminPageContent() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/admin/listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchListings() // Recarregar lista
      } else {
        alert("Erro ao excluir anúncio")
      }
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error)
      alert("Erro ao excluir anúncio")
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchListings() // Recarregar lista
      } else {
        alert("Erro ao alterar status")
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error)
      alert("Erro ao alterar status")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center space-x-4">
              <Link href="/listings" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Voltar aos anúncios</span>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Gerencie os anúncios da plataforma BusMarket
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/admin/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Anúncio
              </Link>
            </div>

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
            <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4 mb-4">
              <Link
                href="/admin/new"
                className="flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Anúncio
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200 dark:divide-slate-700">
              {listings.length === 0 ? (
                <li className="px-6 py-8">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Nenhum anúncio encontrado.{" "}
                    <Link href="/admin/new" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      Criar o primeiro anúncio
                    </Link>
                  </div>
                </li>
              ) : (
                listings.map((listing: {
                  id: string
                  title: string
                  brand: string
                  model: string
                  year: number
                  price: number
                  status: string
                  featured: boolean
                  images: Array<{ url: string }>
                }) => (
                  <li key={listing.id} className="px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center">
                        {listing.images[0] && (
                          <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            className="h-16 w-16 object-cover rounded-md mr-4 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                              {listing.title}
                            </h3>
                            {listing.featured && (
                              <span className="ml-0 sm:ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 mt-1 sm:mt-0">
                                Destaque
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {listing.brand} {listing.model} • {listing.year} • R$ {listing.price.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Status: {listing.status === 'active' ? 'Ativo' : 'Inativo'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:space-x-2">
                        <Link
                          href={`/admin/edit/${listing.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-slate-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Link>
                        <button
                          onClick={() => toggleStatus(listing.id, listing.status)}
                          className={`inline-flex items-center px-3 py-1.5 border text-sm leading-4 font-medium rounded-md transition-colors ${
                            listing.status === 'active'
                              ? 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30'
                              : 'border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 bg-white dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-950/30'
                          }`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {listing.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  )
}
