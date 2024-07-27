import React from "react";
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ChatBox = () => {
  const { chat } = useSelector((state: RootState) => state.chats);
  return (
    <Box
      display={{ base: chat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
      // fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default ChatBox;
