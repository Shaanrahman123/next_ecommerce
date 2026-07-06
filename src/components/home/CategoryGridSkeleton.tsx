export default function CategoryGridSkeleton() {
  return (
    <section className="relative border-b border-amber-900/8 bg-[#faf7f2] py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-[1]">
        <div className="mb-10 lg:mb-12 space-y-2">
          <div className="h-6 w-32 bg-amber-100 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-amber-200/50 rounded animate-pulse" />
          <div className="h-4 w-80 max-w-full bg-amber-100/80 rounded animate-pulse" />
          <div className="h-0.5 w-14 bg-amber-200 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-amber-100 overflow-hidden bg-white">
              <div className="aspect-[4/5] bg-amber-50 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-full bg-amber-100 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-amber-50 rounded animate-pulse" />
                <div className="h-3 w-20 bg-amber-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
