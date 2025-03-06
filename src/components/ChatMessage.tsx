
import React from 'react';
import { Message } from '../context/ChatContext';
import { cn } from '../lib/utils';
import { UserIcon, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 items-start",
        isUser ? "justify-end" : "justify-start",
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          "max-w-[80%] md:max-w-[70%]",
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        )}
      >
        <p className="text-balance">{message.content}</p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
