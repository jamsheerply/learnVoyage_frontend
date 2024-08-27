import React from "react";

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-4xl h-64 mt-4 rounded-lg overflow-hidden border-2 border-gray-300 bg-white">
      <div className="w-full lg:w-1/3 h-full overflow-hidden bg-gray-200 animate-pulse">
        {/* Skeleton for image */}
      </div>
      <div className="w-full lg:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-3 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded w-16 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-2 mt-2">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
