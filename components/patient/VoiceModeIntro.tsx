

import React from 'react';
// FIX: Corrected import path for local module.
import { ICONS } from '../../constants';

interface VoiceModeIntroProps {
  onStart: () => void;
  onExit: () => void;
}

const FeaturePill: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
        <div className="text-primary">{icon}</div>
        <span className="text-neutral font-medium">{text}</span>
    </div>
);

const VoiceModeIntro: React.FC<VoiceModeIntroProps> = ({ onStart, onExit }) => {
  return (
    <div className="flex flex-col h-full bg-base-100 p-6 text-center">
      <div className="w-full flex justify-end">
        <button onClick={onExit} className="text-gray-500 hover:text-neutral transition-colors">
            Close
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-primary bg-primary-light p-4 rounded-full mb-4">
          {ICONS.headphone}
        </div>
        <h2 className="text-3xl font-bold text-neutral">Voice Mode</h2>
        <p className="text-gray-600 mt-2 max-w-xs">
          Engage in a natural, hands-free conversation with MindCare AI.
        </p>
        
        <div className="text-left space-y-3 mt-8 w-full">
            <FeaturePill icon={ICONS.mic} text="Speak Naturally" />
            <FeaturePill icon={ICONS.chat} text="AI Listens & Responds" />
            <FeaturePill icon={ICONS.bookOpen} text="Saved to Chat History" />
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          onClick={onStart}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-focus transition-colors shadow-lg"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
};

export default VoiceModeIntro;