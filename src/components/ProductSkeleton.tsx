const ProductSkeleton = () => (
  <div className="relative flex flex-col items-center justify-between text-center shadow-md rounded-xl p-4 bg-white border border-gray-50 w-full h-full animate-pulse">
    {/* Şəkil sahəsi */}
    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
    
    {/* Mətn sahəsi (Ad üçün) */}
    <div className="w-full px-2 space-y-2 flex flex-col items-center">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
    </div>

    {/* Qiymət sahəsi */}
    <div className="mt-4 flex justify-center items-center gap-3 w-full">
      <div className="h-5 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

export default ProductSkeleton;