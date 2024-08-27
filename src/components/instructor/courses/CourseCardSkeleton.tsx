/* eslint-disable react/react-in-jsx-scope */
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CourseCardSkeleton = () => {
  const skeletonCards = Array.from({ length: 3 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20 gap-6">
      {skeletonCards.map((_, index) => (
        <div key={index} className="rounded-xl shadow-lg">
          <div className="p-5 flex flex-col">
            <div className="rounded-xl overflow-hidden">
              <Skeleton height={200} />
            </div>
            <h5 className="text-xl">
              <Skeleton />
            </h5>
            <div className="flex justify-between">
              <div>
                <Skeleton width={80} />
              </div>
              <div>
                <Skeleton width={30} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCardSkeleton;
