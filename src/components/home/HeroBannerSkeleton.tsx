export default function HeroBannerSkeleton() {
  return (
    <div className="relative h-[50vh] md:h-[75vh] min-h-[320px] md:min-h-[520px] w-full bg-linear-to-br from-amber-100 via-rose-50 to-orange-50 animate-pulse border-b border-amber-200/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
        <div className="h-7 w-40 bg-amber-200/50 rounded-full" />
        <div className="h-10 md:h-14 w-72 max-w-full bg-amber-200/40 rounded" />
        <div className="h-10 w-40 bg-orange-300/40 rounded-sm mt-2" />
      </div>
    </div>
  );
}
