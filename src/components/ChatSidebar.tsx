
import React from 'react';
import { useChat } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

const ChatSidebar: React.FC = () => {
  const { chats, currentChat, setCurrentChat } = useChat();

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="w-full md:w-64 md:min-h-screen md:max-h-screen md:overflow-y-auto border-r border-border bg-background/80 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
      
      <div className="space-y-2">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChat(chat.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentChat?.id === chat.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-start">
                <MessageSquare className="w-4 h-4 mt-1 mr-2" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-2">No chats yet</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
