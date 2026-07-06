export default function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen pb-12 lg:pb-0 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-3 bg-gray-100 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12 lg:mb-16">
          {/* Gallery skeleton */}
          <div className="space-y-3 md:space-y-4">
            <div className="hidden lg:grid lg:grid-cols-2 gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-amber-100/60" />
              ))}
            </div>
            <div className="lg:hidden aspect-[3/4] rounded-xl bg-amber-100/60" />
            <div className="flex lg:hidden gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-lg bg-amber-100/50 shrink-0" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-4 md:space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-green-100 rounded-full" />
              <div className="h-6 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
              <div className="h-3 w-4/6 bg-gray-100 rounded" />
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 w-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="hidden md:flex gap-3">
              <div className="h-14 flex-1 bg-gray-200 rounded-lg" />
              <div className="h-14 w-14 bg-gray-100 rounded-lg" />
            </div>
            <div className="hidden md:block h-14 w-full bg-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Description tabs skeleton */}
        <div className="mb-8 md:mb-12 lg:mb-16 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 h-14 bg-gray-50 border-r border-gray-100 last:border-0" />
            ))}
          </div>
          <div className="p-6 lg:p-8 space-y-3">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Reviews skeleton */}
        <div className="mb-8 md:mb-12 lg:mb-16 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-40 bg-gray-50 rounded-xl" />
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Similar products skeleton */}
        <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
          <div className="h-6 w-56 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
