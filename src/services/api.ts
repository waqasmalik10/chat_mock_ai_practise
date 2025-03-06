
import { Message, Chat } from '../context/ChatContext';

const API_URL = 'http://localhost:5000/api';

export const sendMessage = async (message: string, chatId?: string, history?: Message[]): Promise<{ chat: Chat, messages: Message[] }> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chatId,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChats = async (): Promise<Chat[]> => {
  try {
    const response = await fetch(`${API_URL}/chats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getChat = async (chatId: string): Promise<{ chat: Chat, messages: Message[] }> => {
  try {
    const response = await fetch(`${API_URL}/chats/${chatId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};

export const getAssistants = async () => {
  try {
    const response = await fetch(`${API_URL}/assistants`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch assistants');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching assistants:', error);
    throw error;
  }
};
