import React from 'react';

const OptimizedLoading = ({ message = "Cargando...", showSkeleton = true }) => {
  if (showSkeleton) {
    return (
      <div className="animate-pulse">
        <div className="bg-theme-surface rounded-lg shadow-sm border border-theme-border">
          {/* Header skeleton */}
          <div className="px-6 py-4 border-b border-theme-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-48 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-8 bg-gray-300 rounded"></div>
                <div className="w-24 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="border-b border-theme-border">
            <div className="flex space-x-8 px-6">
              <div className="w-16 h-12 bg-gray-300 rounded"></div>
              <div className="w-20 h-12 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-6 space-y-6">
            {/* Form fields skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-28 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-36 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-10 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Image upload skeleton */}
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
              <div className="w-full h-32 bg-gray-300 rounded border-2 border-dashed border-theme-border"></div>
            </div>

            {/* Description fields skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="w-36 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-24 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                <div className="w-full h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-theme-textSecondary">{message}</p>
      </div>
    </div>
  );
};

export default OptimizedLoading;
