export default function ListingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-slate-900/50 overflow-hidden border border-gray-200 dark:border-slate-700 animate-pulse">
      {/* Imagem skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-slate-700"></div>

      {/* Conteúdo skeleton */}
      <div className="p-4 space-y-3">
        {/* Título skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>

        {/* Preço skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>

        {/* Detalhes skeleton */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-14"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
          </div>
        </div>

        {/* Botões skeleton */}
        <div className="flex space-x-2 pt-2">
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded flex-1"></div>
        </div>
      </div>
    </div>
  )
}
