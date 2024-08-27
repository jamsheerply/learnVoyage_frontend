import React from "react";
import { useNavigate } from "react-router-dom";
import instructorImg from "../../assets/instructorPage2.png";

const Tech = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/instructor-auth/signup", { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-8 py-3 min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0">
        <div className="text-center md:text-left">
          <h1 className="font-bold text-3xl md:text-4xl">Come teach</h1>
          <h1 className="font-bold text-3xl md:text-4xl">with us</h1>
          <p className="font-medium my-2">Become an instructor and change</p>
          <p className="font-medium">lives — including your own</p>
          <button
            className="py-2 text-center w-full md:w-auto px-6 border bg-green-500 text-white rounded-md my-3 hover:bg-green-600 transition duration-300"
            onClick={handleNavigate}
          >
            Get started
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
          src={instructorImg}
          alt="Instructor"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Tech;
