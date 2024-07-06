import React from "react";
import {
  Bell,
  Home,
  LogOut,
  MessageCircleMore,
  NotebookPen,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import profileImg from "../assets/profilePic.svg";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/auth/authActions";
import { useDispatch } from "react-redux";

const AdminLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const pathArray = location.pathname.split("/").filter((part) => part !== "");
  const lastValue = pathArray.pop();

  const handleNavigation = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  const navItems = [
    { name: "Overview", path: "/admin/overview", icon: Home },
    { name: "Categories", path: "/admin/categories", icon: ShoppingBag },
    { name: "Instructors", path: "/admin/instructors", icon: NotebookPen },
    { name: "Messages", path: "/admin/messages", icon: MessageCircleMore },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-[690px]">
      <aside className="bg-green-100 w-[250px] flex flex-col">
        <div className="p-4">
          <div className="text-green-600 text-4xl font-semibold text-center my-6">
            Admin
          </div>
        </div>
        <nav className="flex flex-col items-center">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`px-5 mt-6 py-2 ${
                lastValue === item.name.toLowerCase()
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-500"
              } rounded-lg w-[175px] h-[45px] flex gap-1 items-center px-8 cursor-pointer`}
              onClick={() => item.path && handleNavigation(item.path)}
            >
              <item.icon />
              {item.name}
            </button>
          ))}
          <button
            className="px-8 mt-6 py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 items-center  cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="text-black py-4 px-6 flex gap-5 justify-end items-center h-[100px]">
          <div className="text-base font-semibold flex gap-2 items-center">
            <div className="flex items-center justify-center bg-green-200 rounded-lg w-12 h-12 overflow-hidden">
              <img
                src={profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div>Jamsheer</div>
              <div>UI & UX Designer</div>
            </div>
          </div>
          <div className="bg-green-100 flex items-center p-4 rounded-md">
            <Bell />
          </div>
        </header>
        <hr className="h-px my-2 bg-gray-400 border-0" />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
