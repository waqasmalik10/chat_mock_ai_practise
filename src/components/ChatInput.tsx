
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { SendIcon } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendChatMessage, loading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || loading) return;
    
    await sendChatMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-2xl glass-morphism p-2 shadow-sm"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent resize-none max-h-[200px] h-10 py-2 px-3 rounded-xl focus:outline-none"
          rows={1}
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className={`
            rounded-xl p-2 flex items-center justify-center transition-all
            ${message.trim() && !loading
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
