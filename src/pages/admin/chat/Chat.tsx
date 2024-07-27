import ChatBox from "@/components/admin/chat/ChatBox";
import MyChats from "@/components/admin/chat/MyChats";
// import SideDrawer from "@/components/admin/chat/SideDrawer";
import { RootState } from "@/store/store";
import { Box } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

const Chat = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="" style={{ width: "100%" }}>
      {/* {auth.userId && <SideDrawer />} */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {auth.userId && <MyChats />}
        {auth.userId && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
