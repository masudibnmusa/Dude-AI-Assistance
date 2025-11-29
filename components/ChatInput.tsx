import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="w-full bg-dude-bg/90 backdrop-blur-md border-t border-slate-800 p-4 sticky bottom-0 z-10">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-dude-surface border border-slate-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-dude-primary/50 transition-all">
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say something to Dude..."
          disabled={disabled}
          className="w-full bg-transparent text-dude-text placeholder-dude-muted p-2 resize-none outline-none max-h-[120px] overflow-y-auto"
          rows={1}
        />

        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || disabled}
          className={`
            p-2 rounded-lg transition-all duration-200 flex items-center justify-center
            ${!text.trim() || disabled 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-dude-primary text-dude-bg hover:bg-sky-300 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]'}
          `}
        >
          {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>

      </div>
      <p className="text-center text-xs text-slate-600 mt-2">
        Dude uses Gemini 2.5 Flash. AI can make mistakes, dude.
      </p>
    </div>
  );
};

export default ChatInput;