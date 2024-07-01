import { Bell, Grip } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import profileImg from "../assets/profilePic.svg";
import { logoutUser } from "../store/auth/authActions";
import { AppDispatch, RootState } from "../store/store"; // Ensure you import AppDispatch and RootState types

const NavLayout = () => {
  const dispatch = useDispatch<AppDispatch>(); // Properly type the dispatch function
  const auth = useSelector((state: RootState) => state.auth); // Properly type the state

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
            <li className="bg-gray-50 p-2 rounded-md">
              <Link to="/course">Course</Link>
            </li>
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
          <div className="text-green-600 font-bold bg-green-100 rounded-md px-3 py-1 text-1xl h-10">
            {auth.userId ? (
              <div
                className="text-base font-semibold flex gap-2 items-center"
                onClick={() => {
                  dispatch(logoutUser());
                }}
              >
                <div className="flex items-center justify-center bg-green-200 rounded-lg size-8 overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div>{auth.firstName}</div>
                </div>
              </div>
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
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-green-100 flex items-center px-2 rounded-md lg:hidden"
            >
              <Grip />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavLayout;
