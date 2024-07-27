import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import { searchUserApi } from "@/store/api/ChatApi";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { accessChat, fetchChats } from "@/store/chat/chatsActions";

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
}

const SideDrawer = () => {
  const dispatch: AppDispatch = useDispatch(); // TypeScript dispatch type
  const auth = useSelector((state: RootState) => state.auth); // Get auth state from Redux
  const [search, setSearch] = useState(""); // State for search input
  const [searchResult, setSearchResult] = useState<User[]>([]); // State for search results
  const [loading, setLoading] = useState(false); // State for loading indicator during search
  const [loadingChat, setLoadingChat] = useState(false); // State for loading indicator during chat access
  const toast = useToast(); // Chakra UI toast for notifications
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI hooks for drawer

  // Handle search function
  const handleSearch = async () => {
    if (!search) {
      // Show warning toast if search input is empty
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
      setLoading(true); // Set loading to true before API call
      const response = await searchUserApi(search);
      // Call search API
      console.log(JSON.stringify(response.data.data)); // Log response data
      setLoading(false); // Set loading to false after API call
      setSearchResult(response.data.data); // Set search results to state
    } catch (error) {
      // Show error toast if API call fails
      toast({
        title: "Error occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false); // Set loading to false after API call
    }
  };

  // Handle chat access function
  const accessChatHandler = async (userId: string) => {
    try {
      setLoadingChat(true); // Set loadingChat to true before dispatch
      await dispatch(accessChat(userId));
      await dispatch(fetchChats()); // await dispatch(accessChat(userId)); // Dispatch accessChat action and unwrap the result
      setLoadingChat(false); // Set loadingChat to false after dispatch
      onClose(); // Close the drawer
    } catch (error) {
      // Show error toast if dispatch fails
      toast({
        title: "Error occurred!",
        description: "Failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false); // Set loadingChat to false after dispatch
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {/* Implement notification logic here */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={auth.firstName}
                // src={auth.picture} // Uncomment and set auth.picture if available
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={auth}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
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
    </>
  );
};

export default SideDrawer;
