import axios, { AxiosInstance } from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/chat-service`;

export const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const searchUserApi = (search: string) => {
  return api.get(`/search?search=${search}`);
};

export const accessChatApi = (userId: string) => {
  return api.post(`/access-chat`, { userId });
};

export const fetchChatsApi = () => {
  return api.get("/fetch-chats");
};

export const createGroupChatApi = (chatName: string, users: string[]) => {
  return api.post("/create-groupchat", { chatName, users });
};

export const renameGroupChatApi = (chatName: string, chatId: string) => {
  return api.patch("/rename-groupchat", { chatName, chatId });
};

export const addToGroupChatApi = (chatId: string, userId: string) => {
  return api.patch("/add-groupchat", { chatId, userId });
};

export const removeFromGroupChatApi = (chatId: string, userId: string) => {
  return api.patch("/remove-groupchat", { chatId, userId });
};

export const createMessageApi = (content: string, chatId: string) => {
  return api.post("/create-message", { content, chatId });
};
export const getMessageByIdApi = (chatId: string) => {
  return api.get(`/getMessageById/${chatId}`);
};
