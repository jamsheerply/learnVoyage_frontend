import { Square } from "lucide-react";
import React from "react";

function SimilarCoursesCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4  py-2 cursor-pointer">
      {new Array(4).fill(0).map((u) => (
        <div
          key={u}
          className="flex lg:flex-row flex-col  mt-4 lg:rounded-lg p-2 overflow-hidden border-2 border-gray-300 shadow-md font-bold  h-28"
        >
          <div className="w-44 h-full overflow-hidden ">
            <img
              className="w-full rounded-md h-full "
              src="https://dummyimage.com/6000x4000/41167a/fffSha.jpg"
              alt="Course"
            />
          </div>
          <div className="flex flex-col justify-between mx-3 w-full">
            <div>The Three Musketeers</div>
            <div className="flex justify-between ">
              <div>$40.00</div>
              <div>
                <Square className="bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SimilarCoursesCard;
