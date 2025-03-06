
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getChat, sendMessage } from '../services/api';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  createNewChat: () => void;
  sendChatMessage: (message: string) => Promise<void>;
  setCurrentChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      
      // Set the most recent chat as current if available
      if (parsedChats.length > 0) {
        const mostRecentChat = parsedChats.sort((a: Chat, b: Chat) => b.updatedAt - a.updatedAt)[0];
        setCurrentChatState(mostRecentChat);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setCurrentChatState(newChat);
  };

  const setCurrentChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatState(chat);
    }
  };

  const updateChat = (updatedChat: Chat) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );
    setCurrentChatState(updatedChat);
  };

  const sendChatMessage = async (content: string) => {
    if (!currentChat) {
      createNewChat();
    }

    setLoading(true);

    try {
      const chat = currentChat || chats[0];
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: Date.now(),
      };

      const updatedMessages = [...chat.messages, userMessage];
      
      const updatedChat: Chat = {
        ...chat,
        messages: updatedMessages,
        updatedAt: Date.now(),
      };

      updateChat(updatedChat);

      // Get AI response
      const response = await sendMessage(content, updatedMessages);

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedChat.messages, aiMessage];
      
      const finalChat: Chat = {
        ...updatedChat,
        messages: finalMessages,
        title: updatedChat.messages.length === 0 ? content.slice(0, 30) : updatedChat.title,
        updatedAt: Date.now(),
      };

      updateChat(finalChat);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error (you could add an error message to the state)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        loading,
        createNewChat,
        sendChatMessage,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
