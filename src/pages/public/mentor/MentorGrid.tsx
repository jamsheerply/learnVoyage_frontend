import { getAllInstructorsList } from "@/store/Instructors/InstructorsActions";
import { AppDispatch, RootState } from "@/store/store";
import React, { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import SomeWentWrong from "@/components/public/common/SomeWentWrong";

const imageUrl =
  "https://res.cloudinary.com/dwcytg5ps/image/upload/v1720074303/erx24gyqq4jrlfpyat3h.jpg";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "green",
};

const MentorGrid: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [color] = useState("#ffffff");
  const { instructors, loading, error } = useSelector(
    (state: RootState) => state.instructors
  );
  useEffect(() => {
    dispatch(getAllInstructorsList());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (error) {
    return <SomeWentWrong />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((mentor, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col"
          >
            <div className="h-12 sm:h-40 lg:h-48 overflow-hidden ">
              <img
                src={mentor.profile?.avatar || imageUrl}
                alt={mentor.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                {`${mentor.firstName} ${mentor.lastName}`}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {mentor.profession || "instructor"}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex justify-center mt-8">
        <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm">
          Page 1 of 3
        </button>
      </div> */}
    </div>
  );
};

export default MentorGrid;
