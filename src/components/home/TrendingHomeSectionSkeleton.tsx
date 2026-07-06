export default function TrendingHomeSectionSkeleton() {
  return (
    <section className="relative border-b border-amber-900/8 bg-[#fdf5f3] py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-[1]">
        <div className="mb-8 lg:mb-10 space-y-2">
          <div className="h-6 w-32 bg-rose-100 rounded-full animate-pulse" />
          <div className="h-8 w-72 bg-rose-200/40 rounded animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-rose-100/80 rounded animate-pulse" />
          <div className="h-0.5 w-14 bg-rose-200 rounded-full animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[42vw] lg:w-[17vw] rounded-xl border border-rose-100 overflow-hidden bg-white">
              <div className="aspect-[3/4] bg-rose-50 animate-pulse" />
              <div className="p-3 space-y-2 border-t border-rose-50">
                <div className="h-3 w-full bg-rose-100 rounded animate-pulse" />
                <div className="h-2 w-2/3 bg-rose-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
