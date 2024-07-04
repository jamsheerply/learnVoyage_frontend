import { Link } from "react-router-dom";
import page404 from "../../assets/Page404.gif";

const Page404 = () => {
  return (
    <div className="flex flex-col justify-center items-center my-2">
      <div>
        <img src={page404} alt="404" className="size-80" />
      </div>
      <p className="font-bold text-3xl">404 Page Not Found</p>
      <p className="font-semibold text-sm">
        The page you requested does not exist.
      </p>

      <p className="font-bold my-2 border bg-green-500 p-2 rounded-lg text-gray-200">
        <Link to="/admin/overview">Back to Home</Link>
      </p>
    </div>
  );
};

export default Page404;
