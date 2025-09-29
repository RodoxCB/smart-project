"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X, Filter, Search, Car, Settings, Zap, Star, DollarSign, Calendar } from "lucide-react"

interface FilterStats {
  priceRange: { min: number; max: number }
  yearRange: { min: number; max: number }
  mileageRange: { min: number; max: number }
  brands: string[]
  fuels: string[]
  transmissions: string[]
  totalListings: number
}

interface Filters {
  search: string
  brand: string
  minPrice: number
  maxPrice: number
  minYear: number
  maxYear: number
  minMileage: number
  maxMileage: number
  fuel: string
  transmission: string
  sortBy: string
  sortOrder: string
  featured: boolean
}

interface SmartFiltersProps {
  filters: Filters
  stats: FilterStats | null
  statsLoading: boolean
  onFilterChange: (key: string, value: string | boolean | number) => void
  onPriceRangeChange: (min: number, max: number) => void
  onYearRangeChange: (min: number, max: number) => void
  onMileageRangeChange: (min: number, max: number) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
  onClearAllFilters: () => void
  activeFiltersCount: number
}

interface FilterSection {
  id: string
  title: string
  icon: React.ReactNode
  isOpen: boolean
  filters: FilterItem[]
}

interface FilterItem {
  key: string
  label: string
  type: 'select' | 'input' | 'checkbox'
  value: any
  options?: string[]
  placeholder?: string
}

export default function SmartFilters({
  filters,
  stats,
  statsLoading,
  onFilterChange,
  onPriceRangeChange,
  onYearRangeChange,
  onMileageRangeChange,
  onSortChange,
  onClearAllFilters,
  activeFiltersCount,
}: SmartFiltersProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['search']))

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const handleQuickFilter = (filterId: string) => {
    switch (filterId) {
      case 'recent':
        onSortChange('createdAt', 'desc')
        break
      case 'featured':
        onFilterChange('featured', !filters.featured)
        break
      case 'budget':
        if (stats) {
          const budgetMax = Math.min(stats.priceRange.max, 200000)
          onPriceRangeChange(stats.priceRange.min, budgetMax)
        }
        break
      case 'new':
        if (stats) {
          const currentYear = new Date().getFullYear()
          onYearRangeChange(currentYear - 3, currentYear)
        }
        break
    }
  }

  const getActiveFiltersBadges = () => {
    const badges = []

    if (filters.search) badges.push({ key: 'search', label: `Busca: ${filters.search}`, value: filters.search })
    if (filters.brand) badges.push({ key: 'brand', label: `Marca: ${filters.brand}`, value: filters.brand })
    if (filters.fuel) badges.push({ key: 'fuel', label: `Combustível: ${filters.fuel}`, value: filters.fuel })
    if (filters.transmission) badges.push({ key: 'transmission', label: `Câmbio: ${filters.transmission}`, value: filters.transmission })
    if (filters.featured) badges.push({ key: 'featured', label: 'Apenas destaques', value: true })

    // Verificar se há filtros de range ativos
    if (stats) {
      if (filters.minPrice > stats.priceRange.min || filters.maxPrice < stats.priceRange.max) {
        badges.push({
          key: 'price',
          label: `Preço: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(filters.minPrice)} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(filters.maxPrice)}`,
          value: [filters.minPrice, filters.maxPrice]
        })
      }
      if (filters.minYear > stats.yearRange.min || filters.maxYear < stats.yearRange.max) {
        badges.push({
          key: 'year',
          label: `Ano: ${filters.minYear} - ${filters.maxYear}`,
          value: [filters.minYear, filters.maxYear]
        })
      }
      if (filters.minMileage > stats.mileageRange.min || filters.maxMileage < stats.mileageRange.max) {
        badges.push({
          key: 'mileage',
          label: `KM: ${filters.minMileage.toLocaleString('pt-BR')} - ${filters.maxMileage.toLocaleString('pt-BR')}`,
          value: [filters.minMileage, filters.maxMileage]
        })
      }
    }

    return badges
  }

  const removeFilter = (key: string, value?: any) => {
    switch (key) {
      case 'search':
      case 'brand':
      case 'fuel':
      case 'transmission':
        onFilterChange(key, '')
        break
      case 'featured':
        onFilterChange(key, false)
        break
      case 'price':
        if (stats) {
          onPriceRangeChange(stats.priceRange.min, stats.priceRange.max)
        }
        break
      case 'year':
        if (stats) {
          onYearRangeChange(stats.yearRange.min, stats.yearRange.max)
        }
        break
      case 'mileage':
        if (stats) {
          onMileageRangeChange(stats.mileageRange.min, stats.mileageRange.max)
        }
        break
    }
  }

  const activeBadges = getActiveFiltersBadges()

  const sections: FilterSection[] = [
    {
      id: 'search',
      title: 'Busca',
      icon: <Search className="h-4 w-4" />,
      isOpen: openSections.has('search'),
      filters: [
        {
          key: 'search',
          label: 'Buscar por termo',
          type: 'input',
          value: filters.search,
          placeholder: 'Título, modelo, localização...'
        },
        {
          key: 'brand',
          label: 'Marca',
          type: 'select',
          value: filters.brand,
          options: stats?.brands || []
        }
      ]
    },
    {
      id: 'price',
      title: 'Preço e Ano',
      icon: <DollarSign className="h-4 w-4" />,
      isOpen: openSections.has('price'),
      filters: [
        {
          key: 'minPrice',
          label: 'Preço mínimo',
          type: 'input',
          value: filters.minPrice,
          placeholder: '0'
        },
        {
          key: 'maxPrice',
          label: 'Preço máximo',
          type: 'input',
          value: filters.maxPrice,
          placeholder: '1000000'
        },
        {
          key: 'minYear',
          label: 'Ano mínimo',
          type: 'input',
          value: filters.minYear,
          placeholder: '2010'
        },
        {
          key: 'maxYear',
          label: 'Ano máximo',
          type: 'input',
          value: filters.maxYear,
          placeholder: String(new Date().getFullYear())
        }
      ]
    },
    {
      id: 'details',
      title: 'Detalhes',
      icon: <Settings className="h-4 w-4" />,
      isOpen: openSections.has('details'),
      filters: [
        {
          key: 'fuel',
          label: 'Combustível',
          type: 'select',
          value: filters.fuel,
          options: stats?.fuels || []
        },
        {
          key: 'transmission',
          label: 'Câmbio',
          type: 'select',
          value: filters.transmission,
          options: stats?.transmissions || []
        },
        {
          key: 'featured',
          label: 'Apenas destaques',
          type: 'checkbox',
          value: filters.featured
        }
      ]
    },
    {
      id: 'condition',
      title: 'Condição',
      icon: <Car className="h-4 w-4" />,
      isOpen: openSections.has('condition'),
      filters: [
        {
          key: 'minMileage',
          label: 'KM mínimo',
          type: 'input',
          value: filters.minMileage,
          placeholder: '0'
        },
        {
          key: 'maxMileage',
          label: 'KM máximo',
          type: 'input',
          value: filters.maxMileage,
          placeholder: '500000'
        }
      ]
    }
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Limpar ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickFilter('recent')}
            className="px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            <Zap className="h-4 w-4" />
            Recentes
          </button>
          <button
            onClick={() => handleQuickFilter('featured')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
              filters.featured
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <Star className="h-4 w-4" />
            Destaques
          </button>
          <button
            onClick={() => handleQuickFilter('budget')}
            className="px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            <DollarSign className="h-4 w-4" />
            Econômicos
          </button>
          <button
            onClick={() => handleQuickFilter('new')}
            className="px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            <Calendar className="h-4 w-4" />
            Novos
          </button>
        </div>
      </div>

      {/* Filtros ativos */}
      {activeBadges.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex flex-wrap gap-2">
            {activeBadges.map((badge) => (
              <span
                key={badge.key}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {badge.label}
                <button
                  onClick={() => removeFilter(badge.key, badge.value)}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Seções de filtro */}
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                {section.icon}
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{section.title}</span>
              </div>
              {section.isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {section.isOpen && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.filters.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {filter.label}
                      </label>

                      {filter.type === 'select' && (
                        <select
                          value={filter.value}
                          onChange={(e) => onFilterChange(filter.key, e.target.value)}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                        >
                          <option value="">{`Todas as ${filter.label.toLowerCase()}`}</option>
                          {filter.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {filter.type === 'input' && (
                        <input
                          type="number"
                          value={filter.value}
                          onChange={(e) => onFilterChange(filter.key, parseInt(e.target.value) || 0)}
                          placeholder={filter.placeholder}
                          className="w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm"
                        />
                      )}

                      {filter.type === 'checkbox' && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filter.value}
                            onChange={(e) => onFilterChange(filter.key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{filter.label}</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
