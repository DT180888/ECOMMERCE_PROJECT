export default function ProductCardSkeleton() {
  return (
    <div className="relative w-full flex flex-col animate-pulse h-full bg-transparent shadow-none border-none">
      {/* 1. Image Container */}
      <div className="relative w-full aspect-[3/4] bg-background/50 rounded-gallery overflow-hidden shadow-none flex items-center justify-center">
        <div className="w-full h-full bg-muted/10 rounded-gallery" />
        
        {/* Floating Quick Add Button Skeleton */}
        <div className="absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full bg-muted/20 shadow-neo-sm" />
      </div>

      {/* 2. Text Info */}
      <div className="pt-4 px-0.5 flex flex-col gap-2 flex-1">
        {/* Brand Name */}
        <div className="h-3 w-16 bg-muted/20 rounded-gallery" />
        
        {/* Name and Price Row */}
        <div className="flex justify-between items-baseline gap-4 mt-1 w-full">
          <div className="h-4 w-28 bg-muted/20 rounded-gallery" />
          <div className="h-4 w-16 bg-muted/20 rounded-gallery" />
        </div>
      </div>
    </div>
  );
}