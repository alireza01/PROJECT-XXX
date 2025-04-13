export default function Loading() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse"></div>
      </div>
      
      <div className="border rounded-md p-4">
        <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="h-10 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}