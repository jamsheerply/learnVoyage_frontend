import { Link } from "react-router-dom";
import warningImg from "../assets/warming some.png";

const SomeWentWrong = () => {
  return (
    <div className="flex flex-col justify-center items-center my-2">
      <div>
        <img src={warningImg} alt="Warning" className="w-14 h-15 my-4" />
      </div>
      <p className="font-bold">Oops, something went wrong</p>
      <p className="font-semibold">There was a problem connecting to Proton</p>

      <p className="font-bold my-2 border bg-green-500 p-2 rounded-lg text-gray-200">
        <Link to="/admin/overview">Back to Home</Link>
      </p>
    </div>
  );
};

export default SomeWentWrong;
