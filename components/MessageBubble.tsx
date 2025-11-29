import React from 'react';
import { Message, Role } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-dude-primary text-dude-bg' : 'bg-dude-surface border border-dude-primary/30 text-dude-primary'}
        `}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div className={`
          p-4 rounded-2xl shadow-sm leading-relaxed whitespace-pre-wrap
          ${isUser 
            ? 'bg-dude-primary text-dude-bg rounded-tr-none' 
            : 'bg-dude-surface border border-slate-700/50 text-dude-text rounded-tl-none'}
          ${message.isError ? 'border-red-500 bg-red-900/10 text-red-200' : ''}
        `}>
          {message.content}
          
          <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-dude-bg' : 'text-slate-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;