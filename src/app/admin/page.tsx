"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { AdminGuard } from "@/components/AdminGuard"

export default function AdminPage() {
  const { data: session } = useSession()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchListings()
    }
  }, [session])

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
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Gerencie os anúncios da plataforma BusMarket
                </p>
              </div>
              <Link
                href="/admin/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Novo Anúncio
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <li className="px-6 py-4">
                    <div className="text-center text-gray-500">
                      Nenhum anúncio encontrado.{" "}
                      <Link href="/admin/new" className="text-blue-600 hover:text-blue-800">
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
                    <li key={listing.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {listing.images[0] && (
                            <img
                              src={listing.images[0].url}
                              alt={listing.title}
                              className="h-16 w-16 object-cover rounded-md mr-4"
                            />
                          )}
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">
                                {listing.title}
                              </h3>
                              {listing.featured && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Destaque
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {listing.brand} {listing.model} • {listing.year} • R$ {listing.price.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-xs text-gray-500">
                              Status: {listing.status === 'active' ? 'Ativo' : 'Inativo'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/edit/${listing.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                          <button
                            onClick={() => toggleStatus(listing.id, listing.status)}
                            className={`inline-flex items-center px-3 py-1 border text-sm leading-4 font-medium rounded-md ${
                              listing.status === 'active'
                                ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                                : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                            }`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {listing.status === 'active' ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
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
    </AdminGuard>
  )
}
