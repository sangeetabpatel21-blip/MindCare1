import React from 'react';
import { Patient, ChatMessage } from '../../types';
import { useAppContext } from '../../context/AppContext';
import MessageInterface from '../shared/MessageInterface';

interface SpecialistMessagingScreenProps {
    patient: Patient;
}

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isSpecialist = message.sender === 'specialist';
  return (
    <div className={`flex ${isSpecialist ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isSpecialist
            ? 'bg-secondary text-white rounded-br-none'
            : 'bg-base-200 text-neutral rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};


const SpecialistMessagingScreen: React.FC<SpecialistMessagingScreenProps> = ({ patient }) => {
    const { chatMessages, sendSpecialistMessage } = useAppContext();
    const messages = chatMessages[patient.id] || [];

    const handleSendMessage = (text: string) => {
        sendSpecialistMessage(patient.id, text);
    };

    return (
        <div className="flex flex-col h-full bg-base-100">
            <MessageInterface>
                {messages.map(msg => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                ))}
            </MessageInterface>
            <MessageInterface.Input
                onSendMessage={handleSendMessage}
                placeholder={`Message ${patient.name}...`}
            />
        </div>
    );
};

export default SpecialistMessagingScreen;