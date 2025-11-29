import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from './types';
import { sendMessageToDude, resetConversation } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import { Waves, Trash2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: "Sup? I'm Dude. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      role: Role.MODEL,
      content: '', // Starts empty
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsgPlaceholder]);

    try {
      await sendMessageToDude(text, (streamedText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, content: streamedText } 
            : msg
        ));
      });
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Bummer, man. Something went wrong with my connection. Try again?";
      
      // Check for specific API Key error
      if (error.message && (error.message.includes("API_KEY") || error.message.includes("API key"))) {
        errorMessage = "Whoa, hold up. Looks like the API Key is missing, dude. Check your .env file or environment variables.";
      }

      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, content: errorMessage, isError: true } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    resetConversation();
    setMessages([{
      id: Date.now().toString(),
      role: Role.MODEL,
      content: "Clean slate, nice. What's happening?",
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-dude-bg text-dude-text font-sans overflow-hidden">
      
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-dude-bg/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-20">
        <div className="flex items-center gap-2 text-dude-primary">
          <Waves className="fill-current" size={24} />
          <h1 className="text-xl font-bold tracking-tight text-white">Dude</h1>
        </div>
        
        <button 
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-full transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto pb-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
      
    </div>
  );
};

export default App;