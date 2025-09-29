"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, X, Filter, Search, Car, Fuel, Settings, Zap, Star } from "lucide-react"

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
  onFilterChange: (key: string, value: string | boolean) => void
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
  type: 'select' | 'range' | 'checkbox'
  value: any
  options?: string[]
  rangeConfig?: {
    min: number
    max: number
    step: number
    format: (value: number) => string
  }
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
  const [quickFilters, setQuickFilters] = useState([
    { id: 'recent', label: 'Recentes', icon: <Zap className="h-4 w-4" />, active: false },
    { id: 'featured', label: 'Destaques', icon: <Star className="h-4 w-4" />, active: false },
    { id: 'budget', label: 'Econômicos', icon: <Car className="h-4 w-4" />, active: false },
    { id: 'new', label: 'Novos', icon: <Settings className="h-4 w-4" />, active: false },
  ])

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
    const wasActive = quickFilters.find(f => f.id === filterId)?.active

    setQuickFilters(prev =>
      prev.map(f => ({ ...f, active: f.id === filterId ? !f.active : false }))
    )

    // Aplicar lógica do filtro rápido
    switch (filterId) {
      case 'recent':
        if (!wasActive) {
          onSortChange('createdAt', 'desc')
        } else {
          onSortChange('createdAt', 'desc')
        }
        break
      case 'featured':
        onFilterChange('featured', !wasActive)
        break
      case 'budget':
        if (!wasActive) {
          onPriceRangeChange(50000, 150000)
        } else {
          // Reset para valores padrão quando desativar
          onPriceRangeChange(50000, 1000000)
        }
        break
      case 'new':
        if (!wasActive) {
          onYearRangeChange(new Date().getFullYear() - 2, new Date().getFullYear())
        } else {
          // Reset para valores padrão quando desativar
          onYearRangeChange(2010, new Date().getFullYear())
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
      title: 'Busca e Categoria',
      icon: <Search className="h-4 w-4" />,
      isOpen: openSections.has('search'),
      filters: [
        {
          key: 'search',
          label: 'Buscar',
          type: 'select',
          value: filters.search,
          options: ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'Iveco', 'Marcopolo', 'Caio']
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
      title: 'Preço',
      icon: <Car className="h-4 w-4" />,
      isOpen: openSections.has('price'),
      filters: [
        {
          key: 'price',
          label: 'Faixa de Preço',
          type: 'range',
          value: [filters.minPrice, filters.maxPrice],
          rangeConfig: stats ? {
            min: stats.priceRange.min,
            max: stats.priceRange.max,
            step: 1000,
            format: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
          } : undefined
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
        }
      ]
    },
    {
      id: 'condition',
      title: 'Condição',
      icon: <Fuel className="h-4 w-4" />,
      isOpen: openSections.has('condition'),
      filters: [
        {
          key: 'year',
          label: 'Ano',
          type: 'range',
          value: [filters.minYear, filters.maxYear],
          rangeConfig: stats ? {
            min: stats.yearRange.min,
            max: stats.yearRange.max,
            step: 1,
            format: (value) => value.toString()
          } : undefined
        },
        {
          key: 'mileage',
          label: 'Quilometragem',
          type: 'range',
          value: [filters.minMileage, filters.maxMileage],
          rangeConfig: stats ? {
            min: stats.mileageRange.min,
            max: stats.mileageRange.max,
            step: 5000,
            format: (value) => `${value.toLocaleString('pt-BR')} km`
          } : undefined
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
            Filtros Inteligentes
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
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleQuickFilter(filter.id)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
                filter.active
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
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
                {section.filters.map((filter) => (
                  <div key={filter.key} className="mb-4 last:mb-0">
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

                    {filter.type === 'range' && filter.rangeConfig && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{filter.rangeConfig.format(filter.rangeConfig.min)}</span>
                          <span className="font-medium">
                            {Array.isArray(filter.value) && filter.value.length === 2
                              ? `${filter.rangeConfig.format(filter.value[0])} - ${filter.rangeConfig.format(filter.value[1])}`
                              : 'Selecionar faixa'
                            }
                          </span>
                          <span>{filter.rangeConfig.format(filter.rangeConfig.max)}</span>
                        </div>
                        <input
                          type="range"
                          min={filter.rangeConfig.min}
                          max={filter.rangeConfig.max}
                          value={Array.isArray(filter.value) ? filter.value[0] : filter.rangeConfig.min}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value)
                            const newMax = Array.isArray(filter.value) ? filter.value[1] : filter.rangeConfig!.max
                            if (filter.key === 'price') onPriceRangeChange(newMin, newMax)
                            if (filter.key === 'year') onYearRangeChange(newMin, newMax)
                            if (filter.key === 'mileage') onMileageRangeChange(newMin, newMax)
                          }}
                          className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    )}

                    {filter.type === 'checkbox' && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filter.value}
                          onChange={(e) => onFilterChange(filter.key, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Apenas destaques</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
