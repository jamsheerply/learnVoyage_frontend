import { Bell, Grip } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../store/auth/authSlice";

const NavLayout = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  return (
    <>
      <div className="flex justify-between items-center p-6 lg:px-[90px] cursor-pointer">
        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        <div className="lg:block hidden">
          <ul className="flex gap-5 font-bold text-green-600">
            <li className="bg-green-100 p-2 rounded-md">
              <Link to="/">Home</Link>
            </li>
            <li className="bg-gray-50 p-2 rounded-md">Course</li>
            <li className="bg-gray-50 p-2 rounded-md">
              <Link to="/tech">Tech</Link>
            </li>
            <li className="bg-gray-50 p-2 rounded-md">Contact Us</li>
            <li className="bg-gray-50 p-2 rounded-md">About Us</li>
          </ul>
        </div>
        <div className="lg:block hidden">
          <ul className="flex">
            <li>
              <input
                type="text"
                placeholder="Search Anything"
                className="bg-gray-200  rounded-md w-60 h-9 p-3"
              />
            </li>
            <li className="">
              <span className="material-symbols-outlined my-1">search</span>
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <div className="text-green-600 font-bold bg-green-100 rounded-md p-3 text-1xl">
            {auth.userId ? (
              <span
                onClick={() => {
                  dispatch(logoutUser());
                  toast.warning("Logged out!", { position: "bottom-left" });
                }}
              >
                Logout
              </span>
            ) : (
              <Link to="/student-auth/signin">Login</Link>
            )}
          </div>
          <div className="lucideBell bg-green-100 flex items-center px-2 rounded-md ">
            <Bell />
          </div>
          <div className="lucideBell bg-green-100 flex items-center px-2 rounded-md lg:hidden">
            <Grip />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavLayout;
