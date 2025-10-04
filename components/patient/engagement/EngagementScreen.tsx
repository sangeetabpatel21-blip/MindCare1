
import React, { useState, useEffect } from 'react';
import JournalScreen from './JournalScreen';
import WellnessToolkitScreen from './WellnessToolkitScreen';

interface EngagementScreenProps {
  initialView?: 'journal' | 'toolkit';
  toolId?: string; // For potential deep linking in the future
}

const EngagementScreen: React.FC<EngagementScreenProps> = ({ initialView = 'journal' }) => {
    const [activeTab, setActiveTab] = useState<'journal' | 'toolkit'>(initialView);

    useEffect(() => {
        setActiveTab(initialView);
    }, [initialView]);

    const renderContent = () => {
        switch (activeTab) {
            case 'journal':
                return <JournalScreen />;
            case 'toolkit':
                return <WellnessToolkitScreen />;
            default:
                return <JournalScreen />;
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="tabs tabs-boxed bg-base-200 mb-4 flex-shrink-0">
                <button
                    className={`tab flex-1 ${activeTab === 'journal' ? 'tab-active !bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('journal')}
                >
                    Journal
                </button>
                <button
                    className={`tab flex-1 ${activeTab === 'toolkit' ? 'tab-active !bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('toolkit')}
                >
                    Toolkit
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                 {renderContent()}
            </div>
        </div>
    );
};

export default EngagementScreen;
