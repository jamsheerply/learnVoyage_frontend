import { fetchChats } from "@/store/chat/chatsActions";
import { AppDispatch, RootState } from "@/store/store";
import { Stack, useToast, Box, Text, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLoading from "./ChatLoading";
// import { AddIcon } from "@chakra-ui/icons";
import GroupChatModel from "./GroupChatModel";
import { chatEntity } from "@/types/chatEntity";
import { selectedChat } from "@/store/chat/chatsSlice";
import { getSender } from "./chatLogic";
import { Input } from "@/shadcn/ui/input";
import { ListFilter, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

const MyChats = () => {
  // Added state for search term, sort type, and filtered chats
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<string>("default");
  const [filteredChats, setFilteredChats] = useState<chatEntity[]>([]);

  const toast = useToast();
  const dispatch: AppDispatch = useDispatch();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { chats, chat } = useSelector((state: RootState) => state.chats);
  const { userId, role } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchChatsData = async () => {
      try {
        await dispatch(fetchChats());
      } catch (error) {
        toast({
          title: "Error occurred!",
          description: "Failed to load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchChatsData();
  }, [dispatch, toast]);

  // New useEffect to handle filtering and sorting
  useEffect(() => {
    const filterAndSortChats = () => {
      let result = chats.filter((chat) => {
        const searchString = searchTerm.toLowerCase();
        if (chat.isGroupChat) {
          // Search by group name for group chats
          return chat.chatName?.toLowerCase().includes(searchString);
        } else {
          // Search by other user's name for individual chats
          const otherUser = chat.users.find(
            (user) => user._id.toString() !== userId
          );
          return (
            otherUser && otherUser.name.toLowerCase().includes(searchString)
          );
        }
      });

      // Apply sorting
      switch (sortType) {
        case "nameAZ":
          result.sort((a, b) => {
            const nameA = a.isGroupChat
              ? a.chatName
              : getSender(userId, a.users);
            const nameB = b.isGroupChat
              ? b.chatName
              : getSender(userId, b.users);
            return nameA.localeCompare(nameB);
          });
          break;
        case "nameZA":
          result.sort((a, b) => {
            const nameA = a.isGroupChat
              ? a.chatName
              : getSender(userId, a.users);
            const nameB = b.isGroupChat
              ? b.chatName
              : getSender(userId, b.users);
            return nameB.localeCompare(nameA);
          });
          break;
        case "group":
          result = result.filter((chat) => chat.isGroupChat);
          break;
        default:
          break;
      }

      setFilteredChats(result);
    };

    filterAndSortChats();
  }, [chats, searchTerm, sortType, userId]);

  // Updated search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // New sort handler
  const handleSort = (newSortType: string) => {
    setSortType(newSortType);
  };

  const handleSelectedChat = async (
    users: { _id: string }[],
    chatId: string,
    chatItem: chatEntity
  ) => {
    const selectedUser = users.find((user) => user._id !== userId);

    if (selectedUser && selectedUser._id) {
      setSelectedChatId(chatId);
      await dispatch(selectedChat(chatItem));
    } else {
      toast({
        title: "No user found!",
        description: "Could not find a user to chat with.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Box
      display={{ base: chat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          {/* Updated Input to use search functionality */}
          <Input
            placeholder="Search"
            className="border-2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Updated DropdownMenu to use sort functionality */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-green-100 rounded-sm">
              <Button colorScheme="#dcfce7">
                <ListFilter className="cursor-pointer text-green-500 " />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSort("nameAZ")}>
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("nameZA")}>
              Name Z-A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("group")}>
              Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("default")}>
              Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {role !== "student" && (
          <GroupChatModel>
            <Button
              display="flex "
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              // rightIcon={<AddIcon />}
            >
              <SquarePen />
            </Button>
          </GroupChatModel>
        )}
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {/* Updated to use filteredChats instead of chats */}
            {filteredChats.map((chatItem) => (
              <Box
                onClick={() =>
                  handleSelectedChat(
                    JSON.parse(JSON.stringify(chatItem.users)),
                    JSON.parse(JSON.stringify(chatItem._id)),
                    chatItem
                  )
                }
                cursor="pointer"
                bg={
                  chatItem._id?.toString() === selectedChatId
                    ? "#38B2AC"
                    : "#E8E8E8"
                }
                color={
                  chatItem._id?.toString() === selectedChatId
                    ? "white"
                    : "black"
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={chatItem._id?.toString()}
              >
                <Text>
                  {!chatItem.isGroupChat
                    ? getSender(userId, chatItem.users)
                    : chatItem.chatName}
                </Text>
                {chatItem.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chatItem.latestMessage.sender.name} : </b>
                    {chatItem.latestMessage.content.length > 50
                      ? chatItem.latestMessage.content.substring(0, 51) + "..."
                      : chatItem.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
