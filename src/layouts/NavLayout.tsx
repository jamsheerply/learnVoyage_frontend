import React from "react";
import { Bell, Grip } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import profileImg from "../assets/profilePic.svg";
import { logoutUser } from "../store/auth/authActions";
import { AppDispatch, RootState } from "../store/store"; // Ensure you import AppDispatch and RootState types
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

const NavLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  console.log(location.pathname);

  const handleDashboardNavigation = () => {
    if (auth.role === "student") {
      navigate("/student/overview");
    } else if (auth.role === "instructor") {
      navigate("/instructor/overview");
    } else if (auth.role === "admin") {
      navigate("/admin/overview");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-6 lg:px-[90px] cursor-pointer">
        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        <div className="lg:block hidden">
          <ul className="flex gap-5 font-bold text-green-600">
            <li
              className={`p-2 rounded-md ${
                location.pathname === "/" ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={`p-2 rounded-md ${
                location.pathname === "/course" ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              <Link to="/course">Course</Link>
            </li>
            <li
              className={`p-2 rounded-md ${
                location.pathname === "/tech" ? "bg-green-100" : "bg-gray-50"
              }`}
            >
              <Link to="/tech">Tech</Link>
            </li>
            <li className="bg-gray-50 p-2 rounded-md">Contact Us</li>
            <li className="bg-gray-50 p-2 rounded-md">About Us</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <div className="text-green-600 font-bold bg-green-100 rounded-md px-3 py-1 text-1xl h-10">
            {auth.userId ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="text-base font-semibold flex gap-2 items-center">
                    <div className="flex items-center justify-center bg-green-200 rounded-lg size-8 overflow-hidden">
                      <img
                        src={profileImg}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>{auth.firstName}</div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboardNavigation}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logoutUser());
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/student-auth/signin">Login</Link>
            )}
          </div>

          <div className="lucideBell bg-green-100 flex items-center px-2 rounded-md">
            <Bell />
          </div>
          <DropdownMenu>
            <div className="lucideBell bg-green-100 flex items-center px-2 rounded-md lg:hidden">
              <DropdownMenuTrigger>
                <Grip />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/course">Course</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/tech">Tech</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Contact Us</DropdownMenuItem>
                <DropdownMenuItem>About Us</DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavLayout;
