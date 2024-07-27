import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./chatLogic";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { chatEntity } from "@/types/chatEntity";

interface ScrollableChatProps {
  messages: chatEntity;
}

// Function to remove duplicate messages based on _id
const removeDuplicates = (messages: any[]) => {
  const seen = new Set();
  return messages.filter((message) => {
    const duplicate = seen.has(message._id);
    seen.add(message._id);
    return !duplicate;
  });
};

function ScrollableChat({ messages }: ScrollableChatProps) {
  const { userId } = useSelector((state: RootState) => state.auth);

  // Remove duplicate messages
  const uniqueMessages = removeDuplicates(messages);

  return (
    <ScrollableFeed>
      {uniqueMessages &&
        uniqueMessages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id.toString()}>
            {(isSameSender(uniqueMessages, m, i, userId) ||
              isLastMessage(uniqueMessages, i, userId)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === userId ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(uniqueMessages, m, i, userId),
                marginTop: isSameUser(uniqueMessages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
