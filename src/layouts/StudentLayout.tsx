import React, { useEffect, useState } from "react";
import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  BookOpen,
  Book,
  Settings,
  Menu as MenuL,
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
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Badge } from "customizable-react-badges";
import { setNotification, SetselectedChat } from "@/store/chat/chatsSlice";
import { getSender } from "@/components/admin/chat/chatLogic";

const StudentLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.profile);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.chats);
  const { userId } = useSelector((state: RootState) => state.auth);
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
    { name: "Exams", path: "/student/exams", icon: Book },
    { name: "Messages", path: "/student/messages", icon: MessageCircle },
    { name: "Settings", path: "/student/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="bg-green-100 w-64 flex-shrink-0 hidden lg:block overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="text-green-600 text-4xl font-semibold text-center my-6">
            Student
          </div>

          <nav className="flex flex-col items-center">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`px-5 mt-6 py-2 ${
                  lastValue === item.name.toLowerCase()
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-500"
                } rounded-lg w-3/4 h-12 flex gap-1 items-center justify-start cursor-pointer`}
                onClick={() => item.path && handleNavigation(item.path)}
              >
                <item.icon className="mr-2" />
                {item.name}
              </button>
            ))}
            <button
              className="px-5 mt-6 py-2 bg-white text-gray-500 rounded-lg w-3/4 h-12 flex gap-1 items-center justify-start cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center h-20 lg:justify-end">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MenuL className="w-8 h-8 text-gray-700 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => item.path && handleNavigation(item.path)}
                  >
                    <item.icon className="mr-2" />
                    {item.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User profile and notifications */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="text-base font-semibold flex items-center">
                  <div className="flex items-center justify-center bg-green-200 rounded-lg w-10 h-10 overflow-hidden mr-2">
                    <img
                      src={profile.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <div>{profile.name}</div>
                    <div className="text-sm text-gray-500">
                      {profile.profession}
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/course")}>
                  Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <div className=" flex justify-center items-center w-10 h-10">
              <Menu>
                <Badge
                  content={notifications.length}
                  verticalAlignment="top"
                  horizontalAlignment="right"
                  bgColor="skyblue"
                  hideZero
                >
                  <MenuButton className="  ">
                    <Bell className="text-green-500 w-9 h-9" />
                  </MenuButton>
                  <MenuList pl={2}>
                    {!notifications.length && " no new messages"}
                    {notifications.map((notif) => (
                      <MenuItem
                        key={notif._id}
                        onClick={async () => {
                          await dispatch(SetselectedChat(notif.chat));
                          await dispatch(
                            setNotification(
                              notifications.filter((n) => n !== notif)
                            )
                          );
                        }}
                      >
                        {notif.chat.isGroupchat
                          ? `New Message in ${notifications.chat.chatName}`
                          : `New Message from ${getSender(
                              userId,
                              notif.chat.users
                            )}`}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Badge>
              </Menu>
            </div> */}
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
