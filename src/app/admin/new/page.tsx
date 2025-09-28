"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { AdminGuard } from "@/components/AdminGuard"

interface ListingFormData {
  title: string
  description: string
  price: string
  brand: string
  model: string
  year: string
  mileage: string
  fuel: string
  transmission: string
  capacity: string
  location: string
  whatsapp: string
  featured: boolean
  images: Array<{
    url: string
    publicId: string
    order: number
  }>
}

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    price: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    capacity: "",
    location: "",
    whatsapp: "",
    featured: false,
    images: [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            url: result.data.secure_url,
            publicId: result.data.public_id,
            order: prev.images.length,
          }]
        }))
      } else {
        alert('Erro no upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro no upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar anúncio')
      }
    } catch (error) {
      console.error('Erro ao criar anúncio:', error)
      alert('Erro ao criar anúncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4 md:py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Novo Anúncio</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 rounded-lg p-6 space-y-6 border border-gray-200 dark:border-slate-700">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Mercedes-Benz OF-1721 2019"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preço *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="285000.00"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Marca *
                </label>
                <select
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione a marca</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Scania">Scania</option>
                  <option value="MAN">MAN</option>
                  <option value="Iveco">Iveco</option>
                  <option value="Marcopolo">Marcopolo</option>
                  <option value="Caio">Caio</option>
                  <option value="Busscar">Busscar</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modelo *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="OF-1721"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ano *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2019"
                />
              </div>

              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quilometragem
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="150000"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o ônibus, suas características, estado de conservação, etc."
              />
            </div>

            {/* Detalhes Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Combustível
                </label>
                <select
                  id="fuel"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Elétrico">Elétrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Câmbio
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="Automatizado">Automatizado</option>
                </select>
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Capacidade (lugares)
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="46"
                />
              </div>
            </div>

            {/* Localização e Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Localização
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="São Paulo, SP"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+5511999999999"
                />
              </div>
            </div>

            {/* Configurações */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Anúncio em destaque
              </label>
            </div>

            {/* Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imagens
              </label>

              {/* Upload */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Enviando...' : 'Adicionar Imagem'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Preview das imagens */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 dark:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 dark:hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Anúncio'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  )
}
