import React, { useState, useEffect } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Badge } from "customizable-react-badges";
import { setNotification, SetselectedChat } from "@/store/chat/chatsSlice";
import { getSender } from "@/components/admin/chat/chatLogic";
import { getProfileById } from "@/store/profile/profileActions";

const NavLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.profile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
        profession: user.profession || "Instructor",
      });
    }
  }, [user]);

  const [profile, setProfile] = useState({
    name: "",
    profilePic: "",
    profession: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
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
                          src={profile.profilePic}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{profile.name}</span>
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
              {/* <div className="flex justify-center items-center w-10 h-10 ml-2">
                <Menu>
                  <Badge
                    content={notifications.length}
                    verticalAlignment="top"
                    horizontalAlignment="right"
                    bgColor="skyblue"
                    hideZero
                  >
                    <MenuButton>
                      <Bell className="text-green-500 w-6 h-6" />
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
      <main className="flex-grow pt-16 w-full max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;
