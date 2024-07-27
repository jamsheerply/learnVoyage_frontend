import { createGroupChatApi, searchUserApi } from "@/store/api/ChatApi";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchChats } from "@/store/chat/chatsActions";

interface GroupChatModelProps {
  children: React.ReactNode;
}

interface User {
  _id: string;
  name: string;
}

const GroupChatModel: React.FC<GroupChatModelProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

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

  const handleDelete = (delUser: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const response = await createGroupChatApi(
        groupChatName,
        selectedUsers.map((u) => u._id)
      );
      await dispatch(fetchChats());
      console.log(JSON.stringify(response.data.data));
      onClose(); // Close the modal after successful submission
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response?.data || "Unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
