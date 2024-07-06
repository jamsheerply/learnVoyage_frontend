import React from "react";
import { useNavigate } from "react-router-dom";
import instructorImg from "../../assets/instructorPage2.png";

const Tech = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/instructor-auth/signup", { replace: true });
  };

  return (
    <>
      <div className="flex px-8 py-3 h-full">
        <div className="w-[50%] b flex flex-col items-center justify-center">
          <div>
            <h1 className="font-bold text-4xl">Come teach </h1>
            <h1 className="font-bold text-4xl">with us</h1>
            <p className="font-medium my-2">Become an instructor and change </p>
            <p className="font-medium">lives — including your own</p>
            <button
              className="py-2 text-center w-[100%] border bg-green-500 my-3"
              onClick={handleNavigate}
            >
              Get started
            </button>
          </div>
        </div>
        <div className="w-[50%]">
          <img src={instructorImg} alt="Instructor" />
        </div>
      </div>
    </>
  );
};

export default Tech;
