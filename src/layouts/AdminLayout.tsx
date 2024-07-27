import React, { useState } from "react";
import profileImg from "../assets/profilePic.svg";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../store/auth/authActions";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Bell,
  BookOpen,
  Coins,
  Home,
  LogOut,
  MessageCircleMore,
  NotebookPen,
  ShoppingBag,
} from "lucide-react";
import ChatLoading from "@/components/admin/chat/ChatLoading";
import UserListItem from "@/components/admin/chat/UserListItem";
import { searchUserApi } from "@/store/api/ChatApi";
import { accessChat, fetchChats } from "@/store/chat/chatsActions";
// import { RootState } from "@/store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
}

const AdminLayout = () => {
  const dispatch: AppDispatch = useDispatch();
  // const auth = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    { name: "Courses", path: "/admin/course", icon: BookOpen },
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
      console.log(JSON.stringify(response.data.data));
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
    <div className="flex h-[100vh]">
      <aside className="bg-green-100 w-[250px] flex flex-col h-[690px] sticky top-0 left-0">
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
            className="px-8 mt-6 py-2 bg-white text-gray-500 rounded-lg w-[175px] h-[45px] flex gap-1 items-center cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1">
        <header>
          <div
            className={` ${
              lastValue === "messages" ? "flex justify-between" : ""
            }`}
          >
            {lastValue === "messages" && (
              <div className="flex items-center">
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
              </div>
            )}
            <div className="text-black py-4 px-6 flex gap-5 justify-end items-center h-[70px] ">
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
              <div className="bg-green-100 flex items-center p-4 rounded-md text-green-500">
                <Bell />
              </div>
            </div>
          </div>
        </header>
        <hr className="h-px my-2 bg-gray-400 border-0" />
        <Outlet />
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
