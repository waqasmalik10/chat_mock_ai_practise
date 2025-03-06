
import { Message } from '../context/ChatContext';

const API_URL = '/api';

// In a real application, this would make a fetch call to a real backend
export const sendMessage = async (message: string, history: Message[]): Promise<{ message: string }> => {
  // For now, we're mocking the API response
  // In a real app, this would be:
  // const response = await fetch(`${API_URL}/chat`, { 
  //   method: 'POST', 
  //   headers: { 'Content-Type': 'application/json' }, 
  //   body: JSON.stringify({ message, history }) 
  // });
  // return response.json();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response based on message content
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return { message: "Hello! I'm your AI assistant. How can I help you today?" };
  } else if (message.toLowerCase().includes('help')) {
    return { message: "I'm here to assist you with information, answering questions, or just having a conversation. What would you like to know?" };
  } else if (message.toLowerCase().includes('thank')) {
    return { message: "You're welcome! It's been a pleasure assisting you. Feel free to ask if you need anything else." };
  } else if (message.toLowerCase().includes('?')) {
    return { message: "That's an interesting question. While I'm just a simple mock AI right now, in a full implementation I would provide a thoughtful answer based on my knowledge and capabilities." };
  } else {
    return { message: "I understand you're saying something about " + message.split(' ').slice(0, 3).join(' ') + "... In a complete implementation, I would give a more substantive and contextual response to your message." };
  }
};

export const getChat = async (chatId: string) => {
  // In a real app, this would fetch a specific chat
  // const response = await fetch(`${API_URL}/chats/${chatId}`);
  // return response.json();
  
  // For this implementation, we'll be using localStorage instead
  return null;
};
