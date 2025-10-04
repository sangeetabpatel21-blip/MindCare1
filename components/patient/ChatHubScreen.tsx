

import React, { useState } from 'react';
import AIChatScreen from './AIChatScreen';
import SpecialistMessageList from './SpecialistMessageList';
// FIX: Corrected import path for local module.
import { SpecialistFilters } from '../../types';

interface ChatHubScreenProps {
  onNavigate: (screen: string, params?: { filters: Partial<SpecialistFilters> }) => void;
  onTriggerSos: () => void;
}

type ActiveTab = 'ai' | 'specialist';

const ChatHubScreen: React.FC<ChatHubScreenProps> = (props) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('ai');

    const renderContent = () => {
        switch(activeTab) {
            case 'ai':
                return <AIChatScreen {...props} />;
            case 'specialist':
                return <SpecialistMessageList />;
            default:
                return <AIChatScreen {...props} />;
        }
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="tabs tabs-boxed bg-base-200 mb-4 flex-shrink-0">
                <button
                    className={`tab flex-1 ${activeTab === 'ai' ? 'tab-active !bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('ai')}
                >
                    MindCare AI
                </button>
                <button
                    className={`tab flex-1 ${activeTab === 'specialist' ? 'tab-active !bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('specialist')}
                >
                    Specialist Messages
                </button>
            </div>
            <div className="flex-grow">
                 {renderContent()}
            </div>
        </div>
    );
};

export default ChatHubScreen;