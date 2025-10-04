import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { Message, SpecialistFilters } from '../../types';
import { sendChatMessage } from '../../services/geminiService';
import MessageInterface from '../shared/MessageInterface';
import { FunctionCall } from '@google/genai';
import VoiceModeIntro from './VoiceModeIntro';
import VoiceMode from './VoiceMode';

interface AIChatScreenProps {
  onNavigate: (screen: string, params?: { filters: Partial<SpecialistFilters> }) => void;
  onTriggerSos: () => void;
}

// NEW: Conversation Starters component for guiding the user
const ConversationStarters: React.FC<{ onSelect: (text: string) => void }> = ({ onSelect }) => {
    const starters = [
        "I'm feeling anxious",
        "How can I improve my sleep?",
        "Tell me about mindfulness",
        "I need to talk about stress",
    ];

    return (
        <div className="px-2 pb-2 animate-fade-in">
            <p className="text-sm text-gray-500 mb-2 ml-2">Or try one of these starters:</p>
            <div className="flex flex-wrap gap-2">
                {starters.map((text) => (
                    <button
                        key={text}
                        onClick={() => onSelect(text)}
                        className="btn btn-sm btn-outline bg-base-100 hover:bg-base-200"
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );
};


const AIChatScreen: React.FC<AIChatScreenProps> = ({ onNavigate, onTriggerSos }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hello! I'm MindCare AI. I can provide information and support for your wellness journey. How can I help you today?\n\n*I am an AI and not a substitute for a medical professional.*",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [voiceModeState, setVoiceModeState] = useState<'off' | 'intro' | 'active'>('off');
  
  // NEW: Check if the user has sent at least one message
  const hasUserSentMessage = messages.some(m => m.sender === 'user');

  const handleFindSpecialists = (functionCall: FunctionCall) => {
    if (functionCall.name !== 'findSpecialists' || !functionCall.args) return;
    const { specialties, modes, type } = functionCall.args;
    
    const filters: Partial<SpecialistFilters> = {};
    if (Array.isArray(specialties) && specialties.length > 0) filters.specialties = specialties;
    if (Array.isArray(modes) && modes.length > 0) filters.modes = modes;
    if (typeof type === 'string') filters.type = type;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      timestamp: new Date().toISOString(),
      text: "I found some specialists who might be able to help. Would you like to see them?",
      functionCall: functionCall
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const response = await sendChatMessage(text);
      let botText = response.text || '';
      
      if (botText.startsWith('[TRIGGER_SOS]')) {
        onTriggerSos();
        botText = botText.replace('[TRIGGER_SOS]', '').trim();
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botMessage]);

      if (response.functionCalls && response.functionCalls.length > 0) {
        handleFindSpecialists(response.functionCalls[0]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };
  
  const handleVoiceTurnEnd = (userText: string, botText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
     const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage, botMessage]);
  }

  if (voiceModeState === 'intro') {
      return <VoiceModeIntro onStart={() => setVoiceModeState('active')} onExit={() => setVoiceModeState('off')} />;
  }
  if (voiceModeState === 'active') {
      return <VoiceMode onExit={() => setVoiceModeState('off')} onTurnEnd={handleVoiceTurnEnd} />;
  }

  return (
    <div className="flex flex-col h-full">
        <MessageInterface>
            {messages.map(msg => (
            <React.Fragment key={msg.id}>
                <MessageInterface.MessageBubble message={msg} />
                {msg.functionCall && msg.functionCall.name === 'findSpecialists' && (
                <div className="flex justify-start mb-4">
                    <button 
                        onClick={() => onNavigate('specialists', { filters: msg.functionCall?.args as any })}
                        className="btn btn-primary btn-sm ml-2"
                    >
                        View Specialists
                    </button>
                </div>
                )}
            </React.Fragment>
            ))}
            {isStreaming && <MessageInterface.ThinkingBubble />}
            {!isStreaming && !hasUserSentMessage && (
                <ConversationStarters onSelect={handleSendMessage} />
            )}
        </MessageInterface>
        
        <MessageInterface.Input
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            onMicClick={() => setVoiceModeState('intro')}
        />
    </div>
  );
};

export default AIChatScreen;