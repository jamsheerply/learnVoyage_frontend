import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification, SetselectedChat } from "@/store/chat/chatsSlice";
import { getSender, getSenderFull } from "./chatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { createMessageApi, getMessageByIdApi } from "@/store/api/ChatApi";
import { messageEntity } from "@/types/messageEntity";
import ScrollableChat from "./ScrollableChat";
import io, { Socket } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "./typing.json";
import { chatEntity } from "@/types/chatEntity";
import { fetchChats } from "@/store/chat/chatsActions";

// Endpoint for the socket connection
const ENDPOINT = import.meta.env.VITE_CHAT_URL;

// Global variables for socket and selected chat comparison
let socket: Socket;
let selectedChatCompare: chatEntity | null = null;

function SingleChat() {
  // State variables for managing messages, loading state, new message input, socket connection, typing indicators
  const [messages, setMessages] = useState<messageEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  // Toast for displaying notifications
  const toast = useToast();

  // Default options for typing animation using Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Initialize socket connection and setup event listeners
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userId);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  // Redux hooks to access chat and auth state
  const { chat, notifications } = useSelector(
    (state: RootState) => state.chats
  );
  const { userId } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  // Fetch messages for the current chat
  const fetchMessageById = async () => {
    if (!chat?._id) return;
    try {
      setLoading(true);
      const response = await getMessageByIdApi(chat._id.toString());
      setMessages(response.data.data);
      setLoading(false);

      socket.emit("join chat", chat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch all messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Fetch messages when chat changes
  useEffect(() => {
    fetchMessageById();
    selectedChatCompare = chat;
  }, [chat?._id]);

  useEffect(() => {
    const handleNewMessage = async (newMessageReceived: messageEntity) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          await dispatch(
            setNotification([newMessageReceived, ...notifications])
          );
          await dispatch(fetchChats());
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };
    console.log("notification", notifications);

    socket.on("message received", handleNewMessage);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off("message received", handleNewMessage);
    };
  }, [socket, selectedChatCompare, notifications, dispatch]);

  // Send a message when "Enter" key is pressed
  const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMessage && chat?._id) {
      socket.emit("stop typing", chat._id);
      try {
        setNewMessage("");
        const response = await createMessageApi(
          newMessage,
          chat?._id?.toString()
        );
        socket.emit("new message", response.data.data);
        setMessages((prevMessages) => [...prevMessages, response.data.data]);
        await dispatch(fetchChats());
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Handle typing indicator
  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", chat?._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {chat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch(SetselectedChat(null))}
              aria-label="Back"
            />
            {!chat.isGroupChat ? (
              <>
                {getSender(userId, chat.users)}
                <ProfileModal user={getSenderFull(userId, chat.users)} />
              </>
            ) : (
              <>
                {chat.chatName?.toUpperCase()}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
