import React, { useState } from "react";
import { Bell, Grip, X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/public/auth/Logo";
import { useDispatch, useSelector } from "react-redux";
import profileImg from "../assets/profilePic.svg";
import { logoutUser } from "../store/auth/authActions";
import { AppDispatch, RootState } from "../store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

const NavLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDashboardNavigation = () => {
    if (auth.userId) {
      if (auth.role === "student") {
        navigate("/student/overview");
      } else if (auth.role === "instructor") {
        navigate("/instructor/overview");
      } else if (auth.role === "admin") {
        navigate("/admin/overview");
      }
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/course", label: "Course" },
    { path: "/tech", label: "Tech" },
    { path: "/mentors", label: "Mentors" },
    { path: "/about", label: "About Us" },
  ];

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center">
              <ul className="flex space-x-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.path
                          ? "bg-green-100 text-green-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                {auth.userId ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-green-100 text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <img
                          src={profileImg}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{auth.firstName}</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardNavigation}>
                        Dashboard
                      </DropdownMenuItem>

                      {auth.role === "student" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/student/enrollments");
                            }}
                          >
                            Enrollments
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/student/exams");
                            }}
                          >
                            Exams
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/student/messages");
                            }}
                          >
                            Messages
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/student/settings");
                            }}
                          >
                            Settings
                          </DropdownMenuItem>
                        </>
                      )}
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
                  <Link
                    to="/student-auth/signin"
                    className="bg-green-100 text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
              <button className="ml-4 bg-green-100 p-2 rounded-md text-green-500">
                <Bell size={20} />
              </button>
              <div className="ml-4 md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-green-100 p-2 rounded-md text-green-500"
                >
                  {isMenuOpen ? <X size={20} /> : <Grip size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-green-100 text-green-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default NavLayout;
