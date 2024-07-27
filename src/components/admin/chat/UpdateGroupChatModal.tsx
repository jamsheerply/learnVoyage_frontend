import { AppDispatch, RootState } from "@/store/store";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserBadgeItem from "./UserBadgeItem";
import { userChatEntity } from "@/types/userChatEntity";
import {
  addToGroupChat,
  fetchChats,
  removeFromGroupChat,
  renameGroupChat,
} from "@/store/chat/chatsActions";
import { searchUserApi } from "@/store/api/ChatApi";
import UserListItem from "./UserListItem";
import { chatEntity } from "@/types/chatEntity";
import { selectedChat, SetselectedChat } from "@/store/chat/chatsSlice";

// interface UpdateGroupChatModalProps {
//   fetchAgain: boolean;
//   setFetchAgain: (fetchAgain: boolean) => void;
// }

const UpdateGroupChatModal: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [renameLoading, setRenameLoading] = useState<boolean>(false);
  const { chat, chats } = useSelector((state: RootState) => state.chats);
  const { userId } = useSelector((state: RootState) => state.auth);
  const toast = useToast();

  const handleRemove = async (user1: userChatEntity) => {
    if (
      chat?.groupAdmin?._id.toString() !== userId &&
      user1._id?.toString() !== userId
    ) {
      toast({
        title: "only admins can remove someOne!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      if (chat?._id && user1._id) {
        await dispatch(
          removeFromGroupChat({
            chatId: chat?._id.toString(),
            userId: user1._id.toString(),
          })
        );
      }
      if (user1._id?.toString() === userId) {
        await dispatch(SetselectedChat(null));
      }
      await dispatch(fetchChats());

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "Failed to remove the group chat.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      if (chat?._id) {
        await dispatch(
          renameGroupChat({
            chatName: groupChatName,
            chatId: chat._id.toString(),
          })
        );
        await dispatch(fetchChats());
        setRenameLoading(false);
        setGroupChatName(""); // Clear the input field after renaming
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "Failed to rename the group chat.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
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
      const response = await searchUserApi(query);
      console.log(JSON.stringify(response.data.data));
      setLoading(false);
      setSearchResult(response.data.data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUSer = async (user1: userChatEntity) => {
    if (chat?.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        description: "error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (chat?.groupAdmin && chat?.groupAdmin._id.toString() !== userId) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      if (chat?._id && user1._id) {
        setLoading(true);
        await dispatch(
          addToGroupChat({
            chatId: chat?._id?.toString(),
            userId: user1._id?.toString(),
          })
        );
        await dispatch(fetchChats());
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="View Group Chat"
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{chat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {/* but here it not changing and not showing the updated user */}
              {chat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id.toString()}
                  user={JSON.parse(JSON.stringify(u))}
                  admin={chat.groupAdmin?.toString()}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex" mb={3}>
              <Input
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((user) => (
                // Render search results here
                <UserListItem
                  key={user._id.toString()}
                  user={user}
                  handleFunction={() => handleAddUSer(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(chat)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
