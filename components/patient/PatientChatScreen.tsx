

import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { Specialist, ChatMessage } from '../../types';
// FIX: Corrected import path for local module.
import { MOCK_CHAT_MESSAGES } from '../../constants';
import MessageInterface from '../shared/MessageInterface';

interface PatientChatScreenProps {
    specialist: Specialist;
    onBack: () => void;
}

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isPatient = message.sender === 'patient';
  return (
    <div className={`flex ${isPatient ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isPatient
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-base-200 text-neutral rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

const PatientChatScreen: React.FC<PatientChatScreenProps> = ({ specialist, onBack }) => {
    // Assuming the current user is 'p1' for mock data purposes
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES['p1'] || []);

    const handleSendMessage = (text: string) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            text,
            sender: 'patient',
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
    };

    const ChatHeader = () => (
        <div className="p-2 border-b bg-white flex items-center space-x-3 sticky top-0 z-10">
            <button onClick={onBack} className="btn btn-ghost btn-sm btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={specialist.avatarUrl} alt={specialist.name} className="w-8 h-8 rounded-full" />
            <div>
                <h2 className="text-md font-bold text-neutral">{specialist.name}</h2>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-base-100">
            <MessageInterface headerContent={<ChatHeader />}>
                {messages.map(msg => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                ))}
            </MessageInterface>
            <MessageInterface.Input
                onSendMessage={handleSendMessage}
                placeholder={`Message ${specialist.name}...`}
            />
        </div>
    );
};

export default PatientChatScreen;