import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/auth/authActions";
import profileImg from "../assets/profilePic.svg";
import {
  Bell,
  Home,
  LogOut,
  MessageCircleMore,
  BookOpen,
  NotebookPen,
  ShoppingBag,
  Coins,
  Menu as MenuL,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Input } from "@/shadcn/ui/input";
import ChatLoading from "@/components/admin/chat/ChatLoading";
import UserListItem from "@/components/admin/chat/UserListItem";
import { searchUserApi } from "@/store/api/ChatApi";
import { accessChat, fetchChats } from "@/store/chat/chatsActions";
import { getSender } from "@/components/admin/chat/chatLogic";
import { setNotification, SetselectedChat } from "@/store/chat/chatsSlice";
// import { Badge } from "customizable-react-badges";

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications } = useSelector((state: RootState) => state.chats);
  const { userId } = useSelector((state: RootState) => state.auth);

  const [profile] = useState({
    name: "Admin",
    profilePic: profileImg,
    profession: "Admin",
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
    { name: "Overview", path: "/admin/overview", icon: Home },
    { name: "Categories", path: "/admin/categories", icon: ShoppingBag },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Assessments", path: "/admin/assessments", icon: BookOpen },
    { name: "Instructors", path: "/admin/instructors", icon: NotebookPen },
    { name: "transactions", path: "/admin/transactions", icon: Coins },
    { name: "Messages", path: "/admin/messages", icon: MessageCircleMore },
  ];

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await searchUserApi(search);
      setLoading(false);
      setSearchResult(response.data.data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChatHandler = async (userId: string) => {
    try {
      setLoadingChat(true);
      await dispatch(accessChat(userId));
      await dispatch(fetchChats());
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for large screens */}
      <aside className="bg-green-100 w-64 flex-shrink-0 hidden lg:block overflow-y-auto">
        <div className="h-full flex flex-col">
          <div className="text-green-600 text-4xl font-semibold text-center my-6">
            Admin
          </div>
          <nav className="flex-1 flex flex-col items-center">
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
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center h-20 flex-shrink-0">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* New container for search and profile */}
          <div className="flex-1 flex justify-between items-center">
            {/* Search section */}
            <div className="flex items-center">
              {lastValue === "messages" && (
                <Tooltip
                  label="Search Users to chat"
                  hasArrow
                  placement="bottom-end"
                >
                  <Button variant="ghost" onClick={onOpen}>
                    <i className="fas fa-search"></i>
                    <Text display={{ base: "none", md: "flex" }} px={4}>
                      Search User
                    </Text>
                  </Button>
                </Tooltip>
              )}
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
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <div className="flex justify-center items-center w-10 h-10">
                <Menu>
                  <Badge
                    content={notifications.length}
                    verticalAlignment="top"
                    horizontalAlignment="right"
                    bgColor="skyblue"
                    hideZero
                  >
                    <MenuButton>
                      <Bell className="text-green-500 w-9 h-9" />
                    </MenuButton>
                    <MenuList pl={2}>
                      {!notifications.length && "No new messages"}
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
                            ? `New Message in ${notif.chat.chatName}`
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
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChatHandler(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
