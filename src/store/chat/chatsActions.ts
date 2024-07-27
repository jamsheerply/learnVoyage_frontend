import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatEntity } from "@/types/chatEntity";
import { handleAxiosError } from "@/utils.ts/HandleAxiosError";
import {
  accessChatApi,
  addToGroupChatApi,
  fetchChatsApi,
  removeFromGroupChatApi,
  renameGroupChatApi,
} from "../api/ChatApi";

// Access Chat Action
export const accessChat = createAsyncThunk<
  chatEntity, // Return type of the fulfilled action
  string, // The first argument to the payload creator (userId)
  {
    rejectValue: string; // The return type of the rejected action
  }
>("admin/chat", async (userId, { rejectWithValue }) => {
  try {
    const response = await accessChatApi(userId);
    return response.data.data as chatEntity;
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

// Fetch Chats Action
export const fetchChats = createAsyncThunk<
  chatEntity[], // Return type of the fulfilled action
  void, // No argument needed for this action
  {
    rejectValue: string; // The return type of the rejected action
  }
>("admin/chats", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchChatsApi();
    return response.data.data as chatEntity[];
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

// Rename Group Chat Action
export const renameGroupChat = createAsyncThunk<
  chatEntity, // Return type of the fulfilled action
  { chatName: string; chatId: string }, // The arguments to the payload creator
  {
    rejectValue: string; // The return type of the rejected action
  }
>(
  "admin/groupChat/rename",
  async ({ chatName, chatId }, { rejectWithValue }) => {
    try {
      const response = await renameGroupChatApi(chatName, chatId);
      return response.data.data as chatEntity;
    } catch (error: unknown) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const addToGroupChat = createAsyncThunk<
  chatEntity,
  { userId: string; chatId: string },
  { rejectValue: string }
>("admin/groupChat/addTo", async ({ userId, chatId }, { rejectWithValue }) => {
  try {
    const response = await addToGroupChatApi(chatId, userId);
    return response.data.data as chatEntity;
  } catch (error) {
    const errorMessage = handleAxiosError(error);
    return rejectWithValue(errorMessage);
  }
});

export const removeFromGroupChat = createAsyncThunk<
  chatEntity,
  { userId: string; chatId: string },
  { rejectValue: string }
>(
  "admin/groupChat/removeFrom",
  async ({ userId, chatId }, { rejectWithValue }) => {
    try {
      const response = await removeFromGroupChatApi(chatId, userId);
      return response.data.data as chatEntity;
    } catch (error) {
      const errorMessage = handleAxiosError(error);
      return rejectWithValue(errorMessage);
    }
  }
);
