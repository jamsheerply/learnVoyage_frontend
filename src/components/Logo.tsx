import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => {
  return (
    <>
      <h1
        className="font-extrabold text-green-600 lg:text-3xl text-1xl 
      "
      >
        <Link to="/">LearnVoyage</Link>
      </h1>
    </>
  );
};
