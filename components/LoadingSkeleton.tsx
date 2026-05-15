export default function LoadingSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar Skeleton */}
      <div className="w-72 bg-white shadow-lg flex flex-col">
        <div className="p-3 bg-green-700 flex flex-col gap-2">
          <div className="h-9 bg-green-600 rounded-lg animate-pulse"></div>
          <div className="h-9 bg-green-600 rounded-lg animate-pulse"></div>
        </div>
        <div className="p-3 flex flex-wrap gap-1">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div>
          ))}
        </div>
        <div className="flex-1 p-2">
          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
            <div key={i} className="px-4 py-3 border-b">
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-1 w-24"></div>
              <div className="h-3 bg-gray-50 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Skeleton */}
      <div className="flex-1 bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-3">🗺️</span>
          <p className="text-gray-400 text-sm">মানচিত্র লোড হচ্ছে...</p>
        </div>
      </div>
    </div>
  );
}