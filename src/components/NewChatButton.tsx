
import React from 'react';
import { useChat } from '../context/ChatContext';
import { PlusIcon } from 'lucide-react';

const NewChatButton: React.FC = () => {
  const { createNewChat } = useChat();

  return (
    <button
      onClick={createNewChat}
      className="fixed top-5 right-5 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 animate-fade-in z-10"
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  );
};

export default NewChatButton;
