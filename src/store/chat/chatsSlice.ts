import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  accessChat,
  addToGroupChat,
  fetchChats,
  removeFromGroupChat,
  renameGroupChat,
} from "./chatsActions";
import { chatEntity } from "@/types/chatEntity";
import { messageEntity } from "@/types/messageEntity";

// Define the shape of the state
interface chatState {
  chats: chatEntity[];
  chat: chatEntity | null;
  loading: boolean;
  error: string | null;
  notifications: messageEntity[];
}

// Initial state
const initialState: chatState = {
  chats: [],
  chat: null,
  loading: false,
  error: null,
  notifications: [],
};

// Create the slice
const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    selectedChat(state, action) {
      state.chat = action.payload;
    },
    SetselectedChat(state, action) {
      state.chat = action.payload;
    },
    // notification(state, action) {
    //   state.notifications = action.payload;
    // },
    setNotification(state, action) {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accessChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        accessChat.fulfilled,
        (state, action: PayloadAction<chatEntity>) => {
          state.loading = false;
          console.log(JSON.stringify(action.payload));
        }
      )
      .addCase(
        accessChat.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? null;
        }
      )
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChats.fulfilled,
        (state, action: PayloadAction<chatEntity[]>) => {
          state.loading = false;
          state.chats = JSON.parse(JSON.stringify(action.payload));
        }
      )
      .addCase(
        fetchChats.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? null;
        }
      )
      .addCase(
        renameGroupChat.fulfilled,
        (state, action: PayloadAction<chatEntity>) => {
          state.loading = false;
          state.chat = JSON.parse(JSON.stringify(action.payload));
        }
      )
      .addCase(
        addToGroupChat.fulfilled,
        (state, action: PayloadAction<chatEntity>) => {
          state.loading = false;
          state.chat = JSON.parse(JSON.stringify(action.payload));
        }
      )
      .addCase(
        removeFromGroupChat.fulfilled,
        (state, action: PayloadAction<chatEntity>) => {
          state.loading = false;
          state.chat = JSON.parse(JSON.stringify(action.payload));
        }
      );
  },
});

export const {
  selectedChat,
  SetselectedChat,
  // notification,
  setNotification,
} = chatsSlice.actions;
export default chatsSlice.reducer;
