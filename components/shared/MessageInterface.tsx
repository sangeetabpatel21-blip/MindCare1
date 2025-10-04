

import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import path for local module.
import { Message } from '../../types';
// FIX: Corrected import path for local module.
import { ICONS } from '../../constants';

interface MessageInterfaceProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-base-200 text-neutral rounded-bl-none'
        }`}
      >
        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
      </div>
    </div>
  );
};

const ThinkingBubble: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-base-200 text-neutral rounded-bl-none">
            <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
            </div>
        </div>
    </div>
);


interface InputProps {
  onSendMessage: (message: string) => void;
  isStreaming?: boolean;
  placeholder?: string;
  onMicClick?: () => void;
  isListening?: boolean;
  voiceTranscript?: string;
  onAttachmentRequest?: () => void;
}

const Input: React.FC<InputProps> = ({ onSendMessage, isStreaming, placeholder, onMicClick, isListening, voiceTranscript, onAttachmentRequest }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (voiceTranscript) {
        setInputValue(voiceTranscript);
    }
  }, [voiceTranscript]);

  const handleSend = () => {
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
   return (
      <div className="p-4 bg-white border-t border-base-300">
        <div className="flex items-center space-x-2">
          {onAttachmentRequest && (
            <button
              onClick={onAttachmentRequest}
              disabled={isStreaming}
              className="p-3 rounded-full text-primary hover:bg-base-200 disabled:text-gray-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : (placeholder || "Type your message...")}
            className="w-full px-4 py-2 bg-base-200 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-neutral"
            disabled={isStreaming || isListening}
          />
           {onMicClick && (
            <button
                onClick={onMicClick}
                disabled={isStreaming}
                className={`p-3 rounded-full transition-colors ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary text-white hover:bg-indigo-600'
                } disabled:bg-gray-300`}
            >
                {ICONS.mic}
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={isStreaming || !inputValue.trim()}
            className="bg-primary text-white p-3 rounded-full hover:bg-primary-focus disabled:bg-gray-300 transition-colors"
          >
            {ICONS.send}
          </button>
        </div>
      </div>
    );
}


// Main component refactored as a namespace
const MessageInterface: React.FC<MessageInterfaceProps> & {
    MessageBubble: typeof MessageBubble;
    ThinkingBubble: typeof ThinkingBubble;
    Input: typeof Input;
} = ({ children, headerContent }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [children]);

  return (
    <div className="flex flex-col flex-grow bg-base-100">
      {headerContent}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

MessageInterface.MessageBubble = MessageBubble;
MessageInterface.ThinkingBubble = ThinkingBubble;
MessageInterface.Input = Input;


export default MessageInterface;