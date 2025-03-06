
import React, { useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import NewChatButton from '../components/NewChatButton';
import ChatSidebar from '../components/ChatSidebar';
import { useChat } from '../context/ChatContext';

const Index = () => {
  const { currentChat, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background to-secondary/30">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-center h-16 border-b border-border glass-morphism">
          <h1 className="text-lg font-medium">AI Chat Interface</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="chat-container">
            {currentChat && currentChat.messages && currentChat.messages.length > 0 ? (
              <>
                {currentChat.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="max-w-md">
                  <h2 className="text-2xl font-medium mb-2">Welcome to AI Chat</h2>
                  <p className="text-muted-foreground mb-6">
                    Start a conversation with the AI assistant. Ask anything you'd like to know.
                  </p>
                </div>
              </div>
            )}
            
            {loading && !(currentChat?.messages?.some(m => m.role === 'assistant')) && (
              <div className="flex w-full mb-4 items-start justify-start animate-slide-in-left">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse-light" />
                  </div>
                </div>
                <div className="chat-bubble-ai">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <ChatInput />
      </div>
      
      <NewChatButton />
    </div>
  );
};

export default Index;
