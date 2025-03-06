
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with MongoDB/Postgres in production)
let chats = [];
let messages = [];

// Mock assistants data
const assistants = [
  {
    id: 'assistant-1',
    name: 'General Assistant',
    description: 'A helpful AI assistant for general information and questions.',
    icon: '🤖'
  }
];

// Helper function for AI response generation
const generateAIResponse = (message) => {
  // Mock response generation - would be replaced with actual OpenAI API call
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

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatId, history } = req.body;
    
    // Get or create a chat
    let chat;
    if (chatId && chats.find(c => c.id === chatId)) {
      chat = chats.find(c => c.id === chatId);
    } else {
      chat = {
        id: uuidv4(),
        title: message.slice(0, 30),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      chats.push(chat);
    }
    
    // Create user message
    const userMessage = {
      id: uuidv4(),
      content: message,
      role: 'user',
      chatId: chat.id,
      timestamp: Date.now()
    };
    
    messages.push(userMessage);
    
    // Update chat
    chat.updatedAt = Date.now();
    
    // Generate AI response
    const aiResponse = generateAIResponse(message);
    
    // Create AI message
    const aiMessage = {
      id: uuidv4(),
      content: aiResponse.message,
      role: 'assistant',
      chatId: chat.id,
      timestamp: Date.now()
    };
    
    messages.push(aiMessage);
    
    // Return both messages and chat info
    res.json({
      chat,
      messages: [userMessage, aiMessage]
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

app.get('/api/chats', (req, res) => {
  // Return all chats sorted by most recent first
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  res.json(sortedChats);
});

app.get('/api/chats/:chatId', (req, res) => {
  const { chatId } = req.params;
  
  // Find chat
  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }
  
  // Get messages for this chat
  const chatMessages = messages.filter(m => m.chatId === chatId);
  
  res.json({
    chat,
    messages: chatMessages
  });
});

app.get('/api/assistants', (req, res) => {
  res.json(assistants);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
