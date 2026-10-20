// Real-time chat using Socket.io (live messages). Saving messages uses REST in ChatMessages page.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import API_URL from "../config.js";
import { useAuth } from "../context/AuthContext.jsx";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const activeChatRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Clear chat when user logs out
  useEffect(() => {
    setActiveChat(null);
    setNotifications([]);
  }, [user]);

  // Open socket when user is logged in
  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL);

      setSocket(newSocket);

      newSocket.on("receiveMessage", (data) => {
        if (activeChatRef.current?._id !== data.chatId) {
          setNotifications((prev) => [...prev, data]);
        }
      });

      return () => newSocket.close();
    }
  }, [user]);

  // Tell server which chat room this tab is viewing
  const joinChat = (chatId) => {
    if (socket) {
      socket.emit("joinChat", chatId);
    }
  };

  // Send message through socket (UI updates quickly; backend also saves via API)
  const sendMessage = (
    chatId,
    text,
    messageId = null,
    createdAt = new Date(),
    image = null,
  ) => {
    if (socket && user) {
      const messageData = {
        chatId,
        sender: user._id,
        text,
        image,
        createdAt,
        _id: messageId,
      };

      socket.emit("sendMessage", messageData);
      return messageData;
    }

    return null;
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        activeChat,
        setActiveChat,
        joinChat,
        sendMessage,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
