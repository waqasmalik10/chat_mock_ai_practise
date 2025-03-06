
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getChats, getChat, sendMessage } from '../services/api';
import { toast } from 'sonner';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  chatId?: string;
};

export type Chat = {
  id: string;
  title: string;
  messages?: Message[];
  createdAt: number;
  updatedAt: number;
};

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  createNewChat: () => void;
  sendChatMessage: (message: string) => Promise<void>;
  setCurrentChat: (chatId: string) => Promise<void>;
  fetchChats: () => Promise<void>;
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

  const fetchChats = async () => {
    try {
      const fetchedChats = await getChats();
      setChats(fetchedChats);
      
      // Set the most recent chat as current if available
      if (fetchedChats.length > 0 && !currentChat) {
        const mostRecentChat = fetchedChats[0]; // Already sorted by API
        setCurrentChatState(mostRecentChat);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to load chats');
    }
  };

  // Load chats when component mounts
  useEffect(() => {
    fetchChats();
  }, []);

  const createNewChat = () => {
    setCurrentChatState(null); // Clear current chat to start fresh
  };

  const setCurrentChat = async (chatId: string) => {
    try {
      setLoading(true);
      const { chat, messages } = await getChat(chatId);
      
      const chatWithMessages: Chat = {
        ...chat,
        messages: messages,
      };
      
      setCurrentChatState(chatWithMessages);
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setLoading(true);

    try {
      const { chat, messages } = await sendMessage(
        content, 
        currentChat?.id
      );
      
      // Update the chats list with the new or updated chat
      setChats(prevChats => {
        const chatExists = prevChats.some(c => c.id === chat.id);
        
        if (chatExists) {
          return prevChats.map(c => c.id === chat.id ? chat : c);
        } else {
          return [chat, ...prevChats];
        }
      });
      
      // Update current chat with new messages
      setCurrentChatState({
        ...chat,
        messages: messages,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
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
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
