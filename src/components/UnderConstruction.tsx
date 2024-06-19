import { Link } from "react-router-dom";
import underConstructionImg from "../assets/under construction.png";

const UnderConstrution = () => {
  return (
    <div className="flex flex-col justify-center items-center my-2">
      <div>
        <img
          src={underConstructionImg}
          alt="Warning"
          className="w-14 h-15 my-4"
        />
      </div>
      <p className="font-bold">Oops, under construction</p>
      <p className="font-semibold">We are Online Soon</p>

      <p className="font-bold my-2 border bg-green-500 p-2 rounded-lg text-gray-200">
        <Link to="/admin/overview">Back to Home</Link>
      </p>
    </div>
  );
};

export default UnderConstrution;
