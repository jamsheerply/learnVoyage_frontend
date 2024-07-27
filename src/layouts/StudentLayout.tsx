import React, { useEffect, useState } from "react";
import {
  Bell,
  Home,
  LogOut,
  MessageCircleMore,
  BookOpen,
  BookText,
  Settings,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import profileImg from "../assets/profilePic.svg";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/auth/authActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { getProfileById } from "@/store/profile/profileActions";

const StudentLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(getProfileById(auth.userId));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (auth.userId) {
      fetchUserData();
    }
  }, [dispatch, auth.userId]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: `${user.firstName} ${user.lastName}`,
        profilePic: user.profile?.avatar || profileImg,
        profession: user.profession || "Student",
      });
    }
  }, [user]);

  const [profile, setProfile] = useState<{
    name: string;
    profilePic: string;
    profession: string;
  }>({
    name: "",
    profilePic: "",
    profession: "",
  });

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
    { name: "Overview", path: "/student/overview", icon: Home },
    { name: "Enrollments", path: "/student/enrollments", icon: BookOpen },
    { name: "Exams", path: "/student/exams", icon: BookText },
    { name: "Messages", path: "/student/messages", icon: MessageCircleMore },
    { name: "Settings", path: "/student/settings", icon: Settings },
  ];

  return (
    <div className="flex h-[690px]">
      <aside className="bg-green-100 w-[250px] flex flex-col h-[690px] sticky top-0 left-0">
        <div className="p-4">
          <div className="text-green-600 text-4xl font-semibold text-center my-6">
            Student
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
            className="px-8 mt-6 py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 items-center cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="text-black py-4 px-6 flex gap-5 justify-end items-center h-[90px] ">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="text-base font-semibold flex gap-2 items-center">
                <div className="flex items-center justify-center bg-green-200 rounded-lg w-12 h-12 overflow-hidden">
                  <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className=" flex flex-col items-start">
                  <div>{profile.name}</div>
                  <div>{profile.profession}</div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate("/course");
                }}
              >
                Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-green-100 flex items-center p-4 rounded-md">
            <Bell className="text-green-500" />
          </div>
        </header>
        <hr className="h-px bg-gray-400 border-0" />
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
