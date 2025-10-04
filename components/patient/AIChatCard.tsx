import React from 'react';
import Card from '../shared/Card';
import { ICONS } from '../../constants';

interface AIChatCardProps {
  onClick: () => void;
}

const AIChatCard: React.FC<AIChatCardProps> = ({ onClick }) => {
  return (
    <Card className="bg-gradient-to-br from-primary to-teal-600 text-white">
      <div className="flex flex-col items-start space-y-3">
        <div className="flex items-center space-x-3">
            <div className="text-3xl p-3 bg-white/20 rounded-full">
                {ICONS.chat}
            </div>
            <div>
                <h2 className="card-title text-xl">Need to talk?</h2>
            </div>
        </div>
        <p className="opacity-90 text-sm">
            Our AI assistant is here to provide immediate support, help you gain clarity, and guide you toward helpful resources. Available 24/7.
        </p>
        <button 
            onClick={onClick} 
            className="w-full btn bg-white text-primary border-none hover:bg-gray-200 mt-2"
        >
            Start Chat
        </button>
      </div>
    </Card>
  );
};

export default AIChatCard;