const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="h-10 bg-muted rounded-lg w-64 mx-auto animate-pulse"></div>
        <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse"></div>
        <div className="h-4 bg-muted rounded-lg w-48 mx-auto animate-pulse"></div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg shadow-card overflow-hidden border border-border">
            {/* Image Skeleton */}
            <div className="aspect-square bg-muted animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>

              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
                <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center space-x-2 py-8">
        <div className="h-10 bg-muted rounded-lg w-20 animate-pulse"></div>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 w-10 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-10 bg-muted rounded-lg w-16 animate-pulse"></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
